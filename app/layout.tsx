import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./components/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import "./globals.css";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RipAVid - Download Videos Instantly",
  description: "Fast and simple video downloader for Douyin, Xiaohongshu, and more. No sign-up required.",
  keywords: "video downloader, douyin, xiaohongshu, tiktok, instagram",
  other: {
    "monetag": "9cbfb4a387cd0dce13c3dbc35123a72c",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <AuthProvider>
          <Providers>
            <Header />
            {children}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
