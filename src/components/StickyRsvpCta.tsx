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
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-40 transition-all duration-300 lg:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
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
  );
}
