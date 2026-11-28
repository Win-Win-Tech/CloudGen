import { sendSimpleEmail } from "@/lib/mail";
import { site } from "@/lib/site";
import { getSocialLinks, shareUrls } from "@/lib/social";
import type { DailySocialPack } from "@/lib/socialPosts";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pre(text: string) {
  return `<pre style="white-space:pre-wrap;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;line-height:1.45;background:#f4f7fb;border:1px solid #d9e2ec;border-radius:8px;padding:12px;margin:8px 0 16px">${escapeHtml(text)}</pre>`;
}

export function formatSocialDigest(pack: DailySocialPack) {
  const share = shareUrls(pack.pageUrl, pack.theme);
  const profiles = getSocialLinks();

  const subject = `[Social daily] ${pack.dateKey} · ${pack.theme}`;

  const text = [
    `CloudGen daily social pack — ${pack.dateKey}`,
    `Theme: ${pack.theme}`,
    `Page: ${pack.pageUrl}`,
    "",
    "=== LinkedIn ===",
    pack.linkedin,
    `Compose/share: ${share.linkedin}`,
    "",
    "=== X (Twitter) ===",
    pack.x,
    `Compose: ${share.x}`,
    "",
    "=== Facebook ===",
    pack.facebook,
    `Share: ${share.facebook}`,
    "",
    "=== Instagram ===",
    pack.instagram,
    "(Paste into Instagram app / Meta Business Suite)",
    "",
    "=== WhatsApp Status / Broadcast ===",
    pack.whatsapp,
    `Quick send link: ${share.whatsapp}`,
    "",
    "=== YouTube (Shorts / video idea) ===",
    `Title: ${pack.youtube.title}`,
    `Description:\n${pack.youtube.description}`,
    `Talk track: ${pack.youtube.talkTrack}`,
    "",
    "Profiles:",
    ...profiles.map((p) => `- ${p.label}: ${p.href}`),
    "",
    `Sent from ${site.url}`,
  ].join("\n");

  const html = `
    <div style="font-family:Segoe UI,Arial,sans-serif;color:#1a1f2c;line-height:1.5;max-width:720px">
      <h2 style="margin:0 0 8px">Daily social pack — ${escapeHtml(pack.dateKey)}</h2>
      <p style="margin:0 0 16px;color:#5c6b7a">Theme: <strong>${escapeHtml(pack.theme)}</strong><br/>
      Page: <a href="${escapeHtml(pack.pageUrl)}">${escapeHtml(pack.pageUrl)}</a></p>

      <h3>LinkedIn</h3>
      ${pre(pack.linkedin)}
      <p><a href="${escapeHtml(share.linkedin)}">Open LinkedIn share</a></p>

      <h3>X</h3>
      ${pre(pack.x)}
      <p><a href="${escapeHtml(share.x)}">Open X compose</a></p>

      <h3>Facebook</h3>
      ${pre(pack.facebook)}
      <p><a href="${escapeHtml(share.facebook)}">Open Facebook share</a></p>

      <h3>Instagram</h3>
      ${pre(pack.instagram)}
      <p style="color:#5c6b7a;font-size:13px">Paste into Instagram or Meta Business Suite (API auto-post needs Meta tokens).</p>

      <h3>WhatsApp</h3>
      ${pre(pack.whatsapp)}
      <p><a href="${escapeHtml(share.whatsapp)}">Open WhatsApp share</a></p>

      <h3>YouTube</h3>
      <p><strong>Title</strong></p>
      ${pre(pack.youtube.title)}
      <p><strong>Description</strong></p>
      ${pre(pack.youtube.description)}
      <p><strong>Talk track</strong></p>
      ${pre(pack.youtube.talkTrack)}

      <h3>Profiles on the website</h3>
      <ul>
        ${profiles
          .map(
            (p) =>
              `<li><a href="${escapeHtml(p.href)}">${escapeHtml(p.label)}</a></li>`,
          )
          .join("")}
      </ul>
      <p style="margin-top:20px;color:#5c6b7a;font-size:13px">${escapeHtml(site.url)}</p>
    </div>
  `;

  return { subject, text, html };
}

export async function sendSocialDailyDigest(pack: DailySocialPack) {
  const { subject, text, html } = formatSocialDigest(pack);
  const to =
    process.env.SOCIAL_DIGEST_TO?.trim() ||
    process.env.SEO_DIGEST_TO?.trim() ||
    site.email;
  return sendSimpleEmail({ to, subject, text, html });
}
