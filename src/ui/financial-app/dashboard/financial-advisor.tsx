"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "../../components";
import { useTranslations } from "@/src/translations/use-translations";

export const FinancialAdvisor = ({
  userSpendingData,
  username,
  lang,
}: {
  userSpendingData: any;
  username: string;
  lang: string;
}) => {
  const { dict } = useTranslations();
  const [advice, setAdvice] = useState<{ title: string; advice: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [talking, setTalking] = useState(false);
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const getAdvice = async () => {
    setLoading(true);
    setTalking(true);

    try {
      const res = await fetch("/api/advisor/get-advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSpendingData, lang }),
      });

      const data = await res.json();
      setAdvice(data.tips);
    } catch (error) {
      console.error("Error fetching advice:", error);
    }

    setLoading(false);
    setTimeout(() => setTalking(false), 2000);
  };

  return (
    <motion.div
      className="p-4 bg-white shadow-sm rounded-sm flex flex-col items-center mb-5 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* AI Avatar with Bounce & Glow Animation */}
      <motion.div
        className="relative w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px rgba(0,255,0,0.6)" }}
      >
        🤖
      </motion.div>

      {/* AI Greeting with Fade-In Effect */}
      <motion.h2
        className="text-xl font-bold mt-2 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        Hola {username}! Soy tu asesor financiero! 💰
      </motion.h2>

      {/* AI Call to Action */}
      <div className="mt-4">
        <Button
          onClick={getAdvice}
          className="bg-black text-white disabled:opacity-50 font-bold"
          disabled={loading}
          icon={
            loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )
          }
        >
          <span>
            {loading ? `${dict.ai?.analyzing}...` : dict.ai?.getFinancialAdvise}
          </span>
        </Button>
      </div>

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
