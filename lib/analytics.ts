/**
 * Public Measurement ID.
 * G-03VV49ENRJ returns 404 from googletagmanager.com/gtag/js (invalid/deleted).
 * Use the live stream ID that Google actually serves.
 */
export const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-LMFLM3M2DL";
