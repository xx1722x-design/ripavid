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
  title: "RipAVid - Free No Watermark Video Downloader for Xiaohongshu, Douyin, YouTube, Bilibili",
  description: "Download any video without watermark instantly from YouTube, TikTok, Instagram, Douyin, Xiaohongshu, Bilibili and 10+ platforms. Fast, free, and secure video downloader for creators.",
  keywords: "video downloader, no watermark, youtube downloader, tiktok downloader, instagram downloader, douyin downloader, xiaohongshu downloader, bilibili downloader, free video downloader",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RipAVid",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ripavid.com",
    title: "RipAVid - Free No Watermark Video Downloader",
    description: "Download any video without watermark instantly from YouTube, TikTok, Instagram, Douyin, Xiaohongshu, Bilibili and more.",
    images: [
      {
        url: "https://ripavid.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "RipAVid - Free Global Video Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RipAVid - Free No Watermark Video Downloader",
    description: "Download videos without watermark from 10+ platforms instantly.",
  },
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
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WW0J3P1PYH"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WW0J3P1PYH');
            `,
          }}
        />
      </head>
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
