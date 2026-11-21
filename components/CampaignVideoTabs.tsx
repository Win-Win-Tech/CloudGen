"use client";

import { useState } from "react";

type CampaignClip = {
  id: string;
  label: string;
  hint: string;
  src: string;
  poster: string;
  ariaLabel: string;
};

const CLIPS: CampaignClip[] = [
  {
    id: "animated-vo",
    label: "Animated + Voice",
    hint: "Narrated visitor journey with motion",
    src: "/campaigns/visitor-management-animated-vo.mp4",
    poster: "/campaigns/visitor-management-animated-vo-poster.jpg",
    ariaLabel: "Animated Visitor Management System campaign with voice-over",
  },
  {
    id: "silent",
    label: "Silent Motion",
    hint: "Shorter cut for mute autoplay and social",
    src: "/campaigns/visitor-management-campaign.mp4",
    poster: "/campaigns/visitor-management-campaign-poster.jpg",
    ariaLabel: "Silent Visitor Management campaign video",
  },
];

export function CampaignVideoTabs({
  variant = "hero",
}: {
  variant?: "hero" | "light";
}) {
  const [activeId, setActiveId] = useState(CLIPS[0].id);
  const active = CLIPS.find((clip) => clip.id === activeId) ?? CLIPS[0];
  const isHero = variant === "hero";

  return (
    <div className={isHero ? "" : "mt-6"}>
      <div
        role="tablist"
        aria-label="Campaign video versions"
        className={`flex flex-wrap gap-2 ${isHero ? "mb-3" : "mb-4"}`}
      >
        {CLIPS.map((clip) => {
          const selected = clip.id === active.id;
          return (
            <button
              key={clip.id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`campaign-tab-${clip.id}`}
              aria-controls={`campaign-panel-${clip.id}`}
              onClick={() => setActiveId(clip.id)}
              className={`rounded-md px-3.5 py-2 text-left text-sm font-semibold transition ${
                selected
                  ? isHero
                    ? "bg-[#d4af55] text-[var(--ink)]"
                    : "bg-[var(--teal-deep)] text-white"
                  : isHero
                    ? "border border-white/25 bg-white/5 text-white hover:bg-white/10"
                    : "border border-[var(--line)] bg-white text-[var(--navy)] hover:border-[var(--teal-deep)]"
              }`}
            >
              <span className="block">{clip.label}</span>
              <span
                className={`mt-0.5 block text-[11px] font-medium ${
                  selected
                    ? isHero
                      ? "text-[var(--ink)]/70"
                      : "text-white/80"
                    : isHero
                      ? "text-white/55"
                      : "text-[var(--steel)]"
                }`}
              >
                {clip.hint}
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`campaign-panel-${active.id}`}
        aria-labelledby={`campaign-tab-${active.id}`}
        className={`overflow-hidden ${
          isHero
            ? "rounded-2xl border border-white/15 bg-black shadow-2xl"
            : "max-w-3xl rounded-2xl border border-[var(--line)] bg-black"
        }`}
      >
        <video
          key={active.src}
          className="aspect-video w-full"
          controls
          playsInline
          preload="metadata"
          poster={active.poster}
          aria-label={active.ariaLabel}
        >
          <source src={active.src} type="video/mp4" />
        </video>
      </div>

      <div className={`mt-3 flex flex-wrap gap-3 ${isHero ? "" : ""}`}>
        <a
          href={active.src}
          download
          className={
            isHero
              ? "btn-outline border-white/30 text-white hover:bg-white/10"
              : "btn-outline"
          }
        >
          Download {active.label} MP4
        </a>
      </div>
    </div>
  );
}
