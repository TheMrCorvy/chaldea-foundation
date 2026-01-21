import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Travel Map - Visited Countries",
    description: "A 3D globe showing countries that have been visited",
};

export default function TravelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
