import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import urllib.parse

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT_DIR, 'dist')

if not os.path.exists(DIST_DIR):
    print(f"Error: {DIST_DIR} does not exist. Run build first.")
    sys.exit(1)

html_files = []
for root, _, files in os.walk(DIST_DIR):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))

print(f"[Audit] Scanning {len(html_files)} HTML files in dist/...")

broken_links = []
checked_links = 0
external_links = set()

# Regex to find href, src, action, data-src, etc.
ATTR_REGEX = re.compile(r'(?:href|src|action|data-src)=["\']([^"\'>\s]+)["\']', re.IGNORECASE)

def check_link(source_file, url):
    global checked_links
    url = url.strip()
    if not url:
        return
    
    # Protocol-relative or external or special protocols
    if url.startswith(('http://', 'https://')):
        external_links.add(url)
        return
    if url.startswith(('mailto:', 'tel:', 'data:', 'javascript:', '#', '{')):
        return

    # Strip query & fragment
    parsed = urllib.parse.urlparse(url)
    clean_path = parsed.path
    if not clean_path:
        return # pure fragment like #top

    checked_links += 1

    if clean_path.startswith('/'):
        target_path = clean_path.lstrip('/')
        candidates = [
            os.path.join(DIST_DIR, target_path),
            os.path.join(DIST_DIR, target_path, 'index.html'),
            os.path.join(DIST_DIR, target_path.rstrip('/') + '.html'),
        ]
    else:
        base_dir = os.path.dirname(source_file)
        candidates = [
            os.path.join(base_dir, clean_path),
            os.path.join(base_dir, clean_path, 'index.html'),
            os.path.join(base_dir, clean_path.rstrip('/') + '.html'),
        ]

    exists = any(os.path.exists(c) for c in candidates)
    if not exists:
        rel_source = os.path.relpath(source_file, DIST_DIR)
        broken_links.append({
            'source': rel_source,
            'url': url,
            'clean_path': clean_path,
            'checked_candidate': candidates[0]
        })

# Strip <script> and <style> tags so JS templates (e.g. href="${item.url}") aren't treated as static DOM links
STRIP_BLOCKS_REGEX = re.compile(r'<(script|style)[^>]*>[\s\S]*?</\1>', re.IGNORECASE)

for fpath in html_files:
    try:
        with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            clean_html = STRIP_BLOCKS_REGEX.sub('', content)
            matches = ATTR_REGEX.findall(clean_html)
            for m in matches:
                check_link(fpath, m)
    except Exception as e:
        print(f"Error reading {fpath}: {e}")

print(f"[Audit] Checked {checked_links} internal link/asset references.")
print(f"[Audit] Found {len(external_links)} unique external URLs.")

if broken_links:
    print(f"\n\033[91m[FAILED] Found {len(broken_links)} broken internal links (404):\033[0m")
    for item in broken_links:
        print(f"  ❌ Source: dist/{item['source']}")
        print(f"     Target: {item['url']}")
    sys.exit(1)
else:
    print("\n\033[92m[PASSED] 0 broken internal links! All internal href and src resolve to existing files.\033[0m")
