"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EventSettingsForm({
  initialDate,
  initialStartTime,
  initialEndTime,
  initialLocation,
  initialMapsUrl,
}: {
  initialDate: string;
  initialStartTime: string;
  initialEndTime: string;
  initialLocation: string;
  initialMapsUrl: string;
}) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [location, setLocation] = useState(initialLocation);
  const [mapsUrl, setMapsUrl] = useState(initialMapsUrl);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(null);
    try {
      const response = await fetch("/api/admin/event", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, startTime, endTime, location, mapsUrl }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan pengaturan.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server. Silakan coba lagi.");
      setStatus("error");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Acara</CardTitle>
        <CardDescription>
          Ubah tanggal, jam, dan lokasi yang tampil di halaman RSVP publik.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="event-date">Tanggal</Label>
            <Input
              id="event-date"
              type="date"
              required
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setStatus("idle");
              }}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="event-start">Jam mulai (WIB)</Label>
            <Input
              id="event-start"
              type="time"
              required
              value={startTime}
              onChange={(event) => {
                setStartTime(event.target.value);
                setStatus("idle");
              }}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="event-end">Jam selesai (WIB)</Label>
            <Input
              id="event-end"
              type="time"
              required
              value={endTime}
              onChange={(event) => {
                setEndTime(event.target.value);
                setStatus("idle");
              }}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-3">
            <Label htmlFor="event-location">Lokasi</Label>
            <Input
              id="event-location"
              type="text"
              required
              minLength={3}
              maxLength={200}
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setStatus("idle");
              }}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-3">
            <Label htmlFor="event-maps">
              Titik lokasi <span className="font-normal text-muted-foreground">(tautan Google Maps, opsional)</span>
            </Label>
            <Input
              id="event-maps"
              type="url"
              maxLength={500}
              value={mapsUrl}
              onChange={(event) => {
                setMapsUrl(event.target.value);
                setStatus("idle");
              }}
              placeholder="https://maps.app.goo.gl/..."
              className="h-9"
            />
          </div>
          <Button type="submit" disabled={status === "saving"} className="h-9 sm:col-span-3 sm:w-fit">
            {status === "saving" ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
        {status === "saved" && (
          <p className="mt-3 text-xs text-muted-foreground">Tersimpan.</p>
        )}
        {error && (
          <Alert variant="destructive" className="mt-3">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
