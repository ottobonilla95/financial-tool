import AppLogo from "@/src/ui/app-logo";
import { Footer } from "@/src/ui/components";
import Link from "next/link";

export default function ContactUsPage() {
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
              Contáctanos
            </h1>
            <p className="text-lg text-gray-700 md:text-xl">
              ¡Nos encantaría saber de ti! Ya sea que tengas una pregunta,
              comentario o necesites soporte, no dudes en contactarnos.
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Puedes enviarnos un correo electrónico a:
            </p>
            <p className="text-lg text-gray-700 md:text-xl font-bold">
              <Link
                href="mailto:support@trackmyspend.co"
                className="text-blue-600"
              >
                support@trackmyspend.co
              </Link>
            </p>
            <p className="text-lg text-gray-700 md:text-xl">
              Nos esforzamos por responder dentro de las 24-48 horas.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
