import Image from "next/image";
import { Caveat } from "next/font/google";
import { auth, signIn, signOut } from "@/auth";
import { getAllRsvps, summarize } from "@/lib/sheets-store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { AdminTable } from "@/components/AdminTable";
import { eventConfig } from "@/lib/event";
import { getEventConfig } from "@/lib/event-server";
import { EventSettingsForm } from "@/components/EventSettingsForm";
import { ChartBarIcon, GoogleIcon, ShieldCheckIcon, UsersIcon } from "@/components/icons";

const caveat = Caveat({ subsets: ["latin"], weight: "600" });

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-emerald-50">
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/bg-login-mobile.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="/bg-login.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px] flex-col lg:flex-row">
          <div className="hidden flex-1 flex-col justify-between px-10 py-12 text-white lg:flex xl:px-20 xl:py-16">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.png"
                alt={eventConfig.organizer}
                width={154}
                height={154}
                className="h-12 w-12 object-contain"
              />
              <div className="h-8 w-px bg-white/30" />
              <p className="text-xs font-semibold uppercase leading-snug tracking-[0.15em] text-white/85">
                Berdaya Bersama
                <br />
                Untuk Manfaat Lebih Luas
              </p>
            </div>

            <div className="max-w-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Admin RSVP
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white xl:text-5xl">
                Akses Admin untuk{" "}
                <span className="text-emerald-400">Sukses Ekspose</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80">
                Kelola konfirmasi kehadiran dengan lebih mudah, terstruktur, dan
                berdampak untuk acara Sukses Ekspose.
              </p>

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-6">
                <FeatureBullet
                  icon={<ChartBarIcon className="h-4.5 w-4.5 text-white" />}
                  iconClassName="bg-emerald-500"
                  title="Transparan"
                  detail={
                    <>
                      Data akurat dan
                      <br />
                      terpantau real-time
                    </>
                  }
                />
                <FeatureBullet
                  icon={<UsersIcon className="h-4.5 w-4.5 text-white" />}
                  iconClassName="bg-orange-500"
                  title="Kolaboratif"
                  detail={
                    <>
                      Bekerja lebih efektif
                      <br />
                      dalam satu tim
                    </>
                  }
                />
                <FeatureBullet
                  icon={<ShieldCheckIcon className="h-4.5 w-4.5 text-white" />}
                  iconClassName="bg-emerald-500"
                  title="Aman"
                  detail={
                    <>
                      Hanya akun resmi
                      <br />
                      yang dapat mengakses
                    </>
                  }
                />
              </div>
            </div>

            <blockquote className="max-w-sm border-l-2 border-emerald-400 pl-4 text-sm italic leading-relaxed text-white/80">
              &ldquo;Kolaborasi hari ini, keberkahan untuk masa depan.&rdquo;
              <footer className="mt-2 text-xs font-semibold not-italic tracking-[0.2em] text-white/60">
                ZAKAT SUKSES
              </footer>
            </blockquote>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10">
            <Card className="w-full max-w-sm bg-card/95 p-4 text-center shadow-xl backdrop-blur">
              <CardContent>
              <Image
                src="/logo.png"
                alt={eventConfig.organizer}
                width={154}
                height={154}
                className="mx-auto h-14 w-14 object-contain"
                priority
              />
              <h2 className="mt-4 text-xl font-semibold text-slate-900">Admin RSVP</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Masuk dengan akun Google domain{" "}
                <strong className="font-semibold text-slate-700">zakatsukses.org</strong>{" "}
                untuk mengelola daftar konfirmasi kehadiran.
              </p>

              <form
                action={async () => {
                  "use server";
                  await signIn("google");
                }}
                className="mt-6"
              >
                <Button type="submit" variant="outline" className="h-10 w-full gap-3 text-sm">
                  <GoogleIcon className="h-5 w-5" />
                  Masuk dengan Google
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                atau
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4 text-left">
                <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">
                    Hanya akun Google kantor yang dapat mengakses
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-700">
                    Gunakan akun dengan domain @zakatsukses.org untuk keamanan data
                    acara.
                  </p>
                </div>
              </div>
              </CardContent>
            </Card>

            <p
              className={`mt-8 hidden text-center text-lg text-emerald-700/80 sm:block ${caveat.className}`}
            >
              Lebih Banyak Kebaikan, Lebih Banyak Manfaat
            </p>
          </div>
        </div>
      </main>
    );
  }

  let entries: Awaited<ReturnType<typeof getAllRsvps>> = [];
  let loadError: string | null = null;
  try {
    entries = await getAllRsvps();
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Gagal memuat data dari Google Sheets.";
  }

  const summary = summarize(entries);
  const currentEvent = await getEventConfig();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt={eventConfig.organizer}
            width={154}
            height={154}
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Daftar Konfirmasi Kehadiran
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Masuk sebagai {session.user.email}
            </p>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button type="submit" variant="outline" className="h-9 text-sm">
            Keluar
          </Button>
        </form>
      </div>

      <div className="mt-8">
        <EventSettingsForm
          initialDate={currentEvent.dateISO.slice(0, 10)}
          initialStartTime={currentEvent.startTime}
          initialEndTime={currentEvent.endTime}
          initialLocation={currentEvent.location}
          initialMapsUrl={currentEvent.mapsUrl}
        />
      </div>

      {loadError ? (
        <Alert variant="destructive" className="mt-8">
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <StatCard label="Total Respon" value={summary.totalResponses} />
            <StatCard label="Konfirmasi Hadir" value={summary.attendingCount} />
            <StatCard label="Total Tamu Hadir" value={summary.totalAttendingGuests} />
            <StatCard label="Tidak Hadir" value={summary.notAttendingCount} />
            <StatCard label="Sudah Check-in" value={summary.checkedInCount} />
          </div>

          <div className="mt-8">
            <AdminTable entries={entries} />
          </div>
        </>
      )}
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card size="sm">
      <CardContent>
        <CardDescription>{label}</CardDescription>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function FeatureBullet({
  icon,
  iconClassName,
  title,
  detail,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  detail: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClassName}`}
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs leading-relaxed text-white/70">{detail}</p>
      </div>
    </div>
  );
}
