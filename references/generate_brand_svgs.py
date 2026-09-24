import cv2
import base64

def png_to_svg(png_path, svg_path, width, height):
    with open(png_path, 'rb') as f:
        b64 = base64.b64encode(f.read()).decode('utf-8')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%">
  <image href="data:image/png;base64,{b64}" width="{width}" height="{height}" />
</svg>'''
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'Wrote {svg_path}')

# Symbol color
im = cv2.imread('public/brand/freewing-symbol-hd.png', cv2.IMREAD_UNCHANGED)
h, w = im.shape[:2]
png_to_svg('public/brand/freewing-symbol-hd.png', 'public/brand/freewing-symbol.svg', w, h)

# Symbol dark
im_d = cv2.imread('public/brand/freewing-symbol-dark-hd.png', cv2.IMREAD_UNCHANGED)
hd, wd = im_d.shape[:2]
png_to_svg('public/brand/freewing-symbol-dark-hd.png', 'public/brand/freewing-symbol-dark.svg', wd, hd)

# Symbol mono
im_m = cv2.imread('public/brand/freewing-symbol-mono-hd.png', cv2.IMREAD_UNCHANGED)
hm, wm = im_m.shape[:2]
png_to_svg('public/brand/freewing-symbol-mono-hd.png', 'public/brand/freewing-symbol-mono.svg', wm, hm)

# Horizontal logo
im_hl = cv2.imread('public/brand/freewing-logo-horizontal.png', cv2.IMREAD_UNCHANGED)
hhl, whl = im_hl.shape[:2]
png_to_svg('public/brand/freewing-logo-horizontal.png', 'public/brand/freewing-logo-horizontal.svg', whl, hhl)

# Stacked logo
im_sl = cv2.imread('public/brand/freewing-logo-stacked.png', cv2.IMREAD_UNCHANGED)
hsl, wsl = im_sl.shape[:2]
png_to_svg('public/brand/freewing-logo-stacked.png', 'public/brand/freewing-logo-stacked.svg', wsl, hsl)

# Favicon svg
png_to_svg('public/brand/freewing-symbol-hd.png', 'public/brand/favicon.svg', w, h)
png_to_svg('public/brand/freewing-symbol-hd.png', 'public/favicon.svg', w, h)
