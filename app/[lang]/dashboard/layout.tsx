import { auth } from "@/auth";
import { getDBUser } from "@/src/data/user";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { SubscriptionPlanOption } from "@/src/types";
import SideNav from "@/src/ui/financial-app/dashboard/sidenav";

// export const experimental_ppr = true;

export type LayoutProps = {
  params: { lang: AvailableLanguages };
  children: React.ReactNode;
};

export default async function Layout({
  children,
  params: { lang },
}: LayoutProps) {
  const dict = await getDictionary(lang);

  const session = await auth();
  const userId = session?.user?.id as string;

  const user = await getDBUser({
    filters: {
      id: userId,
    },
    select: {
      subscription_plan: true,
    },
  });

  const isPremium = user?.subscriptionPlan !== SubscriptionPlanOption.Free;

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav dict={dict} isPremium={isPremium} />
      </div>
      <div className="flex-grow md:overflow-y-auto bg-gray-50">
        <div>{children}</div>
      </div>
    </div>
  );
}
