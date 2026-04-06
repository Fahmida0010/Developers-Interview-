import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/components/Navbar";


export const metadata: Metadata = {
  title: "DevChat | Interview App",
  description: "Next-gen Interview & Chat Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#111b21] text-white flex h-screen overflow-hidden">
        {/* Sidebar/Navbar */}
        <Navbar/>
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}