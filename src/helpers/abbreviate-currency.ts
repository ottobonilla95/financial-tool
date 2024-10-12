export function abbreviateCurrency(value: number, currencySymbol: string) {
  const formatValue = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}k`;
    }
    return num.toFixed(2);
  };

  return `${currencySymbol}${formatValue(value)}`;
}
