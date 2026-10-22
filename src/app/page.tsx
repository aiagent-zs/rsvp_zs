import Image from "next/image";
import { Caveat } from "next/font/google";
import { RsvpForm } from "@/components/RsvpForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CalendarIcon, MapPinIcon } from "@/components/icons";
import { eventConfig } from "@/lib/event";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <header className="border-b border-slate-100 dark:border-slate-900">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Image
            src="/logo.png"
            alt={eventConfig.organizer}
            width={154}
            height={154}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="text-xs font-medium text-slate-400">
            {eventConfig.series}
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,var(--color-emerald-100),transparent)] lg:hidden dark:bg-[radial-gradient(closest-side,var(--color-emerald-950),transparent)]"
        />

        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/bg-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>

        <div className="relative mx-auto grid max-w-7xl lg:grid-cols-[1.05fr_1fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-14 sm:px-10 lg:py-24 lg:pr-10 lg:pl-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
              {eventConfig.pillars.join(" • ")}
            </p>
            <h1 className="mt-4 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              {eventConfig.heroTitle.line1}
              <br />
              <span className="text-emerald-600">
                {eventConfig.heroTitle.line2}
              </span>{" "}
              <span className="text-orange-500">
                {eventConfig.heroTitle.year}
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {eventConfig.heroSubheading}
            </p>

            <div className="mt-7 flex flex-col gap-4 text-sm text-slate-700 sm:flex-row sm:flex-wrap sm:items-start sm:gap-8 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <CalendarIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold">{eventConfig.date}</p>
                  <p className="text-xs text-slate-400">{eventConfig.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-600" />
                <p className="max-w-60 font-semibold leading-snug">
                  {eventConfig.location}
                </p>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#rsvp"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                Konfirmasi Kehadiran
                <span aria-hidden>&rarr;</span>
              </a>
              <a
                href="#agenda"
                className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950"
              >
                Lihat Susunan Acara
              </a>
            </div>
          </div>

          <div className="relative hidden min-h-140 lg:block">
            <p
              className={`absolute right-8 top-8 max-w-52.5 text-right text-xl leading-snug text-emerald-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] ${caveat.className}`}
            >
              &ldquo;{eventConfig.quote}&rdquo;
            </p>
            <div className="absolute right-8 bottom-8 left-8">
              <CountdownTimer
                targetDate={eventConfig.dateISO}
                eventName={eventConfig.eventName}
              />
            </div>
          </div>
        </div>

        <div className="mx-6 overflow-hidden rounded-2xl lg:hidden">
          <div className="relative aspect-4/3 w-full">
            <Image
              src="/bg-hero.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-right"
            />
          </div>
        </div>
        <div className="px-6 py-8 lg:hidden">
          <CountdownTimer
            targetDate={eventConfig.dateISO}
            eventName={eventConfig.eventName}
          />
        </div>
      </section>

      <section
        id="agenda"
        className="border-y border-slate-100 bg-slate-50/60 px-6 py-12 dark:border-slate-900 dark:bg-slate-900/40"
      >
        <div className="mx-auto grid max-w-3xl gap-8 sm:grid-cols-3">
          {eventConfig.highlights.map((item) => (
            <div key={item.title}>
              <div className="h-px w-8 bg-emerald-600" />
              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="rsvp" className="px-6 py-16">
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Konfirmasi Kehadiran
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              Mohon konfirmasi kehadiran Anda sebelum {eventConfig.rsvpDeadline}
              .
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
            <RsvpForm />
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 px-6 py-8 dark:border-slate-900">
        <p className="mx-auto max-w-3xl text-center text-xs text-slate-400">
          {eventConfig.eventName} &middot; {eventConfig.organizer}
        </p>
      </footer>
    </main>
  );
}
