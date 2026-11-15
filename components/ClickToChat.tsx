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
              WhatsApp or live chat with CloudGen sales
            </p>
          </div>
          <div className="flex flex-col p-2">
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-[var(--ink)] hover:bg-[#e8f8ef]"
              onClick={() => setOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
                <WhatsAppIcon />
              </span>
              WhatsApp
            </a>
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

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M20.5 3.5A11.9 11.9 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.65a11.86 11.86 0 0 0 5.76 1.47h.01c6.55 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.47-8.42ZM12.07 21.15h-.01a9.24 9.24 0 0 1-4.71-1.29l-.34-.2-3.74.98 1-3.64-.22-.37a9.23 9.23 0 0 1-1.41-4.92c0-5.1 4.15-9.25 9.26-9.25 2.47 0 4.8.96 6.55 2.71a9.2 9.2 0 0 1 2.7 6.55c0 5.1-4.15 9.25-9.24 9.25Zm5.07-6.93c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.62.14-.18.27-.71.9-.87 1.08-.16.18-.32.2-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.38-1.64-1.54-1.92-.16-.27-.02-.42.12-.55.13-.13.28-.32.42-.49.14-.16.18-.27.28-.46.09-.18.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.35-.25.27-.96.94-.96 2.3 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.67 4.14.65.28 1.16.45 1.56.57.65.2 1.25.18 1.72.11.52-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.07-.11-.25-.18-.53-.32Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 5v2h10V9H7Zm0 4v2h7v-2H7Z" />
    </svg>
  );
}
