"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminSection, BilingualFields } from "@/components/admin/AdminFields";
import { GalleryManagementContent } from "@/components/admin/GalleryManagementContent";
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

export function AboutPageCmsContent() {
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
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Header title={t.admin.aboutPageCms} saving={saving} status={status} />

        <AdminSection title={t.about.pageTitle}>
          <BilingualFields
            labelAr={t.admin.pageTitleAr}
            labelEn={t.admin.pageTitleEn}
            value={form.aboutPageTitle}
            onChange={(aboutPageTitle) => setForm({ ...form, aboutPageTitle })}
          />
          <BilingualFields
            labelAr={t.admin.pageSubtitleAr}
            labelEn={t.admin.pageSubtitleEn}
            value={form.aboutPageSubtitle}
            onChange={(aboutPageSubtitle) => setForm({ ...form, aboutPageSubtitle })}
          />
        </AdminSection>

        <AdminSection title={t.about.storyTitle}>
          <BilingualFields
            labelAr={t.admin.storyTitleAr}
            labelEn={t.admin.storyTitleEn}
            value={form.aboutStoryTitle}
            onChange={(aboutStoryTitle) => setForm({ ...form, aboutStoryTitle })}
          />
          <ImageUpload
            label={t.admin.storyImage}
            value={form.aboutStoryImageUrl}
            onChange={(aboutStoryImageUrl) => setForm({ ...form, aboutStoryImageUrl })}
          />
          <BilingualFields
            labelAr={t.admin.aboutStoryAr}
            labelEn={t.admin.aboutStoryEn}
            value={form.aboutStory}
            onChange={(aboutStory) => setForm({ ...form, aboutStory })}
            multiline
          />
        </AdminSection>

        <AdminSection title={t.about.galleryTitle}>
          <BilingualFields
            labelAr={t.admin.gallerySectionTitleAr}
            labelEn={t.admin.gallerySectionTitleEn}
            value={form.aboutGalleryTitle}
            onChange={(aboutGalleryTitle) => setForm({ ...form, aboutGalleryTitle })}
          />
        </AdminSection>
      </form>

      <GalleryManagementContent embedded />
    </div>
  );
}
