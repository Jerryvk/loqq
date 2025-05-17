import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Montserrat } from 'next/font/google'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: "Loqq - Accepteer digitale euro's zonder gedoe",
  description: "Eén apparaat – Eén QR-code. Geen abonnementen. Jouw klanten betalen met EURC of FURT – jij ontvangt direct op je eigen wallet.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${montserrat.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
