"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

export const NavLink = ({ href, children, exact = false }: NavLinkProps) => {
  const pathname = usePathname();

  const isActive = exact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center py-2 px-3 rounded-lg transition",
        "hover:bg-blue-50 text-violet-700",
        isActive && "bg-blue-100 text-violet-900"
      )}
    >
      {children}
    </Link>
  );
};
