"use client";

import { useState } from "react";
import { MapPin, Phone, MessageSquare, Navigation, Send } from "lucide-react";
import { PageHero } from "@/components/ui/SectionHeading";
import { SocialChannelList } from "@/components/ui/SocialLinks";
import { branches as fallbackBranches } from "@/data/site";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import { bilingualOr } from "@/lib/cms-copy";
import { submitContactMessage } from "@/lib/api";
import { toTelHref, toWhatsAppHref } from "@/lib/phone";

const DEFAULT_MAP_EMBED =
  "https://maps.google.com/maps?q=Riyadh%20Saudi%20Arabia&z=11&output=embed";

function toEmbedUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (value.includes("output=embed") || value.includes("/maps/embed")) return value;
  if (value.includes("google.com/maps") || value.includes("maps.app.goo.gl")) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(value)}&z=15&output=embed`;
  }
  return value;
}

export function ContactPageContent() {
  const { t, locale } = useLocale();
  const { siteSettings, branches } = useData();

  const branchCards =
    branches.length > 0
      ? branches.map((branch) => ({
          id: branch.id,
          name: branch.name[locale],
          address: branch.address[locale],
          phone: branch.phone.trim(),
          directionsUrl: branch.directionsUrl,
          mapEmbedUrl: toEmbedUrl(branch.mapEmbedUrl),
          isMainBranch: branch.isMainBranch,
        }))
      : fallbackBranches.map((branch) => ({
          id: branch.id,
          name: t.branches[branch.id].name,
          address: t.branches[branch.id].address,
          phone: branch.phone.trim(),
          directionsUrl: branch.mapUrl,
          mapEmbedUrl: toEmbedUrl(branch.mapUrl),
          isMainBranch: false,
        }));

  const mapTitleFallback = bilingualOr(siteSettings.contactMapTitle, locale, t.contact.mapTitle);
  const whatsappCta = bilingualOr(
    siteSettings.contactWhatsappCta,
    locale,
    t.contact.sendWhatsapp,
  );

  return (
    <>
      <PageHero
        title={bilingualOr(siteSettings.contactPageTitle, locale, t.contact.pageTitle)}
        subtitle={bilingualOr(
          siteSettings.contactPageSubtitle,
          locale,
          t.contact.pageSubtitle,
        )}
      />

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto w-full max-w-7xl space-y-8">
          <h2
            className="animate-rise text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {bilingualOr(
              siteSettings.contactBranchesTitle,
              locale,
              t.contact.branchesTitle,
            )}
          </h2>

          <div className="space-y-6">
            {branchCards.map((branch, index) => {
              const mapSrc = branch.mapEmbedUrl || DEFAULT_MAP_EMBED;
              const delayClass =
                index === 0
                  ? "animate-rise-delay-1"
                  : index === 1
                    ? "animate-rise-delay-2"
                    : index === 2
                      ? "animate-rise-delay-3"
                      : "animate-rise-delay-4";

              return (
                <article
                  key={branch.id}
                  className={`animate-rise hover-lift grid overflow-hidden rounded-2xl border lg:grid-cols-2 ${delayClass}`}
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: "var(--bg-card)",
                  }}
                >
                  <div className="flex flex-col gap-3 p-5 sm:p-6">
                    <h3
                      className="flex items-center gap-2 text-lg font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <MapPin className="size-5 shrink-0 text-brand-gold" />
                      {branch.name}
                      {branch.isMainBranch ? (
                        <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-[10px] font-semibold text-brand-gold">
                          {locale === "ar" ? "رئيسي" : "Main"}
                        </span>
                      ) : null}
                    </h3>
                    {branch.address ? (
                      <p className="text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                        {branch.address}
                      </p>
                    ) : null}
                    {branch.phone ? (
                      <p
                        className="flex items-center gap-1.5 text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <Phone className="size-3.5" />
                        {t.common.phone}:{" "}
                        <a
                          href={toTelHref(branch.phone)}
                          className="font-medium text-brand-gold hover:text-brand-gold-hover"
                        >
                          <span dir="ltr" className="unicode-bidi-isolate">
                            {branch.phone}
                          </span>
                        </a>
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-wrap gap-2 pt-1">
                      {branch.phone ? (
                        <a
                          href={toWhatsAppHref(branch.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                          <MessageSquare className="size-4" />
                          {whatsappCta}
                        </a>
                      ) : null}
                      {branch.directionsUrl ? (
                        <a
                          href={branch.directionsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium text-brand-gold transition-colors hover:border-brand-gold"
                          style={{ borderColor: "var(--border-default)" }}
                        >
                          <Navigation className="size-4" />
                          {t.buttons.getDirections}
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className="min-h-[220px] border-t lg:border-s lg:border-t-0"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <iframe
                      title={`${mapTitleFallback} — ${branch.name}`}
                      src={mapSrc}
                      className="h-full min-h-[220px] w-full lg:min-h-[280px]"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                  </div>
                </article>
              );
            })}
          </div>

          <div className="animate-rise animate-rise-delay-3 space-y-4">
            <SocialChannelList omit={["phone", "whatsapp"]} />
          </div>
        </div>
      </section>

      <section
        className="border-t px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="animate-rise mx-auto w-full max-w-3xl">
          <ContactForm />
        </div>
      </section>
    </>
  );
}

type FormStatus = "idle" | "sending" | "success" | "error";

function ContactForm() {
  const { t } = useLocale();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await submitContactMessage(form);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div
      className="rounded-2xl border p-6 shadow-sm sm:p-8 lg:p-10"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-card)",
      }}
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {t.contact.formTitle}
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
          {t.contact.formSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.contact.formName} value={form.name} onChange={update("name")} required />
          <Field
            label={t.contact.formEmail}
            type="email"
            value={form.email}
            onChange={update("email")}
            required
          />
          <Field label={t.contact.formPhone} value={form.phone} onChange={update("phone")} />
          <Field label={t.contact.formSubject} value={form.subject} onChange={update("subject")} />
        </div>

        <Field
          label={t.contact.formMessage}
          value={form.message}
          onChange={update("message")}
          multiline
          required
        />

        <div className="flex flex-col items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-8 text-sm font-semibold text-brand-dark transition-all duration-300 hover:bg-brand-gold-hover hover:shadow-lg hover:shadow-brand-gold/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Send className="size-4" />
            {status === "sending" ? t.contact.formSending : t.contact.formSubmit}
          </button>

          {status === "success" ? (
            <p className="text-sm font-medium text-emerald-500">{t.contact.formSuccess}</p>
          ) : null}
          {status === "error" ? (
            <p className="text-sm font-medium text-red-500">{t.contact.formError}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  multiline = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  const className =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-brand-gold";
  const style = {
    borderColor: "var(--border-subtle)",
    backgroundColor: "var(--bg-surface)",
    color: "var(--text-primary)",
  };

  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={5}
          className={className}
          style={style}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={className}
          style={style}
        />
      )}
    </label>
  );
}
