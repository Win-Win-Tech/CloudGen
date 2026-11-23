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
      visitor?: Record<string, string>;
    };
    Tawk_LoadStart?: Date;
    __tawkLoading?: boolean;
    __tawkLoaded?: boolean;
  }
}

function embedSrc() {
  return `https://embed.tawk.to/${site.tawkPropertyId}/${site.tawkWidgetId}`;
}

/**
 * Load Tawk once (safe for React Strict Mode / route changes).
 *
 * Important: Country Restriction in the Tawk dashboard (Administration →
 * Chat Widget → Availability Restriction) returns HTTP 403 on embed.tawk.to
 * for blocked regions. Those visitors never appear in Monitoring. Keep
 * Country Restriction OFF (or empty) so Tamil Nadu, rest of India, and
 * international visitors all list.
 */
export function loadTawk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!site.tawkPropertyId || !site.tawkWidgetId) return Promise.resolve();

  if (window.__tawkLoaded && window.Tawk_API?.maximize) {
    return Promise.resolve();
  }

  if (window.__tawkLoading) {
    return new Promise((resolve, reject) => {
      const started = Date.now();
      const check = () => {
        if (window.__tawkLoaded) {
          resolve();
          return;
        }
        if (Date.now() - started > 15000) {
          reject(new Error("Timed out waiting for Tawk.to"));
          return;
        }
        window.setTimeout(check, 100);
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
    // Official Tawk embed attribute (required by their snippet).
    script.setAttribute("crossorigin", "*");
    script.onload = () => {
      window.__tawkLoaded = true;
      window.__tawkLoading = false;
      // Ensure the bubble is visible when the property allows this region.
      try {
        window.Tawk_API?.showWidget?.();
      } catch {
        // ignore
      }
      resolve();
    };
    script.onerror = () => {
      window.__tawkLoading = false;
      // Common cause: Tawk Country Restriction → Cloudflare 403 on embed.tawk.to
      reject(
        new Error(
          "Failed to load Tawk.to (check Chat Widget → Country Restriction is OFF)",
        ),
      );
    };

    // Insert like the official snippet so the script runs as early as possible.
    const first = document.getElementsByTagName("script")[0];
    if (first?.parentNode) {
      first.parentNode.insertBefore(script, first);
    } else {
      document.body.appendChild(script);
    }
  });
}

export async function openTawkChat() {
  try {
    await loadTawk();
    // Widget API may need a tick after script load.
    const tryMaximize = (attempts = 0) => {
      if (window.Tawk_API?.maximize) {
        window.Tawk_API.showWidget?.();
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
 * Load the Tawk chat widget on every page so visitors worldwide appear in
 * Monitoring (when Country Restriction is disabled in the Tawk dashboard).
 */
export function TawkTo() {
  useEffect(() => {
    if (!site.tawkPropertyId || !site.tawkWidgetId) return;

    let cancelled = false;
    const run = () => {
      if (!cancelled) void loadTawk().catch(() => undefined);
    };

    // Load immediately — idle delay caused short visits (esp. international)
    // to bounce before the embed registered them in Monitoring.
    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
