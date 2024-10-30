import clsx from "clsx";

export type DividerProps = {
  className?: string;
};

export const Divider = ({ className }: DividerProps) => {
  const mergedClassName = clsx("border-t border-gray-200", className);

  return <div className={mergedClassName} />;
};
