#!/usr/bin/env node
/**
 * Generate a lip-synced talking + walking SmartPatrol campaign via HeyGen.
 *
 * Requires: HEYGEN_API_KEY
 * Optional: HEYGEN_VOICE_ID (defaults to an English female voice if listed)
 *
 * Usage:
 *   HEYGEN_API_KEY=... node scripts/heygen-face-attendance-campaign.mjs
 *
 * Outputs:
 *   public/campaigns/face-biometric-attendance-lipsync.mp4
 *   public/campaigns/face-biometric-attendance-lipsync-poster.jpg
 */

import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const assets = path.join(__dirname, "campaign-assets");
const outDir = path.join(root, "public", "campaigns");
const apiKey = process.env.HEYGEN_API_KEY?.trim();

if (!apiKey) {
  console.error(
    "Missing HEYGEN_API_KEY. Add it in Cursor Cloud Agent secrets / your shell, then re-run.",
  );
  process.exit(1);
}

const SCENES = [
  {
    id: "talking",
    image: "presenter-talking.jpg",
    script: `Hi, I'm with CloudGen Technologies. Today I'll show you SmartPatrol face biometric attendance on the Guards mobile app — the way your security and facility teams actually use it on site.`,
    motion_prompt:
      "Natural talking-head interview. Subtle head nods, eye blinks, friendly professional delivery to camera.",
  },
  {
    id: "walking",
    image: "presenter-walking.jpg",
    script: `First, walk up to the gate with the Guards Android app ready. Stay inside the site geofence so the punch counts.`,
    motion_prompt:
      "Woman walking forward toward a factory gate holding a phone, natural walking gait, documentary commercial style.",
  },
  {
    id: "demo",
    image: "presenter-demo-phone.jpg",
    script: `Open the app, look at the camera, and punch in with your face. No password. No buddy punching. SmartPatrol checks liveness so the punch is real.`,
    motion_prompt:
      "Presenter holding phone up for face scan while speaking and demonstrating attendance punch, natural hand and head motion.",
  },
  {
    id: "close",
    image: "presenter-talking.jpg",
    script: `Supervisors see attendance live across factories, campuses, hospitals, and multi-site deployments — ready for payroll and audits. Stop paper registers. Start face biometric attendance with CloudGen SmartPatrol. Call plus nine one eight two four eight three five nine seven nine six. Email ravit at cloudgentechnologies dot com. Or visit www dot cloudgentechnologies dot com.`,
    motion_prompt:
      "Confident talking-head close, CTA delivery, natural lip sync and gestures.",
  },
];

async function heygen(pathname, { method = "GET", body, formData } = {}) {
  const headers = { "X-Api-Key": apiKey };
  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`https://api.heygen.com${pathname}`, {
    method,
    headers,
    body: payload,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(
      `HeyGen ${method} ${pathname} → ${res.status}: ${text.slice(0, 800)}`,
    );
  }
  return json;
}

async function uploadAsset(filePath, contentType) {
  // HeyGen asset upload: get upload URL then PUT bytes (v1 assets)
  const name = path.basename(filePath);
  const buf = await readFile(filePath);
  const created = await heygen("/v1/asset", {
    method: "POST",
    body: undefined,
    formData: undefined,
  }).catch(() => null);

  // Prefer v2 talking photo / image URL via temporary hosting is hard.
  // Use /v1/asset with Content-Type header flow documented by HeyGen:
  const res = await fetch("https://upload.heygen.com/v1/asset", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": contentType,
    },
    body: buf,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Asset upload failed for ${name}: ${JSON.stringify(json)}`);
  }
  const assetId = json?.data?.id || json?.data?.asset_id;
  const url = json?.data?.url;
  if (!assetId && !url) {
    throw new Error(`No asset id for ${name}: ${JSON.stringify(json)}`);
  }
  return { assetId, url, name };
}

async function listVoices() {
  try {
    const data = await heygen("/v2/voices");
    return data?.data?.voices || data?.voices || [];
  } catch {
    return [];
  }
}

function pickVoice(voices) {
  const preferred = process.env.HEYGEN_VOICE_ID?.trim();
  if (preferred) return preferred;
  const enFemale =
    voices.find(
      (v) =>
        /en/i.test(v.language || v.locale || "") &&
        /female/i.test(v.gender || "") &&
        /india|indian|neerja|ananya|kavya/i.test(
          `${v.name || ""} ${v.language || ""} ${v.locale || ""}`,
        ),
    ) ||
    voices.find(
      (v) =>
        /en/i.test(v.language || v.locale || "") &&
        /female/i.test(v.gender || ""),
    );
  return enFemale?.voice_id || enFemale?.id || null;
}

async function createSceneVideo({ imageAsset, script, motion_prompt, voiceId }) {
  // HeyGen v2 generate with talking_photo character when possible.
  const character = imageAsset.assetId
    ? {
        type: "talking_photo",
        talking_photo_id: imageAsset.assetId,
      }
    : {
        type: "talking_photo",
        talking_photo_url: imageAsset.url,
      };

  const body = {
    video_inputs: [
      {
        character,
        voice: {
          type: "text",
          input_text: script,
          voice_id: voiceId,
        },
        background: {
          type: "color",
          value: "#0b1f36",
        },
      },
    ],
    dimension: { width: 1920, height: 1080 },
    aspect_ratio: "16:9",
    test: process.env.HEYGEN_TEST === "true",
  };

  // Attach motion prompt when API accepts it (Avatar IV+/photo).
  if (motion_prompt) {
    body.video_inputs[0].character.motion_prompt = motion_prompt;
  }

  const created = await heygen("/v2/video/generate", {
    method: "POST",
    body,
  });
  const videoId =
    created?.data?.video_id || created?.video_id || created?.data?.id;
  if (!videoId) {
    throw new Error(`No video_id: ${JSON.stringify(created)}`);
  }
  return videoId;
}

async function waitForVideo(videoId) {
  for (let i = 0; i < 90; i++) {
    await new Promise((r) => setTimeout(r, 10_000));
    const status = await heygen(`/v1/video_status.get?video_id=${videoId}`);
    const data = status?.data || status;
    const state = data?.status;
    console.log(`  [${videoId}] ${state}`);
    if (state === "completed") {
      return data.video_url || data.video_url_caption || data.url;
    }
    if (state === "failed" || state === "error") {
      throw new Error(`Video failed: ${JSON.stringify(data)}`);
    }
  }
  throw new Error(`Timed out waiting for ${videoId}`);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const voices = await listVoices();
  const voiceId = pickVoice(voices);
  if (!voiceId) {
    throw new Error(
      "Could not find a HeyGen voice. Set HEYGEN_VOICE_ID explicitly.",
    );
  }
  console.log("Using voice:", voiceId);

  const sceneFiles = [];
  for (const scene of SCENES) {
    console.log(`\nScene ${scene.id}: uploading ${scene.image}`);
    const imagePath = path.join(assets, scene.image);
    const imageAsset = await uploadAsset(imagePath, "image/jpeg");
    console.log("  asset:", imageAsset.assetId || imageAsset.url);
    console.log("  generating lip-sync video…");
    const videoId = await createSceneVideo({
      imageAsset,
      script: scene.script,
      motion_prompt: scene.motion_prompt,
      voiceId,
    });
    const url = await waitForVideo(videoId);
    const dest = path.join("/tmp", `heygen-${scene.id}.mp4`);
    await download(url, dest);
    sceneFiles.push(dest);
    console.log("  saved", dest);
  }

  // Stitch scenes + endcard still from existing poster if present
  const listPath = "/tmp/heygen-concat.txt";
  const listBody = sceneFiles.map((f) => `file '${f}'`).join("\n");
  await writeFile(listPath, listBody);
  const finalPath = path.join(outDir, "face-biometric-attendance-lipsync.mp4");
  const concat = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      finalPath,
    ],
    { encoding: "utf8" },
  );
  if (concat.status !== 0) {
    console.error(concat.stderr);
    throw new Error("ffmpeg concat failed");
  }

  // Poster = talking still
  await copyFile(
    path.join(assets, "presenter-talking.jpg"),
    path.join(outDir, "face-biometric-attendance-lipsync-poster.jpg"),
  );

  console.log("\nDone:");
  console.log(" ", finalPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
