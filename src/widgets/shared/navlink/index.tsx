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
        "hover:bg-[#383838] text-gray-200",
        isActive && "bg-[#2d2d2d]"
      )}
    >
      {children}
    </Link>
  );
};
