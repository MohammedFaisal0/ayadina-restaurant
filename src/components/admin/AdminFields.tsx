"use client";

import type { ReactNode } from "react";

const inputClass =
  "w-full rounded-xl border px-4 py-3 text-sm transition-all duration-300 ease-in-out focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30";

const inputStyle = {
  borderColor: "var(--border-default)",
  backgroundColor: "var(--bg-surface)",
  color: "var(--text-primary)",
} as const;

export function TextField({
  label,
  value,
  onChange,
  dir,
  lang,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  lang?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">
        {label}
      </span>
      <input
        type={type}
        value={value}
        dir={dir}
        lang={lang}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        style={inputStyle}
      />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  dir,
  lang,
  rows = 4,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  lang?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span style={{ color: "var(--text-secondary)" }} className="text-sm font-medium">
        {label}
      </span>
      <textarea
        value={value}
        dir={dir}
        lang={lang}
        rows={rows}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} resize-y`}
        style={inputStyle}
      />
    </label>
  );
}

export function BilingualFields({
  labelAr,
  labelEn,
  value,
  onChange,
  multiline = false,
  required = false,
}: {
  labelAr: string;
  labelEn: string;
  value: { ar: string; en: string };
  onChange: (value: { ar: string; en: string }) => void;
  multiline?: boolean;
  required?: boolean;
}) {
  const Field = multiline ? TextAreaField : TextField;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label={labelAr}
        value={value.ar}
        onChange={(ar) => onChange({ ...value, ar })}
        dir="rtl"
        lang="ar"
        required={required}
      />
      <Field
        label={labelEn}
        value={value.en}
        onChange={(en) => onChange({ ...value, en })}
        dir="ltr"
        lang="en"
        required={required}
      />
    </div>
  );
}

export function AdminSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="space-y-4 rounded-2xl border p-4 sm:p-6"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-card)",
      }}
    >
      <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}
