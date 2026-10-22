"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { RsvpEntry } from "@/lib/sheets-store";

export function AdminTable({ entries }: { entries: RsvpEntry[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Hapus konfirmasi ini?")) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/rsvps/${id}`, { method: "DELETE" });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Gagal menghapus data.");
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Belum ada konfirmasi kehadiran.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Nama</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Kehadiran</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Tamu</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Ucapan</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-slate-300">Waktu</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{entry.name}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    entry.attendance === "yes"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {entry.attendance === "yes" ? "Hadir" : "Tidak Hadir"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                {entry.attendance === "yes" ? entry.guests : "-"}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-600 dark:text-slate-400" title={entry.message}>
                {entry.message || "-"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-500 dark:text-slate-400">
                {entry.createdAt ? new Date(entry.createdAt).toLocaleString("id-ID") : "-"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                  className="text-xs font-medium text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400"
                >
                  {deletingId === entry.id ? "Menghapus..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
