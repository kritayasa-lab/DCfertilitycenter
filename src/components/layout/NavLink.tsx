"use client";

import type { ComponentProps } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/** Link that marks itself as current for its section (aria-current="page"). */
export function NavLink({
  href,
  className,
  activeClassName = "text-primary",
  exact = false,
  ...props
}: ComponentProps<typeof Link> & { href: string; activeClassName?: string; exact?: boolean }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(className, active && activeClassName)}
      {...props}
    />
  );
}
