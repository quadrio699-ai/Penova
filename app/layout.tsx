import type { Metadata } from "next";
import { Space_Grotesk, Source_Serif_4, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { siteMeta } from "@/lib/content";
import AsciiIntro from "@/components/ui/AsciiIntro";
import PageTransition from "@/components/ui/PageTransition";
import DepthField from "@/components/ui/DepthField";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

// Handwriting face used only for the decorative doodle phrases.
const hand = Caveat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-hand",
});

export const metadata: Metadata = {
  title: `${siteMeta.name} — ${siteMeta.tagline}`,
  description: siteMeta.positioning,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hand.variable}`}>
      <body>
        <AsciiIntro />
        <PageTransition />
        <DepthField />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
