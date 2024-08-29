import clsx from "clsx";
import Link from "next/link";
import { Spinner } from "./icons";

export type ButtonProps = {
  href?: string;
  isDisabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  href,
  isDisabled,
  children,
  icon,
  iconPosition = "left",
  className: inputClassname,
  loading,
  ...rest
}: ButtonProps) => {
  const className = clsx(
    "flex w-full text-sm h-10 px-3 items-center justify-center rounded-md border aria-disabled:cursor-not-allowed aria-disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    {
      "pointer-events-none text-gray-300 bg-gray-100": isDisabled,
      "hover:bg-gray-100": !isDisabled,
    },
    inputClassname
  );

  const content = loading ? (
    <Spinner className="w-5" />
  ) : (
    <>
      {icon && iconPosition === "left" && <div className="mr-1">{icon}</div>}
      {children}
      {icon && iconPosition === "right" && <div className="ml-1">{icon}</div>}
    </>
  );

  if (isDisabled) {
    return <div className={className}>{content}</div>;
  }
  if (href) {
    return (
      <Link className={className} href={href}>
        {content}
      </Link>
    );
  }
  return (
    <button className={className} {...rest}>
      {content}
    </button>
  );
};
