#!/usr/bin/env python3
"""Build the ORCGA Media site: injects shared CSS, JS, header, footer and
the logo (as a data URI) into each page so every file is standalone."""

import base64, pathlib, re, shutil

ROOT = pathlib.Path(__file__).parent
SRC, DIST, ASSETS = ROOT / "src", ROOT / "dist", ROOT / "assets"
DIST.mkdir(exist_ok=True)

def data_uri(p):
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode()

LOGO = data_uri(ASSETS / "logo.png")
LOGO_WHITE = data_uri(ASSETS / "logo-white.png")
CSS = (SRC / "style.css").read_text()
JS = (SRC / "app.js").read_text()
HEADER = (SRC / "header.html").read_text()
FOOTER = (SRC / "footer.html").read_text()

PAGES = {
    "index.html": "home",
    "work.html": "work",
    "services.html": "services",
    "about.html": "about",
    "contact.html": "contact",
}

FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link href="https://fonts.googleapis.com/css2?'
    'family=Montserrat:wght@600;700;800;900&'
    'family=Inter:wght@400;500;600&'
    'family=Playfair+Display:ital,wght@1,400;1,500&display=swap" rel="stylesheet">'
)

for name, key in PAGES.items():
    page = (SRC / name).read_text()

    header = HEADER.replace("{{LOGO}}", LOGO)
    for k in PAGES.values():
        header = header.replace(
            "{{CUR_%s}}" % k.upper(),
            ' aria-current="page"' if k == key else "",
        )
    footer = FOOTER.replace("{{LOGO_WHITE}}", LOGO_WHITE)

    page = (page
            .replace("{{FONTS}}", FONTS)
            .replace("{{CSS}}", "<style>\n" + CSS + "\n</style>")
            .replace("{{HEADER}}", header)
            .replace("{{FOOTER}}", footer)
            .replace("{{JS}}", "<script>\n" + JS + "\n</script>")
            .replace("{{LOGO}}", LOGO))

    (DIST / name).write_text(page)
    print("built", name, f"{len(page)/1024:.0f} KB")

# keep raw assets alongside for anyone who wants the source files
out_assets = DIST / "assets"
out_assets.mkdir(exist_ok=True)
for f in ASSETS.glob("*"):
    shutil.copy(f, out_assets / f.name)

leftovers = set()
for name in PAGES:
    for m in re.findall(r"\{\{[A-Z_]+\}\}", (DIST / name).read_text()):
        leftovers.add((name, m))
print("unreplaced placeholders:", leftovers or "none")
