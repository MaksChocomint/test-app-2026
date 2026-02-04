import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "HappyPets — Ветеринарная клиника",
  description: "Система управления ветеринарной клиникой",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body
        className={`${nunito.variable} antialiased bg-brand-beige text-brand-dark font-nunito`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <footer className="p-8 text-center text-brand-dark/50 text-sm">
          © 2026 HappyPets — Ветеринарная клиника
        </footer>
      </body>
    </html>
  );
}
