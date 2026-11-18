import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import QuickConnectWidget from "@/components/QuickConnectWidget";
import { SanityLive } from "@/lib/sanity/live";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SDA English Church Vellore - Welcome Home",
  description: "A community where you can love God, love people, and make a difference.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://unpkg.com/maplibre-gl@5.2.4/dist/maplibre-gl.css" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${plusJakartaSans.variable} ${newsreader.variable} font-body antialiased`}
      >
        {children}
        <QuickConnectWidget />
        <SanityLive />
      </body>
    </html>
  );
}
