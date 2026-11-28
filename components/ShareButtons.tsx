"use client";

import { shareUrls } from "@/lib/social";

export function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const shares = shareUrls(url, title);

  const items = [
    { label: "LinkedIn", href: shares.linkedin },
    { label: "X", href: shares.x },
    { label: "Facebook", href: shares.facebook },
    { label: "WhatsApp", href: shares.whatsapp },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
        Share
      </span>
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[var(--teal-deep)] hover:underline"
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
