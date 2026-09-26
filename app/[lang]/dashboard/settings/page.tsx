import { auth } from "@/auth";
import { fetchManagedCategories } from "@/src/data/category/settings";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import CategorySettings from "@/src/ui/financial-app/settings/category-settings";
import { redirect } from "next/navigation";

export default async function SettingsPage({ params: { lang } }: { params: { lang: AvailableLanguages } }) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/${lang}/login`);
  const [dict, categories] = await Promise.all([getDictionary(lang), fetchManagedCategories(session.user.id)]);
  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8">
      <h1 className="text-2xl font-bold">{dict.settings.title}</h1>
      <p className="mt-2 mb-6 text-gray-600">{dict.settings.description}</p>
      <CategorySettings categories={categories} lang={lang} labels={dict.settings} />
    </main>
  );
}
