"use client";

import { useState } from "react";
import { openTawkChat } from "@/components/TawkTo";
import { site } from "@/lib/site";

export function ClickToChat() {
  const [open, setOpen] = useState(false);
  const [openingTawk, setOpeningTawk] = useState(false);

  async function openTawk() {
    setOpeningTawk(true);
    try {
      await openTawkChat();
      setOpen(false);
    } finally {
      setOpeningTawk(false);
    }
  }

  return (
    <div className="fixed bottom-5 left-5 z-[60] flex flex-col items-start gap-3">
      {open ? (
        <div className="card-panel w-64 overflow-hidden p-0 shadow-xl">
          <div className="border-b border-[var(--line)] bg-[#f8fafc] px-4 py-3">
            <p className="text-sm font-bold text-[var(--ink)]">Click to chat</p>
            <p className="text-xs text-[var(--steel)]">
              Live chat or email CloudGen sales
            </p>
          </div>
          <div className="flex flex-col p-2">
            <button
              type="button"
              onClick={() => void openTawk()}
              disabled={openingTawk}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-semibold text-[var(--ink)] hover:bg-[#eef6ff] disabled:opacity-60"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--teal)] text-white">
                <ChatIcon />
              </span>
              {openingTawk ? "Opening chat…" : "Live chat (Tawk.to)"}
            </button>
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[#f4f7fb]"
              onClick={() => setOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-bold text-white">
                @
              </span>
              {site.email}
            </a>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close chat options" : "Click to chat"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--orange)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[var(--orange-deep)]"
      >
        <ChatIcon />
        {open ? "Close" : "Click to chat"}
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 5v2h10V9H7Zm0 4v2h7v-2H7Z" />
    </svg>
  );
}
