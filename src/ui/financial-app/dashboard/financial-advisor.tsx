"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";
import { Earning, Expense, Saving } from "@/src/types";
import { groupExpensesForAI } from "@/src/helpers/group-expenses-for-AI";

type MonthData = {
  label: string;
  month: number;
  year: number;
  expenses: Expense[];
  earnings: Earning[];
  savings: Saving[];
};

type UserGoal = {
  amount: number;
  timeframe: string;
  description: string;
} | null;

export type FinancialAdvisorProps = {
  monthsData: MonthData[];
  userGoal: UserGoal;
  userName: string;
};

const loadingMessages = {
  en: [
    "Analyzing your expenses...",
    "Finding patterns...",
    "Generating advice...",
  ],
  es: [
    "Analizando tus gastos...",
    "Encontrando patrones...",
    "Generando consejos...",
  ],
};

export const FinancialAdvisor = ({
  monthsData,
  userGoal,
  userName,
}: FinancialAdvisorProps) => {
  // Check if there's any data to analyze
  const hasData = monthsData.some(
    (m) => m.expenses.length > 0 || m.earnings.length > 0 || m.savings.length > 0
  );

  if (!hasData) {
    return null;
  }

  // Process all months data
  const processedMonthsData = monthsData.map((m) => ({
    label: m.label,
    month: m.month,
    year: m.year,
    summary: groupExpensesForAI(m.expenses, m.earnings, m.savings),
  }));

  const { lang, dict } = useTranslations();
  const [advice, setAdvice] = useState<{ title: string; advice: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    if (!loading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  const getAdvice = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/advisor/get-advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthsData: processedMonthsData,
          userGoal,
          lang,
        }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setRateLimited(true);
        setErrorMessage(
          lang === "es"
            ? "Ya recibiste consejos hoy. Vuelve mañana."
            : "You've already received advice today. Come back tomorrow!"
        );
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to get advice");
      }

      setAdvice(data.tips);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setErrorMessage(
        lang === "es"
          ? "Error al obtener consejos. Intenta de nuevo."
          : "An error occurred while fetching advice. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const messages = lang === "es" ? loadingMessages.es : loadingMessages.en;

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
            className="!py-8 lg:!py-0 bg-black text-white disabled:opacity-50 font-bold min-w-[220px]"
            disabled={loading || rateLimited}
            icon={
              loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ) : (
                <Sparkles className="w-4 h-4" />
              )
            }
          >
            {loading ? (
              <AnimatePresence mode="wait">
                <motion.span
                  key={loadingMessageIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {messages[loadingMessageIndex]}
                </motion.span>
              </AnimatePresence>
            ) : rateLimited ? (
              dict.ai?.comeBackTomorrow
            ) : (
              dict.ai?.getFinancialAdvise
            )}
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
