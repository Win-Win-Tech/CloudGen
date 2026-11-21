#!/usr/bin/env python3
"""Build CloudGen Visitor Management System campaign video (16:9 MP4)."""

from __future__ import annotations

import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "campaigns"
WORK = Path("/tmp/vms-campaign")
ARTIFACT = Path("/opt/cursor/artifacts/visitor-management-campaign.mp4")

BG_PATH = Path("/opt/cursor/artifacts/assets/vms-campaign-bg.jpg")
QR_PATH = Path("/opt/cursor/artifacts/assets/vms-campaign-qr.jpg")
LOGO_PATH = ROOT / "public" / "brand" / "smartpatrol-logo.jpg"

W, H = 1920, 1080
FPS = 30

NAVY = (8, 28, 58)
NAVY_SOFT = (14, 42, 78)
GOLD = (212, 175, 85)
SILVER = (220, 228, 236)
WHITE = (255, 255, 255)
TEAL = (56, 168, 170)
MUTED = (170, 186, 204)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
if not Path(FONT_SERIF).exists():
    FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def load_cover(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGB")
    scale = max(W / img.width, H / img.height)
    img = img.resize((math.ceil(img.width * scale), math.ceil(img.height * scale)), Image.Resampling.LANCZOS)
    left = (img.width - W) // 2
    top = (img.height - H) // 2
    return img.crop((left, top, left + W, top + H))


def darken(img: Image.Image, factor: float = 0.42) -> Image.Image:
    return ImageEnhance.Brightness(img).enhance(factor)


def vignette(base: Image.Image) -> Image.Image:
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for i in range(180):
        alpha = int(140 * (i / 180) ** 1.6)
        d.rectangle([i, i, W - 1 - i, H - 1 - i], outline=(0, 0, 0, alpha))
    return Image.alpha_composite(base.convert("RGBA"), overlay).convert("RGB")


def rounded_logo(size: int = 180) -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo = logo.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=28, fill=255)
    out = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    out.paste(logo, (0, 0), mask)
    return out


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def center_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    fnt: ImageFont.FreeTypeFont,
    fill=WHITE,
    max_width: int = 1600,
) -> int:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for word in words:
        trial = f"{cur} {word}".strip()
        if text_size(draw, trial, fnt)[0] <= max_width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    line_h = text_size(draw, "Ag", fnt)[1] + 14
    for i, line in enumerate(lines):
        tw, _ = text_size(draw, line, fnt)
        draw.text(((W - tw) // 2, y + i * line_h), line, font=fnt, fill=fill)
    return len(lines) * line_h


def accent_bar(draw: ImageDraw.ImageDraw, y: int, width: int = 140) -> None:
    x = (W - width) // 2
    draw.rounded_rectangle([x, y, x + width, y + 6], radius=3, fill=GOLD)


def badge(draw: ImageDraw.ImageDraw, label: str, y: int = 70) -> None:
    f = font(FONT_BOLD, 22)
    tw, th = text_size(draw, label, f)
    pad_x, pad_y = 22, 10
    x0 = (W - tw) // 2 - pad_x
    y0 = y
    x1 = x0 + tw + pad_x * 2
    y1 = y0 + th + pad_y * 2
    draw.rounded_rectangle([x0, y0, x1, y1], radius=999, outline=GOLD, width=2)
    draw.text((x0 + pad_x, y0 + pad_y - 2), label, font=f, fill=GOLD)


def feature_icon(draw: ImageDraw.ImageDraw, kind: str, cx: int, cy: int, r: int = 54) -> None:
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD, width=3)
    draw.ellipse([cx - r + 8, cy - r + 8, cx + r - 8, cy + r - 8], outline=SILVER, width=1)
    if kind == "register":
        draw.rectangle([cx - 22, cy - 28, cx + 22, cy + 28], outline=WHITE, width=3)
        draw.line([cx - 12, cy - 10, cx + 12, cy - 10], fill=WHITE, width=2)
        draw.line([cx - 12, cy, cx + 12, cy], fill=WHITE, width=2)
        draw.line([cx - 12, cy + 10, cx + 6, cy + 10], fill=WHITE, width=2)
    elif kind == "qr":
        for i in range(3):
            for j in range(3):
                if (i + j) % 2 == 0:
                    draw.rectangle(
                        [cx - 18 + i * 12, cy - 18 + j * 12, cx - 10 + i * 12, cy - 10 + j * 12],
                        fill=WHITE,
                    )
        draw.rectangle([cx - 24, cy - 24, cx - 8, cy - 8], outline=WHITE, width=2)
        draw.rectangle([cx + 8, cy - 24, cx + 24, cy - 8], outline=WHITE, width=2)
        draw.rectangle([cx - 24, cy + 8, cx - 8, cy + 24], outline=WHITE, width=2)
    elif kind == "sos":
        draw.polygon(
            [(cx, cy - 28), (cx + 24, cy + 20), (cx - 24, cy + 20)],
            outline=GOLD,
            fill=(180, 40, 40),
        )
        draw.rectangle([cx - 3, cy - 10, cx + 3, cy + 6], fill=WHITE)
        draw.ellipse([cx - 3, cy + 10, cx + 3, cy + 16], fill=WHITE)
    elif kind == "zone":
        draw.rectangle([cx - 26, cy - 18, cx + 26, cy + 18], outline=WHITE, width=3)
        draw.line([cx - 26, cy, cx + 26, cy], fill=GOLD, width=2)
        draw.line([cx, cy - 18, cx, cy + 18], fill=GOLD, width=2)
        draw.ellipse([cx - 8, cy - 8, cx + 8, cy + 8], outline=WHITE, width=2)
    elif kind == "timer":
        draw.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], outline=WHITE, width=3)
        draw.line([cx, cy, cx, cy - 14], fill=GOLD, width=3)
        draw.line([cx, cy, cx + 12, cy + 6], fill=WHITE, width=3)
        draw.rectangle([cx - 6, cy - 28, cx + 6, cy - 22], fill=GOLD)
    elif kind == "checkout":
        draw.arc([cx - 24, cy - 24, cx + 24, cy + 24], start=40, end=320, fill=WHITE, width=4)
        draw.polygon([(cx + 10, cy - 22), (cx + 26, cy - 10), (cx + 8, cy - 8)], fill=GOLD)


def make_base(bg: Image.Image) -> Image.Image:
    return vignette(darken(bg, 0.38))


def slide_open(bg: Image.Image) -> Image.Image:
    img = make_base(bg)
    draw = ImageDraw.Draw(img)
    logo = rounded_logo(200)
    img.paste(logo, ((W - 200) // 2, 180), logo)
    badge(draw, "CLOUDGEN TECHNOLOGIES", 420)
    h = center_text(draw, "Visitor Management System", 490, font(FONT_BOLD, 64), WHITE)
    accent_bar(draw, 490 + h + 18, 160)
    center_text(
        draw,
        "SmartPatrol  ·  AI-Powered Smart Patrol Solutions",
        490 + h + 50,
        font(FONT_REG, 28),
        SILVER,
    )
    center_text(
        draw,
        "Workforce Management  |  Security Operations  |  CCTV AI Analytics  |  Incident Management",
        490 + h + 100,
        font(FONT_REG, 20),
        MUTED,
        max_width=1700,
    )
    return img


def slide_feature(
    bg: Image.Image,
    step: str,
    title: str,
    subtitle: str,
    icon: str,
) -> Image.Image:
    img = make_base(bg)
    draw = ImageDraw.Draw(img)
    logo = rounded_logo(96)
    img.paste(logo, (70, 50), logo)
    draw.text((190, 70), "SmartPatrol Visitor", font=font(FONT_BOLD, 28), fill=WHITE)
    draw.text((190, 108), "CloudGen Technologies", font=font(FONT_REG, 20), fill=SILVER)

    badge(draw, step, 250)
    feature_icon(draw, icon, W // 2, 420, 62)
    h = center_text(draw, title, 530, font(FONT_BOLD, 52), WHITE, max_width=1500)
    accent_bar(draw, 530 + h + 16, 120)
    center_text(draw, subtitle, 530 + h + 50, font(FONT_REG, 28), SILVER, max_width=1400)
    return img


def slide_close(bg: Image.Image) -> Image.Image:
    img = make_base(bg)
    draw = ImageDraw.Draw(img)
    logo = rounded_logo(150)
    img.paste(logo, ((W - 150) // 2, 70), logo)
    center_text(draw, "CloudGen Technologies", 250, font(FONT_BOLD, 48), WHITE)
    accent_bar(draw, 320, 140)
    center_text(draw, "SmartPatrol | AI-Powered Smart Patrol Solutions", 350, font(FONT_REG, 26), GOLD)

    lines = [
        "No. 3/634, Kalvi Nagar North, Alampatti,",
        "Nagamalai Pudukottai, Madurai, Tamil Nadu, India",
        "",
        "Mobile: +91 82483 59796",
        "Email: ravit@cloudgentechnologies.com",
        "Website: https://www.cloudgentechnologies.com/",
        "",
        "Workforce Management | Security Operations | CCTV AI Analytics | Incident Management",
    ]
    y = 420
    for line in lines:
        if not line:
            y += 18
            continue
        fill = SILVER if "Website" in line or "Email" in line or "Mobile" in line else MUTED
        if "Workforce" in line:
            fill = TEAL
            center_text(draw, line, y, font(FONT_REG, 20), fill, max_width=1700)
            y += 40
        else:
            center_text(draw, line, y, font(FONT_REG, 24 if "Mobile" in line or "Email" in line else 22), fill)
            y += 38
    return img


def write_slide(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, quality=95)


def encode_video(slides: list[tuple[Path, float]], out: Path) -> None:
    """Encode each slide, then xfade-chain them."""
    parts: list[Path] = []
    for i, (slide, duration) in enumerate(slides):
        part = WORK / f"part_{i:02d}.mp4"
        # Gentle Ken Burns zoom
        frames = max(int(duration * FPS), 1)
        z_end = 1.08
        # zoompan z expression: linear from 1 to z_end
        # d = frames; s = WxH
        vf = (
            f"scale=8000:-1,"
            f"zoompan=z='1+({z_end}-1)*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
            f"d={frames}:s={W}x{H}:fps={FPS},"
            f"format=yuv420p"
        )
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-loop",
                "1",
                "-i",
                str(slide),
                "-vf",
                vf,
                "-t",
                f"{duration:.2f}",
                "-c:v",
                "libx264",
                "-pix_fmt",
                "yuv420p",
                "-r",
                str(FPS),
                str(part),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        parts.append(part)

    # xfade between parts
    if len(parts) == 1:
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(parts[0].read_bytes())
        return

    fade = 0.6
    # Build filter_complex
    inputs: list[str] = []
    for p in parts:
        inputs.extend(["-i", str(p)])

    # offset = cumulative duration - fade * n
    durations = [d for _, d in slides]
    filter_parts = []
    current = "[0:v]"
    offset = durations[0] - fade
    for i in range(1, len(parts)):
        out_label = f"[v{i}]" if i < len(parts) - 1 else "[vout]"
        filter_parts.append(
            f"{current}[{i}:v]xfade=transition=fade:duration={fade}:offset={offset:.3f}{out_label}"
        )
        current = out_label
        if i < len(parts) - 1:
            offset += durations[i] - fade

    filter_complex = ";".join(filter_parts)
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg",
        "-y",
        *inputs,
        "-filter_complex",
        filter_complex,
        "-map",
        "[vout]",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        str(out),
    ]
    subprocess.run(cmd, check=True)


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    bg = load_cover(BG_PATH)
    qr_bg = load_cover(QR_PATH)

    slides_spec = [
        ("00_open.jpg", slide_open(bg), 4.5),
        (
            "01_register.jpg",
            slide_feature(
                bg,
                "FEATURE 01",
                "Pre / Spot Registration",
                "Register visitors ahead of arrival or instantly at the gate",
                "register",
            ),
            4.2,
        ),
        (
            "02_qr.jpg",
            slide_feature(
                qr_bg,
                "FEATURE 02",
                "QR Code Visitor Pass",
                "Generate secure digital passes for seamless entry",
                "qr",
            ),
            4.2,
        ),
        (
            "03_arrival.jpg",
            slide_feature(
                bg,
                "FEATURE 03",
                "Arrival & Approval SOS Alerts",
                "Notify invitee / host instantly when a visitor arrives for approval",
                "sos",
            ),
            4.5,
        ),
        (
            "04_zone.jpg",
            slide_feature(
                bg,
                "FEATURE 04",
                "Restricted Zone SOS Alerts",
                "Trigger SOS when a visitor moves into a restricted area",
                "zone",
            ),
            4.5,
        ),
        (
            "05_longstay.jpg",
            slide_feature(
                bg,
                "FEATURE 05",
                "Long-Stay SOS Alerts",
                "Alert security when visitors remain inside premises too long",
                "timer",
            ),
            4.5,
        ),
        (
            "06_checkout.jpg",
            slide_feature(
                qr_bg,
                "FEATURE 06",
                "Checkout by QR Scan",
                "Close the visit securely by scanning the visitor QR pass",
                "checkout",
            ),
            4.2,
        ),
        ("07_close.jpg", slide_close(bg), 7.0),
    ]

    encoded: list[tuple[Path, float]] = []
    for name, img, dur in slides_spec:
        path = WORK / name
        write_slide(img, path)
        encoded.append((path, dur))

    site_out = OUT_DIR / "visitor-management-campaign.mp4"
    encode_video(encoded, site_out)
    ARTIFACT.parent.mkdir(parents=True, exist_ok=True)
    ARTIFACT.write_bytes(site_out.read_bytes())
    print(f"Wrote {site_out} ({site_out.stat().st_size} bytes)")
    print(f"Wrote {ARTIFACT}")


if __name__ == "__main__":
    main()
