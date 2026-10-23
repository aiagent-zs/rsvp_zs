import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteRsvp, setCheckIn } from "@/lib/sheets-store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteRsvp(id);
  if (!deleted) {
    return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { checkedIn?: unknown } | null;
  if (typeof body?.checkedIn !== "boolean") {
    return NextResponse.json({ error: "Data tidak valid." }, { status: 400 });
  }

  const { id } = await params;
  const checkedInAt = await setCheckIn(id, body.checkedIn);
  if (checkedInAt === null) {
    return NextResponse.json({ error: "Data tidak ditemukan." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, checkedInAt });
}
