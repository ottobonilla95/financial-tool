"use client";

import { AppDictionary } from "@/src/translations";
import React, { useEffect } from "react";
import { Button } from "../../components";
import { FireIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { motion } from "framer-motion";

export type IntroProps = {
  dict: AppDictionary;
  variant?: "dark" | "light";
};

export const Intro = ({ dict, variant = "dark" }: IntroProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://scripts.converteai.net/769d0a20-d707-4621-8a28-39232bb67a07/players/67b3fdcc5ebfb6f44fd717c9/player.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

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
                    {/* Construye */}
                    Ahorra
                  </span>
                </span>{" "}
                <span> más y elimina gastos innecesarios con IA.</span>
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
              {/* {dict.mainPage.welcomeDescription} */}
              Descubre cómo tus emociones influyen en tus finanzas y ahorra más
              con la ayuda de la inteligencia artificial.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* <img
            src={`/images/vslgif3.gif`}
            className="w-full sm:w-[500px]"
            alt="Screenshots of the dashboard project showing desktop version"
          /> */}

          <div
            id="vid_67b3fdcc5ebfb6f44fd717c9"
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "64.98%",
            }}
          >
            <img
              id="thumb_67b3fdcc5ebfb6f44fd717c9"
              src="https://images.converteai.net/769d0a20-d707-4621-8a28-39232bb67a07/players/67b3fdcc5ebfb6f44fd717c9/thumbnail.jpg"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              alt="thumbnail"
            />
            <div
              id="backdrop_67b3fdcc5ebfb6f44fd717c9"
              style={{
                WebkitBackdropFilter: "blur(5px)",
                backdropFilter: "blur(5px)",
                position: "absolute",
                top: 0,
                height: "100%",
                width: "100%",
              }}
            ></div>
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
