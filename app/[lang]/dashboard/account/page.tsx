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
      subscription_plan: true,
      subscription_cancel_at: true,
      stripeId: true,
      currency: {
        select: {
          name: true,
          symbol: true,
        },
      },
    },
  })) as User;

  const stripeCustomerPortalLink = `${process.env.STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${user.email}`;

  let cancelDateString;

  if (user.subscriptionCancelAt) {
    const cancelDate = new Date(user.subscriptionCancelAt * 1000);

    const formattedDate = cancelDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    cancelDateString = formattedDate;
  }

  return (
    <div className="p-2 md:p-5">
      <div className="rounded-sm shadow-sm bg-white p-5">
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

          <div className="flex justify-between items-center py-1">
            <p>
              <strong>{`${"Plan"}:`}</strong>
              <span className="ml-1 mr-1">
                {
                  dict.accountPage[
                    user.subscriptionPlan as keyof typeof dict.accountPage
                  ]
                }
              </span>
              {cancelDateString && (
                <span>{`(${dict.accountPage.finishesOn}: ${cancelDateString})`}</span>
              )}
            </p>
            <div>
              {user.stripeId ? (
                <Button href={stripeCustomerPortalLink} target="_blank">
                  {`${dict.shared.manageSubscription}`}
                </Button>
              ) : (
                <Button href="/dashboard/pricing">{`${dict.shared.goPremium}`}</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
