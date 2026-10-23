"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
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
          {entries.map((entry) => (
            <TableRow key={entry.id}>
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
  );
}
