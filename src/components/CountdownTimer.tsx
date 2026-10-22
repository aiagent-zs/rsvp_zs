"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "@/components/icons";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

export function CountdownTimer({
  targetDate,
  eventName,
}: {
  targetDate: string;
  eventName: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const update = () => setTimeLeft(getTimeLeft(target));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const display = timeLeft ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const units: Array<{ label: string; value: number }> = [
    { label: "Hari", value: display.days },
    { label: "Jam", value: display.hours },
    { label: "Menit", value: display.minutes },
    { label: "Detik", value: display.seconds },
  ];

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
      <div>
        <p className="text-xs font-medium text-slate-500">
          Menuju <span className="font-semibold text-slate-700">{eventName}</span>
        </p>
        <div className="mt-2 flex gap-4">
          {units.map((unit) => (
            <div key={unit.label} className="text-center">
              <p className="text-xl font-bold tabular-nums text-emerald-700 sm:text-2xl">
                {String(unit.value).padStart(2, "0")}
              </p>
              <p className="text-[11px] text-slate-400">{unit.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 sm:flex">
        <CalendarIcon className="h-5 w-5" />
      </div>
    </div>
  );
}
