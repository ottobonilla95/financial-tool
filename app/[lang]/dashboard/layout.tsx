import { AvailableLanguages, getDictionary } from "@/src/translations";
import SideNav from "@/src/ui/financial-app/dashboard/sidenav";
import { headers } from "next/headers";

export type LayoutProps = {
  params: { lang: AvailableLanguages };
  children: React.ReactNode;
};

export default async function Layout({
  children,
  params: { lang, ...rest },
}: LayoutProps) {
  const dict = await getDictionary(lang);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav dict={dict} />
      </div>
      <div className="flex-grow md:overflow-y-auto bg-gray-50 relative">
        <div>{children}</div>
      </div>
    </div>
  );
}
