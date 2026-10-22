import Image from "next/image";
import { Caveat } from "next/font/google";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RsvpForm } from "@/components/RsvpForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GuestName } from "@/components/GuestName";
import { LocationMap } from "@/components/LocationMap";
import { Reveal } from "@/components/Reveal";
import { StickyRsvpCta } from "@/components/StickyRsvpCta";
import { getEventConfig, getMapEmbedUrl } from "@/lib/event-server";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

export const revalidate = 60;

export default async function Home() {
  const eventConfig = await getEventConfig();
  const mapEmbedUrl = await getMapEmbedUrl(eventConfig.mapsUrl, eventConfig.location);

  return (
    <div className="min-h-screen bg-muted">
      <main className="mx-auto max-w-md bg-background shadow-xl">
        {/* Sampul undangan */}
        <section className="flex min-h-svh p-3">
          <Frame className="flex flex-1 flex-col items-center px-6 py-8 text-center">
            <Image
              src="/logo.png"
              alt={eventConfig.organizer}
              width={154}
              height={154}
              className="h-14 w-14 object-contain"
              priority
            />
            <p className="mt-6 font-heading text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              Undangan
            </p>
            <p className="mt-1 font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              {eventConfig.series}
            </p>

            <div className="relative mt-6 aspect-4/5 w-full max-w-60 overflow-hidden rounded-t-full border-4 border-background shadow-lg ring-1 ring-primary/30">
              <Image
                src="/bg-hero.png"
                alt=""
                fill
                priority
                sizes="240px"
                className="object-cover object-right"
              />
            </div>

            <h1 className="mt-6 font-heading text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground">
              {eventConfig.heroTitle.line1}
              <br />
              <span className="text-primary">{eventConfig.heroTitle.line2}</span>{" "}
              <span className="text-brand-orange">{eventConfig.heroTitle.year}</span>
            </h1>
            <p className={`mt-3 text-lg leading-snug text-foreground ${caveat.className}`}>
              &ldquo;{eventConfig.quote}&rdquo;
            </p>

            <div className="mt-auto w-full pt-8">
              <Ornament />
              <p className="mt-4 text-xs text-muted-foreground">Kepada Yth.</p>
              <p className="mt-1 font-heading text-base font-semibold text-foreground">
                <GuestName fallback="Bapak/Ibu/Saudara/i" />
              </p>
              <a
                href="#undangan"
                className={cn(buttonVariants(), "mt-5 h-11 gap-2 rounded-full px-7 text-sm font-semibold")}
              >
                Buka Undangan
                <span aria-hidden>&darr;</span>
              </a>
            </div>
          </Frame>
        </section>

        {/* Isi surat */}
        <section id="undangan" className="scroll-mt-2 px-3 pb-3">
          <Frame className="px-6 py-12 text-center">
            <Reveal>
              <p className="font-heading text-sm font-semibold text-primary">
                Assalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
              </p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri
              </p>
              <h2 className="mt-4 font-heading text-2xl font-extrabold uppercase leading-tight text-foreground">
                {eventConfig.eventName}
              </h2>
              <p className="mt-1 text-xs font-medium text-brand-orange">
                {eventConfig.pillars.join(" • ")}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {eventConfig.description}
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <Ornament />
              <dl className="mt-6 space-y-5">
                <Detail label="Hari / Tanggal">
                  {eventConfig.weekday}, {eventConfig.date}
                </Detail>
                <Detail label="Waktu">{eventConfig.time}</Detail>
                <Detail label="Tempat">{eventConfig.location}</Detail>
              </dl>
              <div className="mt-8">
                <CountdownTimer
                  targetDate={eventConfig.dateISO}
                  eventName={eventConfig.eventName}
                />
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <Ornament />
              <h3 className="mt-6 font-heading text-sm font-bold text-primary">
                Dalam acara ini akan dibahas
              </h3>
              <ol className="mt-5 space-y-5 text-left">
                {eventConfig.highlights.map((item, index) => (
                  <li key={item.title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/40 font-heading text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-heading text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Frame>
        </section>

        <div className="px-3 pb-3">
          <Frame className="py-0">
            <Reveal>
              <LocationMap
                embedUrl={mapEmbedUrl}
                location={eventConfig.location}
                mapsUrl={eventConfig.mapsUrl}
              />
            </Reveal>
          </Frame>
        </div>

        <section id="rsvp" className="scroll-mt-2 px-3 pb-3">
          <Frame className="px-6 py-12">
            <Reveal>
              <div className="text-center">
                <h2 className="font-heading text-xl font-bold text-primary">
                  Konfirmasi Kehadiran
                </h2>
                <div className="mx-auto mt-2 h-0.5 w-10 bg-brand-orange" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Mohon konfirmasi kehadiran Anda sebelum {eventConfig.rsvpDeadline}.
                </p>
              </div>

              <Card className="mt-8 bg-background p-2 shadow-sm">
                <CardContent>
                  <RsvpForm />
                </CardContent>
              </Card>
            </Reveal>
          </Frame>
        </section>

        {/* Penutup surat */}
        <footer className="px-6 pb-24 pt-8 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Atas kehadiran dan doa Bapak/Ibu/Saudara/i, kami mengucapkan terima kasih.
          </p>
          <p className="mt-4 font-heading text-sm font-semibold text-primary">
            Wassalamu&rsquo;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="mt-6 text-xs text-muted-foreground">Hormat kami,</p>
          <p className="mt-1 font-heading text-sm font-bold text-foreground">
            {eventConfig.organizer}
          </p>
          <p className="mt-8 text-xs text-muted-foreground">
            {eventConfig.eventName} &middot; {eventConfig.organizer}
          </p>
        </footer>

        <StickyRsvpCta />
      </main>
    </div>
  );
}

/** Bingkai ganda bergaya kertas undangan. */
function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className="w-full rounded-lg border border-primary/40 p-1">
      <div className={cn("h-full rounded-md border border-brand-orange/40", className)}>
        {children}
      </div>
    </div>
  );
}

/** Pemisah tipis dengan belah ketupat di tengah. */
function Ornament() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-primary/40" />
      <span className="size-1.5 rotate-45 bg-brand-orange" />
      <span className="h-px w-16 bg-primary/40" />
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-heading text-base font-semibold text-foreground">{children}</dd>
    </div>
  );
}
