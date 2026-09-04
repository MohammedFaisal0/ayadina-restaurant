"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminSection, BilingualFields, TextField } from "@/components/admin/AdminFields";
import { Header } from "@/components/admin/SiteSettingsContent";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import type { SiteSettingsFormData } from "@/types/data";

function withoutId(settings: SiteSettingsFormData & { id?: string }): SiteSettingsFormData {
  const { id: _id, ...rest } = settings as SiteSettingsFormData & { id?: string };
  void _id;
  return rest;
}

export function HomePageSettingsContent() {
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
      <Header title={t.admin.homePageCms} saving={saving} status={status} />

      <AdminSection title={t.admin.heroSection}>
        <ImageUpload
          label={t.admin.heroBackground}
          value={form.heroBgImageUrl}
          onChange={(heroBgImageUrl) => setForm({ ...form, heroBgImageUrl })}
        />
        <BilingualFields
          labelAr={t.admin.heroTitleAr}
          labelEn={t.admin.heroTitleEn}
          value={form.heroTitle}
          onChange={(heroTitle) => setForm({ ...form, heroTitle })}
        />
        <BilingualFields
          labelAr={t.admin.heroSubtitleAr}
          labelEn={t.admin.heroSubtitleEn}
          value={form.heroSubtitle}
          onChange={(heroSubtitle) => setForm({ ...form, heroSubtitle })}
          multiline
        />
        <BilingualFields
          labelAr={t.admin.primaryCtaAr}
          labelEn={t.admin.primaryCtaEn}
          value={form.heroPrimaryCtaText}
          onChange={(heroPrimaryCtaText) => setForm({ ...form, heroPrimaryCtaText })}
        />
        <TextField
          label={t.admin.primaryCtaLink}
          value={form.heroPrimaryCtaLink}
          onChange={(heroPrimaryCtaLink) => setForm({ ...form, heroPrimaryCtaLink })}
          dir="ltr"
        />
        <BilingualFields
          labelAr={t.admin.secondaryCtaAr}
          labelEn={t.admin.secondaryCtaEn}
          value={form.heroSecondaryCtaText}
          onChange={(heroSecondaryCtaText) => setForm({ ...form, heroSecondaryCtaText })}
        />
        <TextField
          label={t.admin.secondaryCtaLink}
          value={form.heroSecondaryCtaLink}
          onChange={(heroSecondaryCtaLink) => setForm({ ...form, heroSecondaryCtaLink })}
          dir="ltr"
        />
      </AdminSection>

      <AdminSection title={t.admin.quickInfoSection}>
        <BilingualFields
          labelAr={t.admin.quickInfoAr}
          labelEn={t.admin.quickInfoEn}
          value={form.quickInfoText}
          onChange={(quickInfoText) => setForm({ ...form, quickInfoText })}
        />
        <TextField
          label={t.admin.quickInfoLink}
          value={form.quickInfoLink}
          onChange={(quickInfoLink) => setForm({ ...form, quickInfoLink })}
          dir="ltr"
        />
      </AdminSection>

      <AdminSection title={t.admin.featured}>
        <BilingualFields
          labelAr={t.admin.featuredTitleAr}
          labelEn={t.admin.featuredTitleEn}
          value={form.featuredTitle}
          onChange={(featuredTitle) => setForm({ ...form, featuredTitle })}
        />
        <BilingualFields
          labelAr={t.admin.featuredSubtitleAr}
          labelEn={t.admin.featuredSubtitleEn}
          value={form.featuredSubtitle}
          onChange={(featuredSubtitle) => setForm({ ...form, featuredSubtitle })}
        />
        <BilingualFields
          labelAr={t.admin.announcementTitleAr}
          labelEn={t.admin.announcementTitleEn}
          value={form.announcementTitle}
          onChange={(announcementTitle) => setForm({ ...form, announcementTitle })}
        />
        <BilingualFields
          labelAr={t.admin.announcementCtaAr}
          labelEn={t.admin.announcementCtaEn}
          value={form.announcementCta}
          onChange={(announcementCta) => setForm({ ...form, announcementCta })}
        />
      </AdminSection>
    </form>
  );
}
