import { auth } from "@/auth";
import { getPricingOptions } from "@/src/data/pricing_option";
import { getDBUser } from "@/src/data/user";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { User } from "@/src/types";
import { Pricing, SubscriptionPlan } from "@/src/ui/financial-app/pricing";

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
      id: true,
      email: true,
      subscription_plan: true,
      pricing_group: true,
    },
  })) as User;

  const pricingOptions = await getPricingOptions({
    filters: {
      pricing_group: user.pricingGroup || "",
    },
  });

  return (
    <div className="p-2 md:p-5">
      <div className="rounded-sm shadow-sm bg-white p-5">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {dict.pricingPage.chooseYourPlan}
        </h1>

        <Pricing
          currenSubscriptionPlan={user.subscriptionPlan as SubscriptionPlan}
          user={user}
          lang={lang}
          dict={dict}
          pricingOptions={pricingOptions}
        />
      </div>
    </div>
  );
}
