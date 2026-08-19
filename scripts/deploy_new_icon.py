from PIL import Image, ImageDraw
import os

SOURCE_ICON = r"E:\Downloads\Mushi Qr Pro App Icon 1.png"
OUTPUT_DIR = "public"
RES_DIR = "android/app/src/main/res"

DENSITIES = {
    "mipmap-ldpi": 36,
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FG_SIZES = {
    "mipmap-ldpi": 81,
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}

# Exact matching icon crimson-red color
MATCHING_RED = (235, 25, 60, 255)

def clean_and_solidify_icon(source_path):
    img = Image.open(source_path).convert("RGBA")
    w, h = img.size
    
    # Extract alpha mask
    r, g, b, a = img.split()
    
    # Create solid base with icon matching color (Zero white)
    solid_base = Image.new("RGBA", (w, h), MATCHING_RED)
    
    # Paste original image over matching red base
    composite = Image.alpha_composite(solid_base, img)
    
    # Apply alpha mask
    final_icon = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    final_icon.paste(composite, (0, 0), a)
    
    return final_icon

def make_round(img):
    s = img.size[0]
    mask = Image.new('L', (s, s), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, s - 1, s - 1), fill=255)
    r = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    r.paste(img, (0, 0), mask)
    return r

def deploy():
    print("Processing new app icon from:", SOURCE_ICON)
    icon_1024 = clean_and_solidify_icon(SOURCE_ICON)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 1. Web icons
    icon_1024.save(os.path.join(OUTPUT_DIR, "logo.png"), "PNG")
    icon_1024.save(os.path.join(OUTPUT_DIR, "logo.webp"), "WEBP", quality=98)
    icon_1024.save(os.path.join(OUTPUT_DIR, "logo-transparent.png"), "PNG")
    icon_1024.save(os.path.join(OUTPUT_DIR, "logo-transparent.webp"), "WEBP", quality=98)
    
    # Apple Touch Icon (180x180)
    apple_icon = icon_1024.resize((180, 180), Image.LANCZOS)
    apple_icon.save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG")
    
    # Admin logos
    admin_512 = icon_1024.resize((512, 512), Image.LANCZOS)
    admin_512.save(os.path.join(OUTPUT_DIR, "admin-logo.png"), "PNG")
    admin_512.save(os.path.join(OUTPUT_DIR, "admin-logo-512.png"), "PNG")
    admin_512.save(os.path.join(OUTPUT_DIR, "admin-logo.webp"), "WEBP", quality=98)
    
    admin_192 = icon_1024.resize((192, 192), Image.LANCZOS)
    admin_192.save(os.path.join(OUTPUT_DIR, "admin-logo-192.png"), "PNG")
    admin_192.save(os.path.join(OUTPUT_DIR, "admin-logo-192.webp"), "WEBP", quality=98)
    
    print("Web icons successfully saved.")
    
    # 2. Android mipmaps
    if os.path.exists(RES_DIR):
        print("Generating Android launcher icons across all mipmap densities...")
        for d, s in DENSITIES.items():
            od = os.path.join(RES_DIR, d)
            os.makedirs(od, exist_ok=True)
            
            # Standard squircle launcher icon
            r = icon_1024.resize((s, s), Image.LANCZOS)
            r.save(os.path.join(od, "ic_launcher.png"), "PNG")
            
            # Round launcher icon
            ri = make_round(r)
            ri.save(os.path.join(od, "ic_launcher_round.png"), "PNG")
            
            # Solid matching red background (Replace any legacy white backgrounds)
            bg_img = Image.new("RGBA", (s, s), MATCHING_RED)
            bg_img.save(os.path.join(od, "ic_launcher_background.png"), "PNG")
            print(f"  Saved {d}: {s}x{s}")

        for d, s in FG_SIZES.items():
            od = os.path.join(RES_DIR, d)
            os.makedirs(od, exist_ok=True)
            
            # Foreground icon scaled into adaptive safe-zone
            fg_canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
            r = icon_1024.resize((s, s), Image.LANCZOS)
            fg_canvas.paste(r, (0, 0), r)
            fg_canvas.save(os.path.join(od, "ic_launcher_foreground.png"), "PNG")
            
            # Adaptive background (solid matching red)
            bg_fg = Image.new("RGBA", (s, s), MATCHING_RED)
            bg_fg.save(os.path.join(od, "ic_launcher_background.png"), "PNG")
            print(f"  Saved {d} foreground & background: {s}x{s}")
            
    print("All Android mipmap icons successfully updated with ZERO white gap!")

if __name__ == "__main__":
    deploy()
