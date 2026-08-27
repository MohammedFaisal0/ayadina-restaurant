"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { routes } from "@/lib/paths";
import { useLocale } from "@/i18n/locale-context";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(routes.adminLogin);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: "var(--bg-page)" }}
      >
        <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
          <Shield className="size-4 animate-pulse" />
          <p className="text-sm">{t.admin.loginTitle}...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
