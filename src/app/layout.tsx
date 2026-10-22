import type { Metadata } from "next";
import { Geist_Mono, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-montserrat",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sukses Ekspose 2026 — Zakat Sukses",
  description:
    "Konfirmasi kehadiran Sukses Ekspose 2026, forum terbuka tahunan Zakat Sukses dalam Rangkaian Milad Zakat Sukses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", geistMono.variable, "font-sans", poppins.variable, montserrat.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
