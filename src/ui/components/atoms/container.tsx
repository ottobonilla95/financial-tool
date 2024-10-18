import clsx from "clsx";

export type ContainerProps = {
  children: React.ReactNode;
  variant?: "full" | "standard";
};

export const Container = ({
  children,
  variant = "standard",
}: ContainerProps) => {
  return (
    <div className="flex justify-center">
      <div
        className={clsx("", {
          "max-w-[1440px] w-full px-8": variant === "standard",
          "w-full": variant === "full",
        })}
      >
        {children}
      </div>
    </div>
  );
};
