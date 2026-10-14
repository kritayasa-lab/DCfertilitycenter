"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { NavLink } from "./NavLink";

export interface MobileNavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

/** Collapsible navigation for small screens. */
export function MobileNav({
  items,
  openLabel,
  closeLabel,
  footer,
}: {
  items: MobileNavItem[];
  openLabel: string;
  closeLabel: string;
  footer: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Close after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-border-strong bg-surface text-foreground"
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" fill="none" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" fill="none" />
          )}
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-surface px-5 pb-8 shadow-raised"
      >
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.href} className="py-1">
              <NavLink
                href={item.href}
                exact={Boolean(item.children)}
                className="flex min-h-12 items-center text-base font-medium text-foreground"
              >
                {item.label}
              </NavLink>
              {item.children && item.children.length > 0 && (
                <ul className="mb-2 ml-4 border-l border-border pl-4">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <NavLink
                        href={child.href}
                        exact
                        className="flex min-h-11 items-center text-sm text-muted"
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3">{footer}</div>
      </div>
    </div>
  );
}
