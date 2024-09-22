"use client";

import {
  HomeIcon,
  PresentationChartLineIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  {
    name: "Mi Resumen",
    href: "/dashboard/insights",
    icon: PresentationChartLineIcon,
  },
  { name: "Soporte", href: "/dashboard/support", icon: UserGroupIcon },
  { name: "Cuenta", href: "/dashboard/account", icon: UserIcon },
];

export default function NavLinks() {
  let pathname = usePathname();
  if (pathname.includes("/dashboard/account")) {
    pathname = "/dashboard/account";
  }
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
              {
                "!bg-black text-white": pathname === link.href,
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
