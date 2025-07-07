import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: {
        position: "bottom-left",
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "4000",
                pathname: "/**",
                search: "",
            },
        ],
    },
};

export default nextConfig;
