import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://questionate.vercel.app";

export const metadata: Metadata = {
  title: "Online Store Owner Research Survey",
  description:
    "Help us understand the biggest challenges online business owners face so we can build better software.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "online store survey",
    "e-commerce research",
    "shop owner questionnaire",
    "commerce management",
  ],
  authors: [{ name: "Questionate" }],
  openGraph: {
    title: "Online Store Owner Research Survey",
    description:
      "Help us understand the biggest challenges online business owners face so we can build better software.",
    type: "website",
    siteName: "Questionate",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Store Owner Research Survey",
    description:
      "Help us understand the biggest challenges online business owners face so we can build better software.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
