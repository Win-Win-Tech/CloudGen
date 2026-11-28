import { getSocialLinks } from "@/lib/social";

export function SocialLinks({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const links = getSocialLinks();
  if (!links.length) return null;

  return (
    <div className={className}>
      {!compact ? (
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
          Social
        </p>
      ) : null}
      <ul
        className={`flex flex-wrap gap-x-4 gap-y-2 ${compact ? "" : "mt-3"} text-sm font-semibold`}
      >
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="text-[var(--teal-deep)] hover:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
