import { NextRequest, NextResponse } from "next/server";
import { addRsvp } from "@/lib/sheets-store";

const MAX_GUESTS = 10;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const { name, attendance, guests, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json(
      { error: "Nama wajib diisi (minimal 2 karakter)." },
      { status: 400 }
    );
  }

  if (attendance !== "yes" && attendance !== "no") {
    return NextResponse.json(
      { error: "Konfirmasi kehadiran wajib dipilih." },
      { status: 400 }
    );
  }

  const guestsNumber = Number(guests);
  if (
    attendance === "yes" &&
    (!Number.isInteger(guestsNumber) || guestsNumber < 1 || guestsNumber > MAX_GUESTS)
  ) {
    return NextResponse.json(
      { error: `Jumlah tamu harus antara 1 dan ${MAX_GUESTS}.` },
      { status: 400 }
    );
  }

  try {
    const entry = await addRsvp({
      name: name.trim().slice(0, 100),
      attendance,
      guests: attendance === "yes" ? guestsNumber : 0,
      message: typeof message === "string" ? message.trim().slice(0, 500) : "",
    });

    return NextResponse.json({ entry }, { status: 201 });
  } catch (error) {
    console.error("Gagal menyimpan RSVP ke Google Sheets:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan konfirmasi. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
