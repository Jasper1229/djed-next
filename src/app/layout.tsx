import type { Metadata } from "next";
import { Fira_Sans, Fira_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/landing/Navbar";

const firaSans = Fira_Sans({
  weight: ["400", "500", "700"],
  variable: "--font-fira-sans",
  subsets: ["latin", "cyrillic"],
});

const firaMono = Fira_Mono({
  weight:["400", "700"],
  variable: "--font-fira-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Djed",
  description: "My pet productivity app (so original I know)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${firaSans.variable} ${firaMono.variable} h-full antialiased`}
    >
      <Navbar />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
