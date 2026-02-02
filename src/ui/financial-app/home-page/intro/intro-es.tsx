"use client";

import { AppDictionary } from "@/src/translations";
import Image from "next/image";
import React from "react";
import { Button } from "../../../components";
import { FireIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { motion } from "framer-motion";

export type IntroEsProps = {
  dict: AppDictionary;
  variant?: "dark" | "light";
};

export const IntroEs = ({ dict, variant = "dark" }: IntroEsProps) => {
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
        {/* Mobile: stacked layout, Desktop: two-column layout */}
        <div className="w-full flex flex-col md:grid md:grid-cols-2 md:gap-8 md:items-center">
          {/* Left column: Title, subtitle, CTA */}
          <motion.div
            className="text-center md:text-left flex flex-col mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1
              className={clsx(
                "mb-3 font-extrabold text-center md:text-left text-[26px] lg:text-5xl tracking-tight flex flex-col gap-3 items-center md:items-start",
                {
                  "text-neutral-300": variant === "dark",
                }
              )}
            >
              <span className="relative">
                Toma el control de tu dinero,{" "}
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
                    Ahorra
                  </span>
                </span>{" "}
                <span> más y elimina gastos innecesarios con IA.</span>
              </span>
            </h1>

            <motion.p
              className={clsx(
                "text-lg opacity-80 leading-relaxed sm:text-xl text-center md:text-left font-medium",
                {
                  "text-neutral-300": variant === "dark",
                }
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Registra tus gastos, detecta patrones y recibe recomendaciones con
              IA para ahorrar — sin hojas de cálculo.
            </motion.p>

            <motion.div
              className="mt-5 flex flex-wrap justify-center md:justify-start gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-neutral-200 ring-1 ring-white/10">
                Insights con IA
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-neutral-200 ring-1 ring-white/10">
                Registro simple de gastos
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-neutral-200 ring-1 ring-white/10">
                Mejores hábitos
              </span>
            </motion.div>

            {/* CTA Button - visible on desktop in left column */}
            <motion.div
              className="hidden md:flex mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Button
                className="!font-bold !text-xl group rounded-lg bg-[#1cde98] font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !py-8"
                icon={
                  <FireIcon className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
                }
                iconPosition="left"
                href="#offer"
              >
                {dict.mainPage.takeControlToday}
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column: Screenshot */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="w-full max-w-[980px]">
              <div>
                <Image
                  src="/images/home-page/es/hero-mobile.png"
                  alt="Vista previa de TrackMySpend"
                  width={900}
                  height={1600}
                  sizes="100vw"
                  className="block sm:hidden w-full h-auto"
                  priority
                />
                <Image
                  src="/images/home-page/es/hero-desktop.png"
                  alt="Vista del panel de TrackMySpend"
                  width={1600}
                  height={1000}
                  sizes="(min-width: 640px) 980px, 100vw"
                  className="hidden sm:block w-full h-auto"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Button - visible on mobile only, centered below */}
      <motion.div
        className="flex justify-center md:hidden"
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
