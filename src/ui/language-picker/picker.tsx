"use client";
import { setCookie } from "cookies-next";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export const LanguagePicker = ({
  currentLocale,
}: {
  currentLocale: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState(currentLocale);

  const handleLocaleChange = (newLocale: string) => {
    // Update the URL to reflect the chosen language
    const currentPath = pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    setLocale(newLocale);

    // Save the selected language in cookies
    setCookie("preferredLocale", newLocale);

    // Redirect to the new locale URL
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLocaleChange("en")}
        className={`p-1 rounded-md ${
          currentLocale === "en" ? "border-2 border-white" : ""
        }`}
      >
        <img
          src="/images/lang/en.png" // Replace this with the path to your English flag image
          alt="English"
          className="w-6 "
        />
      </button>
      <button
        onClick={() => handleLocaleChange("es")}
        className={`p-1 rounded-md ${
          currentLocale === "es" ? "border-2 border-white" : ""
        }`}
      >
        <img
          src="/images/lang/es.png" // Replace this with the path to your Spanish flag image
          alt="Español"
          className="w-6"
        />
      </button>
    </div>
  );
};
