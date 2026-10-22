import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPinIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function LocationMap({
  embedUrl,
  location,
  mapsUrl,
}: {
  embedUrl: string;
  location: string;
  mapsUrl: string;
}) {
  return (
    <section id="lokasi" className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-heading text-xl font-bold text-primary">Lokasi Acara</h2>
          <div className="mx-auto mt-2 h-0.5 w-10 bg-brand-orange" />
          <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4 shrink-0 text-brand-orange" />
            {location}
          </p>
        </div>

        <Card className="mt-8 p-0">
          <CardContent className="p-0">
            <iframe
              src={embedUrl}
              title={`Peta lokasi: ${location}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="aspect-4/3 w-full border-0"
            />
          </CardContent>
        </Card>

        {mapsUrl && (
          <div className="mt-4 text-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }), "h-9 px-4 text-sm")}
            >
              Buka di Google Maps
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
