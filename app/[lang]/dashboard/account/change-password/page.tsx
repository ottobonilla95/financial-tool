import { AvailableLanguages, getDictionary } from "@/src/translations";
import { ChangePasswordForm } from "@/src/ui/account";

export type ChangePasswordPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function ChangePasswordPage({
  params: { lang },
}: ChangePasswordPageProps) {
  const dict = await getDictionary(lang);

  return <ChangePasswordForm dict={dict} />;
}
