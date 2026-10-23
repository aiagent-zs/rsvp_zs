import { randomUUID } from "crypto";
import { google, sheets_v4 } from "googleapis";

export type Attendance = "yes" | "no";

export type RsvpEntry = {
  id: string;
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  phone: string;
  email: string;
  createdAt: string;
  /** Waktu check-in (ISO); kosong bila belum check-in */
  checkedInAt: string;
};

export type NewRsvpInput = {
  name: string;
  attendance: Attendance;
  guests: number;
  message: string;
  phone: string;
  email: string;
};

const SHEET_NAME = process.env.GOOGLE_SHEET_NAME || "RSVP";
const HEADER = ["ID", "Nama", "Kehadiran", "Jumlah Tamu", "Pesan", "Waktu Konfirmasi", "Telepon", "Email", "Check-in"];

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) {
    throw new Error(
      "GOOGLE_SHEET_ID belum diatur. Tambahkan pada file .env.local."
    );
  }
  return id;
}

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "Kredensial Google Service Account belum diatur (GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY) di .env.local."
    );
  }

  const auth = new google.auth.JWT({
    email,
    key: rawKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

async function ensureSheetReady(sheets: sheets_v4.Sheets, spreadsheetId: string) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existing = meta.data.sheets?.find(
    (sheet) => sheet.properties?.title === SHEET_NAME
  );

  let sheetId = existing?.properties?.sheetId;

  if (sheetId === undefined || sheetId === null) {
    const created = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SHEET_NAME } } }],
      },
    });
    sheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId ?? 0;
  }

  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A1:I1`,
  });
  const firstRow = headerRes.data.values?.[0];
  // juga memperbarui header sheet lama yang belum punya kolom Telepon/Email
  if (!firstRow || firstRow[0] !== "ID" || firstRow.length < HEADER.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${SHEET_NAME}!A1:I1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADER] },
    });
  }

  return sheetId;
}

function rowToEntry(row: string[]): RsvpEntry | null {
  const [id, name, attendance, guests, message, createdAt, phone, email, checkedInAt] = row;
  if (!id || !name) return null;
  return {
    id,
    name,
    attendance: attendance === "no" ? "no" : "yes",
    guests: Number(guests) || 0,
    message: message ?? "",
    phone: phone ?? "",
    email: email ?? "",
    createdAt: createdAt ?? "",
    checkedInAt: checkedInAt ?? "",
  };
}

export async function getAllRsvps(): Promise<RsvpEntry[]> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await ensureSheetReady(sheets, spreadsheetId);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A2:I`,
  });

  const rows = res.data.values ?? [];
  const entries = rows
    .map((row) => rowToEntry(row as string[]))
    .filter((entry): entry is RsvpEntry => entry !== null);

  return entries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addRsvp(input: NewRsvpInput): Promise<RsvpEntry> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await ensureSheetReady(sheets, spreadsheetId);

  const entry: RsvpEntry = {
    id: randomUUID(),
    name: input.name,
    attendance: input.attendance,
    guests: input.guests,
    message: input.message,
    phone: input.phone,
    email: input.email,
    createdAt: new Date().toISOString(),
    checkedInAt: "",
  };

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${SHEET_NAME}!A:I`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          entry.id,
          entry.name,
          entry.attendance,
          String(entry.guests),
          entry.message,
          entry.createdAt,
          entry.phone,
          entry.email,
          entry.checkedInAt,
        ],
      ],
    },
  });

  return entry;
}

export async function deleteRsvp(id: string): Promise<boolean> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const sheetId = await ensureSheetReady(sheets, spreadsheetId);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:A`,
  });
  const ids = res.data.values ?? [];
  const rowIndex = ids.findIndex((row) => row[0] === id);
  if (rowIndex <= 0) return false; // not found, or header row

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });

  return true;
}

export async function setCheckIn(id: string, checkedIn: boolean): Promise<string | null> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await ensureSheetReady(sheets, spreadsheetId);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SHEET_NAME}!A:A`,
  });
  const rowIndex = (res.data.values ?? []).findIndex((row) => row[0] === id);
  if (rowIndex <= 0) return null; // not found, or header row

  const checkedInAt = checkedIn ? new Date().toISOString() : "";
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SHEET_NAME}!I${rowIndex + 1}`,
    valueInputOption: "RAW",
    requestBody: { values: [[checkedInAt]] },
  });
  return checkedInAt;
}

export type RsvpSummary = {
  totalResponses: number;
  totalAttendingGuests: number;
  attendingCount: number;
  notAttendingCount: number;
  checkedInCount: number;
  /** Jumlah orang yang sudah check-in (tamu yang tidak hadir di RSVP dihitung 1 orang) */
  checkedInGuests: number;
};

export function summarize(entries: RsvpEntry[]): RsvpSummary {
  const attending = entries.filter((entry) => entry.attendance === "yes");
  const notAttending = entries.filter((entry) => entry.attendance === "no");
  return {
    totalResponses: entries.length,
    totalAttendingGuests: attending.reduce((sum, entry) => sum + entry.guests, 0),
    attendingCount: attending.length,
    notAttendingCount: notAttending.length,
    checkedInCount: entries.filter((entry) => entry.checkedInAt).length,
    checkedInGuests: entries
      .filter((entry) => entry.checkedInAt)
      .reduce((sum, entry) => sum + (entry.attendance === "yes" ? entry.guests : 1), 0),
  };
}

export type EventSettings = {
  /** Format YYYY-MM-DD */
  date: string;
  /** Format HH:MM (WIB) */
  startTime: string;
  endTime: string;
  location: string;
  /** Tautan titik lokasi (Google Maps), boleh kosong */
  mapsUrl: string;
};

const SETTINGS_SHEET_NAME = "Pengaturan";

async function ensureSettingsSheet(sheets: sheets_v4.Sheets, spreadsheetId: string) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const exists = meta.data.sheets?.some(
    (sheet) => sheet.properties?.title === SETTINGS_SHEET_NAME
  );
  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: SETTINGS_SHEET_NAME } } }],
      },
    });
  }
}

export async function getEventSettings(): Promise<Partial<EventSettings>> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await ensureSettingsSheet(sheets, spreadsheetId);

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${SETTINGS_SHEET_NAME}!A2:B`,
  });
  const map = new Map((res.data.values ?? []).map((row) => [row[0], row[1]]));
  return {
    date: map.get("date") || undefined,
    startTime: map.get("startTime") || undefined,
    endTime: map.get("endTime") || undefined,
    location: map.get("location") || undefined,
    mapsUrl: map.get("mapsUrl") || undefined,
  };
}

export async function saveEventSettings(settings: EventSettings): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  await ensureSettingsSheet(sheets, spreadsheetId);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${SETTINGS_SHEET_NAME}!A1:B6`,
    valueInputOption: "RAW",
    requestBody: {
      values: [
        ["Kunci", "Nilai"],
        ["date", settings.date],
        ["startTime", settings.startTime],
        ["endTime", settings.endTime],
        ["location", settings.location],
        ["mapsUrl", settings.mapsUrl],
      ],
    },
  });
}
