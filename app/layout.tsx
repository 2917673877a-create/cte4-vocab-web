import type { Metadata } from "next";
import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CET4 Vocab Web",
  description: "A simple vocabulary review app built with Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-8 rounded-3xl border border-white/70 bg-white/80 px-6 py-5 shadow-soft backdrop-blur">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-brand-500">
                      CET-4 Vocabulary
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold text-brand-900">
                      cte4-vocab-web
                    </h1>
                  </div>
                  <AuthControls />
                </div>

                <nav className="flex flex-wrap gap-3 text-sm font-medium text-stone-600">
                  <Link className="rounded-full px-4 py-2 hover:bg-brand-50 hover:text-brand-700" href="/">
                    首页
                  </Link>
                  <Link
                    className="rounded-full px-4 py-2 hover:bg-brand-50 hover:text-brand-700"
                    href="/review"
                  >
                    复习
                  </Link>
                  <Link
                    className="rounded-full px-4 py-2 hover:bg-brand-50 hover:text-brand-700"
                    href="/login"
                  >
                    账号
                  </Link>
                  <Link
                    className="rounded-full px-4 py-2 hover:bg-brand-50 hover:text-brand-700"
                    href="/api/words"
                  >
                    API
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
