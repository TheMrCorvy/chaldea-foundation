import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "admin.chaldea.foundation",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "1337",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
