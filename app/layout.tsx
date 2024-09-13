import "@/src/styles/global.css";
import { inter } from "@/src/styles/fonts";
import { ToastContainer } from "react-toastify";

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
    </html>
  );
}
