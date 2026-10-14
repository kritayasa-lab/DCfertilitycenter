"use client";

import { useEffect, useId, useRef, useState } from "react";
import { NavLink } from "./NavLink";

export interface NavDropdownItem {
  href: string;
  label: string;
}

/**
 * Disclosure-style dropdown (button + list of links). Closes on Escape,
 * outside click, focus leaving the menu and navigation.
 */
export function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: NavDropdownItem[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-1 rounded-md px-3 text-sm font-medium text-foreground hover:text-primary"
      >
        {label}
        <svg aria-hidden="true" viewBox="0 0 20 20" className={`h-4 w-4 ${open ? "rotate-180" : ""}`}>
          <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
      <ul
        id={menuId}
        hidden={!open}
        className="absolute top-full left-0 z-40 mt-2 w-72 rounded-lg border border-border bg-surface p-2 shadow-raised"
      >
        {items.map((item) => (
          <li key={item.href}>
            <NavLink
              href={item.href}
              exact
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-foreground hover:bg-primary-soft"
              activeClassName="bg-primary-soft text-primary"
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
