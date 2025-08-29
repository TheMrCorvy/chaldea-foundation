import "../styles/globals.css";

import { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Anime Server",
    description: "Servidor de anime privado",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="text-white">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
