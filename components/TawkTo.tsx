"use client";

import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Loads the same Tawk.to property used on cloudgentechnologies.com.
 * Property: 672866ff2480f5b4f59842aa · Widget: 1ibqt4mc1
 */
export function TawkTo() {
  if (!site.tawkPropertyId || !site.tawkWidgetId) return null;

  const src = `https://embed.tawk.to/${site.tawkPropertyId}/${site.tawkWidgetId}`;

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script");
          var s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = "${src}";
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
