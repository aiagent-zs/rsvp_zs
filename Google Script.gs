// ============================================================
//  MILAD KE-15 LAZ ZAKAT SUKSES — Google Apps Script Backend
//  Paste kode ini di https://script.google.com
// ============================================================

// ── KONFIGURASI ──────────────────────────────────────────────
const SHEET_NAME = "Milad ke-15 Konfirmasi"; // Nama tab di Google Sheets
const ADMIN_SECRET = "milad15zs"; // Password admin dashboard — GANTI ini!
// ─────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    const now = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });

    // Tambah baris baru
    sheet.appendRow([
      now, // A: Waktu
      data.fullName || "", // B: Nama
      data.email || "", // C: Email
      data.phone || "", // D: WhatsApp
      data.position || "", // E: Posisi
      data.event === "gathering"
        ? "Gathering (29 Juni)"
        : data.event === "formal"
          ? "Formal (15 Juli)"
          : data.event === "both"
            ? "Kedua Acara"
            : data.event || "", // F: Acara
      data.attendance === "hadir" ? "Hadir" : "Tidak Hadir", // G: Status
      parseInt(data.guestCount) || 0, // H: Jumlah Tamu
      (data.guestNames || []).join("; "), // I: Nama Tamu
      data.notes || "", // J: Catatan
    ]);

    return jsonResponse({
      success: true,
      message: "Konfirmasi berhasil disimpan.",
    });
  } catch (err) {
    return jsonResponse({ success: false, message: err.message }, 500);
  }
}

function doGet(e) {
  const action = e.parameter.action || "";

  // ── READ: ambil semua data (butuh secret) ──
  if (action === "getData") {
    if (e.parameter.secret !== ADMIN_SECRET) {
      return jsonResponse({ success: false, message: "Unauthorized" }, 403);
    }
    const sheet = getOrCreateSheet();
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return jsonResponse({ success: true, data: [] });
    }
    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
    return jsonResponse({ success: true, data });
  }

  // ── PING: cek apakah script aktif ──
  if (action === "ping") {
    return jsonResponse({ success: true, message: "Script aktif ✅" });
  }

  return jsonResponse(
    { success: false, message: "Action tidak dikenal." },
    400,
  );
}

// ── Helper: buat/ambil sheet dengan header ──
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Waktu",
      "Nama",
      "Email",
      "WhatsApp",
      "Posisi",
      "Acara",
      "Status Kehadiran",
      "Jumlah Tamu",
      "Nama Tamu Tambahan",
      "Catatan",
    ]);
    // Format header
    const header = sheet.getRange(1, 1, 1, 10);
    header.setFontWeight("bold");
    header.setBackground("#5BA828");
    header.setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(9, 220);
    sheet.setColumnWidth(10, 220);
  }

  return sheet;
}

// ── Helper: JSON response dengan CORS ──
function jsonResponse(obj, code) {
  const output = ContentService.createTextOutput(
    JSON.stringify(obj),
  ).setMimeType(ContentService.MimeType.JSON);
  return output;
}
