import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Server-side rate limiting: check last_advice_date
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { last_advice_date: true },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user?.last_advice_date) {
      const lastAdviceDate = new Date(user.last_advice_date);
      lastAdviceDate.setHours(0, 0, 0, 0);

      if (lastAdviceDate.getTime() === today.getTime()) {
        return NextResponse.json(
          { error: "Rate limited - already received advice today" },
          { status: 429 }
        );
      }
    }

    const { monthsData, userGoal, lang } = await req.json();

    if (!monthsData || monthsData.length === 0) {
      return NextResponse.json(
        { error: "Missing spending data" },
        { status: 400 }
      );
    }

    // Build the prompt with 4 months of data
    let monthsBreakdown = "";
    monthsData.forEach((month: any, index: number) => {
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const monthName = monthNames[month.month - 1];

      monthsBreakdown += `
      ### **${index === 0 ? "Current Month" : `Month ${index + 1}`} (${monthName} ${month.year})**
      - **Total Earnings:** $${month.summary.totalEarnings}
      - **Total Expenses:** $${month.summary.totalExpenses}
      - **Total Savings:** $${month.summary.totalSavings}

      **Spending Breakdown (with Emotions & Satisfaction):**
      ${JSON.stringify(month.summary.categoryTotals, null, 2)}

      **Earnings Breakdown:**
      ${JSON.stringify(month.summary.earningsTotals, null, 2)}

      `;
    });

    // Goal section
    let goalSection = "";
    if (userGoal) {
      goalSection = `
      ### **User's Financial Goal**
      - **Target Amount:** $${userGoal.amount}
      - **Timeframe:** ${userGoal.timeframe}
      - **Description:** ${userGoal.description || "No description provided"}

      Please provide advice specifically tailored to help the user achieve this goal.
      `;
    }

    const prompt = `
      You are an expert financial advisor analyzing the user's financial health over the past 4 months.
      Your goal is to provide actionable, personalized insights based on spending patterns, emotional triggers, and satisfaction levels.

      **Important Context:**
      - The user tracks not just spending amounts, but also their EMOTIONS when spending and their SATISFACTION level (1-5) after each purchase.
      - Emotions are categorized as "positive", "negative", or "neutral".
      - Look for patterns between emotions and spending (e.g., "stress spending", "impulse purchases when anxious").

      **Satisfaction Scale:**
      - 1 = Very Unsatisfied (regret)
      - 2 = Somewhat Unsatisfied
      - 3 = Neutral
      - 4 = Somewhat Satisfied
      - 5 = Very Satisfied (great purchase)

      ## Financial Data (4 Months):
      ${monthsBreakdown}

      ${goalSection}

      ## Your Analysis Should Include:

      1. **Emotion-Spending Correlations**: Identify if the user spends more when experiencing certain emotions. For example:
         - "You spend X% more when feeling stressed"
         - "Your anxious purchases have an average satisfaction of only 2.1/5"
         - "Boredom-driven spending increased by 40% this month"

      2. **Satisfaction Analysis**: Look at which categories/purchases bring high vs low satisfaction:
         - "Your 'stressed' purchases in Food category average only 2.3/5 satisfaction - consider meal prepping instead"
         - "Entertainment purchases have high satisfaction (4.2/5) - these seem like worthwhile spending"

      3. **Trend Analysis**: Compare the 4 months to identify:
         - Improving or worsening patterns
         - Seasonal spending changes
         - Categories where spending is increasing/decreasing

      4. **Actionable Recommendations**: Provide specific, implementable tips

      Ensure responses are structured as valid JSON:
      {
        "tips": [
          { "title": "Tip 1 Title", "advice": "Detailed advice text" },
          { "title": "Tip 2 Title", "advice": "Detailed advice text" },
          { "title": "Tip 3 Title", "advice": "Detailed advice text" }
        ]
      }

      Please provide the recommendations in **${lang === "es" ? "Spanish" : "English"}**.
      Focus on being helpful and encouraging while being honest about areas for improvement.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0].message.content?.trim();

    let tips;
    try {
      tips = JSON.parse(aiResponse || "{}").tips;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid AI response format", rawResponse: aiResponse },
        { status: 500 }
      );
    }

    // Update last_advice_date after successful response
    await prisma.users.update({
      where: { id: userId },
      data: { last_advice_date: today },
    });

    return NextResponse.json({ tips });
  } catch (error: any) {
    console.error("AI Financial Advisor Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
