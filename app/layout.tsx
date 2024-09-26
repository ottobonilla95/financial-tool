import "@/src/styles/global.css";
import { inter } from "@/src/styles/fonts";
import { ToastContainer } from "react-toastify";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <ToastContainer />
        <div className="fixed bottom-2 right-2 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TrackMySpend
        </div>
      </body>
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid="b7860b70-8613-4e44-ab1b-0f6305eead69"
        data-blockingmode="auto"
        type="text/javascript"
      />
    </html>
  );
}
