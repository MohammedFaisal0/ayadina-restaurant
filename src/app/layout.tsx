import type { Metadata } from "next";
import { Cairo, Readex_Pro } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LocaleProvider } from "@/i18n/locale-context";
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

export const metadata: Metadata = {
  title: "Ayadina Grills | مشويات أيادينا",
  description:
    "Ayadina Grills — premium grilled dishes and an authentic luxury dining experience.",
};

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
      <body className="min-h-screen font-arabic">
        <LocaleProvider>
          <ThemeProvider>
            <AuthProvider>
              <DataProvider>
                <AppShell>{children}</AppShell>
              </DataProvider>
            </AuthProvider>
          </ThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
