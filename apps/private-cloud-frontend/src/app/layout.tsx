import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/inter";
import EmotionRegistry from "@/lib/EmotionRegistry";
import ThemeRegistry from "@/lib/ThemeRegistry";

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
            <body
                className={`${geistSans.variable} ${geistMono.variable}`}
                suppressHydrationWarning
            >
                <EmotionRegistry>
                    <ThemeRegistry>{children}</ThemeRegistry>
                </EmotionRegistry>
            </body>
        </html>
    );
}
