"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

declare global {
  interface Window {
    Tawk_API?: {
      maximize?: () => void;
      toggle?: () => void;
      hideWidget?: () => void;
      showWidget?: () => void;
      onLoad?: () => void;
    };
    Tawk_LoadStart?: Date;
    __tawkLoading?: boolean;
    __tawkLoaded?: boolean;
  }
}

function embedSrc() {
  return `https://embed.tawk.to/${site.tawkPropertyId}/${site.tawkWidgetId}`;
}

/** Load Tawk once (safe for React Strict Mode / route changes). */
export function loadTawk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!site.tawkPropertyId || !site.tawkWidgetId) return Promise.resolve();

  if (window.__tawkLoaded && window.Tawk_API?.maximize) {
    return Promise.resolve();
  }

  if (window.__tawkLoading) {
    return new Promise((resolve) => {
      const check = () => {
        if (window.__tawkLoaded) resolve();
        else requestAnimationFrame(check);
      };
      check();
    });
  }

  window.__tawkLoading = true;
  window.Tawk_API = window.Tawk_API || {};
  window.Tawk_LoadStart = new Date();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-tawk-embed="true"]`,
    );
    if (existing) {
      window.__tawkLoaded = true;
      window.__tawkLoading = false;
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = embedSrc();
    script.charset = "UTF-8";
    script.dataset.tawkEmbed = "true";
    script.setAttribute("crossorigin", "*");
    script.onload = () => {
      window.__tawkLoaded = true;
      window.__tawkLoading = false;
      resolve();
    };
    script.onerror = () => {
      window.__tawkLoading = false;
      reject(new Error("Failed to load Tawk.to"));
    };
    document.body.appendChild(script);
  });
}

export async function openTawkChat() {
  try {
    await loadTawk();
    // Widget API may need a tick after script load.
    const tryMaximize = (attempts = 0) => {
      if (window.Tawk_API?.maximize) {
        window.Tawk_API.maximize();
        return;
      }
      if (attempts < 40) {
        window.setTimeout(() => tryMaximize(attempts + 1), 150);
      }
    };
    tryMaximize();
  } catch {
    // Ignore — WhatsApp remains available from Click to chat.
  }
}

/**
 * Prefetch Tawk in production only (avoids noisy Next.js console overlay in dev).
 */
export function TawkTo() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!site.tawkPropertyId || !site.tawkWidgetId) return;

    let cancelled = false;
    const run = () => {
      if (!cancelled) void loadTawk();
    };

    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    if (typeof window.requestIdleCallback === "function") {
      idleHandle = window.requestIdleCallback(run);
    } else {
      timeoutHandle = setTimeout(run, 1800);
    }

    return () => {
      cancelled = true;
      if (idleHandle != null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle != null) clearTimeout(timeoutHandle);
    };
  }, []);

  return null;
}
