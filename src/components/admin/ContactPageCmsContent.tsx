"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminSection, BilingualFields } from "@/components/admin/AdminFields";
import { BranchesManagementContent } from "@/components/admin/BranchesManagementContent";
import { ContactInboxContent } from "@/components/admin/ContactInboxContent";
import { Header } from "@/components/admin/SiteSettingsContent";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import type { SiteSettingsFormData } from "@/types/data";

function withoutId(settings: SiteSettingsFormData & { id?: string }): SiteSettingsFormData {
  const { id: _id, ...rest } = settings as SiteSettingsFormData & { id?: string };
  void _id;
  return rest;
}

export function ContactPageCmsContent() {
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
        <Header title={t.admin.contactPageCms} saving={saving} status={status} />
        <AdminSection title={t.contact.pageTitle}>
          <BilingualFields
            labelAr={t.admin.pageTitleAr}
            labelEn={t.admin.pageTitleEn}
            value={form.contactPageTitle}
            onChange={(contactPageTitle) => setForm({ ...form, contactPageTitle })}
          />
          <BilingualFields
            labelAr={t.admin.pageSubtitleAr}
            labelEn={t.admin.pageSubtitleEn}
            value={form.contactPageSubtitle}
            onChange={(contactPageSubtitle) => setForm({ ...form, contactPageSubtitle })}
          />
          <BilingualFields
            labelAr={t.admin.branchesTitleAr}
            labelEn={t.admin.branchesTitleEn}
            value={form.contactBranchesTitle}
            onChange={(contactBranchesTitle) => setForm({ ...form, contactBranchesTitle })}
          />
          <BilingualFields
            labelAr={t.admin.mapTitleAr}
            labelEn={t.admin.mapTitleEn}
            value={form.contactMapTitle}
            onChange={(contactMapTitle) => setForm({ ...form, contactMapTitle })}
          />
          <BilingualFields
            labelAr={t.admin.whatsappCtaAr}
            labelEn={t.admin.whatsappCtaEn}
            value={form.contactWhatsappCta}
            onChange={(contactWhatsappCta) => setForm({ ...form, contactWhatsappCta })}
          />
        </AdminSection>
      </form>

      <BranchesManagementContent embedded />
      <ContactInboxContent embedded />
    </div>
  );
}
