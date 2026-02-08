import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit - Habit Tracker",
  description: "Build consistency, one day at a time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}