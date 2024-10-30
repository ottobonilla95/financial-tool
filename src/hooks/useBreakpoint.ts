import resolveConfig from "tailwindcss/resolveConfig";
import { useMediaQuery } from "./useMediaQuery";
const baseConfig = require("../../tailwind.config");

const breakpointArray = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;
type BreakpointKey = (typeof breakpointArray)[number];

const fullConfig = resolveConfig(baseConfig);
//@ts-ignore
const breakpoints: { [key in BreakpointKey]: string } =
  fullConfig.theme!.screens;
export function useBreakpoint<K extends BreakpointKey>(
  breakpointKey: K,
  options: { useBreakpointRanges?: boolean } = {}
) {
  const index = breakpointArray.indexOf(breakpointKey);

  let query = "";

  if (breakpointKey === breakpointArray[0]) {
    query = `(max-width: ${breakpoints["sm"]})`;
  } else {
    if (options.useBreakpointRanges) {
      if (breakpointKey === breakpointArray[breakpointArray.length - 1]) {
        query = `(min-width: ${breakpoints[breakpointKey]})`;
      } else {
        query = `(min-width: ${breakpoints[breakpointKey]}) and (max-width: ${
          breakpoints[breakpointArray[index + 1]]
        })`;
      }
    } else {
      query = `(min-width: ${breakpoints[breakpointKey]})`;
    }
  }

  const bool = useMediaQuery(query);

  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
  type Key = `is${Capitalize<K>}`;
  return {
    [`is${capitalizedKey}`]: bool,
  } as Record<Key, boolean>;
}
