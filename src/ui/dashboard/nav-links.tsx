"use client";

import {
  HomeIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import clsx from "clsx";
import { AppDictionary } from "@/src/translations";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.

export type NavLinksProps = {
  dict: AppDictionary;
};

export default function NavLinks({ dict }: NavLinksProps) {
  let pathname = usePathname();

  const params = useParams();
  const lang = params.lang;

  if (pathname.includes("/dashboard/account")) {
    pathname = `/${lang}/dashboard/account`;
  }

  const links = [
    { name: dict.sideMenu.home, href: "/dashboard", icon: HomeIcon },
    {
      name: dict.sideMenu.summary,
      href: "/dashboard/insights",
      icon: PresentationChartLineIcon,
      className: "tour-step-4",
    },
    {
      name: dict.sideMenu.support,
      href: "/dashboard/support",
      icon: UserGroupIcon,
    },
    { name: dict.sideMenu.account, href: "/dashboard/account", icon: UserIcon },
  ];

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-500 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3",
              link.className,
              {
                "!bg-black text-white":
                  pathname.replace(`/${lang}`, "") === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
