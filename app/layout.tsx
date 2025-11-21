import type { Metadata } from "next";
import { GeistSans } from "@/app/fonts/geist";
import { Montserrat } from "@/app/fonts/montserrat";
import { PlayfairDisplay } from "@/app/fonts/playfair";
import "./globals.css";

export const metadata: Metadata = {
  title: "SixtyFour Hotel & Accommodation",
  description: "We have different types of rooms to suit your needs.",
};//add additional metadata here in the future 

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`
        ${GeistSans.variable} 
        ${Montserrat.variable} 
        ${PlayfairDisplay.variable}
        font-sans antialiased
        h-full flex flex-col min-h-screen
        `}>
        {children}
      </body>
    </html>
  );
}
