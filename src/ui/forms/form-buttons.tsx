import { useFormStatus } from "react-dom";
import { Button, Spinner } from "../components";
import { useTranslations } from "@/src/translations/use-translations";

export type SubmitButtonProps = {
  text?: string;
};

export const SubmitButton = ({ text }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button isDisabled icon={<Spinner className="h-5 w-5" />}>
        Loading...
      </Button>
    );
  }

  return (
    <Button type="submit" disabled={pending}>
      {text}
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
