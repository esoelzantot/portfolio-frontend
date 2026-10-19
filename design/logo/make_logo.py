"""Builds the header logos (dark/light) and favicon set from the source PNG.

Usage (needs Pillow), from the project root:
    python design/logo/make_logo.py design/logo/logo-source.png <out-dir>
then copy logo-*.png to public/images/logo/, favicon.ico to public/,
and the icon-*/apple-touch-icon/favicon-32 PNGs to public/icons/.
"""
import colorsys, sys
from PIL import Image, ImageDraw

src, out = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGBA')

# trim the transparent margin
bbox = im.getchannel('A').point(lambda a: 255 if a > 12 else 0).getbbox()
im = im.crop(bbox)
print('trimmed to', im.size)

DARK = (0x19, 0x16, 0x27)  # site text color #191627

def recolor_for_light(img):
    """White/grey body -> site dark color (shading kept), purple untouched."""
    out = img.copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            # HSV saturation: unlike HLS it stays low for near-white pixels
            # with a faint tint, which HLS would misread as "purple"
            _, sat, _ = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if sat < 0.3:  # neutral (white/grey bevel), not the purple accent
                # one flat color: the source white has compression noise that
                # any lightness-based shading would turn into visible speckles
                px[x, y] = DARK + (a,)
    return out

def fit_height(img, height):
    w = round(img.width * height / img.height)
    return img.resize((w, height), Image.LANCZOS)

# header logos at 2x of a 48px display height (sharp on retina)
fit_height(im, 96).save(f'{out}/logo-dark.png', optimize=True)
fit_height(recolor_for_light(im), 96).save(f'{out}/logo-light.png', optimize=True)

# the "ES" mark without the < > chevrons, so it stays legible at 16-32px
mark = im.crop((round(im.width * 0.18), 0, round(im.width * 0.82), im.height))

def tile(size, pad_ratio=0.14, src=None):
    """Logo centered on a dark rounded tile, visible on light and dark tabs."""
    t = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    ImageDraw.Draw(t).rounded_rectangle([0, 0, size - 1, size - 1], radius=round(size * 0.22), fill=DARK + (255,))
    inner = size - 2 * round(size * pad_ratio)
    src = src or im
    scale = min(inner / src.width, inner / src.height)
    logo = src.resize((max(1, round(src.width * scale)), max(1, round(src.height * scale))), Image.LANCZOS)
    t.alpha_composite(logo, ((size - logo.width) // 2, (size - logo.height) // 2))
    return t

big = tile(512)
big.save(f'{out}/icon-512.png', optimize=True)
tile(192).save(f'{out}/icon-192.png', optimize=True)
tile(180, 0.12).save(f'{out}/apple-touch-icon.png', optimize=True)
tile(32, 0.1, mark).save(f'{out}/favicon-32.png', optimize=True)
# 16/32 show just the mark; 48 has room for the full logo
ico_frames = [tile(16, 0.06, mark), tile(32, 0.1, mark), tile(48, 0.08)]
ico_frames[2].save(f'{out}/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico_frames[:2])
print('done')
