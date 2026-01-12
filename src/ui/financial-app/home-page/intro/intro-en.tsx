"use client";

import { AppDictionary } from "@/src/translations";
import Image from "next/image";
import React from "react";
import { Button } from "../../../components";
import { FireIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { motion } from "framer-motion";

export type IntroEnProps = {
  dict: AppDictionary;
  variant?: "dark" | "light";
};

export const IntroEN = ({ dict, variant = "dark" }: IntroEnProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="mb-2 sm:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full flex justify-center">
          <motion.div
            className="text-center lg:max-w-[900px] flex flex-col mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1
              className={clsx(
                "mb-3 font-extrabold text-center text-[26px] lg:text-5xl tracking-tight flex flex-col gap-3 items-center sm:items-start",
                {
                  "text-neutral-300": variant === "dark",
                }
              )}
            >
              <span className="relative">
                Take control of your money,{" "}
                <span className="relative whitespace-nowrap mr-4 ml-3">
                  <span
                    className={clsx(
                      "absolute bg-neutral-900 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1",
                      {
                        "!bg-neutral-300": variant === "dark",
                      }
                    )}
                  ></span>
                  <span
                    className={clsx("relative text-white", {
                      "!text-neutral-900": variant === "dark",
                    })}
                  >
                    Save
                  </span>
                </span>{" "}
                <span> more and eliminate unnecessary expenses with AI.</span>
              </span>
            </h1>

            <motion.p
              className={clsx(
                "text-lg opacity-80 leading-relaxed sm:text-xl text-center font-medium",
                {
                  "text-neutral-300": variant === "dark",
                }
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Track expenses, spot patterns, and get AI recommendations to cut
              waste — without spreadsheets.
            </motion.p>

            <motion.div
              className="mt-5 flex flex-wrap justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-neutral-200 ring-1 ring-white/10">
                AI insights
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-neutral-200 ring-1 ring-white/10">
                Simple spending tracking
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-neutral-200 ring-1 ring-white/10">
                Build better habits
              </span>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="w-full max-w-[980px]">
            <div>
              <Image
                src="/images/home-page/en/hero-mobile.png"
                alt="TrackMySpend app preview"
                width={900}
                height={1600}
                sizes="100vw"
                className="block sm:hidden w-full h-auto"
                priority
              />
              <Image
                src="/images/home-page/en/hero-desktop.png"
                alt="TrackMySpend dashboard preview"
                width={1600}
                height={1000}
                sizes="(min-width: 640px) 980px, 100vw"
                className="hidden sm:block w-full h-auto"
                priority
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <div className="sm:max-w-[400px]">
          <Button
            className="!font-bold mt-4 !text-xl group rounded-lg bg-[#1cde98] font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !py-8"
            icon={
              <FireIcon className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
            }
            iconPosition="left"
            href="#offer"
          >
            {dict.mainPage.takeControlToday}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
