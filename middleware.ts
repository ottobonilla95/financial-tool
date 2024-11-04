import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";
import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";

let locales = ["en", "es"];

function getUserPreferredLocale(request: NextRequest) {
  // Check for the user's saved language in the request (e.g., via cookies or tokens)
  const userPreferredLocale = request.cookies.get("preferredLocale")?.value;

  if (userPreferredLocale && locales.includes(userPreferredLocale)) {
    return userPreferredLocale;
  }

  return null;
}

function removeFirstPartOfUrl(url: string) {
  const parts = url.split("/");
  parts.splice(1, 1);

  return parts.join("/");
}

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) {
    return locales[0];
  }

  // Parse the header and find a matching locale
  const acceptedLocales = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim());

  for (const acceptedLocale of acceptedLocales) {
    if (locales.includes(acceptedLocale)) {
      return acceptedLocale;
    }
  }

  return locales[0];
}

function generateLocaleUrl(pathname: string, locale: string) {
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return pathname;

  return `/${locale}${pathname}`;
}

const { auth } = NextAuth(authConfig);
export default auth(async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // 1. Check if user has a preferred locale
  const userPreferredLocale = getUserPreferredLocale(request);

  // 2. Fallback to browser locale if no preference is set
  const locale = userPreferredLocale || getLocale(request);

  const pathnameHasLocale = locales.some(
    (locale) =>
      nextUrl.pathname.startsWith(`/${locale}/`) ||
      nextUrl.pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${locale}${nextUrl.pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  //@ts-ignore
  const isLoggedIn = !!request.auth;
  const isPublicRoute = publicRoutes.includes(
    removeFirstPartOfUrl(nextUrl.pathname)
  );

  const isAuthRoute = authRoutes.includes(
    removeFirstPartOfUrl(nextUrl.pathname)
  );

  if (isAuthRoute) {
    if (isLoggedIn) {
      // Redirect logged-in users from auth routes
      return NextResponse.redirect(
        new URL(generateLocaleUrl(DEFAULT_LOGIN_REDIRECT, locale), nextUrl)
      );
    }

    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(
      new URL(generateLocaleUrl("/login", locale), nextUrl)
    );
  }

  // if (isLoggedIn) {
  //   return intlMiddleware(req); // Apply internationalization for logged-in users
  // }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$|sitemap\\.xml|robots\\.txt|scripts/).*)",
  ],
};
