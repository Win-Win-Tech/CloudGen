# Face biometric lip-sync campaign assets

Source plates + narration for a **real talking / walking / app-demo** campaign.

## Why HeyGen is required

Cursor Cloud has no GPU for local Wav2Lip / SadTalker. True lip-sync and human motion need an avatar video API (HeyGen recommended).

## Generate

1. Create a HeyGen account and API key: https://www.heygen.com/
2. Add secret `HEYGEN_API_KEY` to this Cloud Agent environment (Cursor → Cloud Agents → Secrets) **or** export it in your shell.
3. Optional: `HEYGEN_VOICE_ID` for a specific Indian English female voice.
4. Run:

```bash
HEYGEN_API_KEY=... node scripts/heygen-face-attendance-campaign.mjs
```

This renders four lip-synced scenes (talk → walk → phone demo → CTA), stitches them, and writes:

- `public/campaigns/face-biometric-attendance-lipsync.mp4`
- `public/campaigns/face-biometric-attendance-lipsync-poster.jpg`

Then open a PR to swap the campaign page to the lipsync file.

## Shot list

| Scene | Plate | Action |
| --- | --- | --- |
| talking | `presenter-talking.jpg` | Lip-sync intro to camera |
| walking | `presenter-walking.jpg` | Walk toward gate with phone |
| demo | `presenter-demo-phone.jpg` | Live face punch demo on Guards app |
| close | `presenter-talking.jpg` | CTA + CloudGen contact details |
