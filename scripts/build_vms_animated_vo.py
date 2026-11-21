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
VOICE = "en-IN-NeerjaExpressiveNeural"

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
        "id": "scan",
        "scene": "scan",
        "text": (
            "At the gate, security scans the visitor QR pass. "
            "The guard verifies identity in real time before allowing entry."
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


def draw_person(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    *,
    scale: float = 1.0,
    body: tuple[int, int, int] = TEAL,
    walking: bool = False,
    t: float = 0.0,
    facing: int = 1,
    label: str | None = None,
    badge: bool = False,
) -> None:
    """Stylized visitor / security figure with optional walk cycle."""
    s = scale
    head_r = int(28 * s)
    phase = t * 12
    bob = int(8 * s * abs(math.sin(phase))) if walking else 0
    swing = int(32 * s * math.sin(phase)) if walking else 0
    cx = x
    cy = y + bob

    # shadow
    draw.ellipse(
        [cx - int(48 * s), cy + int(215 * s), cx + int(48 * s), cy + int(238 * s)],
        fill=(15, 22, 32),
    )

    # articulated legs (thigh + shin) for clearer walk
    hip_y = cy + int(118 * s)
    knee_l_x = cx - int(10 * s) - int(swing * 0.55) * facing
    knee_r_x = cx + int(10 * s) + int(swing * 0.55) * facing
    knee_y = cy + int(165 * s)
    foot_l_x = cx - int(10 * s) - swing * facing
    foot_r_x = cx + int(10 * s) + swing * facing
    foot_y = cy + int(215 * s)
    leg_w = max(5, int(10 * s))
    draw.line([cx - int(10 * s), hip_y, knee_l_x, knee_y], fill=SILVER, width=leg_w)
    draw.line([knee_l_x, knee_y, foot_l_x, foot_y], fill=SILVER, width=leg_w)
    draw.line([cx + int(10 * s), hip_y, knee_r_x, knee_y], fill=SILVER, width=leg_w)
    draw.line([knee_r_x, knee_y, foot_r_x, foot_y], fill=SILVER, width=leg_w)
    # shoes
    draw.ellipse([foot_l_x - int(14 * s), foot_y - 4, foot_l_x + int(10 * s), foot_y + int(12 * s)], fill=(30, 30, 40))
    draw.ellipse([foot_r_x - int(10 * s), foot_y - 4, foot_r_x + int(14 * s), foot_y + int(12 * s)], fill=(30, 30, 40))

    # body
    draw.rounded_rectangle(
        [cx - int(36 * s), cy + int(40 * s), cx + int(36 * s), cy + int(130 * s)],
        radius=int(18 * s),
        fill=body,
    )
    # swinging arms
    arm_y = cy + int(70 * s)
    arm_swing = int(28 * s * math.sin(phase + math.pi)) if walking else 0
    draw.line(
        [cx - int(36 * s), arm_y, cx - int(70 * s) * facing, arm_y + int(35 * s) + arm_swing],
        fill=body,
        width=max(4, int(11 * s)),
    )
    draw.line(
        [cx + int(36 * s), arm_y, cx + int(60 * s) * facing, arm_y + int(20 * s) - arm_swing],
        fill=body,
        width=max(4, int(11 * s)),
    )

    # head
    draw.ellipse([cx - head_r, cy - head_r, cx + head_r, cy + head_r], fill=(245, 230, 210))
    draw.pieslice([cx - head_r, cy - head_r - 4, cx + head_r, cy + 8], start=200, end=340, fill=(40, 40, 50))

    if badge:
        draw.rounded_rectangle(
            [cx - int(18 * s), cy + int(55 * s), cx + int(18 * s), cy + int(78 * s)],
            radius=4,
            fill=GOLD,
        )

    if label:
        f = font(FONT_BOLD, max(14, int(18 * s)))
        tw, th = text_size(draw, label, f)
        ly = cy + int(245 * s)
        draw.rounded_rectangle(
            [cx - tw // 2 - 10, ly, cx + tw // 2 + 10, ly + th + 12],
            radius=8,
            fill=(12, 28, 48),
            outline=GOLD,
            width=2,
        )
        draw.text((cx - tw // 2, ly + 5), label, font=f, fill=WHITE)


def draw_scanner_gun(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    *,
    beam_len: int = 0,
    beam_on: bool = False,
    angle_down: bool = True,
) -> None:
    """Handheld QR scanner held by security."""
    # body
    draw.rounded_rectangle([x, y, x + 90, y + 44], radius=10, fill=(30, 36, 48), outline=GOLD, width=2)
    draw.rectangle([x + 70, y + 8, x + 110, y + 36], fill=TEAL)
    # handle
    draw.rounded_rectangle([x + 20, y + 40, x + 48, y + 95], radius=6, fill=(50, 55, 70))
    if beam_on and beam_len > 0:
        # scanning laser / beam toward visitor QR
        x2 = x - beam_len if angle_down else x + beam_len
        y2 = y + 20 + (30 if angle_down else -10)
        for i in range(3):
            draw.line([x, y + 18 + i, x2, y2 + i], fill=(0, 220, 180) if i == 1 else (0, 140, 120), width=2)
        # hit sparkle
        draw.ellipse([x2 - 8, y2 - 8, x2 + 8, y2 + 8], fill=TEAL)


def draw_phone_pass(draw: ImageDraw.ImageDraw, x: int, y: int, *, scan_t: float = 0.0) -> None:
    """Visitor phone showing QR pass."""
    draw.rounded_rectangle([x, y, x + 110, y + 190], radius=16, fill=(20, 24, 32), outline=GOLD, width=2)
    draw.rounded_rectangle([x + 8, y + 22, x + 102, y + 170], radius=8, fill=WHITE)
    # mini QR
    for r in range(5):
        for c in range(5):
            if (r + c) % 2 == 0 or (r < 2 and c < 2):
                draw.rectangle(
                    [x + 28 + c * 12, y + 55 + r * 12, x + 36 + c * 12, y + 63 + r * 12],
                    fill=NAVY,
                )
    sy = y + 40 + int(110 * ((scan_t * 0.9) % 1.0))
    draw.line([x + 16, sy, x + 94, sy], fill=TEAL, width=2)


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

    # Visitor walks up to kiosk / tablet
    visitor_x = int(lerp(200, 380, ease_out(min(1.0, local_t / 1.5))))
    draw_person(
        draw,
        visitor_x,
        420,
        scale=1.15,
        body=TEAL,
        walking=local_t < 1.5,
        t=local_t,
        facing=1,
        label="Visitor",
    )

    # Animated form card (kiosk)
    card_x, card_y, card_w, card_h = 560, 180, 980, 620
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, fill=(12, 28, 48))
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, outline=GOLD, width=2)
    draw.text((card_x + 40, card_y + 24), "Spot Registration Kiosk", font=font(FONT_BOLD, 22), fill=GOLD)

    fields = ["Visitor Name", "Mobile Number", "Host / Invitee", "Purpose of Visit", "Expected Time"]
    for i, label in enumerate(fields):
        fy = card_y + 80 + i * 90
        fill_amt = ease_out(max(0.0, min(1.0, (local_t - 0.4 - i * 0.35) / 0.5)))
        draw.text((card_x + 60, fy), label, font=font(FONT_REG, 20), fill=MUTED)
        draw.rounded_rectangle(
            [card_x + 60, fy + 28, card_x + card_w - 60, fy + 68],
            radius=10,
            outline=SILVER,
            width=2,
        )
        fill_w = int((card_w - 160) * fill_amt)
        if fill_w > 8:
            draw.rounded_rectangle(
                [card_x + 70, fy + 38, card_x + 70 + fill_w, fy + 58],
                radius=4,
                fill=TEAL,
            )

    if local_t > 2.2:
        cx, cy = card_x + card_w - 90, card_y + 80
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

    size = 300
    qx, qy = 720, 220
    reveal = ease_out(min(1.0, local_t / 1.5))
    draw.rounded_rectangle([qx - 24, qy - 24, qx + size + 24, qy + size + 24], radius=24, fill=(255, 255, 255))

    modules = 12
    cell = size // modules
    for r in range(modules):
        for c in range(modules):
            show = (r + c * 0.2) / modules < reveal
            if not show:
                continue
            is_finder = (r < 3 and c < 3) or (r < 3 and c > modules - 4) or (r > modules - 4 and c < 3)
            on = is_finder or ((r * 7 + c * 13) % 5 != 0)
            if on:
                draw.rectangle(
                    [qx + c * cell + 2, qy + r * cell + 2, qx + (c + 1) * cell - 2, qy + (r + 1) * cell - 2],
                    fill=NAVY,
                )

    scan_y = qy + int(size * ((local_t * 0.7) % 1.0))
    draw.line([qx, scan_y, qx + size, scan_y], fill=TEAL, width=4)

    # Visitor walks in from left and receives digital pass on phone
    vx = int(lerp(180, 420, ease_out(min(1.0, local_t / 1.6))))
    draw_person(draw, vx, 420, scale=1.15, body=TEAL, walking=local_t < 1.6, t=local_t, facing=1, label="Visitor")
    if local_t > 1.2:
        draw_phone_pass(draw, vx + 55, 480, scan_t=local_t)

    center_text(draw, "QR visitor pass generated", 780, font(FONT_BOLD, 40), WHITE)
    center_text(draw, "Paperless · Verified · Instant", 840, font(FONT_REG, 26), SILVER)
    progress_bar(draw, global_t / total)
    return img


def scene_scan(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    """Gate security scans the visitor's QR pass with handheld scanner."""
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 03 · Security QR Scan at Gate")

    # Boom barrier / gate frame
    draw.rectangle([160, 240, 200, 820], fill=SILVER)
    draw.rectangle([1720, 240, 1760, 820], fill=SILVER)
    barrier_angle = ease_out(min(1.0, max(0.0, (local_t - 4.0) / 1.2)))  # lifts after verified
    # horizontal barrier arm
    arm_y = int(lerp(320, 200, barrier_angle))
    draw.rectangle([200, arm_y, 1720, arm_y + 28], fill=GOLD)
    for i in range(8):
        draw.rectangle([240 + i * 180, arm_y, 320 + i * 180, arm_y + 28], fill=RED if i % 2 == 0 else WHITE)

    # Visitor walks toward guard with phone pass
    visitor_x = int(lerp(280, 720, ease_out(min(1.0, local_t / 2.2))))
    walking = local_t < 2.2
    draw_person(
        draw,
        visitor_x,
        430,
        scale=1.2,
        body=TEAL,
        walking=walking,
        t=local_t,
        facing=1,
        label="Visitor",
    )
    draw_phone_pass(draw, visitor_x + 60, 500, scan_t=local_t)

    # Security officer with scanner
    guard_x = 1180
    draw_person(
        draw,
        guard_x,
        410,
        scale=1.25,
        body=(35, 55, 95),
        walking=False,
        t=local_t,
        facing=-1,
        label="Security",
        badge=True,
    )
    # scanner in hand + laser beam toward visitor phone
    beam_on = 1.2 < local_t < 4.2
    beam_len = int(lerp(80, 280, ease_out(min(1.0, (local_t - 1.2) / 0.8)))) if beam_on else 0
    # pulse beam
    if beam_on:
        beam_len = int(beam_len + 20 * math.sin(local_t * 12))
    draw_scanner_gun(draw, guard_x - 130, 520, beam_len=beam_len, beam_on=beam_on, angle_down=True)

    # Verification HUD
    if local_t > 2.0:
        hud_x, hud_y = 700, 180
        draw.rounded_rectangle([hud_x, hud_y, hud_x + 520, hud_y + 150], radius=16, fill=(12, 28, 48), outline=TEAL, width=2)
        status = "Scanning QR…" if local_t < 3.2 else "Verified · Entry allowed"
        color = TEAL if local_t < 3.2 else GREEN
        draw.text((hud_x + 28, hud_y + 30), "GATE SCANNER", font=font(FONT_BOLD, 20), fill=GOLD)
        draw.text((hud_x + 28, hud_y + 70), status, font=font(FONT_BOLD, 28), fill=color)
        # progress dots
        for i in range(5):
            on = (local_t * 4 + i) % 5 < 3
            draw.ellipse(
                [hud_x + 28 + i * 28, hud_y + 115, hud_x + 42 + i * 28, hud_y + 129],
                fill=color if on else (40, 55, 75),
            )

    if local_t > 4.0:
        center_text(draw, "Security scan complete — visitor cleared", 900, font(FONT_BOLD, 34), GREEN)
    else:
        center_text(draw, "Security scans visitor QR pass at the gate", 900, font(FONT_BOLD, 34), WHITE)

    progress_bar(draw, global_t / total)
    return img


def scene_arrival(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 04 · Arrival & Approval SOS")

    gate_x = 320
    draw.rectangle([gate_x, 280, gate_x + 40, 780], fill=SILVER)
    draw.rectangle([gate_x + 700, 280, gate_x + 740, 780], fill=SILVER)
    draw.rectangle([gate_x, 260, gate_x + 740, 290], fill=GOLD)

    visitor_x = int(lerp(gate_x + 80, gate_x + 360, ease_out(min(1.0, local_t / 1.8))))
    draw_person(
        draw,
        visitor_x,
        430,
        scale=1.15,
        body=TEAL,
        walking=local_t < 1.8,
        t=local_t,
        facing=1,
        label="Visitor",
    )
    draw_phone_pass(draw, visitor_x + 55, 500, scan_t=local_t)

    # Security observes at gate
    draw_person(
        draw,
        gate_x + 620,
        420,
        scale=1.1,
        body=(35, 55, 95),
        walking=False,
        t=local_t,
        facing=-1,
        label="Security",
        badge=True,
    )

    if local_t > 1.2:
        pulse = 0.5 + 0.5 * math.sin(local_t * 8)
        px, py = 1220, 280
        draw.rounded_rectangle([px, py, px + 420, py + 520], radius=36, fill=(18, 24, 36), outline=GOLD, width=3)
        draw.rounded_rectangle([px + 18, py + 50, px + 402, py + 470], radius=20, fill=(245, 248, 252))
        alert_h = int(120 + 10 * pulse)
        draw.rounded_rectangle([px + 40, py + 100, px + 380, py + 100 + alert_h], radius=16, fill=RED)
        draw.text((px + 70, py + 125), "SOS ALERT", font=font(FONT_BOLD, 28), fill=WHITE)
        draw.text((px + 70, py + 165), "Visitor arrived", font=font(FONT_REG, 22), fill=WHITE)
        draw.text((px + 70, py + 200), "Approve entry?", font=font(FONT_REG, 20), fill=(80, 90, 110))
        draw.rounded_rectangle([px + 50, py + 360, px + 200, py + 420], radius=12, fill=GREEN)
        draw.rounded_rectangle([px + 220, py + 360, px + 370, py + 420], radius=12, fill=RED)
        draw.text((px + 85, py + 378), "Approve", font=font(FONT_BOLD, 20), fill=WHITE)
        draw.text((px + 260, py + 378), "Deny", font=font(FONT_BOLD, 20), fill=WHITE)

    center_text(draw, "Invitee / host notified for approval", 900, font(FONT_BOLD, 34), WHITE)
    progress_bar(draw, global_t / total)
    return img


def scene_zone(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 05 · Restricted Zone SOS")

    draw.rounded_rectangle([200, 220, 900, 820], radius=20, fill=(20, 40, 65), outline=TEAL, width=3)
    draw.text((240, 250), "Allowed Zone", font=font(FONT_BOLD, 28), fill=TEAL)

    draw.rounded_rectangle([980, 220, 1700, 820], radius=20, fill=(70, 20, 25), outline=RED, width=3)
    draw.text((1040, 250), "RESTRICTED ZONE", font=font(FONT_BOLD, 28), fill=RED)

    t = ease_in_out(min(1.0, local_t / 2.5))
    vx = int(lerp(360, 1250, t))
    draw_person(
        draw,
        vx,
        480,
        scale=1.05,
        body=GOLD,
        walking=True,
        t=local_t,
        facing=1,
        label="Visitor",
    )

    # Security monitoring from allowed zone
    draw_person(
        draw,
        320,
        500,
        scale=1.0,
        body=(35, 55, 95),
        walking=False,
        t=local_t,
        facing=1,
        label="Security",
        badge=True,
    )

    if t > 0.55:
        pulse = 0.5 + 0.5 * math.sin(local_t * 10)
        draw.ellipse(
            [
                1200 - int(40 + 20 * pulse),
                360 - int(40 + 20 * pulse),
                1200 + int(40 + 20 * pulse),
                360 + int(40 + 20 * pulse),
            ],
            outline=RED,
            width=4,
        )
        draw.polygon([(1200, 300), (1260, 410), (1140, 410)], fill=RED)
        draw.rectangle([1194, 330, 1206, 370], fill=WHITE)
        draw.ellipse([1194, 378, 1206, 390], fill=WHITE)
        center_text(draw, "SOS: Visitor entered restricted zone", 900, font(FONT_BOLD, 34), RED)
    else:
        center_text(draw, "Tracking visitor movement…", 900, font(FONT_BOLD, 34), SILVER)

    progress_bar(draw, global_t / total)
    return img


def scene_longstay(bg: Image.Image, local_t: float, global_t: float, total: float) -> Image.Image:
    img = darken(bg, 0.34).copy()
    draw = ImageDraw.Draw(img)
    draw_header(img, "Feature 06 · Long-Stay SOS")

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
    draw_header(img, "Feature 07 · Checkout by QR Scan")

    # Exit gate
    draw.rectangle([200, 260, 240, 820], fill=SILVER)
    draw.rectangle([1680, 260, 1720, 820], fill=SILVER)

    # Visitor walks to exit with phone pass
    visitor_x = int(lerp(400, 780, ease_out(min(1.0, local_t / 1.8))))
    draw_person(
        draw,
        visitor_x,
        420,
        scale=1.2,
        body=TEAL,
        walking=local_t < 1.8,
        t=local_t,
        facing=1,
        label="Visitor",
    )
    draw_phone_pass(draw, visitor_x + 60, 500, scan_t=local_t)

    # Security scans at exit
    guard_x = 1200
    draw_person(
        draw,
        guard_x,
        400,
        scale=1.25,
        body=(35, 55, 95),
        walking=False,
        t=local_t,
        facing=-1,
        label="Security",
        badge=True,
    )
    beam_on = local_t > 1.0
    beam_len = int(220 + 25 * math.sin(local_t * 10)) if beam_on else 0
    draw_scanner_gun(draw, guard_x - 140, 510, beam_len=beam_len, beam_on=beam_on, angle_down=True)

    if local_t > 2.2:
        draw.ellipse([860, 200, 980, 320], fill=GREEN)
        draw.line([890, 260, 920, 290], fill=WHITE, width=6)
        draw.line([920, 290, 960, 230], fill=WHITE, width=6)
        center_text(draw, "Visit closed · Checkout complete", 900, font(FONT_BOLD, 36), GREEN)
    else:
        center_text(draw, "Security scans QR for checkout…", 900, font(FONT_BOLD, 36), SILVER)

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
    "scan": scene_scan,
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
