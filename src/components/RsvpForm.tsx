"use client";

import { FormEvent, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Attendance = "yes" | "no";

export function RsvpForm() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
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
      <Card className="items-center py-8 text-center">
        <CardContent className="flex flex-col items-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            ✓
          </div>
          <h3 className="text-lg font-semibold">Terima kasih!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Konfirmasi kehadiran Anda telah kami terima.
          </p>
          <Button
            variant="link"
            className="mt-4"
            onClick={() => setStatus("idle")}
          >
            Kirim konfirmasi lain
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-sm">
          Nama lengkap
        </Label>
        <Input
          id="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Masukkan nama Anda"
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Apakah Anda akan hadir?</Label>
        <ToggleGroup
          value={[attendance]}
          onValueChange={(value) =>
            value[0] && setAttendance(value[0] as Attendance)
          }
          variant="outline"
          className="grid w-full grid-cols-2"
        >
          <ToggleGroupItem
            value="yes"
            className="h-9 text-sm aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            Ya
          </ToggleGroupItem>
          <ToggleGroupItem
            value="no"
            className="h-9 text-sm aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            Tidak
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {attendance === "yes" && (
        <div className="space-y-1.5">
          <Label htmlFor="guests" className="text-sm">
            Jumlah tamu (termasuk Anda)
          </Label>
          <Input
            id="guests"
            type="number"
            min={1}
            max={10}
            required
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
            className="h-9 text-sm"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm">
          Catatan{" "}
          <span className="font-normal text-muted-foreground">(opsional)</span>
        </Label>
        <Textarea
          id="message"
          rows={3}
          maxLength={500}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Instansi/lembaga, pertanyaan, atau catatan lain"
          className="resize-none text-sm"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="h-9 w-full text-sm"
      >
        {status === "submitting" ? "Mengirim..." : "Kirim Konfirmasi"}
      </Button>
    </form>
  );
}
