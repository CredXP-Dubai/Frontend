import type { CurrencyRef } from "@/types/catalog";

export function formatPrice(
  price: string | number,
  currency: CurrencyRef | string = "AED",
): string {
  const code = typeof currency === "string" ? currency : currency.code;
  const amount = typeof price === "string" ? Number(price) : price;
  if (!Number.isFinite(amount)) return String(price);

  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatArea(sqft: string | number): string {
  const value = typeof sqft === "string" ? Number(sqft) : sqft;
  if (!Number.isFinite(value)) return String(sqft);
  return `${value.toLocaleString()} sq ft`;
}

export function formatDate(date?: string): string | null {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function propertyTitle(property: {
  unitNumber: string;
  project?: { name?: string };
}): string {
  const projectName = property.project?.name;
  return projectName ? `${property.unitNumber} · ${projectName}` : property.unitNumber;
}

export function propertyLocation(property: {
  project?: { area?: string; city?: string };
  location?: { area?: string; city?: string };
}): string {
  const area = property.project?.area ?? property.location?.area;
  const city = property.project?.city ?? property.location?.city;
  return [area, city].filter(Boolean).join(", ");
}

export function getPrimaryMediaUrl(media?: { url: string; isPrimary?: boolean }[]): string | null {
  if (!media?.length) return null;
  const primary = media.find((item) => item.isPrimary) ?? media[0];
  return primary?.url ?? null;
}
