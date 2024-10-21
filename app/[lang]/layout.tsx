import "@/src/styles/global.css";
import { bricolageGrotesque } from "@/src/styles/fonts";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { lang: AvailableLanguages };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);

  return {
    title: {
      template: "%s | Track My Spend",
      default: dict.meta.title,
    },
    description: dict.meta.description,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.className} antialiased`}>
        {children}
        <ToastContainer />
        <div className="fixed bottom-2 right-2 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TrackMySpend
        </div>
      </body>
      {/* {process.env.NODE_ENV === "production" && (
        <Script
          id="Cookiebot"
          src="https://consent.cookiebot.com/uc.js"
          data-cbid="b7860b70-8613-4e44-ab1b-0f6305eead69"
          data-blockingmode="auto"
          type="text/javascript"
        />
      )} */}
    </html>
  );
}
