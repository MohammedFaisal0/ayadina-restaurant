"use client";

import { useCallback, useId, useRef, useState } from "react";
import { Upload, ImagePlus, X, Loader2 } from "lucide-react";
import { useLocale } from "@/i18n/locale-context";
import { getAuthToken } from "@/lib/api";

const MAX_FILE_SIZE_MB = 3;

type ImageUploadProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function ImageUpload({ value, onChange, required = false }: ImageUploadProps) {
  const { t } = useLocale();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      if (!file.type.startsWith("image/")) {
        setError(t.admin.uploadInvalidType);
        return;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(t.admin.uploadTooLarge);
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const token = getAuthToken();
        const headers: Record<string, string> = {};
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          headers,
          body: formData,
        });

        const body = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;

        if (!response.ok || !body?.url) {
          throw new Error(body?.error || t.admin.uploadFailed);
        }

        onChange(body.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.admin.uploadFailed);
      } finally {
        setIsUploading(false);
      }
    },
    [onChange, t.admin.uploadFailed, t.admin.uploadInvalidType, t.admin.uploadTooLarge],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) void uploadFile(file);
    },
    [uploadFile],
  );

  const handleRemove = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onChange("");
    },
    [onChange],
  );

  return (
    <div className="space-y-3">
      <span style={{ color: "var(--text-secondary)" }} className="text-sm">
        {t.admin.uploadImage}
      </span>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
        onDragLeave={(event) => { event.preventDefault(); setIsDragging(false); }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed p-4 transition-all duration-300 sm:min-h-[180px] ${
          isDragging
            ? "border-brand-gold bg-brand-gold/10 scale-[1.01]"
            : "hover:border-brand-gold/50"
        } ${isUploading ? "pointer-events-none opacity-70" : ""}`}
        style={{
          borderColor: isDragging ? undefined : "var(--border-default)",
          backgroundColor: isDragging ? undefined : "var(--bg-surface)",
        }}
      >
        <input
          tabIndex={-1}
          aria-hidden
          required={required || isUploading}
          value={isUploading ? "" : value}
          onChange={() => undefined}
          className="sr-only"
        />
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={isUploading}
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin" style={{ color: "var(--text-muted)" }} />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t.admin.uploading}
            </p>
          </div>
        ) : value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={t.admin.uploadPreview}
              className="absolute inset-0 size-full object-cover opacity-80"
            />
            <div className="relative z-10 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white backdrop-blur-sm"
                style={{ backgroundColor: "var(--glass-bg)" }}
              >
                <Upload className="size-3" />
                {t.admin.changeImage}
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center justify-center rounded-full p-2 text-white backdrop-blur-sm"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.8)" }}
              >
                <X className="size-3" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className="flex size-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <ImagePlus className="size-5" style={{ color: "var(--text-muted)" }} />
            </div>
            <p
              className="max-w-xs text-center text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {t.admin.dragDropHint}
            </p>
            <span className="rounded-full bg-brand-gold px-4 py-2 text-xs font-semibold text-brand-dark">
              {t.admin.browseFiles}
            </span>
          </>
        )}
      </div>

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}