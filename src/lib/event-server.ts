import { eventConfig } from "@/lib/event";
import { getEventSettings } from "@/lib/sheets-store";

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// jam bawaan diambil dari eventConfig.time, mis. "08.00 - 16.00 WIB"
const [DEFAULT_START, DEFAULT_END] = (eventConfig.time.match(/\d{2}\.\d{2}/g) ?? ["08.00", "16.00"]).map(
  (t) => t.replace(".", ":")
);

export function formatEventDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** eventConfig dengan tanggal & lokasi yang diubah admin (disimpan di Google Sheets). */
export async function getEventConfig() {
  let overrides: Awaited<ReturnType<typeof getEventSettings>> = {};
  try {
    overrides = await getEventSettings();
  } catch (error) {
    console.error("Gagal memuat pengaturan acara, memakai nilai bawaan:", error);
  }

  const date =
    overrides.date && DATE_PATTERN.test(overrides.date) ? overrides.date : undefined;

  const startTime =
    overrides.startTime && TIME_PATTERN.test(overrides.startTime) ? overrides.startTime : DEFAULT_START;
  const endTime =
    overrides.endTime && TIME_PATTERN.test(overrides.endTime) && overrides.endTime > startTime
      ? overrides.endTime
      : DEFAULT_END;
  const dateOnly = date ?? eventConfig.dateISO.slice(0, 10);

  return {
    ...eventConfig,
    startTime,
    endTime,
    time: `${startTime.replace(":", ".")} - ${endTime.replace(":", ".")} WIB`,
    dateISO: `${dateOnly}T${startTime}:00+07:00`,
    ...(date && { date: formatEventDate(date) }),
    ...(overrides.location && { location: overrides.location }),
    ...(overrides.mapsUrl && /^https?:\/\//.test(overrides.mapsUrl) && { mapsUrl: overrides.mapsUrl }),
  };
}

const SHORT_LINK_HOSTS = ["maps.app.goo.gl", "goo.gl"];

async function resolveShortLink(url: string): Promise<string> {
  try {
    if (!SHORT_LINK_HOSTS.includes(new URL(url).hostname)) return url;
    const res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(4000) });
    return res.url || url;
  } catch {
    return url;
  }
}

/**
 * URL peta untuk iframe (tanpa API key). Memakai koordinat dari tautan Google Maps
 * bila ada, tautan "embed" apa adanya, dan jika tidak ada memakai teks lokasi.
 */
export async function getMapEmbedUrl(mapsUrl: string, location: string): Promise<string> {
  const embed = (query: string) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  if (!mapsUrl) return embed(location);

  const url = await resolveShortLink(mapsUrl);
  try {
    const parsed = new URL(url);
    if (/(^|\.)google\.[a-z.]+$/.test(parsed.hostname) && parsed.pathname.startsWith("/maps/embed")) {
      return url;
    }
  } catch {
    return embed(location);
  }

  const coords =
    url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) ??
    url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ??
    url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  return embed(coords ? `${coords[1]},${coords[2]}` : location);
}
