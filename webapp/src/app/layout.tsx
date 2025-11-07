import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Agentic Store Tracker",
  description:
    "Monitor product catalogue performance, revenue, profit, and stock alerts with a personalized store dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
