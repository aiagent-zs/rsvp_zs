# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

RSVP site for the Zakat Sukses "Sukses Ekspose 2026" event. Guests submit attendance on `/`; organizers view/delete responses on `/admin` after Google SSO restricted to `@zakatsukses.org`. All user-facing copy and error messages are in Bahasa Indonesia — keep it that way.

Stack: Next.js 16 (App Router, React 19), Tailwind CSS v4, NextAuth v5 beta, `googleapis`. Next 16 differs from older versions — check `node_modules/next/dist/docs/` before using framework APIs (e.g. route handler `params` is a `Promise` and must be awaited).

## Commands

Terapkan 4 prinsip ini di semua tugas:

1. Pikir dulu: sebut asumsi, tanya jika ragu, tawarkan opsi jika ada lebih dari satu tafsir.
2. Sederhana dulu: solusi minimum, tanpa fitur atau abstraksi spekulatif.
3. Ubah seperlunya: sentuh hanya yang diminta, ikuti gaya yang ada, jangan refactor yang tidak rusak.
4. Berbasis tujuan: tetapkan kriteria sukses yang bisa diverifikasi, lalu cek sebelum selesai.

setiap perubahan yang dilakukan jika dianggap perubahan yang tidak terlalu besar/tidak berdampak signifikan tidak perlu dibuat menjadi PR langsung ke main saja sudah cukup.

setiap perubahan tolong tambahkan akhiran dibawah ini secara bergantian (satu baris per commit, urut bergiliran):

```
Co-Authored-By: Abdulfi2 <faqih@zakatsukses.org>
Co-Authored-By: aiagent-zs <ai_agent@zakatsukses.org>
Co-Authored-By: itzakatsukses <itzakatsukses@gmail.com>
```

```bash
npm run dev     # dev server at http://localhost:3000
npm run build   # production build (also type-checks)
npm start       # serve production build
npm run lint    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test suite.

## Architecture

- **No database — Google Sheets is the datastore.** [src/lib/sheets-store.ts](src/lib/sheets-store.ts) owns every read/write via a Service Account JWT. Each call runs `ensureSheetReady`, which creates the tab (`GOOGLE_SHEET_NAME`, default `RSVP`) and writes the header row `ID | Nama | Kehadiran | Jumlah Tamu | Pesan | Waktu Konfirmasi | Telepon | Email | Check-in` if missing. Rows are columns A–I; an older sheet whose header is shorter gets its header row refreshed automatically; IDs are `randomUUID()`. Delete finds the row index by scanning column A and issues a `deleteDimension`. If you add a field, update `HEADER`, `rowToEntry`, the append payload, and the `A:I` ranges together.
- **Public write path:** `RsvpForm` (client) → `POST /api/rsvp` ([src/app/api/rsvp/route.ts](src/app/api/rsvp/route.ts)), which does all validation server-side (name ≥2 chars, attendance `yes|no`, guests 1–`MAX_GUESTS` when attending, truncation of name/message) before `addRsvp`.
- **Admin path:** [src/app/admin/page.tsx](src/app/admin/page.tsx) is a server component that calls `auth()`; unauthenticated users get the login screen (sign-in/out via inline server actions), authenticated users get stats from `summarize()` plus `AdminTable` (client), which calls `DELETE /api/admin/rsvps/[id]`. That route re-checks `auth()` itself — there is no middleware/proxy, so every admin route must guard itself.
- **Auth:** [src/auth.ts](src/auth.ts) — Google provider with `hd=ALLOWED_DOMAIN` plus a `signIn` callback that verifies the email suffix server-side. NextAuth's sign-in and error pages both point to `/admin`.
- **Event content** (name, date, `dateISO` used by `CountdownTimer`, location, highlights, deadline) lives in [src/lib/event.ts](src/lib/event.ts); change event details there, not in page markup.
- **UI:** the existing pages use hand-written Tailwind classes and SVG icons from `src/components/icons.tsx`. `src/components/ui/` is a freshly added shadcn library (`base-mira` style on `@base-ui/react`, config in `components.json`, `cn()` in `src/lib/utils.ts`) not yet used by the app pages. Path alias `@/*` → `src/*`.

## Configuration

Copy `.env.example` to `.env.local`. Two separate Google credentials are needed: a **Service Account** (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` with literal `\n`, `GOOGLE_SHEET_ID`; the sheet must be shared to the service account as Editor) for data, and an **OAuth Web client** (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, redirect `/api/auth/callback/google`) plus `AUTH_SECRET` and `ALLOWED_DOMAIN` for admin login. Full setup steps are in README.md. `credentials.json` and `.env.local` are gitignored.
