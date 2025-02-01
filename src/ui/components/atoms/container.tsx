import clsx from "clsx";

export type ContainerProps = {
  children: React.ReactNode;
  variant?: "full" | "standard" | "narrow";
  className?: string;
};

export const Container = ({
  children,
  variant = "standard",
  className,
}: ContainerProps) => {
  return (
    <div className="flex justify-center">
      <div
        className={clsx(className, {
          "max-w-[1440px] w-full px-4": variant === "standard",
          "w-full": variant === "full",
          "px-8 max-w-[900px]": variant === "narrow",
        })}
      >
        {children}
      </div>
    </div>
  );
};
