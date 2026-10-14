import type { Metadata } from "next";
import Link from "next/link";
import { defaultLocale } from "@/i18n/routing";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

// Rendered for URLs that match no route at all (e.g. an unsupported locale
// prefix). Shown trilingually because the visitor's locale is unknown.
export default function GlobalNotFound() {
  return (
    <html lang={defaultLocale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full items-center justify-center px-5 py-24">
        <main className="max-w-prose text-center">
          <h1 className="text-4xl">404</h1>
          <p className="mt-4" lang="th">ไม่พบหน้าที่ต้องการ</p>
          <p lang="en">Page not found</p>
          <p lang="zh-CN">页面未找到</p>
          <nav className="mt-8 flex justify-center gap-4 text-primary underline">
            <Link href="/th" lang="th">ไทย</Link>
            <Link href="/en" lang="en">English</Link>
            <Link href="/zh-CN" lang="zh-CN">简体中文</Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
