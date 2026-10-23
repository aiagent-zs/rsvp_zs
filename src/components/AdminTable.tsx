"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RsvpEntry } from "@/lib/sheets-store";

export function AdminTable({ entries }: { entries: RsvpEntry[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  async function handleCheckIn(id: string, checkedIn: boolean) {
    setCheckingId(id);
    try {
      const response = await fetch(`/api/admin/rsvps/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkedIn }),
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Gagal menyimpan check-in.");
      }
    } finally {
      setCheckingId(null);
    }
  }

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
      <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Belum ada konfirmasi kehadiran.
      </p>
    );
  }

  const keyword = query.trim().toLowerCase();
  const visible = keyword
    ? entries.filter((entry) =>
        [entry.name, entry.phone, entry.email].some((value) =>
          value.toLowerCase().includes(keyword)
        )
      )
    : entries;

  return (
    <div className="space-y-3">
    <Input
      type="search"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      placeholder="Cari nama, telepon, atau email"
      className="h-9 max-w-sm text-sm"
    />
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Check-in</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Kehadiran</TableHead>
            <TableHead>Tamu</TableHead>
            <TableHead>Ucapan</TableHead>
            <TableHead>Waktu</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="py-6 text-center text-muted-foreground">
                Tidak ada tamu yang cocok.
              </TableCell>
            </TableRow>
          )}
          {visible.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={Boolean(entry.checkedInAt)}
                    disabled={checkingId === entry.id}
                    onCheckedChange={(checked) => handleCheckIn(entry.id, checked)}
                    aria-label={`Check-in ${entry.name}`}
                  />
                  {entry.checkedInAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.checkedInAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </label>
              </TableCell>
              <TableCell className="font-medium">{entry.name}</TableCell>
              <TableCell className="whitespace-nowrap">{entry.phone || "-"}</TableCell>
              <TableCell>{entry.email || "-"}</TableCell>
              <TableCell>
                <Badge variant={entry.attendance === "yes" ? "default" : "secondary"}>
                  {entry.attendance === "yes" ? "Hadir" : "Tidak Hadir"}
                </Badge>
              </TableCell>
              <TableCell>{entry.attendance === "yes" ? entry.guests : "-"}</TableCell>
              <TableCell className="max-w-xs truncate text-muted-foreground" title={entry.message}>
                {entry.message || "-"}
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {entry.createdAt ? new Date(entry.createdAt).toLocaleString("id-ID") : "-"}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                >
                  {deletingId === entry.id ? "Menghapus..." : "Hapus"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
