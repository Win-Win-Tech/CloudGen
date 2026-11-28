import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.product} by ${site.company}`,
    short_name: site.product,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0d1c2e",
    theme_color: "#0f8f9a",
    lang: "en-IN",
    categories: ["business", "productivity", "security"],
    icons: [
      {
        src: site.logo,
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
