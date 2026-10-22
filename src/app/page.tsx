import Image from "next/image";
import { Caveat } from "next/font/google";
import { FileText, Target, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RsvpForm } from "@/components/RsvpForm";
import { CountdownTimer } from "@/components/CountdownTimer";
import { CalendarIcon, ClockIcon, MapPinIcon } from "@/components/icons";
import { LocationMap } from "@/components/LocationMap";
import { Reveal } from "@/components/Reveal";
import { StickyRsvpCta } from "@/components/StickyRsvpCta";
import { getEventConfig, getMapEmbedUrl } from "@/lib/event-server";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

const highlightIcons = [FileText, Wallet, Target];

export const revalidate = 60;

export default async function Home() {
  const eventConfig = await getEventConfig();
  const mapEmbedUrl = await getMapEmbedUrl(eventConfig.mapsUrl, eventConfig.location);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-16">
          <span className="font-heading text-xs font-semibold text-muted-foreground">
            {eventConfig.series}
          </span>
          <Image
            src="/logo.png"
            alt={eventConfig.organizer}
            width={154}
            height={154}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>
      </header>

      <section className="relative overflow-hidden">
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
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {eventConfig.pillars.join(" • ")}
            </p>
            <h1 className="mt-4 font-heading text-5xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl">
              {eventConfig.heroTitle.line1}
              <br />
              <span className="text-primary">{eventConfig.heroTitle.line2}</span>{" "}
              <span className="text-brand-orange">{eventConfig.heroTitle.year}</span>
            </h1>
            <div className="mt-4 h-1 w-16 rounded-full bg-brand-orange" />
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              {eventConfig.heroSubheading}
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <HeroFact icon={<CalendarIcon className="h-5 w-5" />} label="Tanggal">
                {eventConfig.date}
              </HeroFact>
              <HeroFact icon={<ClockIcon className="h-5 w-5" />} label="Waktu">
                {eventConfig.time}
              </HeroFact>
              <HeroFact icon={<MapPinIcon className="h-5 w-5" />} label="Lokasi">
                {eventConfig.location}
              </HeroFact>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#rsvp"
                className={cn(buttonVariants(), "h-12 gap-2 rounded-full px-7 text-sm font-semibold")}
              >
                Konfirmasi Kehadiran
                <span aria-hidden>&rarr;</span>
              </a>
              <a
                href="#agenda"
                className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-full px-7 text-sm font-semibold")}
              >
                Lihat Susunan Acara
              </a>
            </div>
          </div>

          <div className="relative hidden min-h-140 lg:block">
            <p
              className={`absolute right-8 top-8 max-w-52.5 text-right text-xl leading-snug text-foreground drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] ${caveat.className}`}
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

      <section id="agenda" className="border-y bg-muted px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <h2 className="font-heading text-xl font-bold text-primary">Yang Akan Dibahas</h2>
            <div className="mx-auto mt-2 h-0.5 w-10 bg-brand-orange" />
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {eventConfig.description}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {eventConfig.highlights.map((item, index) => {
              const Icon = highlightIcons[index % highlightIcons.length];
              return (
                <Reveal key={item.title} delay={index * 120}>
                  <Card className="h-full bg-background p-2">
                    <CardContent>
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <h3 className="mt-4 font-heading text-sm font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.detail}
                      </p>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Reveal>
        <LocationMap
          embedUrl={mapEmbedUrl}
          location={eventConfig.location}
          mapsUrl={eventConfig.mapsUrl}
        />
      </Reveal>

      <section id="rsvp" className="scroll-mt-4 bg-muted px-6 py-16">
        <Reveal className="mx-auto max-w-md">
          <div className="text-center">
            <h2 className="font-heading text-xl font-bold text-primary">Konfirmasi Kehadiran</h2>
            <div className="mx-auto mt-2 h-0.5 w-10 bg-brand-orange" />
            <p className="mt-4 text-sm text-muted-foreground">
              Mohon konfirmasi kehadiran Anda sebelum {eventConfig.rsvpDeadline}.
            </p>
          </div>

          <Card className="mt-8 bg-background p-2 shadow-sm sm:p-4">
            <CardContent>
              <RsvpForm />
            </CardContent>
          </Card>
        </Reveal>
      </section>

      <footer className="border-t px-6 py-8">
        <p className="mx-auto max-w-3xl text-center text-xs text-muted-foreground">
          {eventConfig.eventName} &middot; {eventConfig.organizer}
        </p>
      </footer>

      <StickyRsvpCta />
    </main>
  );
}

function HeroFact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-background/90 p-3 shadow-sm backdrop-blur sm:flex-col sm:gap-2">
      <span className="text-brand-orange">{icon}</span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground">{children}</p>
      </div>
    </div>
  );
}
