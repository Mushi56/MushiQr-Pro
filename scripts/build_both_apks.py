import os
import shutil
import subprocess
import sys

BASE_DIR = r"d:\App devlepment\mushiqr-pro"
ADMIN_DIR = os.path.join(BASE_DIR, "admin")
ANDROID_DIR = os.path.join(BASE_DIR, "android")
APKS_DIR = os.path.join(BASE_DIR, "apks")
os.makedirs(APKS_DIR, exist_ok=True)

def run(cmd, cwd=BASE_DIR):
    print(f"\n[EXEC] {cmd} (in {cwd})")
    res = subprocess.run(cmd, cwd=cwd, shell=True)
    if res.returncode != 0:
        print(f"[ERROR] Command failed with code {res.returncode}")
        sys.exit(res.returncode)

def main():
    print("==================================================")
    print("0. SYNCING LIVE CLOUD DEFAULTS TO BUNDLED CONFIG")
    print("==================================================")
    run(f"{sys.executable} scripts/sync_cloud_defaults.py", cwd=BASE_DIR)

    print("\n==================================================")
    print("1. BUILDING MUSHI QR PRO APK (OFFLINE)")
    print("==================================================")
    run("npm run build", cwd=BASE_DIR)
    run("npx cap sync android", cwd=BASE_DIR)
    run(f"{sys.executable} scripts/apply_android_icons.py pro", cwd=BASE_DIR)
    
    gradlew = os.path.join(ANDROID_DIR, "gradlew.bat")
    run(f'"{gradlew}" assembleDebug', cwd=ANDROID_DIR)
    
    built_apk = os.path.join(ANDROID_DIR, "app", "build", "outputs", "apk", "debug", "app-debug.apk")
    pro_dest = os.path.join(APKS_DIR, "MushiQRPro-debug.apk")
    shutil.copy2(built_apk, pro_dest)
    print(f"[OK] Mushi QR Pro APK generated: {pro_dest} ({os.path.getsize(pro_dest)/(1024*1024):.2f} MB)")

    print("\n==================================================")
    print("2. BUILDING MUSHI ADMIN APK (OFFLINE WITH BADGE)")
    print("==================================================")
    run("npm run build", cwd=ADMIN_DIR)
    
    # Copy admin dist to Android assets public folder
    public_assets = os.path.join(ANDROID_DIR, "app", "src", "main", "assets", "public")
    if os.path.exists(public_assets):
        shutil.rmtree(public_assets)
    shutil.copytree(os.path.join(ADMIN_DIR, "dist"), public_assets)
    
    run(f"{sys.executable} scripts/apply_android_icons.py admin", cwd=BASE_DIR)
    run(f'"{gradlew}" assembleDebug', cwd=ANDROID_DIR)
    
    admin_dest = os.path.join(APKS_DIR, "MushiAdmin-debug.apk")
    shutil.copy2(built_apk, admin_dest)
    print(f"[OK] Mushi Admin APK generated: {admin_dest} ({os.path.getsize(admin_dest)/(1024*1024):.2f} MB)")

    # Restore main app config & icons
    print("\n==================================================")
    print("3. RESTORING MAIN APP WEB ASSETS & PRO ICONS")
    print("==================================================")
    run("npx cap sync android", cwd=BASE_DIR)
    run(f"{sys.executable} scripts/apply_android_icons.py pro", cwd=BASE_DIR)
    print("[ALL DONE] Both standalone offline APKs are updated in ./apks/")

if __name__ == "__main__":
    main()
