import { Footer } from "@/src/ui/components";
import SideNav from "@/src/ui/dashboard/sidenav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Track My Spend",
    default: "TrackMySpend: Herramienta de Seguimiento de Gastos y Ganancias",
  },
  description:
    "Descubre TrackMySpend, la aplicación de gestión financiera que te permite seguir tus gastos y ganancias de manera fácil y eficiente. Organiza tus finanzas con categorías y subcategorías personalizables. ¡Empieza a gestionar tu dinero hoy mismo en www.trackmyspend.co!",
};

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <div className="p-6 md:p-12">{children}</div>
      </div>
    </div>
  );
}
