import type { Metadata } from "next";
import { connection } from "next/server";
import { Cairo, Readex_Pro } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { FaviconSync } from "@/components/layout/FaviconSync";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocaleProvider } from "@/i18n/locale-context";
import { getOrCreateSiteSetting } from "@/lib/cms";
import { resolveSiteIconUrl } from "@/lib/site-icon";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const readexPro = Readex_Pro({
  variable: "--font-readex-pro",
  subsets: ["latin", "arabic"],
  display: "swap",
});

const FALLBACK_METADATA: Metadata = {
  title: "Ayadina Grills | مشويات أيادينا",
  description:
    "Ayadina Grills — premium grilled dishes and an authentic luxury dining experience.",
  icons: { icon: "/logo.png" },
};

function iconHref(url: string, updatedAt?: Date): string {
  const base = url.trim() || "/logo.png";
  if (!updatedAt) return base;
  const stamp = updatedAt.getTime();
  return base.includes("?") ? `${base}&v=${stamp}` : `${base}?v=${stamp}`;
}

export async function generateMetadata(): Promise<Metadata> {
  // Force a fresh DB read so favicon/title are not frozen from a cached render.
  await connection();
  try {
    const settings = await getOrCreateSiteSetting();
    const icon = iconHref(
      resolveSiteIconUrl({
        faviconUrl: settings.faviconUrl,
        logoUrl: settings.logoUrl,
      }),
      settings.updatedAt,
    );
    return {
      title: `${settings.brandNameEn} | ${settings.brandNameAr}`,
      description: settings.aboutStoryEn,
      icons: {
        icon: [{ url: icon }],
        shortcut: icon,
      },
    };
  } catch {
    return FALLBACK_METADATA;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-theme="dark"
      suppressHydrationWarning
      className={`${cairo.variable} ${readexPro.variable} h-full antialiased`}
    >
      <body className="min-h-screen font-arabic" suppressHydrationWarning>
        <LocaleProvider>
          <ThemeProvider>
            <AuthProvider>
              <DataProvider>
                <FaviconSync />
                <AppShell>{children}</AppShell>
              </DataProvider>
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
