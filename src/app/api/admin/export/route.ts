import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllRsvps } from "@/lib/sheets-store";

function formatWib(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  let entries;
  try {
    entries = await getAllRsvps();
  } catch (error) {
    console.error("Gagal memuat data untuk ekspor:", error);
    return NextResponse.json({ error: "Gagal memuat data." }, { status: 500 });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("RSVP");
  sheet.columns = [
    { header: "No", key: "no", width: 6 },
    { header: "Nama", key: "name", width: 28 },
    { header: "Telepon", key: "phone", width: 18 },
    { header: "Email", key: "email", width: 28 },
    { header: "Kehadiran", key: "attendance", width: 14 },
    { header: "Jumlah Tamu", key: "guests", width: 13 },
    { header: "Pesan", key: "message", width: 40 },
    { header: "Waktu Konfirmasi (WIB)", key: "createdAt", width: 24 },
    { header: "Check-in (WIB)", key: "checkedInAt", width: 24 },
  ];

  // urut dari konfirmasi paling awal agar nomor mengikuti urutan masuk
  [...entries].reverse().forEach((entry, index) => {
    sheet.addRow({
      no: index + 1,
      name: entry.name,
      phone: entry.phone,
      email: entry.email,
      attendance: entry.attendance === "yes" ? "Hadir" : "Tidak Hadir",
      guests: entry.attendance === "yes" ? entry.guests : 0,
      message: entry.message,
      createdAt: formatWib(entry.createdAt),
      checkedInAt: formatWib(entry.checkedInAt),
    });
  });

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF769826" } };
  header.alignment = { vertical: "middle" };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: "A1", to: "I1" };

  // nomor telepon disimpan sebagai teks agar angka 0 di depan tidak hilang
  sheet.getColumn("phone").numFmt = "@";

  const buffer = await workbook.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer as ArrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="rsvp-sukses-ekspose-${date}.xlsx"`,
      "Cache-Control": "no-store",
    },
  });
}
