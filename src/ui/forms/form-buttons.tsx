import { useFormStatus } from "react-dom";
import { Button, ButtonProps, Spinner } from "../components";
import { useTranslations } from "@/src/translations/use-translations";

export type SubmitButtonProps = ButtonProps;

export const SubmitButton = ({ children, ...props }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button
        isDisabled
        aria-disabled
        disabled
        {...props}
        icon={<Spinner className="h-5 w-5 !fill-black" />}
      ></Button>
    );
  }

  return (
    <Button type="submit" {...props}>
      {children}
    </Button>
  );
};

export const CancelButton = ({ onClick }: { onClick: () => void }) => {
  const { pending } = useFormStatus();
  const { dict } = useTranslations();

  if (pending) {
    return null;
  }

  return (
    <Button type="button" onClick={onClick}>
      {dict.forms?.shared.cancel}
    </Button>
  );
};
