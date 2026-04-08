import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/layout/Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KVIS Connect",
  description: "KVIS Alumni Network",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
