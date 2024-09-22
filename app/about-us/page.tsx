import AppLogo from "@/src/ui/app-logo";
import { Footer } from "@/src/ui/components";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col p-6">
        <div className="flex h-20 shrink-0 items-center rounded-lg bg-black p-4 md:h-[150px] sm:pl-10">
          <Link href="/">
            <AppLogo />
          </Link>
        </div>
        <div className="mt-4 flex grow flex-col gap-4">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10">
            <h1 className="text-xl text-gray-800 md:text-3xl font-bold">
              Sobre Track My Expense
            </h1>
            <p className="text-lg text-gray-700 md:text-xl">
              Nuestro sitio web fue creado para permitir a los usuarios llevar
              un registro de sus gastos de manera sencilla y obtener una mejor
              comprensión de cómo se están gestionando sus finanzas personales.
              Esto les ayuda a tomar el control de su salud financiera y a tomar
              decisiones informadas.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Creemos que la gestión de las finanzas personales debe ser simple,
              accesible y eficiente. Ya sea que estés intentando ahorrar más,
              entender tus hábitos de gasto o simplemente llevar un mejor
              control, Track My Expense está diseñado para personas que desean
              mejorar su bienestar financiero.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
