import os
import json
import urllib.request

BASE_DIR = r"d:\App devlepment\mushiqr-pro"

def fetch_doc(path):
    try:
        url = f'https://firestore.googleapis.com/v1/projects/mushi-qr-pro/databases/(default)/documents/{path}'
        req = urllib.request.Request(url, headers={'User-Agent': 'MushiQR-BuildTool/1.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"[WARN] Failed to fetch {path}: {e}")
        return None

def parse_fields(fields):
    if not fields:
        return {}
    res = {}
    for k, v in fields.items():
        if 'booleanValue' in v:
            res[k] = v['booleanValue']
        elif 'stringValue' in v:
            res[k] = v['stringValue']
        elif 'integerValue' in v:
            res[k] = int(v['integerValue'])
        elif 'doubleValue' in v:
            res[k] = float(v['doubleValue'])
        elif 'mapValue' in v:
            res[k] = parse_fields(v['mapValue'].get('fields', {}))
        elif 'arrayValue' in v:
            arr = []
            for item in v['arrayValue'].get('values', []):
                if 'stringValue' in item: arr.append(item['stringValue'])
                elif 'booleanValue' in item: arr.append(item['booleanValue'])
                elif 'integerValue' in item: arr.append(int(item['integerValue']))
                elif 'mapValue' in item: arr.append(parse_fields(item['mapValue'].get('fields', {})))
            res[k] = arr
    return res

def sync_cloud_defaults():
    print("[SYNC] Fetching live Firestore cloud configuration...")
    
    # 1. Feature Flags
    flags_doc = fetch_doc('global_config/featureFlags')
    flags = parse_fields(flags_doc.get('fields', {})) if flags_doc else {}
    print(f"  - Feature Flags: {len(flags)} items")

    # 2. Membership Config
    membership_doc = fetch_doc('global_config/membership')
    membership = parse_fields(membership_doc.get('fields', {})) if membership_doc else {}
    print(f"  - Membership Config: {len(membership)} keys")

    # 3. Subscription Plans Collection
    plans_col = fetch_doc('subscription_plans')
    plans = {}
    if plans_col and 'documents' in plans_col:
        for doc in plans_col['documents']:
            doc_id = doc['name'].split('/')[-1]
            plans[doc_id] = parse_fields(doc.get('fields', {}))
    print(f"  - Subscription Plans: {list(plans.keys())}")

    bundled_data = {
        "_generatedAt": flags.get('_updatedAt', ''),
        "_syncTimestamp": flags_doc.get('updateTime', ''),
        "globalFlags": flags,
        "membershipConfig": membership,
        "plans": plans
    }

    # Save to src/config/bundled_cloud_defaults.json
    src_config_dir = os.path.join(BASE_DIR, "src", "config")
    os.makedirs(src_config_dir, exist_ok=True)
    src_file = os.path.join(src_config_dir, "bundled_cloud_defaults.json")
    with open(src_file, "w", encoding="utf-8") as f:
        json.dump(bundled_data, f, indent=2)
    print(f"[OK] Saved bundled cloud defaults: {src_file}")

    # Save to admin/src/config/bundled_cloud_defaults.json
    admin_config_dir = os.path.join(BASE_DIR, "admin", "src", "config")
    os.makedirs(admin_config_dir, exist_ok=True)
    admin_file = os.path.join(admin_config_dir, "bundled_cloud_defaults.json")
    with open(admin_file, "w", encoding="utf-8") as f:
        json.dump(bundled_data, f, indent=2)
    print(f"[OK] Saved bundled cloud defaults: {admin_file}")

if __name__ == "__main__":
    sync_cloud_defaults()
