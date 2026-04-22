import type { Metadata } from "next";
import { Poppins, Work_Sans } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  weight: ["400", "500", "600", "700"],
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tmfnigeria.com"),
  title: {
    default: "TMF Nigeria | The Mechanization Forum",
    template: "%s | TMF Nigeria",
  },
  description:
    "TMF Nigeria is a national mechanization forum convening government, investors, development partners, MSPs, farmers, OEMs, and academia to advance agricultural mechanization.",
  applicationName: "TMF Nigeria",
  keywords: [
    "TMF Nigeria",
    "Mechanization Forum",
    "Agricultural mechanization Nigeria",
    "NAMP 2025",
    "TMF 2026",
    "Policy ratification dialogue",
    "TracTrac MSL",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tmfnigeria.com",
    siteName: "TMF Nigeria",
    title: "TMF Nigeria | The Mechanization Forum",
    description:
      "Nigeria's leading mechanization forum driving policy dialogue, investment, and implementation across the agricultural ecosystem.",
    images: [
      {
        url: "/tmf-mark.png",
        width: 512,
        height: 512,
        alt: "TMF Nigeria mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TMF Nigeria | The Mechanization Forum",
    description:
      "TMF Nigeria convenes public and private stakeholders to accelerate agricultural mechanization and food security.",
    images: ["/tmf-mark.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/tmf-mark.png", type: "image/png" },
    ],
    apple: [{ url: "/tmf-mark.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
