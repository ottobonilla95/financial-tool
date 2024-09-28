import { auth } from "@/auth";
import { getDBUser } from "@/src/data/user";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { User } from "@/src/types";
import { Button } from "@/src/ui/components";

export type AccountPageProps = {
  params: { lang: AvailableLanguages };
};

export default async function AccountPage({
  params: { lang },
}: AccountPageProps) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const user = (await getDBUser({
    filters: {
      id: userId,
    },
    select: {
      name: true,
      email: true,
      currency: {
        select: {
          name: true,
          symbol: true,
        },
      },
    },
  })) as User;

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{dict.accountPage.title}</h1>

      <div className="mb-8">
        <div>
          <p>
            <strong>{`${dict.shared.name}:`}</strong> {user.name}
          </p>
        </div>

        <div>
          <p>
            <strong>{`${dict.shared.email}:`}</strong> {user.email}
          </p>
        </div>
        <div>
          <p>
            <strong>{`${dict.shared.currency}:`}</strong> (
            {user.currency?.symbol}){user.currency?.name}
          </p>
        </div>

        <div className="flex justify-between items-center py-1">
          <p>
            <strong>{`${dict.shared.password}:`}</strong> ********
          </p>
          <div>
            <Button href="/dashboard/account/change-password">
              {`${dict.accountPage.changePassword}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
