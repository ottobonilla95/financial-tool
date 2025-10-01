import "@/src/styles/global.css";
import { bricolageGrotesque } from "@/src/styles/fonts";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import { AvailableLanguages, getDictionary } from "@/src/translations";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import FacebookPixel from "@/src/facebook-pixel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: AvailableLanguages };
}) {
  const dict = await getDictionary(params.lang);

  return (
    <html lang={params.lang} className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Google Analytics Script */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KXGCHBETSN"
        ></Script>
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KXGCHBETSN');
            `,
          }}
        />

        {/* Structured data JSON-LD script using translations */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: dict.meta.title,
              url: `https://www.trackmyspend.co/${params.lang}`,
              description: dict.meta.structuredData.description,
              applicationCategory: "FinanceApplication",
              operatingSystem: "Web, iOS, Android",
              softwareVersion: "1.0",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "200",
              },
              offers: [
                {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description: dict.meta.structuredData.freeTierDescription,
                  eligibleRegion: {
                    "@type": "Country",
                    name: "US",
                  },
                },
                {
                  "@type": "Offer",
                  price: "4.99",
                  priceCurrency: "USD",
                  description:
                    dict.meta.structuredData.monthlySubscriptionDescription,
                  eligibleRegion: {
                    "@type": "Country",
                    name: "US",
                  },
                },
                {
                  "@type": "Offer",
                  price: "49.00",
                  priceCurrency: "USD",
                  description:
                    dict.meta.structuredData.lifetimeAccessDescription,
                  eligibleRegion: {
                    "@type": "Country",
                    name: "US",
                  },
                },
              ],
              author: {
                "@type": "Organization",
                name: "TrackMySpend",
              },
            }),
          }}
        />
        <script
          defer
          data-website-id="67324a7e48920f2d2ad55ea7"
          data-domain="trackmyspend.co"
          src="https://datafa.st/js/script.js"
        ></script>

        {process.env.NODE_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:5234021,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
            }}
          />
        )}
      </head>
      <body
        className={`${bricolageGrotesque.className} antialiased tracking-tight`}
      >
        {children}
        <ToastContainer />
        <div className="fixed bottom-2 right-2 text-sm text-gray-400">
          &copy; {new Date().getFullYear()} TrackMySpend
        </div>
        <Analytics />
        <FacebookPixel />
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
