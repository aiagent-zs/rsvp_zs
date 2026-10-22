"use client";

import { FormEvent, useState } from "react";

type Attendance = "yes" | "no";

export function RsvpForm() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, attendance, guests, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Terjadi kesalahan, silakan coba lagi.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setName("");
      setMessage("");
      setGuests(1);
      setAttendance("yes");
    } catch {
      setError("Tidak dapat terhubung ke server. Silakan coba lagi.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-900 dark:bg-emerald-950">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
          Terima kasih!
        </h3>
        <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-300">
          Konfirmasi kehadiran Anda telah kami terima.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-emerald-700 underline underline-offset-4 hover:text-emerald-900 dark:text-emerald-300"
        >
          Kirim konfirmasi lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Nama lengkap
        </label>
        <input
          id="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Masukkan nama Anda"
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Apakah Anda akan hadir?
        </span>
        <div className="mt-1.5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAttendance("yes")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              attendance === "yes"
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300"
                : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            Ya, saya akan hadir
          </button>
          <button
            type="button"
            onClick={() => setAttendance("no")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              attendance === "no"
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-300"
                : "border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            Maaf, tidak bisa hadir
          </button>
        </div>
      </div>

      {attendance === "yes" && (
        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Jumlah tamu (termasuk Anda)
          </label>
          <input
            id="guests"
            type="number"
            min={1}
            max={10}
            required
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900"
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Catatan <span className="font-normal text-slate-400">(opsional)</span>
        </label>
        <textarea
          id="message"
          rows={3}
          maxLength={500}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Instansi/lembaga, pertanyaan, atau catatan lain"
          className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-emerald-900"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Mengirim..." : "Kirim Konfirmasi"}
      </button>
    </form>
  );
}
