"use client";

import { useEffect, useState } from "react";
import { BilingualFields } from "@/components/admin/AdminFields";
import { useLocale } from "@/i18n/locale-context";
import type { BilingualText } from "@/types/data";

/** Day ranges an admin can pick, with the exact wording written to each locale. */
const DAY_RANGES = [
  { id: "daily", ar: "يومياً", en: "Daily" },
  { id: "satThu", ar: "من السبت إلى الخميس", en: "Saturday – Thursday" },
  { id: "sunThu", ar: "من الأحد إلى الخميس", en: "Sunday – Thursday" },
  { id: "satWed", ar: "من السبت إلى الأربعاء", en: "Saturday – Wednesday" },
  { id: "friSat", ar: "الجمعة والسبت", en: "Friday & Saturday" },
  { id: "fri", ar: "الجمعة", en: "Friday" },
  { id: "weekend", ar: "عطلة نهاية الأسبوع", en: "Weekends" },
] as const;

type DayRangeId = (typeof DAY_RANGES)[number]["id"];

const SEPARATOR = " · ";
const DASH = " – ";

function formatEnTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function formatArTime(time: string): string {
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function buildHours(range: DayRangeId, start: string, end: string): BilingualText {
  const days = DAY_RANGES.find((item) => item.id === range) ?? DAY_RANGES[0];
  return {
    ar: `${days.ar}${SEPARATOR}${formatArTime(start)}${DASH}${formatArTime(end)}`,
    en: `${days.en}${SEPARATOR}${formatEnTime(start)}${DASH}${formatEnTime(end)}`,
  };
}

const EN_PATTERN =
  /^(.+?)\s*·\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

function to24Hour(hour: number, minute: number, period: string): string {
  const upper = period.toUpperCase();
  let h = hour % 12;
  if (upper === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

type ParsedHours = { range: DayRangeId; start: string; end: string };

/**
 * Reads a previously saved English string back into picker state. Returns null
 * for anything hand-written, which is what flips the editor into manual mode.
 */
function parseHours(value: string): ParsedHours | null {
  const match = value.trim().match(EN_PATTERN);
  if (!match) return null;

  const [, dayLabel, startHour, startMinute, startPeriod, endHour, endMinute, endPeriod] =
    match;
  const days = DAY_RANGES.find(
    (item) => item.en.toLowerCase() === dayLabel.trim().toLowerCase(),
  );
  if (!days) return null;

  return {
    range: days.id,
    start: to24Hour(Number(startHour), Number(startMinute), startPeriod),
    end: to24Hour(Number(endHour), Number(endMinute), endPeriod),
  };
}

const DEFAULTS: ParsedHours = { range: "daily", start: "12:00", end: "00:00" };

export function WorkingHoursPicker({
  value,
  onChange,
  labelAr,
  labelEn,
}: {
  value: BilingualText;
  onChange: (value: BilingualText) => void;
  labelAr: string;
  labelEn: string;
}) {
  const { t, locale } = useLocale();
  const parsed = parseHours(value.en);

  const [manual, setManual] = useState(() => value.en.trim() !== "" && parsed === null);
  const [range, setRange] = useState<DayRangeId>(parsed?.range ?? DEFAULTS.range);
  const [start, setStart] = useState(parsed?.start ?? DEFAULTS.start);
  const [end, setEnd] = useState(parsed?.end ?? DEFAULTS.end);

  // Re-sync when settings finish loading or are saved elsewhere.
  useEffect(() => {
    const next = parseHours(value.en);
    if (!next) return;
    setRange(next.range);
    setStart(next.start);
    setEnd(next.end);
  }, [value.en]);

  const apply = (nextRange: DayRangeId, nextStart: string, nextEnd: string) => {
    setRange(nextRange);
    setStart(nextStart);
    setEnd(nextEnd);
    onChange(buildHours(nextRange, nextStart, nextEnd));
  };

  const enableManual = (nextManual: boolean) => {
    setManual(nextManual);
    // Leaving manual mode re-generates the string so both locales stay in step.
    if (!nextManual) onChange(buildHours(range, start, end));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {t.admin.workingHours}
        </span>
        <label className="flex cursor-pointer items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <input
            type="checkbox"
            checked={manual}
            onChange={(event) => enableManual(event.target.checked)}
            className="size-4 accent-brand-gold"
          />
          {t.admin.hoursManual}
        </label>
      </div>

      {manual ? (
        <BilingualFields
          labelAr={labelAr}
          labelEn={labelEn}
          value={value}
          onChange={onChange}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {t.admin.hoursDays}
              </span>
              <select
                value={range}
                onChange={(event) => apply(event.target.value as DayRangeId, start, end)}
                className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-300 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                style={{
                  borderColor: "var(--border-default)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                }}
              >
                {DAY_RANGES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {locale === "ar" ? item.ar : item.en}
                  </option>
                ))}
              </select>
            </label>

            <TimeField
              label={t.admin.hoursStart}
              value={start}
              onChange={(next) => apply(range, next, end)}
            />
            <TimeField
              label={t.admin.hoursEnd}
              value={end}
              onChange={(next) => apply(range, start, next)}
            />
          </div>

          <div
            className="space-y-1 rounded-xl border px-4 py-3"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-surface)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {t.admin.hoursPreview}
            </p>
            <p className="text-sm font-medium" dir="rtl" lang="ar" style={{ color: "var(--text-primary)" }}>
              {value.ar}
            </p>
            <p className="text-sm font-medium" dir="ltr" lang="en" style={{ color: "var(--text-primary)" }}>
              {value.en}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <input
        type="time"
        value={value}
        dir="ltr"
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border px-4 py-3 text-sm transition-all duration-300 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
        style={{
          borderColor: "var(--border-default)",
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-primary)",
        }}
      />
    </label>
  );
}
