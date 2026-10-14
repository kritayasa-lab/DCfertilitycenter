import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { buttonClasses } from "@/components/ui/Button";
import { mainNav } from "@/config/navigation";
import { listServices } from "@/content/queries";
import type { Locale } from "@/i18n/routing";
import { MobileNav, type MobileNavItem } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";
import { NavLink } from "./NavLink";
import { SiteLogo } from "./SiteLogo";

const navLinkClass =
  "inline-flex min-h-11 items-center rounded-pill px-3.5 text-[0.95rem] font-medium text-foreground transition-colors hover:bg-primary-soft hover:text-primary aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary";

export async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Nav" });
  const services = await listServices(locale);

  const serviceItems = [
    { href: "/services", label: t("allServices") },
    ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.translations[locale]!.title })),
  ];

  const mobileItems: MobileNavItem[] = mainNav.map((item) => ({
    href: item.href,
    label: t(item.key),
    children: item.key === "services" ? serviceItems.slice(1) : undefined,
  }));

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="relative mx-auto flex max-w-content items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <SiteLogo />

        <nav aria-label={t("mainLabel")} className="hidden xl:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {mainNav.map((item) => (
              <li key={item.key}>
                {item.key === "services" ? (
                  <NavDropdown label={t("services")} items={serviceItems} />
                ) : item.key === "contact" ? (
                  <NavLink
                    href={item.href}
                    className={buttonClasses("gold", "md", "ml-2 px-6 text-[0.95rem]")}
                    activeClassName=""
                  >
                    {t(item.key)}
                  </NavLink>
                ) : (
                  <NavLink href={item.href} exact={item.href === "/"} className={navLinkClass} activeClassName="">
                    {t(item.key)}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden xl:block">
          <LanguageSwitcher compact />
        </div>

        <MobileNav
          items={mobileItems}
          openLabel={t("openMenu")}
          closeLabel={t("closeMenu")}
          footer={<LanguageSwitcher />}
        />
      </div>
    </header>
  );
}
