import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display, Montserrat } from 'next/font/google';
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SixtyFour Hotel & Accommodation",
  description: "We have different types of rooms to suit your needs.",
};//add additional metadata here in the future 


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`
        ${playfair.variable} 
        ${montserrat.variable} 
        ${geistSans.variable}
        ${geistMono.variable}
        font-sans antialiased
        h-full flex flex-col min-h-screen
        `}>
        {children}
      </body>
    </html>
  );
}
