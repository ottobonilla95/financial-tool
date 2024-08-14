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
        {/* {children} */}
        zz
        <ToastContainer />
      </body>
    </html>
  );
}
