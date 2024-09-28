import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://trackmyspend.co",
      // lastModified: new Date("2023-08-01"), // Last actual update of this page
      alternates: {
        languages: {
          es: "https://trackmyspend.co/es",
          en: "https://trackmyspend.co/en",
        },
      },
    },
    {
      url: "https://trackmyspend.co/about-us",
      // lastModified: new Date("2023-07-01"), // Example of last real modification date
      alternates: {
        languages: {
          es: "https://trackmyspend.co/es/about-us",
          en: "https://trackmyspend.co/en/about-us",
        },
      },
    },
    {
      url: "https://trackmyspend.co/contact-us",
      // lastModified: new Date("2023-06-01"), // Last modification date for this page
      alternates: {
        languages: {
          es: "https://trackmyspend.co/es/contact-us",
          en: "https://trackmyspend.co/en/contact-us",
        },
      },
    },
    {
      url: "https://trackmyspend.co/privacy-policy",
      lastModified: new Date(),
      alternates: {
        languages: {
          es: "https://trackmyspend.co/es/privacy-policy",
          en: "https://trackmyspend.co/en/privacy-policy",
        },
      },
    },
  ];
}
