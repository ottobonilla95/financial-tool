import { auth } from "@/auth";
import { fetchContacts } from "@/src/data/contacts-app/contacts";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { ContactsMap } from "@/src/ui/contacts-app";

export type InsightsPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function Page({ params: { lang } }: InsightsPageProps) {
  const dict = await getDictionary(lang);

  const session = await auth();

  const userId = session?.user?.id as string;

  const contacts = await fetchContacts({
    filters: {
      user_id: userId,
    },
  });

  const mapToken = process.env.MAPBOX_TOKEN;

  return (
    <main className="">
      <div className="fixed inset-0">
        <ContactsMap mapToken={mapToken || ""} contacts={contacts} />
      </div>
    </main>
  );
}
