import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { DATE_PATTERN, TIME_PATTERN } from "@/lib/event-server";
import { saveEventSettings } from "@/lib/sheets-store";

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const { date, startTime, endTime, location, mapsUrl } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof date !== "string" ||
    !DATE_PATTERN.test(date) ||
    Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())
  ) {
    return NextResponse.json({ error: "Tanggal tidak valid." }, { status: 400 });
  }
  if (
    typeof startTime !== "string" ||
    typeof endTime !== "string" ||
    !TIME_PATTERN.test(startTime) ||
    !TIME_PATTERN.test(endTime)
  ) {
    return NextResponse.json({ error: "Jam kegiatan tidak valid." }, { status: 400 });
  }
  if (endTime <= startTime) {
    return NextResponse.json(
      { error: "Jam selesai harus setelah jam mulai." },
      { status: 400 }
    );
  }
  if (typeof location !== "string" || location.trim().length < 3) {
    return NextResponse.json(
      { error: "Lokasi wajib diisi (minimal 3 karakter)." },
      { status: 400 }
    );
  }

  const mapsUrlValue = typeof mapsUrl === "string" ? mapsUrl.trim() : "";
  if (mapsUrlValue) {
    let valid = mapsUrlValue.length <= 500;
    try {
      valid = valid && /^https?:$/.test(new URL(mapsUrlValue).protocol);
    } catch {
      valid = false;
    }
    if (!valid) {
      return NextResponse.json(
        { error: "Tautan titik lokasi harus berupa URL http(s) yang valid." },
        { status: 400 }
      );
    }
  }

  try {
    await saveEventSettings({
      date,
      startTime,
      endTime,
      location: location.trim().slice(0, 200),
      mapsUrl: mapsUrlValue,
    });
  } catch (error) {
    console.error("Gagal menyimpan pengaturan acara:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan." }, { status: 500 });
  }

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
