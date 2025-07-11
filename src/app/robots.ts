import { envConfig } from "@/config";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: "/me/",
        },
        sitemap: `${envConfig.NEXT_PUBLIC_API}/sitemap.xml`,
    };
}
