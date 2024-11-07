import { AppDictionary } from "@/src/translations";
import React from "react";

export type MyStoryProps = {
  dict: AppDictionary;
};
export const MyStory = ({ dict }: MyStoryProps) => {
  return null;
  return (
    <section
      id="key-features"
      className="text-neutral-100 px-4 md:px-0 text-center tracking-tight"
    >
      MyStory
    </section>
  );
};
