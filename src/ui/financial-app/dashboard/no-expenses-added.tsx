"use client";

import { AppDictionary } from "@/src/translations";
import { motion } from "framer-motion";

export type NoExpensesAddedProps = {
  dict: AppDictionary;
};

export const NoExpensesAdded = ({ dict }: NoExpensesAddedProps) => {
  return (
    <motion.div
      className="flex flex-col items-center my-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated Avatar */}
      <motion.div
        className="w-16 h-16 bg-lime-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px rgba(0,0,255,0.6)" }}
      >
        💰
      </motion.div>

      {/* Encouraging Message */}
      <motion.div
        className="bg-gray-200 rounded py-3 px-6 mt-4 text-center text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {dict.shared.noExpensesAdded}
        <p className="mt-2 text-gray-600 text-sm">
          {dict.shared.startTrackingToday}
        </p>
      </motion.div>
    </motion.div>
  );
};
