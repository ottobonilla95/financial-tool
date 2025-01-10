import { PricingOptionGroup } from "../types";

export function getRandomPricingGroup() {
  const groups: PricingOptionGroup[] = ["pricing1", "pricing2", "pricing3"];
  const randomIndex = Math.floor(Math.random() * groups.length);
  return groups[randomIndex];
}
