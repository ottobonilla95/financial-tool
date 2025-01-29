import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in .env
});

export async function POST(req: Request) {
  try {
    const { userSpendingData, lang } = await req.json(); // Receive user's spending data

    if (!userSpendingData) {
      return NextResponse.json(
        { error: "Missing spending data" },
        { status: 400 }
      );
    }

    const prompt = `
      You are a financial advisor analyzing the user's financial health.
      Below is their **financial breakdown**, including categorized spending, earnings, and savings:

      - **Total Earnings:** $${
        userSpendingData.currentMonthFinancesSummary.totalEarnings
      }
      - **Total Expenses:** $${
        userSpendingData.currentMonthFinancesSummary.totalExpenses
      }
      - **Total Savings:** $${
        userSpendingData.currentMonthFinancesSummary.totalSavings
      }

      ### **Earnings Breakdown**
      ${JSON.stringify(
        userSpendingData.currentMonthFinancesSummary.earningsTotals,
        null,
        2
      )}

      ### **Spending Breakdown (Emotions & Satisfaction)**
      ${JSON.stringify(
        userSpendingData.currentMonthFinancesSummary.categoryTotals,
        null,
        2
      )}

      ### **Savings History**
      ${JSON.stringify(
        userSpendingData.currentMonthFinancesSummary.savingsList,
        null,
        2
      )}


      - **Total Earnings previus month:** $${
        userSpendingData.previusMonthFinancesSummary.totalEarnings
      }
      - **Total Expenses previus month:** $${
        userSpendingData.previusMonthFinancesSummary.totalExpenses
      }
      - **Total Savings previus month:** $${
        userSpendingData.previusMonthFinancesSummary.totalSavings
      }

      ### **Earnings Breakdown previus month**
      ${JSON.stringify(
        userSpendingData.previusMonthFinancesSummary.earningsTotals,
        null,
        2
      )}

      ### **Spending Breakdown (Emotions & Satisfaction) previus month**
      ${JSON.stringify(
        userSpendingData.previusMonthFinancesSummary.categoryTotals,
        null,
        2
      )}

      ### **Savings History previus month**
      ${JSON.stringify(
        userSpendingData.previusMonthFinancesSummary.savingsList,
        null,
        2
      )}

      **Satisfaction Scale:**
      - 1 = Very Unsatisfied
      - 2 = Somewhat Unsatisfied
      - 3 = Neutral
      - 4 = Somewhat Satisfied
      - 5 = Very Satisfied

      Based on this, provide **3 personalized insights** to help the user:
      - Improve their financial balance (spending vs. saving).
      - Reduce unnecessary expenses.
      - Maximize financial well-being and happiness.

      Ensure responses are structured as valid JSON:
      {
        "tips": [
          { "title": "Tip 1", "advice": "Advice text" },
          { "title": "Tip 2", "advice": "Advice text" },
          { "title": "Tip 3", "advice": "Advice text" }
        ]
      }

      Please provide the recommendations in **${lang}**.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use gpt-4o since it's available
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const aiResponse = response.choices[0].message.content?.trim();

    // Ensure response is valid JSON before parsing
    let tips;
    try {
      tips = JSON.parse(aiResponse || "{}").tips;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid AI response format", rawResponse: aiResponse },
        { status: 500 }
      );
    }

    return NextResponse.json({ tips });
  } catch (error) {
    console.error("AI Financial Advisor Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
