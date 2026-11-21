#!/usr/bin/env python3
"""Animated Visitor Management campaign video with Edge TTS voice-over."""

from __future__ import annotations

import asyncio
import math
import subprocess
import wave
from pathlib import Path

import edge_tts
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "campaigns"
WORK = Path("/tmp/vms-animated")
ARTIFACT = Path("/opt/cursor/artifacts/visitor-management-animated-vo.mp4")
BG_PATH = Path("/opt/cursor/artifacts/assets/vms-campaign-bg.jpg")
QR_PATH = Path("/opt/cursor/artifacts/assets/vms-campaign-qr.jpg")
LOGO_PATH = ROOT / "public" / "brand" / "smartpatrol-logo.jpg"

W, H = 1920, 1080
FPS = 24
VOICE = "en-IN-PrabhatNeural"

NAVY = (8, 28, 58)
GOLD = (212, 175, 85)
SILVER = (220, 228, 236)
WHITE = (255, 255, 255)
TEAL = (56, 168, 170)
MUTED = (170, 186, 204)
RED = (210, 55, 55)
GREEN = (46, 170, 110)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# Narration segments (spoken text). Timing comes from actual TTS duration.
SEGMENTS = [
    {
        "id": "open",
        "scene": "open",
        "text": (
            "Welcome to Smart Patrol Visitor Management System, "
            "powered by CloudGen Technologies."
        ),
    },
    {
        "id": "register",
        "scene": "register",
        "text": (
            "Start with pre-registration or spot registration at the gate. "
            "Capture visitor details quickly and securely."
        ),
    },
    {
        "id": "qr",
        "scene": "qr",
        "text": (
            "Generate a QR code visitor pass instantly, "
            "so entry is paperless and verified."
        ),
    },
    {
        "id": "arrival",
        "scene": "arrival",
        "text": (
            "When the visitor arrives, Smart Patrol triggers an S O S alert "
            "to the invitee or host for approval."
        ),
    },
    {
        "id": "zone",
        "scene": "zone",
        "text": (
            "If a visitor moves into a restricted zone, "
            "security receives an immediate S O S alert."
        ),
    },
    {
        "id": "longstay",
        "scene": "longstay",
        "text": (
            "If a visitor stays too long inside the premises, "
            "long-stay S O S alerts keep your team informed."
        ),
    },
    {
        "id": "checkout",
        "scene": "checkout",
        "text": (
            "Checkout is simple. Scan the visitor QR code to close the visit securely."
        ),
    },
    {
        "id": "close",
        "scene": "close",
        "text": (
            "Powered by CloudGen Technologies, Madurai. "
            "Call plus ninety-one, eight two four eight three, five nine seven nine six, "
            "or visit cloudgen technologies dot com. "
            "Smart Patrol — smarter solutions, safer communities."
        ),
    },
]


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def text_size(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def center_text(draw, text, y, fnt, fill=WHITE, max_width=1500) -> int:
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
    line_h = text_size(draw, "Ag", fnt)[1] + 12
    for i, line in enumerate(lines):
        tw, _ = text_size(draw, line, fnt)
        draw.text(((W - tw) // 2, y + i * line_h), line, font=fnt, fill=fill)
    return len(lines) * line_h


def load_cover(path: Path) -> Image.Image:
    img = Image.open(path).convert("RGB")
    scale = max(W / img.width, H / img.height)
    img = img.resize((math.ceil(img.width * scale), math.ceil(img.height * scale)), Image.Resampling.LANCZOS)
    left = (img.width - W) // 2
    top = (img.height - H) // 2
    return img.crop((left, top, left + W, top + H))


def darken(img: Image.Image, factor: float = 0.35) -> Image.Image:
    return ImageEnhance.Brightness(img).enhance(factor)


def rounded_logo(size: int = 160) -> Image.Image:
    logo = Image.open(LOGO_PATH).convert("RGBA")
    logo = logo.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=24, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(logo, (0, 0), mask)
    return out


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def ease_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def ease_in_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 3 * t * t - 2 * t * t * t


def progress_bar(draw, t: float, y: int = H - 48) -> None:
    draw.rounded_rectangle([80, y, W - 80, y + 10], radius=5, fill=(40, 55, 75))
    w = int((W - 160) * max(0.0, min(1.0, t)))
    if w > 0:
        draw.rounded_rectangle([80, y, 80 + w, y + 10], radius=5, fill=GOLD)


def draw_header(img: Image.Image, subtitle: str = "Visitor Management") -> None:
    draw = ImageDraw.Draw(img)
    logo = rounded_logo_cached(72)
    img.paste(logo, (64, 40), logo)
    draw.text((156, 48), "SmartPatrol", font=font(FONT_BOLD, 28), fill=WHITE)
    draw.text((156, 84), subtitle, font=font(FONT_REG, 18), fill=SILVER)


def scene_open(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.32 + 0.05 * math.sin(local_t * 2)).copy()
    draw = ImageDraw.Draw(img)
    # Pulsing glow ring
    pulse = 0.5 + 0.5 * math.sin(local_t * 4)
    r = int(130 + 20 * pulse)
    cx, cy = W // 2, 320
    for i in range(4):
        rr = r + i * 18
        draw.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], outline=GOLD, width=2)

    logo = rounded_logo_cached(int(150 + 10 * pulse))
    img.paste(logo, (cx - logo.width // 2, cy - logo.height // 2), logo)

    appear = ease_out(min(1.0, local_t / 1.2))
    y_off = int((1 - appear) * 40)
    badge = "CLOUDGEN TECHNOLOGIES"
    f = font(FONT_BOLD, 22)
    tw, th = text_size(draw, badge, f)
    by = 470 + y_off
    draw.rounded_rectangle(
        [(W - tw) // 2 - 20, by, (W + tw) // 2 + 20, by + th + 18],
        radius=999,
        outline=GOLD,
        width=2,
    )
    draw.text(((W - tw) // 2, by + 8), badge, font=f, fill=GOLD)

    center_text(draw, "Visitor Management System", 530 + y_off, font(FONT_BOLD, 58), WHITE)
    center_text(
        draw,
        "AI-Powered Smart Patrol Solutions",
        620 + y_off,
        font(FONT_REG, 28),
        SILVER,
    )
    progress_bar(draw, global_t / total)
    return img


def scene_register(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 01 · Pre / Spot Registration")

    # Animated form card
    card_x, card_y, card_w, card_h = 460, 180, 1000, 620
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, fill=(12, 28, 48))
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, outline=GOLD, width=2)

    fields = ["Visitor Name", "Mobile Number", "Host / Invitee", "Purpose of Visit", "Expected Time"]
    for i, label in enumerate(fields):
        fy = card_y + 70 + i * 90
        fill_amt = ease_out(max(0.0, min(1.0, (local_t - i * 0.35) / 0.5)))
        draw.text((card_x + 60, fy), label, font=font(FONT_REG, 20), fill=MUTED)
        draw.rounded_rectangle(
            [card_x + 60, fy + 28, card_x + card_w - 60, fy + 68],
            radius=10,
            outline=SILVER,
            width=2,
        )
        # typing fill
        fill_w = int((card_w - 160) * fill_amt)
        if fill_w > 8:
            draw.rounded_rectangle(
                [card_x + 70, fy + 38, card_x + 70 + fill_w, fy + 58],
                radius=4,
                fill=TEAL,
            )

    # Checkmark when complete
    if local_t > 2.0:
        p = ease_out(min(1.0, (local_t - 2.0) / 0.4))
        cx, cy = card_x + card_w - 90, card_y + 70
        draw.ellipse([cx - 28, cy - 28, cx + 28, cy + 28], fill=GREEN)
        draw.line([cx - 12, cy, cx - 2, cy + 12], fill=WHITE, width=4)
        draw.line([cx - 2, cy + 12, cx + 14, cy - 10], fill=WHITE, width=4)
        draw.text((card_x + 60, card_y + card_h - 70), "Registered", font=font(FONT_BOLD, 28), fill=GREEN)

    progress_bar(draw, global_t / total)
    return img


def scene_qr(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(qr_bg(), 0.3).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 02 · QR Code Visitor Pass")

    size = 360
    qx, qy = (W - size) // 2, 250
    reveal = ease_out(min(1.0, local_t / 1.5))
    draw.rounded_rectangle([qx - 30, qy - 30, qx + size + 30, qy + size + 30], radius=28, fill=(255, 255, 255))

    # Fake QR modules revealing row by row
    modules = 13
    cell = size // modules
    for r in range(modules):
        for c in range(modules):
            show = (r + c * 0.2) / modules < reveal
            if not show:
                continue
            # finder patterns + random-ish modules
            is_finder = (r < 3 and c < 3) or (r < 3 and c > modules - 4) or (r > modules - 4 and c < 3)
            on = is_finder or ((r * 7 + c * 13) % 5 != 0)
            if on:
                draw.rectangle(
                    [qx + c * cell + 2, qy + r * cell + 2, qx + (c + 1) * cell - 2, qy + (r + 1) * cell - 2],
                    fill=NAVY,
                )

    # Scan line
    scan_y = qy + int(size * ((local_t * 0.7) % 1.0))
    draw.line([qx, scan_y, qx + size, scan_y], fill=TEAL, width=4)

    center_text(draw, "QR visitor pass generated", 700, font(FONT_BOLD, 40), WHITE)
    center_text(draw, "Paperless · Verified · Instant", 760, font(FONT_REG, 26), SILVER)
    progress_bar(draw, global_t / total)
    return img


def scene_arrival(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 03 · Arrival & Approval SOS")

    # Gate / visitor approaching
    gate_x = 420
    draw.rectangle([gate_x, 280, gate_x + 40, 780], fill=SILVER)
    draw.rectangle([gate_x + 900, 280, gate_x + 940, 780], fill=SILVER)
    draw.rectangle([gate_x, 260, gate_x + 940, 290], fill=GOLD)

    visitor_x = int(lerp(gate_x + 80, gate_x + 420, ease_out(min(1.0, local_t / 1.8))))
    # person icon
    draw.ellipse([visitor_x, 470, visitor_x + 50, 520], fill=WHITE)
    draw.rounded_rectangle([visitor_x - 10, 525, visitor_x + 60, 650], radius=20, fill=TEAL)

    # Phone notification for host
    if local_t > 1.2:
        p = ease_out(min(1.0, (local_t - 1.2) / 0.5))
        pulse = 0.5 + 0.5 * math.sin(local_t * 8)
        px, py = 1180, 320
        draw.rounded_rectangle([px, py, px + 420, py + 520], radius=36, fill=(18, 24, 36), outline=GOLD, width=3)
        # screen
        draw.rounded_rectangle([px + 18, py + 50, px + 402, py + 470], radius=20, fill=(245, 248, 252))
        alert_h = int(120 + 10 * pulse)
        draw.rounded_rectangle([px + 40, py + 100, px + 380, py + 100 + alert_h], radius=16, fill=RED)
        draw.text((px + 70, py + 125), "SOS ALERT", font=font(FONT_BOLD, 28), fill=WHITE)
        draw.text((px + 70, py + 165), "Visitor arrived", font=font(FONT_REG, 22), fill=WHITE)
        draw.text((px + 70, py + 200), "Approve entry?", font=font(FONT_REG, 20), fill=SILVER)
        # buttons
        draw.rounded_rectangle([px + 50, py + 360, px + 200, py + 420], radius=12, fill=GREEN)
        draw.rounded_rectangle([px + 220, py + 360, px + 370, py + 420], radius=12, fill=RED)
        draw.text((px + 85, py + 378), "Approve", font=font(FONT_BOLD, 20), fill=WHITE)
        draw.text((px + 260, py + 378), "Deny", font=font(FONT_BOLD, 20), fill=WHITE)
        # fade in via overlay darkening reverse - approximate by drawing already

    center_text(draw, "Invitee / host notified for approval", 860, font(FONT_BOLD, 34), WHITE)
    progress_bar(draw, global_t / total)
    return img


def scene_zone(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 04 · Restricted Zone SOS")

    # Floor plan style zones
    draw.rounded_rectangle([200, 220, 900, 820], radius=20, fill=(20, 40, 65), outline=TEAL, width=3)
    draw.text((240, 250), "Allowed Zone", font=font(FONT_BOLD, 28), fill=TEAL)

    draw.rounded_rectangle([980, 220, 1700, 820], radius=20, fill=(70, 20, 25), outline=RED, width=3)
    draw.text((1040, 250), "RESTRICTED ZONE", font=font(FONT_BOLD, 28), fill=RED)

    # moving visitor
    t = ease_in_out(min(1.0, local_t / 2.5))
    vx = int(lerp(360, 1250, t))
    vy = 520
    draw.ellipse([vx, vy, vx + 54, vy + 54], fill=WHITE)
    draw.rounded_rectangle([vx - 8, vy + 58, vx + 62, vy + 170], radius=18, fill=GOLD)

    if t > 0.55:
        pulse = 0.5 + 0.5 * math.sin(local_t * 10)
        draw.ellipse([1200 - int(40 + 20 * pulse), 400 - int(40 + 20 * pulse), 1200 + int(40 + 20 * pulse), 400 + int(40 + 20 * pulse)], outline=RED, width=4)
        draw.polygon([(1200, 340), (1260, 450), (1140, 450)], fill=RED)
        draw.rectangle([1194, 370, 1206, 410], fill=WHITE)
        draw.ellipse([1194, 418, 1206, 430], fill=WHITE)
        center_text(draw, "SOS: Visitor entered restricted zone", 900, font(FONT_BOLD, 34), RED)
    else:
        center_text(draw, "Tracking visitor movement…", 900, font(FONT_BOLD, 34), SILVER)

    progress_bar(draw, global_t / total)
    return img


def scene_longstay(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 05 · Long-Stay SOS")

    # Large clock
    cx, cy, r = W // 2, 480, 220
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD, width=8)
    draw.ellipse([cx - r + 20, cy - r + 20, cx + r - 20, cy + r - 20], outline=SILVER, width=2)

    # Hands spinning fast then alert
    angle = local_t * 2.2
    hx = cx + int(math.sin(angle) * (r - 60))
    hy = cy - int(math.cos(angle) * (r - 60))
    mx = cx + int(math.sin(angle * 8) * (r - 100))
    my = cy - int(math.cos(angle * 8) * (r - 100))
    draw.line([cx, cy, hx, hy], fill=WHITE, width=8)
    draw.line([cx, cy, mx, my], fill=TEAL, width=4)
    draw.ellipse([cx - 10, cy - 10, cx + 10, cy + 10], fill=GOLD)

    # Duration counter
    mins = int(min(180, 20 + local_t * 40))
    center_text(draw, f"Inside premises: {mins} min", 740, font(FONT_BOLD, 40), WHITE)

    if local_t > 1.5:
        pulse = 0.5 + 0.5 * math.sin(local_t * 9)
        draw.rounded_rectangle(
            [W // 2 - 320, 820, W // 2 + 320, 920],
            radius=18,
            fill=RED if pulse > 0.3 else (140, 30, 30),
        )
        center_text(draw, "SOS: Long stay detected", 848, font(FONT_BOLD, 32), WHITE)

    progress_bar(draw, global_t / total)
    return img


def scene_checkout(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(qr_bg(), 0.3).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 06 · Checkout by QR Scan")

    size = 300
    qx, qy = 520, 300
    draw.rounded_rectangle([qx - 20, qy - 20, qx + size + 20, qy + size + 20], radius=20, fill=WHITE)
    modules = 11
    cell = size // modules
    for r in range(modules):
        for c in range(modules):
            on = ((r * 5 + c * 9) % 4 != 0) or (r < 2 and c < 2)
            if on:
                draw.rectangle(
                    [qx + c * cell + 1, qy + r * cell + 1, qx + (c + 1) * cell - 1, qy + (r + 1) * cell - 1],
                    fill=NAVY,
                )

    # Scanner phone moving in
    t = ease_out(min(1.0, local_t / 1.4))
    px = int(lerp(1500, 1050, t))
    py = 280
    draw.rounded_rectangle([px, py, px + 280, py + 520], radius=30, fill=(20, 24, 32), outline=GOLD, width=3)
    draw.rounded_rectangle([px + 16, py + 40, px + 264, py + 460], radius=16, fill=(230, 236, 242))
    scan = 0.5 + 0.5 * math.sin(local_t * 6)
    draw.line([px + 40, py + 120 + int(200 * ((local_t * 0.8) % 1)), px + 240, py + 120 + int(200 * ((local_t * 0.8) % 1))], fill=TEAL, width=4)

    if local_t > 1.6:
        draw.ellipse([px + 90, py + 280, px + 190, py + 380], fill=GREEN)
        draw.line([px + 115, py + 330, px + 135, py + 350], fill=WHITE, width=5)
        draw.line([px + 135, py + 350, px + 170, py + 300], fill=WHITE, width=5)
        center_text(draw, "Visit closed · Checkout complete", 860, font(FONT_BOLD, 36), GREEN)
    else:
        center_text(draw, "Scanning visitor QR pass…", 860, font(FONT_BOLD, 36), SILVER)

    progress_bar(draw, global_t / total)
    return img


def scene_close(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.32).copy()
    draw = ImageDraw.Draw(img)
    appear = ease_out(min(1.0, local_t / 0.8))
    y_off = int((1 - appear) * 30)

    logo = rounded_logo_cached(140)
    img.paste(logo, ((W - logo.width) // 2, 60 + y_off), logo)
    center_text(draw, "CloudGen Technologies", 230 + y_off, font(FONT_BOLD, 48), WHITE)
    center_text(draw, "SmartPatrol | AI-Powered Smart Patrol Solutions", 300 + y_off, font(FONT_REG, 26), GOLD)

    lines = [
        "No. 3/634, Kalvi Nagar North, Alampatti,",
        "Nagamalai Pudukottai, Madurai, Tamil Nadu, India",
        "",
        "Mobile: +91 82483 59796",
        "Email: ravit@cloudgentechnologies.com",
        "Website: www.cloudgentechnologies.com",
        "",
        "Workforce Management | Security Operations | CCTV AI Analytics | Incident Management",
    ]
    y = 380 + y_off
    for line in lines:
        if not line:
            y += 16
            continue
        fill = TEAL if "Workforce" in line else SILVER
        size = 20 if "Workforce" in line else 24
        center_text(draw, line, y, font(FONT_REG, size), fill, max_width=1700)
        y += 36 if size == 24 else 32

    progress_bar(draw, global_t / total)
    return img


SCENE_FN = {
    "open": scene_open,
    "register": scene_register,
    "qr": scene_qr,
    "arrival": scene_arrival,
    "zone": scene_zone,
    "longstay": scene_longstay,
    "checkout": scene_checkout,
    "close": scene_close,
}

_QR_BG: Image.Image | None = None
_LOGO_CACHE: dict[int, Image.Image] = {}


def qr_bg() -> Image.Image:
    global _QR_BG
    if _QR_BG is None:
        _QR_BG = load_cover(QR_PATH)
    return _QR_BG


def rounded_logo_cached(size: int = 160) -> Image.Image:
    if size not in _LOGO_CACHE:
        _LOGO_CACHE[size] = rounded_logo(size)
    return _LOGO_CACHE[size].copy()


async def synth_segment(text: str, out_mp3: Path) -> None:
    communicate = edge_tts.Communicate(text, VOICE, rate="-5%")
    await communicate.save(str(out_mp3))


def mp3_to_wav(mp3: Path, wav: Path) -> float:
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(mp3), "-ar", "44100", "-ac", "1", str(wav)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    with wave.open(str(wav), "rb") as w:
        return w.getnframes() / float(w.getframerate())


def concat_wavs(wavs: list[Path], out: Path, gap_sec: float = 0.35) -> list[tuple[str, float, float]]:
    """Return timeline (scene_id, start, duration) after concat with gaps.

    Each scene's visual duration includes the following silence gap so the
    end-card never flashes between narrated segments.
    """
    frames: list[bytes] = []
    timeline: list[tuple[str, float, float]] = []
    rate = 44100
    gap = b"\x00\x00" * int(rate * gap_sec)
    t = 0.0
    for i, (seg, wav) in enumerate(zip(SEGMENTS, wavs)):
        with wave.open(str(wav), "rb") as w:
            assert w.getframerate() == rate
            data = w.readframes(w.getnframes())
            dur = w.getnframes() / float(rate)
        is_last = i == len(SEGMENTS) - 1
        visual_dur = dur if is_last else dur + gap_sec
        timeline.append((seg["scene"], t, visual_dur))
        frames.append(data)
        if not is_last:
            frames.append(gap)
            t += dur + gap_sec
        else:
            t += dur
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(b"".join(frames))
    return timeline


def render_frames(bg: Image.Image, timeline: list[tuple[str, float, float]], frames_dir: Path) -> int:
    frames_dir.mkdir(parents=True, exist_ok=True)
    total = timeline[-1][1] + timeline[-1][2]
    n_frames = int(math.ceil(total * FPS))
    # Preload logo once
    for i in range(n_frames):
        global_t = i / FPS
        # find scene
        scene = timeline[-1][0]
        local_t = global_t - timeline[-1][1]
        for sid, start, dur in timeline:
            if start <= global_t < start + dur + 0.0001:
                scene = sid
                local_t = global_t - start
                break
        fn = SCENE_FN[scene]
        img = fn(bg, local_t, global_t, total)
        img.save(frames_dir / f"frame_{i:05d}.jpg", quality=88, optimize=True)
        if i % 60 == 0:
            print(f"  rendered {i}/{n_frames} ({100 * i / n_frames:.0f}%)")
    print(f"  rendered {n_frames}/{n_frames} (100%)")
    return n_frames


def encode(frames_dir: Path, audio_wav: Path, out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(frames_dir / "frame_%05d.jpg"),
            "-i",
            str(audio_wav),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-shortest",
            "-movflags",
            "+faststart",
            str(out),
        ],
        check=True,
    )


async def main_async() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    audio_dir = WORK / "audio"
    audio_dir.mkdir(exist_ok=True)
    frames_dir = WORK / "frames"
    if frames_dir.exists():
        for p in frames_dir.glob("*.jpg"):
            p.unlink()
    frames_dir.mkdir(exist_ok=True)

    print("Synthesizing voice-over…")
    wavs: list[Path] = []
    for seg in SEGMENTS:
        mp3 = audio_dir / f"{seg['id']}.mp3"
        wav = audio_dir / f"{seg['id']}.wav"
        await synth_segment(seg["text"], mp3)
        dur = mp3_to_wav(mp3, wav)
        print(f"  {seg['id']}: {dur:.2f}s")
        wavs.append(wav)

    full_wav = WORK / "narration.wav"
    timeline = concat_wavs(wavs, full_wav, gap_sec=0.4)
    total = timeline[-1][1] + timeline[-1][2]
    print(f"Total narration: {total:.1f}s")

    bg = load_cover(BG_PATH)
    print("Rendering animated frames…")
    render_frames(bg, timeline, frames_dir)

    site_out = OUT_DIR / "visitor-management-animated-vo.mp4"
    print("Encoding MP4…")
    encode(frames_dir, full_wav, site_out)
    ARTIFACT.write_bytes(site_out.read_bytes())

    # Poster from ~2s
    poster = OUT_DIR / "visitor-management-animated-vo-poster.jpg"
    subprocess.run(
        ["ffmpeg", "-y", "-ss", "2", "-i", str(site_out), "-frames:v", "1", str(poster)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    print(f"Wrote {site_out} ({site_out.stat().st_size} bytes)")
    print(f"Wrote {ARTIFACT}")


def main() -> None:
    # Fix accidental syntax from drafting — validate SCENE open compiles
    asyncio.run(main_async())


if __name__ == "__main__":
    main()
