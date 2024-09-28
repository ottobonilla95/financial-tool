import { AvailableLanguages, getDictionary } from "@/src/translations";
import SideNav from "@/src/ui/dashboard/sidenav";

export const experimental_ppr = true;

export type LayoutProps = {
  params: { lang: AvailableLanguages };
  children: React.ReactNode;
};

export default async function Layout({
  children,
  params: { lang },
}: LayoutProps) {
  const dict = await getDictionary(lang);

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav dict={dict} />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="p-6 md:p-12">{children}</div>
      </div>
    </div>
  );
}
