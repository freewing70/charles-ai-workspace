import os, re, json
from bs4 import BeautifulSoup

dist_dir = 'dist'
if not os.path.exists(dist_dir):
    print("dist directory does not exist! Please run pnpm build first.")
    exit(1)

html_files = []
for root, dirs, files in os.walk(dist_dir):
    for f in files:
        if f.endswith('.html'):
            html_files.append(os.path.join(root, f))

print(f"Auditing {len(html_files)} HTML files in dist/...")

issues = {
    'placeholders': [],
    'missing_meta': [],
    'img_issues': [],
    'link_issues': [],
    'jsonld_errors': [],
    'noindex_check': [],
}

suspicious_words = [
    r'\bTODO\b', r'\bTBD\b', r'\bFIXME\b', r'\bLorem ipsum\b',
    r'undefined', r'\bNaN\b', r'\[object Object\]'
]

for file_path in html_files:
    rel_path = os.path.relpath(file_path, dist_dir).replace('\\', '/')
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # 1. Suspicious placeholders in visible body text
    body = soup.find('body')
    if body:
        # Strip script and style tags from body text check
        for s in body(['script', 'style']):
            s.decompose()
        body_text = body.get_text()
        for pattern in suspicious_words:
            if re.search(pattern, body_text):
                # Ignore expected code occurrences in tutorials/notes if in code blocks
                matches = re.findall(pattern, body_text)
                issues['placeholders'].append((rel_path, pattern, len(matches)))

    # 2. SEO & Head Tag checks
    head = soup.find('head')
    if head:
        title = head.find('title')
        if not title or not title.text.strip():
            issues['missing_meta'].append((rel_path, 'Missing <title>'))
        
        meta_desc = head.find('meta', attrs={'name': 'description'})
        if not meta_desc or not meta_desc.get('content', '').strip():
            # 404 is allowed to not have meta desc
            if rel_path != '404.html':
                issues['missing_meta'].append((rel_path, 'Missing <meta name="description">'))
        
        canonical = head.find('link', attrs={'rel': 'canonical'})
        if not canonical or not canonical.get('href', '').strip():
            issues['missing_meta'].append((rel_path, 'Missing canonical link'))
        elif canonical.get('href', '').startswith('http://') or 'freewing.biz/' in canonical.get('href', ''):
            issues['missing_meta'].append((rel_path, f"Invalid canonical href: {canonical.get('href')}"))
            
        # Check noindex on search & 404
        meta_robots = head.find('meta', attrs={'name': 'robots'})
        if rel_path in ['404.html', 'search/index.html']:
            if not meta_robots or 'noindex' not in meta_robots.get('content', ''):
                issues['noindex_check'].append((rel_path, 'Expected noindex on utility page'))
        else:
            if meta_robots and 'noindex' in meta_robots.get('content', ''):
                issues['noindex_check'].append((rel_path, 'Unexpected noindex on content page!'))

        # 3. JSON-LD validation
        json_ld_scripts = head.find_all('script', attrs={'type': 'application/ld+json'})
        for j_script in json_ld_scripts:
            try:
                data = json.loads(j_script.string or '')
                # Ensure context is https://schema.org
                if '@context' not in data:
                    issues['jsonld_errors'].append((rel_path, 'JSON-LD missing @context'))
            except Exception as e:
                issues['jsonld_errors'].append((rel_path, f'Invalid JSON-LD: {str(e)}'))

    # 4. Image tags check (alt, width, height)
    imgs = soup.find_all('img')
    for img in imgs:
        src = img.get('src', '')
        alt = img.get('alt', None)
        width = img.get('width', None)
        height = img.get('height', None)
        
        # Check missing alt
        if alt is None:
            issues['img_issues'].append((rel_path, f'<img> missing alt attribute: src={src}'))
        
        # Check missing dimensions
        if not width or not height:
            # Icons and avatars may use classes, but cover images MUST have width/height
            if 'covers/' in src:
                issues['img_issues'].append((rel_path, f'Cover image missing width/height: src={src}'))

    # 5. Link checks
    anchors = soup.find_all('a')
    for a in anchors:
        href = a.get('href', None)
        if href is None or href == '' or href == '#':
            text = a.get_text(strip=True)[:20]
            # Ignore interactive JS buttons that might use href="#" if role="button" or aria-label
            issues['link_issues'].append((rel_path, f'Empty or hash href on anchor: text="{text}"'))

print("\n=== AUDIT RESULTS ===")
for category, items in issues.items():
    print(f"\n[{category.upper()}] Count: {len(items)}")
    for item in items[:10]: # show first 10
        print("  -", item)
    if len(items) > 10:
        print(f"  ... and {len(items) - 10} more")

print("\nAudit completed.")
