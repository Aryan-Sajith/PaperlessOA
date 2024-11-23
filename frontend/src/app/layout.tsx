// This is where all pages are rendered. Stuff here appears on all pages.
// Probably put navigation bars here

import type { Metadata } from "next";
import "./globals.css";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import React from "react";

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
      <body className="bg-[#DEDEDE]">
        <Navbar/>
        <div className="flex h-screen w-full">
          <Sidebar/>
          <main className="p-5 w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
};