from PIL import Image, ImageDraw
import os
import sys

# mode: "main" (Mushi QR Pro) or "admin" (Mushi QR Admin with Badge)
mode = sys.argv[1] if len(sys.argv) > 1 else "main"

if mode == "admin":
    LOGO = "admin/public/admin-logo-512.png"
    if not os.path.exists(LOGO):
        LOGO = "public/admin-logo-512.png"
else:
    LOGO = "public/logo.webp"

RES_DIR = "android/app/src/main/res"

DENSITIES = {
    "mipmap-mdpi": 48, "mipmap-hdpi": 72, "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144, "mipmap-xxxhdpi": 192,
}
FG_SIZES = {
    "mipmap-mdpi": 108, "mipmap-hdpi": 162, "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324, "mipmap-xxxhdpi": 432,
}

def make_round(img):
    s = img.size[0]
    mask = Image.new('L', (s, s), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, s-1, s-1), fill=255)
    r = Image.new('RGBA', (s, s), (0,0,0,0))
    r.paste(img, (0,0), mask)
    return r

logo = Image.open(LOGO).convert("RGBA")
print(f"Applying Android launcher icons for mode: {mode.upper()} from {LOGO}")

for d, s in DENSITIES.items():
    od = os.path.join(RES_DIR, d)
    os.makedirs(od, exist_ok=True)
    
    # 1. Standard launcher icon
    ps = s
    r = logo.resize((ps, ps), Image.LANCZOS)
    c = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    o = (s - ps) // 2
    c.paste(r, (o, o), r)
    c.save(os.path.join(od, "ic_launcher.png"), "PNG")
    
    # 2. Round launcher icon
    ri = make_round(r)
    rc = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    rc.paste(ri, (o, o), ri)
    rc.save(os.path.join(od, "ic_launcher_round.png"), "PNG")
    print(f"  [OK] {d}: {s}x{s}")

for d, s in FG_SIZES.items():
    od = os.path.join(RES_DIR, d)
    os.makedirs(od, exist_ok=True)
    ls = s
    r = logo.resize((ls, ls), Image.LANCZOS)
    c = Image.new('RGBA', (s, s), (0,0,0,0))
    o = (s - ls) // 2
    c.paste(r, (o, o), r)
    c.save(os.path.join(od, "ic_launcher_foreground.png"), "PNG")
    print(f"  [OK] {d} foreground: {s}x{s}")

print(f"Done generating Android icons for {mode.upper()}!")
