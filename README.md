# Sistem RSVP

Aplikasi konfirmasi kehadiran (RSVP) berbasis Next.js + Tailwind CSS.

- Tamu mengisi form RSVP di halaman utama (`/`).
- Setiap konfirmasi otomatis tersimpan sebagai baris baru di **Google Spreadsheet** (via Service Account).
- Panitia membuka `/admin`, login dengan akun Google **domain @zakatsukses.org** (SSO), lalu melihat rekap & daftar tamu, serta bisa menghapus data.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Sebelum RSVP & login admin berfungsi, isi dulu `.env.local` (lihat di bawah).

## Konfigurasi `.env.local`

Contoh lengkap ada di [.env.example](.env.example). Ada dua bagian kredensial Google yang **berbeda tujuan**:

### 1. Google Sheets — penyimpanan data (Service Account)

1. Buka [Google Cloud Console](https://console.cloud.google.com/) → pilih/buat project.
2. Aktifkan **Google Sheets API** (APIs & Services → Library).
3. Buat **Service Account** (APIs & Services → Credentials → Create Credentials → Service Account).
4. Buka service account tsb → tab **Keys** → **Add Key** → JSON. File JSON akan terunduh.
5. Dari file JSON, salin:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_PRIVATE_KEY` (biarkan dalam tanda kutip, `\n` tetap literal seperti di file)
6. Buat Google Spreadsheet baru, salin ID-nya dari URL:
   `https://docs.google.com/spreadsheets/d/`**`<GOOGLE_SHEET_ID>`**`/edit`
7. **Share** spreadsheet tsb ke email service account (`client_email`) dengan akses **Editor**.
8. Tab/sheet bernama `RSVP` (atau sesuai `GOOGLE_SHEET_NAME`) beserta header kolom akan dibuat otomatis saat RSVP pertama masuk.

### 2. Login Admin — Google SSO domain zakatsukses.org (OAuth Client)

1. Di project Google Cloud yang sama → **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Application type: **Web application**.
3. Authorized redirect URI:
   - Lokal: `http://localhost:3000/api/auth/callback/google`
   - Produksi: `https://<domain-anda>/api/auth/callback/google`
4. Salin **Client ID** → `AUTH_GOOGLE_ID`, **Client secret** → `AUTH_GOOGLE_SECRET`.
5. `ALLOWED_DOMAIN=zakatsukses.org` — hanya akun Google Workspace dengan domain ini yang bisa login ke `/admin` (dicek dua kali: parameter `hd` saat login & validasi email di server).
6. `AUTH_SECRET` sudah digenerate otomatis di `.env.local`. Untuk generate ulang: `npx auth secret`.

> Catatan: jika `client_email` service account bukan bagian dari Google Workspace `zakatsukses.org`, itu tidak masalah — service account hanya dipakai untuk menulis ke Spreadsheet, bukan untuk login admin.

## Struktur

- `src/app/page.tsx` — halaman RSVP publik (form + info acara di `src/lib/event.ts`)
- `src/app/admin/page.tsx` — dashboard admin (butuh login Google SSO)
- `src/app/api/rsvp/route.ts` — endpoint publik untuk submit RSVP
- `src/app/api/admin/rsvps/[id]/route.ts` — hapus data (butuh sesi admin)
- `src/lib/sheets-store.ts` — semua operasi baca/tulis ke Google Sheets
- `src/auth.ts` — konfigurasi NextAuth (Google SSO + pembatasan domain)

## Build produksi

```bash
npm run build
npm start
```
