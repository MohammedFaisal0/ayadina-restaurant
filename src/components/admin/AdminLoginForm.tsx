"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Flame, Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocale } from "@/i18n/locale-context";
import { routes } from "@/lib/paths";

export function AdminLoginForm() {
  const { t } = useLocale();
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace(routes.adminDashboard);
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const success = await login(username, password);
    if (success) {
      router.push(routes.adminDashboard);
      return;
    }
    setError(t.admin.invalidCredentials);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div
        className="animate-fade-scale w-full max-w-md rounded-2xl border p-6 backdrop-blur-xl sm:p-8"
        style={{
          borderColor: "var(--glass-border)",
          backgroundColor: "var(--glass-bg)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)",
        }}
      >
        <div className="mb-6 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Flame className="size-6 text-brand-gold" />
            <p className="text-sm font-semibold text-brand-gold">Ayadina Grills</p>
          </div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {t.admin.loginTitle}
          </h1>
          <p style={{ color: "var(--text-muted)" }} className="text-sm">
            {t.admin.loginSubtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm">
              {t.admin.username}
            </span>
            <div className="relative">
              <User
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
                className="w-full rounded-xl border py-3 pe-4 ps-10 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                style={{
                  borderColor: "var(--border-default)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span style={{ color: "var(--text-secondary)" }} className="text-sm">
              {t.admin.password}
            </span>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-xl border py-3 pe-12 ps-10 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                style={{
                  borderColor: "var(--border-default)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? t.admin.hidePassword : t.admin.showPassword}
                className="absolute end-2 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-lg transition-colors hover:text-brand-gold"
                style={{ color: "var(--text-muted)" }}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </label>

          {error ? (
            <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-dark transition-all duration-300 ease-in-out hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/20"
          >
            {t.admin.loginButton}
          </button>
        </form>
      </div>
    </div>
  );
}
