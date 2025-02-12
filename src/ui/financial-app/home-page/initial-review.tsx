"use client";

import { motion } from "framer-motion";
import { QuoteIcon } from "../../components";
import { AppDictionary } from "@/src/translations";

export type TestimonialSectionProps = {
  dict: AppDictionary;
};
export default function TestimonialSection({ dict }: TestimonialSectionProps) {
  return (
    <motion.div
      className="bg-neutral-800 text-neutral-300 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="flex justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <QuoteIcon className="w-12 h-12" color="#ffffff" />
      </motion.div>

      <motion.div
        className="p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex justify-center mb-1">⭐ ⭐ ⭐ ⭐ ⭐</div>
        <p className="text-lg opacity-80 mb-4">
          {dict.mainPage.testimonials.testimonial4.feedback}
        </p>
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <img
            src="/images/reviews/4410s08633_n.png"
            alt="Kevin Gonzales"
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          <h4 className="text-lg font-semibold">Kevin Gonzales</h4>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
