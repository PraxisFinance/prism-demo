import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";

import { Header } from "@/components/layout/Header";
import { StoreHydration } from "@/components/providers/StoreHydration";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Praxis Prism",
  description:
    "Praxis Prism — predict future vault APY and choose a risk profile before you deposit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <StoreHydration />
        <div className="flex min-h-dvh flex-col">
          <Header />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
