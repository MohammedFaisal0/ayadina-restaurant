"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { AdminSection, BilingualFields, TextField } from "@/components/admin/AdminFields";
import { WorkingHoursPicker } from "@/components/admin/WorkingHoursPicker";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import type { SiteSettingsFormData } from "@/types/data";

function withoutId(settings: SiteSettingsFormData & { id?: string }): SiteSettingsFormData {
  const { id: _id, ...rest } = settings as SiteSettingsFormData & { id?: string };
  void _id;
  return rest;
}

export function SiteSettingsContent() {
  const { t } = useLocale();
  const { siteSettings, updateSiteSettings } = useData();
  const [form, setForm] = useState<SiteSettingsFormData>(withoutId(siteSettings));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    setForm(withoutId(siteSettings));
  }, [siteSettings]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus("idle");
    try {
      await updateSiteSettings(form);
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Header title={t.admin.generalSettings} saving={saving} status={status} />

      <AdminSection title={t.admin.brandingSection}>
        <div className="grid gap-6 lg:grid-cols-2">
          <ImageUpload label={t.admin.logoImage} value={form.logoUrl} onChange={(logoUrl) => setForm({ ...form, logoUrl })} />
          <ImageUpload label={t.admin.faviconImage} value={form.faviconUrl} onChange={(faviconUrl) => setForm({ ...form, faviconUrl })} />
        </div>
        <BilingualFields
          labelAr={t.admin.brandNameAr}
          labelEn={t.admin.brandNameEn}
          value={form.brandName}
          onChange={(brandName) => setForm({ ...form, brandName })}
          required
        />
      </AdminSection>

      <AdminSection title={t.admin.footerAboutSection}>
        <WorkingHoursPicker
          labelAr={t.admin.openingHoursAr}
          labelEn={t.admin.openingHoursEn}
          value={form.openingHours}
          onChange={(openingHours) => setForm({ ...form, openingHours })}
        />
        <BilingualFields
          labelAr={t.admin.copyrightAr}
          labelEn={t.admin.copyrightEn}
          value={form.copyrightText}
          onChange={(copyrightText) => setForm({ ...form, copyrightText })}
        />
      </AdminSection>

      <AdminSection title={t.admin.contactSocialsSection}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label={t.admin.contactEmail} value={form.contactEmail} onChange={(contactEmail) => setForm({ ...form, contactEmail })} dir="ltr" type="email" />
          <TextField label={t.admin.instagramUrl} value={form.instagramUrl} onChange={(instagramUrl) => setForm({ ...form, instagramUrl })} dir="ltr" />
          <TextField label={t.admin.facebookUrl} value={form.facebookUrl} onChange={(facebookUrl) => setForm({ ...form, facebookUrl })} dir="ltr" />
          <TextField label={t.admin.tiktokUrl} value={form.tiktokUrl} onChange={(tiktokUrl) => setForm({ ...form, tiktokUrl })} dir="ltr" />
        </div>
      </AdminSection>
    </form>
  );
}

export function Header({
  title,
  saving,
  status,
}: {
  title: string;
  saving: boolean;
  status: "idle" | "saved" | "error";
}) {
  const { t } = useLocale();
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h1>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-gold px-6 text-sm font-semibold text-brand-dark hover:bg-brand-gold-hover disabled:opacity-60"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          {saving ? t.admin.saving : t.admin.save}
        </button>
      </div>
      {status === "saved" ? <p className="text-sm text-emerald-500">{t.admin.settingsSaved}</p> : null}
      {status === "error" ? <p className="text-sm text-red-400">{t.admin.saveFailed}</p> : null}
    </div>
  );
}
