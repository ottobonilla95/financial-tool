import clsx from "clsx";
import Link from "next/link";

export type ButtonProps = {
  href?: string;
  isDisabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  href,
  isDisabled,
  children,
  icon,
  iconPosition = "left",
  ...rest
}: ButtonProps) => {
  const className = clsx(
    "flex h-10 px-3 items-center justify-center rounded-md border",
    {
      "pointer-events-none text-gray-300": isDisabled,
      "hover:bg-gray-100": !isDisabled,
    }
  );

  const content = (
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
