import type { ReactNode } from "react";
import { Flame, Star } from "lucide-react";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "start" | "center";
};

export function SectionHeading({
  title,
  subtitle,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl space-y-2 text-center"
          : "max-w-2xl space-y-2"
      }
    >
      <h2
        className="text-2xl font-semibold sm:text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className="text-sm leading-7 sm:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

type StatusBadgeProps = {
  isOpen: boolean;
  openLabel: string;
  closedLabel: string;
};

export function StatusBadge({ isOpen, openLabel, closedLabel }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${
        isOpen
          ? "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30"
          : "bg-red-500/15 text-red-400 ring-1 ring-red-500/30"
      }`}
    >
      <span
        className={`size-2 rounded-full ${isOpen ? "bg-emerald-400" : "bg-red-400"}`}
        aria-hidden
      />
      {isOpen ? openLabel : closedLabel}
    </span>
  );
}

type DishBadgeProps = {
  type: "spicy" | "popular";
  label: string;
};

export function DishBadge({ type, label }: DishBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1"
      style={{
        backgroundColor: "rgba(243,167,18,0.15)",
        color: "var(--brand-gold, #F3A712)",
        boxShadow: "inset 0 0 0 1px rgba(243,167,18,0.3)",
      }}
    >
      {type === "spicy" ? (
        <Flame className="size-3" />
      ) : (
        <Star className="size-3" />
      )}
      {label}
    </span>
  );
}

type PageHeroProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export function PageHero({ title, subtitle, children }: PageHeroProps) {
  return (
    <section
      className="border-b px-4 py-10 sm:px-6 sm:py-14 lg:px-8"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-surface)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <SectionHeading title={title} subtitle={subtitle} />
        {children}
      </div>
    </section>
  );
}
