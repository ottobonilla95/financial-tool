"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";
import { Earning, Expense, Saving } from "@/src/types";
import { groupExpensesForAI } from "@/src/helpers/group-expenses-for-AI";

export type FinancialAdvisorProps = {
  expenses: Expense[];
  expensesPrevious: Expense[];
  earnings: Earning[];
  earningsPrevious: Earning[];
  savings: Saving[];
  savingsPrevious: Saving[];
  userName: string;
};

export const FinancialAdvisor = ({
  expenses,
  expensesPrevious,
  earnings,
  earningsPrevious,
  savings,
  savingsPrevious,
  userName,
}: FinancialAdvisorProps) => {
  if (expenses.length === 0 && earnings.length === 0 && savings.length === 0) {
    return null;
  }

  const currentMonthFinancesSummary = groupExpensesForAI(
    expenses,
    earnings,
    savings
  );

  const previusMonthFinancesSummary = groupExpensesForAI(
    expensesPrevious,
    earningsPrevious,
    savingsPrevious
  );

  const { lang, dict } = useTranslations();
  const [advice, setAdvice] = useState<{ title: string; advice: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastAdviceDate, setLastAdviceDate] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load last advice date from localStorage
  useEffect(() => {
    const storedDate = localStorage.getItem("lastAdviceDate");
    if (storedDate) {
      setLastAdviceDate(storedDate);
    }
  }, []);

  const getAdvice = async () => {
    const today = new Date().toISOString().split("T")[0]; // Get only the date (YYYY-MM-DD)

    if (lastAdviceDate === today) {
      setErrorMessage(
        "You've already received financial advice today. Come back tomorrow!"
      );
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/advisor/get-advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userSpendingData: {
            currentMonthFinancesSummary,
            previusMonthFinancesSummary,
          },
          lang,
        }),
      });

      const data = await res.json();
      setAdvice(data.tips);
      setLastAdviceDate(today);
      localStorage.setItem("lastAdviceDate", today); // Store last request date
    } catch (error) {
      console.error("Error fetching advice:", error);
      setErrorMessage(
        "An error occurred while fetching advice. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <motion.div
      className="p-4 bg-white shadow-sm rounded-sm mb-5 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          {/* AI Avatar */}
          <motion.div
            className="relative w-10 cursor-pointer h-10 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 12px rgba(0,0,0,0.6)",
            }}
          >
            🤖
          </motion.div>

          {/* AI Greeting */}
          <motion.h2
            className="text-lg font-bold mt-2 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {`${dict.ai?.hi} ${userName}! ${dict.ai?.imYourFinancialAdvisor}`}{" "}
            💰
          </motion.h2>
        </div>

        {/* AI Call to Action */}
        <div className="mt-4">
          <Button
            onClick={getAdvice}
            className="!py-8 lg:!py-0 bg-black text-white disabled:opacity-50 font-bold"
            disabled={
              loading ||
              lastAdviceDate === new Date().toISOString().split("T")[0]
            }
            icon={
              loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )
            }
          >
            <span>
              {loading
                ? `${dict.ai?.analyzing}...`
                : lastAdviceDate === new Date().toISOString().split("T")[0]
                ? dict.ai?.comeBackTomorrow
                : dict.ai?.getFinancialAdvise}
            </span>
          </Button>
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="mt-2 text-sm text-red-500">⚠ {errorMessage}</div>
      )}

      {/* AI Advice Display */}
      {advice.length > 0 && (
        <div className="mt-4 w-full">
          {advice.map((tip, index) => (
            <motion.div
              key={index}
              className="p-3 shadow-sm rounded-sm mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h3 className="font-semibold">{tip.title}</h3>
              <p>{tip.advice}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
