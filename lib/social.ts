import { site } from "@/lib/site";

export type SocialNetwork =
  | "linkedin"
  | "x"
  | "youtube"
  | "facebook"
  | "instagram"
  | "whatsapp";

export type SocialLink = {
  id: SocialNetwork;
  label: string;
  href: string;
};

/**
 * Public profile URLs (override via NEXT_PUBLIC_SOCIAL_* env in Vercel).
 * Empty string = hide that network until the URL is set.
 */
export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [
    {
      id: "linkedin",
      label: "LinkedIn",
      href:
        process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN?.trim() ||
        "https://www.linkedin.com/company/cloudgentech",
    },
    {
      id: "x",
      label: "X",
      href:
        process.env.NEXT_PUBLIC_SOCIAL_X?.trim() ||
        "https://x.com/cloudgtech",
    },
    {
      id: "youtube",
      label: "YouTube",
      href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE?.trim() || "",
    },
    {
      id: "facebook",
      label: "Facebook",
      href:
        process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.trim() ||
        "https://www.facebook.com/cloudgentech/",
    },
    {
      id: "instagram",
      label: "Instagram",
      href:
        process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.trim() ||
        "https://www.instagram.com/cloudgentech/",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: site.whatsappUrl,
    },
  ];

  return links.filter((l) => Boolean(l.href));
}

export function socialProfileUrls(): string[] {
  return getSocialLinks()
    .filter((l) => l.id !== "whatsapp")
    .map((l) => l.href);
}

/** Share / compose helpers for daily posting + on-page share buttons. */
export function shareUrls(pageUrl: string, text: string) {
  const u = encodeURIComponent(pageUrl);
  const t = encodeURIComponent(text);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${pageUrl}`)}`,
  };
}
