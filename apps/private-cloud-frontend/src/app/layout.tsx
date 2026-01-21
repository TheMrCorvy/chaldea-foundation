import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/inter";
import EmotionRegistry from "@/lib/EmotionRegistry";
import ThemeRegistry from "@/lib/ThemeRegistry";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ),
    title: "Unlimited Blades Work",
    description: "El mejor sitio de streaming gratuito",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Unlimited Blades Work",
    },
    formatDetection: {
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <head>
                {/* PWA Meta Tags */}
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
                />
                <meta name="theme-color" content="#3f51b5" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta
                    name="mobile-web-app-status-bar-style"
                    content="black-translucent"
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black-translucent"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="Private Cloud"
                />
                <meta
                    name="description"
                    content="Your personal private cloud media library"
                />
                <link rel="icon" href="/icons/icon-192x192.png" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <link rel="manifest" href="/manifest.json" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable}`}
                suppressHydrationWarning
            >
                <ServiceWorkerRegistration />
                <EmotionRegistry>
                    <ThemeRegistry>{children}</ThemeRegistry>
                </EmotionRegistry>
            </body>
        </html>
    );
}
