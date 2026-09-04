/** Digits only — for wa.me links. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Keep leading + for tel: links; strip spaces/dashes. */
export function toDialable(value: string): string {
  return value.trim().replace(/[^\d+]/g, "");
}

export function toTelHref(phone: string): string {
  return `tel:${toDialable(phone)}`;
}

export function toWhatsAppHref(phone: string): string {
  return `https://wa.me/${digitsOnly(phone)}`;
}
