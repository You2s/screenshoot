import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Screenshoot — Fake Notification Generator",
  description: "Create realistic iPhone lock screen notifications",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
