"use client";

import { useEffect, useState } from "react";
import { Eye, Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ModalSecondaryButton } from "@/components/ui/ModalActions";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";
import type { ContactMessage } from "@/types/data";

export function ContactInboxContent({ embedded = false }: { embedded?: boolean }) {
  const { t, locale } = useLocale();
  const {
    contactMessages,
    fetchContactMessages,
    markContactMessageRead,
    deleteContactMessage,
  } = useData();
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    void fetchContactMessages();
  }, [fetchContactMessages]);

  const liveSelected =
    selected ? contactMessages.find((m) => m.id === selected.id) ?? selected : null;

  const toggleRead = async (message: ContactMessage, isRead: boolean) => {
    setBusyId(message.id);
    setActionError("");
    try {
      await markContactMessageRead(message.id, isRead);
    } catch {
      setActionError(t.admin.saveFailed);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.admin.confirmDelete)) return;
    setBusyId(id);
    setActionError("");
    try {
      await deleteContactMessage(id);
      setSelected(null);
    } catch {
      setActionError(t.admin.saveFailed);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className={embedded ? "space-y-4" : "space-y-6"}>
      {!embedded ? (
        <div>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            {t.admin.contactInbox}
          </h1>
        </div>
      ) : null}

      {actionError ? <p className="text-sm text-red-400">{actionError}</p> : null}

      {contactMessages.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {t.admin.inboxEmpty}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border-default)" }}>
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}>
                <th className="px-4 py-3 text-start font-medium">{t.admin.messageFrom}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.messageSubject}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.receivedAt}</th>
                <th className="px-4 py-3 text-start font-medium">{t.admin.actions}</th>
              </tr>
            </thead>
            <tbody>
              {contactMessages.map((message) => (
                <tr
                  key={message.id}
                  className="border-t"
                  style={{
                    borderColor: "var(--border-subtle)",
                    backgroundColor: message.isRead ? "transparent" : "var(--bg-surface)",
                  }}
                >
                  <td className="px-4 py-3" style={{ color: "var(--text-primary)" }}>
                    <div className="font-medium">{message.name}</div>
                    <div dir="ltr" className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {message.email}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {message.subject || "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                    {new Date(message.createdAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-GB")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(message);
                          if (!message.isRead) void toggleRead(message, true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs"
                        style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
                      >
                        <Eye className="size-3.5" />
                        {t.admin.viewMessage}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(message.id)}
                        disabled={busyId === message.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/40 px-2.5 py-1.5 text-xs text-red-400 disabled:opacity-50"
                      >
                        {busyId === message.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        {t.admin.deleteMessage}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={liveSelected !== null}
        onClose={() => setSelected(null)}
        title={liveSelected?.subject || t.admin.viewMessage}
        icon={<Mail className="size-5" />}
        footer={
          liveSelected ? (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <ModalSecondaryButton
                onClick={() => void toggleRead(liveSelected, !liveSelected.isRead)}
                disabled={busyId === liveSelected.id}
              >
                {liveSelected.isRead ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                {liveSelected.isRead ? t.admin.markAsUnread : t.admin.markAsRead}
              </ModalSecondaryButton>
              <button
                type="button"
                onClick={() => void handleDelete(liveSelected.id)}
                disabled={busyId === liveSelected.id}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-6 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/25 disabled:opacity-60"
              >
                <Trash2 className="size-4" />
                {t.admin.deleteMessage}
              </button>
            </div>
          ) : null
        }
      >
        {liveSelected ? (
          <div className="space-y-4">
            <div className="space-y-1 text-sm">
              <p style={{ color: "var(--text-primary)" }}>
                <span className="font-medium">{t.admin.messageFrom}:</span> {liveSelected.name}
              </p>
              <p dir="ltr" style={{ color: "var(--text-muted)" }}>{liveSelected.email}</p>
              {liveSelected.phone ? (
                <p dir="ltr" style={{ color: "var(--text-muted)" }}>{liveSelected.phone}</p>
              ) : null}
              <p style={{ color: "var(--text-muted)" }}>
                {t.admin.receivedAt}: {new Date(liveSelected.createdAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-GB")}
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-7" style={{ color: "var(--text-secondary)" }}>
              {liveSelected.message}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
