"use client";
import "./globals.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import React from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

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
          <ProtectedRoute>
            {(user) => (
              <>
                {alert(`You can access the logged in user data in this way: ${JSON.stringify(user)}`)}
                <Navbar />
                <div className="flex h-screen w-full">
                  <Sidebar />
                  <main className="p-5 w-full">
                    {children}
                  </main>
                </div>
              </>
            )}
          </ProtectedRoute>
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