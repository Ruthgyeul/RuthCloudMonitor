import * as React from "react";
import type { Metadata } from "next";
import { NextUIProvider } from "@nextui-org/react";
import { Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Geist, Geist_Mono } from "next/font/google";

import Error from '@/app/error';
import Loading from '@/app/loading';

import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ruthcloud.xyz'),
    title: {
        template: '%s | RuthCloud',
        default: 'Ruth Cloud'
    },
    description: "RuthCloud for multiple cloud platforms",
    manifest: "/manifest.json",
    applicationName: "Ruth Cloud",
    keywords: [],
    authors: [{ name: "Ruthgyeul" }],
    creator: "Ruthgyeul",
    publisher: "Ruthgyeul",
    formatDetection: {
        telephone: true,
        date: true,
        address: true,
        email: true,
        url: true
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any", type: "image/x-icon" }
        ],
        shortcut: ["/favicon.ico"]
    },
    openGraph: {
        title: "Ruth Cloud",
        description: "RuthCloud for multiple cloud platforms",
        url: "https://ruthcloud.xyz",
        siteName: "GDGoC INHA",
        images: [
            {
                url: "https://ruthcloud.xyz/screenshots/home.png",
                width: 1280,
                height: 720,
                alt: "Ruth Cloud Home"
            }
        ],
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ruth Cloud",
        description: "RuthCloud for multiple cloud platforms",
        images: ["https://ruthcloud.xyz/screenshots/home.png"],
        creator: "Ruthgyeul",
    },
    verification: {
        // Google Search Console 등에 사용되는 확인 코드가 있다면 추가
        // google: "VERIFICATION_CODE",
    },
    alternates: {
        canonical: 'https://ruthcloud.syz',
        languages: {
            'en-US': 'https://ruthcloud.xyz',
        },
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#111827"/>
        <link rel="manifest" href="/manifest.json"/>
        {/* PWA 관련 메타 태그 */}
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="mobile-web-app-status-bar-style" content="default"/>
        <meta name="mobile-web-app-title" content="Ruth Cloud"/>
        <title>Ruth Cloud</title>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-auto bg-gray-900`}
      >
      <NextUIProvider>
      <ErrorBoundary 
        FallbackComponent={Error}
      >
          <Suspense fallback={<Loading />} >
              {children}
          </Suspense>
      </ErrorBoundary>
      </NextUIProvider>
      </body>
    </html>
  );
}
