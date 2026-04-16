import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Chaldea Foundation",
    description: "Welcome to the Chaldea Foundation",
    openGraph: {
        images: [
            {
                url: "/assets/images/cover.webp",
                width: 1200,
                height: 630,
                alt: "Chaldea Foundation Cover",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/assets/images/cover.webp"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <Analytics />
            <SpeedInsights />
            <ThemeRegistry>
                <body className={inter.className}>{children}</body>
            </ThemeRegistry>
        </html>
    );
}
