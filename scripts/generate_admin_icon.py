import os
from PIL import Image, ImageDraw, ImageFont

def create_admin_icon():
    base_logo_path = r"d:\App devlepment\mushiqr-pro\public\logo.webp"
    if not os.path.exists(base_logo_path):
        print(f"Error: {base_logo_path} does not exist")
        return

    # Load base image and convert to RGBA
    img = Image.open(base_logo_path).convert("RGBA")
    size = 512
    img = img.resize((size, size), Image.Resampling.LANCZOS)

    # Create overlay layer
    overlay = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # We want a prominent golden ADMIN shield badge on the bottom-right
    # Badge dimensions
    badge_w = 260
    badge_h = 96
    badge_x = size - badge_w - 24 # 228
    badge_y = size - badge_h - 24 # 392
    r = 28 # Corner radius

    # Shadow
    shadow_color = (0, 0, 0, 160)
    for offset in range(6, 0, -2):
        draw.rounded_rectangle(
            [badge_x - offset, badge_y - offset, badge_x + badge_w + offset, badge_y + badge_h + offset],
            radius=r + offset,
            fill=(0, 0, 0, 30)
        )
    draw.rounded_rectangle(
        [badge_x, badge_y + 4, badge_x + badge_w, badge_y + badge_h + 4],
        radius=r,
        fill=shadow_color
    )

    # Gold Pill Background
    # Draw gradient or rich gold base with dark border
    draw.rounded_rectangle(
        [badge_x, badge_y, badge_x + badge_w, badge_y + badge_h],
        radius=r,
        fill=(245, 158, 11, 255), # Vivid Gold Amber
        outline=(255, 255, 255, 240),
        width=4
    )

    # Inner subtle border
    draw.rounded_rectangle(
        [badge_x + 3, badge_y + 3, badge_x + badge_w - 3, badge_y + badge_h - 3],
        radius=r - 2,
        outline=(253, 224, 71, 200),
        width=2
    )

    # Draw Shield Icon on left of the badge
    # Shield coordinates inside badge
    shield_cx = badge_x + 48
    shield_cy = badge_y + badge_h // 2
    
    # Shield shape points
    # Top-left, top-right, bottom-center arc
    shield_w = 34
    shield_h = 42
    sx1 = shield_cx - shield_w // 2
    sx2 = shield_cx + shield_w // 2
    sy1 = shield_cy - shield_h // 2
    sy2 = shield_cy + shield_h // 2
    
    shield_points = [
        (sx1, sy1),
        (sx2, sy1),
        (sx2, sy1 + 18),
        (shield_cx, sy2),
        (sx1, sy1 + 18)
    ]
    draw.polygon(shield_points, fill=(15, 18, 33, 255)) # Dark navy
    
    # Shield inner highlight (Star or mini check or V)
    inner_shield = [
        (sx1 + 4, sy1 + 4),
        (sx2 - 4, sy1 + 4),
        (sx2 - 4, sy1 + 16),
        (shield_cx, sy2 - 4),
        (sx1 + 4, sy1 + 16)
    ]
    draw.polygon(inner_shield, fill=(245, 158, 11, 255))
    
    # Inner dark core
    core_shield = [
        (sx1 + 8, sy1 + 8),
        (sx2 - 8, sy1 + 8),
        (sx2 - 8, sy1 + 14),
        (shield_cx, sy2 - 8),
        (sx1 + 8, sy1 + 14)
    ]
    draw.polygon(core_shield, fill=(15, 18, 33, 255))

    # Try loading a nice bold system font or fallback
    font = None
    for font_name in ["arialbd.ttf", "segoeuib.ttf", "arial.ttf", "calibrib.ttf", "HelveticaBold"]:
        try:
            font = ImageFont.truetype(font_name, 44)
            break
        except:
            continue
    if font is None:
        font = ImageFont.load_default()

    # Draw "ADMIN" text
    text = "ADMIN"
    text_x = badge_x + 88
    text_y = badge_y + 24
    
    # Text shadow
    draw.text((text_x + 1, text_y + 1), text, fill=(255, 255, 255, 120), font=font)
    draw.text((text_x, text_y), text, fill=(15, 18, 33, 255), font=font)

    # Composite overlay onto base image
    result = Image.alpha_composite(img, overlay)

    # Output paths
    output_dirs = [
        r"d:\App devlepment\mushiqr-pro\public",
        r"d:\App devlepment\mushiqr-pro\admin\public"
    ]

    for d in output_dirs:
        os.makedirs(d, exist_ok=True)
        # 512x512 PNG & WebP
        result.save(os.path.join(d, "admin-logo.png"), "PNG")
        result.save(os.path.join(d, "admin-logo.webp"), "WEBP", quality=95)
        result.save(os.path.join(d, "admin-logo-512.png"), "PNG")
        
        # 192x192 PNG & WebP
        res_192 = result.resize((192, 192), Image.Resampling.LANCZOS)
        res_192.save(os.path.join(d, "admin-logo-192.png"), "PNG")
        res_192.save(os.path.join(d, "admin-logo-192.webp"), "WEBP", quality=95)
        
        # apple-touch-icon 180x180
        res_180 = result.resize((180, 180), Image.Resampling.LANCZOS)
        res_180.save(os.path.join(d, "apple-touch-icon.png"), "PNG")

    print("Successfully generated all admin raster and PWA icons!")

if __name__ == "__main__":
    create_admin_icon()
