import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Product Admin Dashboard",
  description: "Product management admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Sidebar />

        <div className="min-h-screen lg:pl-64">
          {children}
        </div>
      </body>
    </html>
  );
}