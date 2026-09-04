"use client";

import { Mail } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useLocale } from "@/i18n/locale-context";

/**
 * This project's lucide-react build no longer ships brand marks, so Instagram,
 * Facebook, TikTok and WhatsApp are drawn here and sized like Lucide icons.
 */
type IconProps = { className?: string };

function BrandIcon({ className, path }: IconProps & { path: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className ?? "size-4"}
    >
      <path d={path} />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <BrandIcon
      {...props}
      path="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
    />
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <BrandIcon
      {...props}
      path="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  );
}

export function TiktokIcon(props: IconProps) {
  return (
    <BrandIcon
      {...props}
      path="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
    />
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <BrandIcon
      {...props}
      path="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
    />
  );
}

export type SocialChannelId =
  | "phone"
  | "email"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "tiktok";

type SocialChannel = {
  id: SocialChannelId;
  href: string;
  label: string;
  value: string;
  Icon: (props: IconProps) => React.ReactElement;
  ltr: boolean;
};

function toAbsoluteUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

/** Email + social channels from site settings (phone/WhatsApp are per-branch). */
export function useSocialChannels(): SocialChannel[] {
  const { siteSettings } = useData();
  const { t } = useLocale();

  const channels: SocialChannel[] = [];

  if (siteSettings.contactEmail.trim()) {
    channels.push({
      id: "email",
      href: `mailto:${siteSettings.contactEmail.trim()}`,
      label: t.contact.formEmail,
      value: siteSettings.contactEmail,
      Icon: (props) => <Mail {...(props as LucideProps)} />,
      ltr: true,
    });
  }

  if (siteSettings.instagramUrl.trim()) {
    channels.push({
      id: "instagram",
      href: toAbsoluteUrl(siteSettings.instagramUrl),
      label: "Instagram",
      value: "Instagram",
      Icon: InstagramIcon,
      ltr: false,
    });
  }

  if (siteSettings.facebookUrl.trim()) {
    channels.push({
      id: "facebook",
      href: toAbsoluteUrl(siteSettings.facebookUrl),
      label: "Facebook",
      value: "Facebook",
      Icon: FacebookIcon,
      ltr: false,
    });
  }

  if (siteSettings.tiktokUrl.trim()) {
    channels.push({
      id: "tiktok",
      href: toAbsoluteUrl(siteSettings.tiktokUrl),
      label: "TikTok",
      value: "TikTok",
      Icon: TiktokIcon,
      ltr: false,
    });
  }

  return channels;
}

function isExternal(channel: SocialChannel) {
  return channel.href.startsWith("http");
}

/** Compact icon-only row, used in the footer. */
export function SocialIconRow({
  omit = [],
  className = "",
}: {
  omit?: SocialChannelId[];
  className?: string;
}) {
  const channels = useSocialChannels().filter((c) => !omit.includes(c.id));
  if (channels.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {channels.map((channel) => (
        <a
          key={channel.id}
          href={channel.href}
          target={isExternal(channel) ? "_blank" : undefined}
          rel={isExternal(channel) ? "noopener noreferrer" : undefined}
          aria-label={channel.label}
          title={channel.label}
          className="inline-flex size-9 items-center justify-center rounded-full transition-colors duration-300 hover:border-brand-gold hover:text-brand-gold"
          style={{ border: "1px solid var(--border-default)", color: "var(--text-muted)" }}
        >
          <channel.Icon className="size-4" />
        </a>
      ))}
    </div>
  );
}

/** Labelled rows with the underlying number/address, used on the contact page. */
export function SocialChannelList({ omit = [] }: { omit?: SocialChannelId[] }) {
  const channels = useSocialChannels().filter((c) => !omit.includes(c.id));
  if (channels.length === 0) return null;

  return (
    <ul className="space-y-2">
      {channels.map((channel) => (
        <li key={channel.id}>
          <a
            href={channel.href}
            target={isExternal(channel) ? "_blank" : undefined}
            rel={isExternal(channel) ? "noopener noreferrer" : undefined}
            className="flex min-h-11 items-center gap-3 rounded-xl border px-4 transition-colors duration-300 hover:border-brand-gold"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-card)" }}
          >
            <span className="text-brand-gold">
              <channel.Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
                {channel.label}
              </span>
              <span
                className="block truncate text-sm font-medium"
                dir={channel.ltr ? "ltr" : undefined}
                style={{ color: "var(--text-primary)" }}
              >
                {channel.value}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
