import { AppDictionary } from "@/src/translations";
import React from "react";
import { Button } from "../../components";
import { FireIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export type IntroProps = {
  dict: AppDictionary;
  variant?: "dark" | "light";
};

export const Intro = ({ dict, variant = "dark" }: IntroProps) => {
  return (
    <div>
      <div className="mt-4 sm:mt-10 mb-2 sm:mb-10">
        <div className="w-full flex justify-center">
          <div className="text-center lg:max-w-[800px] flex flex-col mb-6">
            <h1
              className={clsx(
                "mb-3 font-extrabold text-center text-3xl lg:text-6xl tracking-tight flex flex-col gap-3 items-center sm:items-start",
                {
                  "text-neutral-100": variant === "dark",
                }
              )}
            >
              <span className="relative">
                Controla Tu Dinero en Minutos y{" "}
                <span className="relative whitespace-nowrap mr-4 ml-3">
                  <span
                    className={clsx(
                      "absolute bg-neutral-900 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1",
                      {
                        "!bg-neutral-100": variant === "dark",
                      }
                    )}
                  ></span>
                  <span
                    className={clsx("relative text-white", {
                      "!text-neutral-900": variant === "dark",
                    })}
                  >
                    Construye
                  </span>
                </span>{" "}
                <span> la Vida que Siempre Soñaste</span>
              </span>
            </h1>

            <p
              className={clsx(
                "text-lg opacity-80 leading-relaxed sm:text-xl text-center",
                {
                  "text-neutral-100": variant === "dark",
                }
              )}
            >
              {dict.mainPage.welcomeDescription}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <img
            src={`/images/vslgif.gif`}
            className="w-[80%] sm:max-w-[500px]"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="sm:max-w-[400px]">
          <Button
            className="!font-bold mt-4 !text-xl group rounded-lg bg-lime-500 font-medium text-black hover:opacity-70 focus-visible:outline-black active:opacity-80 border-0 min-w-[300px] !py-8"
            icon={
              <FireIcon className="w-6 h-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-200 ease-in-out" />
            }
            iconPosition="left"
            href="#offer"
          >
            {dict.mainPage.takeControlToday}
          </Button>
        </div>
      </div>

      {/* <section className="flex flex-wrap items-center justify-center mt-6 mb-12 xl:py-5">
              <span className="text-xs opacity-50 mr-2">Featured on</span>
              <a
                href="https://x.com/ottobonilla95/status/1843986969715691806"
                target="_blank"
                rel="noreferrer"
                title="Featured on X.com"
              >
                <XIcon className="w-8 md:w-9" />
              </a>
            </section> */}
    </div>
  );
};
