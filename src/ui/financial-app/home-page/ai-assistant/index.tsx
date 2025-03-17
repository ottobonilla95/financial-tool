import { AvailableLanguages } from "@/src/translations";
import React from "react";
import { AIAssistantEn } from "./ai-assistant-en";
import { AIAssistantEs } from "./ai-assistant-es";

export type AIAssistantProps = { lang: AvailableLanguages };

export const AIAssistant = ({ lang }: AIAssistantProps) => {
  if (lang === "es") {
    return <AIAssistantEs />;
  }

  return <AIAssistantEn />;
};
