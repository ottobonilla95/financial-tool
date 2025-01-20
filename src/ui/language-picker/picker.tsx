"use client";
import { setCookie, getCookie } from "cookies-next";
import { get } from "http";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const LanguagePicker = ({
  currentLocale,
}: {
  currentLocale: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // Access current query parameters
  const [locale, setLocale] = useState(currentLocale);

  const handleLocaleChange = (newLocale: string) => {
    // Update the URL to reflect the chosen language
    const currentPath = pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);

    setLocale(newLocale);

    // Save the selected language in cookies
    setCookie("preferredLocale", newLocale);

    // Convert query params to a string
    const queryString = searchParams.toString();
    const updatedUrl = queryString ? `${newPath}?${queryString}` : newPath;

    // Redirect to the new locale URL with query parameters
    router.push(updatedUrl);
  };

  useEffect(() => {
    if (!getCookie("preferredLocale")) {
      setCookie("preferredLocale", currentLocale);
    }
  }, []);
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
          className="w-6"
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
