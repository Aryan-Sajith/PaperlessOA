// This is where all pages are rendered. Stuff here appears on all pages.
// Probably put navigation bars here

import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "PaperlessOA",
  description: "Office Automation Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar/>

        {children}
      </body>
    </html>
  );
};