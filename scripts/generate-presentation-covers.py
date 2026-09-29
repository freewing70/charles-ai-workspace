import os
import glob
import re
import time
import subprocess
import http.server
import socketserver
import threading

ROOT_DIR = os.getcwd()
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')
COVERS_DIR = os.path.join(PUBLIC_DIR, 'assets', 'covers')
CONTENT_DIR = os.path.join(ROOT_DIR, 'content')

os.makedirs(COVERS_DIR, exist_ok=True)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

PORT = 4321
server = socketserver.TCPServer(("", PORT), Handler)
server_thread = threading.Thread(target=server.serve_forever)
server_thread.daemon = True
server_thread.start()
print(f"Server started on http://localhost:{PORT}")

time.sleep(1)

presentation_files = glob.glob(os.path.join(CONTENT_DIR, 'presentations', '*.md'))

for md_file in presentation_files:
    with open(md_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    fm_lines = []
    in_fm = False
    for line in lines:
        if line.strip() == '---':
            if not in_fm:
                in_fm = True
                continue
            else:
                break
        if in_fm:
            fm_lines.append(line)

    play_url = None
    item_id = os.path.basename(md_file).replace('.md', '')

    for line in fm_lines:
        if line.startswith('playUrl:'):
            play_url = line.split(':', 1)[1].strip().strip('"').strip("'")
        elif line.startswith('id:'):
            item_id = line.split(':', 1)[1].strip().strip('"').strip("'")

    if not play_url:
        continue

    target_url = f"http://localhost:{PORT}{play_url}"
    cover_filename = f"{item_id}.png"
    cover_file_path = os.path.join(COVERS_DIR, cover_filename)
    cover_rel_url = f"/assets/covers/{cover_filename}"

    print(f"[Capturing Cover] {item_id} -> {target_url}")

    cmd = [
        "npx.cmd" if os.name == 'nt' else "npx",
        "playwright",
        "screenshot",
        "--viewport-size=1280, 720",
        target_url,
        cover_file_path
    ]

    try:
        subprocess.run(cmd, check=True)
        print(f"[Success] Saved thumbnail: {cover_file_path}")

        # Update cover field in file lines
        new_lines = []
        in_fm_flag = False
        cover_updated = False

        for line in lines:
            if line.strip() == '---':
                if not in_fm_flag:
                    in_fm_flag = True
                else:
                    if not cover_updated:
                        new_lines.append(f'cover: "{cover_rel_url}"\n')
                        cover_updated = True
                    in_fm_flag = False
                new_lines.append(line)
                continue

            if in_fm_flag and line.startswith('cover:'):
                new_lines.append(f'cover: "{cover_rel_url}"\n')
                cover_updated = True
            else:
                new_lines.append(line)

        with open(md_file, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"[Updated] Frontmatter in {md_file}")

    except Exception as e:
        print(f"[Error] Failed to capture screenshot for {item_id}: {e}")

server.shutdown()
print("All presentation cover thumbnails generated successfully!")
