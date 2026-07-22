import type { MetadataRoute } from "next";
import { env } from "@/lib/env.config";

export default function robots(): MetadataRoute.Robots {
	const baseURL = env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/sign-in", "/contacts", "/register", "/account"],
			},
		],
		sitemap: `${baseURL}/sitemap.xml`,
	};
}
