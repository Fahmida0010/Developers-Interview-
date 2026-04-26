import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import { Providers } from "@/src/components/Providers";
// import LoginPage from "./(auth)/login/page";

export const metadata: Metadata = {
  title: "DevChat | Interview App",
  description: "Next-gen Interview & Chat Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#111b21] text-white flex h-screen overflow-hidden">
        
        <Providers>
          <Navbar />

          <main className="flex-1 flex flex-col relative overflow-hidden">
            {children}
        
          </main>
        </Providers>

      </body>
    </html>
  );
}