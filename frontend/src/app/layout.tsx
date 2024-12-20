"use client";
import "./globals.css";
import Navbar from "../components/general/Navbar";
import Sidebar from "../components/general/Sidebar";
import React from "react";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className="bg-[#DEDEDE]">
        {!isLoginPage && (
          <div>
            <Navbar />
            <div className="flex h-screen w-full">
              <Sidebar />
              <main className="p-8 w-full">
                {children}
              </main>
            </div>
          </div>
        )}
        {isLoginPage && (
          <main className="w-full">
            {children}
          </main>
        )}
      </body>
    </html>
  );
}