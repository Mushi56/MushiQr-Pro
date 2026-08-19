from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps
import os

SOURCE_ICON = r"E:\Downloads\Mushi Qr Pro App Icon.png"
OUTPUT_DIR = "public"
RES_DIR = "android/app/src/main/res"

DENSITIES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FG_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}

def create_glassy_app_icon(source_path, target_size=1024):
    # Render at 2x super-sampling (2048x2048) for ultra-sharp, anti-aliased subpixel rendering
    scale = 2
    size = target_size * scale
    radius = int(size * 0.224) # Standard Android / iOS squircle curvature (22.4%)
    
    # 1. Create Squircle Mask
    mask = Image.new('L', (size, size), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=255)
    
    # 2. Base Frosted Glass Canvas
    base_bg = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # Generate diagonal soft white luminous gradient
    gradient = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_grad = ImageDraw.Draw(gradient)
    
    for y in range(size):
        for x in range(0, size, 4):
            diag = (x + y) / (size * 2)
            # Pure luminous white (255, 255, 255) to soft pearl slate (242, 246, 250)
            r = int(255 - diag * 13)
            g = int(255 - diag * 9)
            b = int(255 - diag * 5)
            draw_grad.rectangle([x, y, x + 3, y], fill=(r, g, b, 255))
    
    base_bg.paste(gradient, (0, 0))
    
    # 3. Light Color Taps (Soft glowing radial meshes)
    # Tap A: Top-Right Crimson / Coral Pink Glow (MushiQR brand color)
    glow_a = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_a = ImageDraw.Draw(glow_a)
    center_ax, center_ay = int(size * 0.80), int(size * 0.20)
    rad_a = int(size * 0.48)
    
    for r_step in range(rad_a, 0, -4):
        alpha = int(50 * (1.0 - (r_step / rad_a) ** 1.4))
        draw_a.ellipse(
            (center_ax - r_step, center_ay - r_step, center_ax + r_step, center_ay + r_step),
            fill=(244, 37, 85, alpha)
        )
    glow_a = glow_a.filter(ImageFilter.GaussianBlur(radius=int(22 * scale)))
    base_bg = Image.alpha_composite(base_bg, glow_a)
    
    # Tap B: Bottom-Left Electric Violet / Cyan Glow (Chromatism)
    glow_b = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_b = ImageDraw.Draw(glow_b)
    center_bx, center_by = int(size * 0.20), int(size * 0.80)
    rad_b = int(size * 0.44)
    
    for r_step in range(rad_b, 0, -4):
        alpha = int(38 * (1.0 - (r_step / rad_b) ** 1.4))
        draw_b.ellipse(
            (center_bx - r_step, center_by - r_step, center_bx + r_step, center_by + r_step),
            fill=(99, 102, 241, alpha)
        )
    glow_b = glow_b.filter(ImageFilter.GaussianBlur(radius=int(20 * scale)))
    base_bg = Image.alpha_composite(base_bg, glow_b)

    # Tap C: Bottom-Center Soft Golden Amber Sheen
    glow_c = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_c = ImageDraw.Draw(glow_c)
    center_cx, center_cy = int(size * 0.52), int(size * 0.86)
    rad_c = int(size * 0.36)
    
    for r_step in range(rad_c, 0, -4):
        alpha = int(28 * (1.0 - (r_step / rad_c) ** 1.5))
        draw_c.ellipse(
            (center_cx - r_step, center_cy - r_step, center_cx + r_step, center_cy + r_step),
            fill=(245, 158, 11, alpha)
        )
    glow_c = glow_c.filter(ImageFilter.GaussianBlur(radius=int(16 * scale)))
    base_bg = Image.alpha_composite(base_bg, glow_c)

    # 4. Glass Specular Light Reflection / Highlights
    specular = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_spec = ImageDraw.Draw(specular)
    draw_spec.polygon(
        [(0, 0), (size, 0), (size, int(size * 0.32)), (0, int(size * 0.60))],
        fill=(255, 255, 255, 38)
    )
    specular = specular.filter(ImageFilter.GaussianBlur(radius=int(32 * scale)))
    base_bg = Image.alpha_composite(base_bg, specular)
    
    # 5. Inner Border / Glass Bevel (Crisp frosted edge)
    inner_border = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw_border = ImageDraw.Draw(inner_border)
    border_w = int(2.5 * scale)
    draw_border.rounded_rectangle(
        (border_w, border_w, size - border_w - 1, size - border_w - 1),
        radius=radius - border_w,
        outline=(255, 255, 255, 220),
        width=border_w
    )
    base_bg = Image.alpha_composite(base_bg, inner_border)

    # 6. Overlay Foreground Logo with Floating 3D Drop Shadow
    logo_src = Image.open(source_path).convert("RGBA")
    
    # Trim empty transparent padding to center emblem perfectly
    bbox = logo_src.getbbox()
    if bbox:
        crop = logo_src.crop(bbox)
        w, h = crop.size
        max_dim = max(w, h)
        sq = Image.new('RGBA', (max_dim, max_dim), (0, 0, 0, 0))
        sq.paste(crop, ((max_dim - w) // 2, (max_dim - h) // 2))
        logo_src = sq

    # Scale logo emblem to fit comfortably (~72% of card width for optimal breathing room)
    target_logo_dim = int(size * 0.72)
    logo_resized = logo_src.resize((target_logo_dim, target_logo_dim), Image.LANCZOS)
    
    offset_x = (size - target_logo_dim) // 2
    offset_y = (size - target_logo_dim) // 2
    
    # Generate Drop Shadow for Emblem
    shadow_mask = logo_resized.split()[3]
    shadow_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    
    # Colored ambient shadow (warm crimson)
    shadow_color = Image.new('RGBA', (target_logo_dim, target_logo_dim), (190, 0, 50, 80))
    shadow_img.paste(shadow_color, (offset_x, offset_y + int(14 * scale)), shadow_mask)
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=int(16 * scale)))
    
    # Dark contact shadow
    shadow_dark = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    shadow_color_dark = Image.new('RGBA', (target_logo_dim, target_logo_dim), (15, 23, 42, 50))
    shadow_dark.paste(shadow_color_dark, (offset_x, offset_y + int(6 * scale)), shadow_mask)
    shadow_dark = shadow_dark.filter(ImageFilter.GaussianBlur(radius=int(6 * scale)))
    
    # Composite: Base + Shadows + Logo
    final_canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    final_canvas.paste(base_bg, (0, 0), mask)
    final_canvas = Image.alpha_composite(final_canvas, shadow_img)
    final_canvas = Image.alpha_composite(final_canvas, shadow_dark)
    
    # Paste Logo on top
    logo_layer = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    logo_layer.paste(logo_resized, (offset_x, offset_y), logo_resized)
    final_canvas = Image.alpha_composite(final_canvas, logo_layer)
    
    # Clip final canvas to squircle mask
    output_icon = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output_icon.paste(final_canvas, (0, 0), mask)
    
    # Downsample to target 1024x1024 with Lanczos
    result = output_icon.resize((target_size, target_size), Image.LANCZOS)
    return result

def make_round(img):
    s = img.size[0]
    mask = Image.new('L', (s, s), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, s - 1, s - 1), fill=255)
    r = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    r.paste(img, (0, 0), mask)
    return r

def generate_all_icons():
    print("Generating master 1024x1024 icon...")
    icon_1024 = create_glassy_app_icon(SOURCE_ICON, 1024)
    
    # 1. Save master web icons
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    icon_1024.save(os.path.join(OUTPUT_DIR, "logo.png"), "PNG")
    icon_1024.save(os.path.join(OUTPUT_DIR, "logo.webp"), "WEBP", quality=95)
    
    # Apple Touch Icon (180x180)
    apple_icon = icon_1024.resize((180, 180), Image.LANCZOS)
    apple_icon.save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG")
    
    # Admin logos
    admin_512 = icon_1024.resize((512, 512), Image.LANCZOS)
    admin_512.save(os.path.join(OUTPUT_DIR, "admin-logo.png"), "PNG")
    admin_512.save(os.path.join(OUTPUT_DIR, "admin-logo-512.png"), "PNG")
    admin_512.save(os.path.join(OUTPUT_DIR, "admin-logo.webp"), "WEBP", quality=95)
    
    admin_192 = icon_1024.resize((192, 192), Image.LANCZOS)
    admin_192.save(os.path.join(OUTPUT_DIR, "admin-logo-192.png"), "PNG")
    admin_192.save(os.path.join(OUTPUT_DIR, "admin-logo-192.webp"), "WEBP", quality=95)
    
    print("Web icons saved.")
    
    # 2. Save Android mipmaps
    if os.path.exists(RES_DIR):
        print("Generating Android mipmap launcher icons...")
        for d, s in DENSITIES.items():
            od = os.path.join(RES_DIR, d)
            os.makedirs(od, exist_ok=True)
            
            # Standard squircle launcher icon
            r = icon_1024.resize((s, s), Image.LANCZOS)
            r.save(os.path.join(od, "ic_launcher.png"), "PNG")
            
            # Round launcher icon
            ri = make_round(r)
            ri.save(os.path.join(od, "ic_launcher_round.png"), "PNG")
            print(f"  Saved {d}: {s}x{s}")

        for d, s in FG_SIZES.items():
            od = os.path.join(RES_DIR, d)
            os.makedirs(od, exist_ok=True)
            r = icon_1024.resize((s, s), Image.LANCZOS)
            r.save(os.path.join(od, "ic_launcher_foreground.png"), "PNG")
            print(f"  Saved {d} foreground: {s}x{s}")
            
    print("All icons successfully generated and deployed!")

if __name__ == "__main__":
    generate_all_icons()
