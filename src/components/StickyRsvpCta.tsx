"use client";

import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Tombol RSVP melayang di ponsel; tersembunyi di dekat atas halaman dan saat form terlihat. */
export function StickyRsvpCta() {
  const [scrolled, setScrolled] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const form = document.getElementById("rsvp");
    const observer = new IntersectionObserver(([entry]) =>
      setFormInView(entry.isIntersecting)
    );
    if (form) observer.observe(form);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const show = scrolled && !formInView;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
    <div
      className={cn(
        "w-full max-w-md transition-all duration-300",
        show ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      )}
    >
      <a
        href="#rsvp"
        tabIndex={show ? 0 : -1}
        className={cn(buttonVariants(), "h-12 w-full rounded-full text-sm font-semibold shadow-lg")}
      >
        Konfirmasi Kehadiran
      </a>
    </div>
    </div>
  );
}
