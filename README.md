# ORCGA Media Limited — website

Five static pages, no build step required to publish.

## Files
- `index.html` — home
- `work.html` — work grid + case studies
- `services.html` — capabilities, standards, engagement models
- `about.html` — mission, journey, leadership, ethics
- `contact.html` — details, enquiry form, next steps
- `assets/` — logo files (also embedded in each page, so pages work standalone)
- `source/` — editable source: shared `style.css`, `app.js`, header/footer partials, page bodies, and `build.py`

## To publish
Upload the five HTML files (plus `assets/`) to any static host — Netlify, Vercel, GitHub Pages, cPanel. Nothing else is needed.

## To add a video
Every video slot is one attribute. Find the placeholder and paste in the 11-character
YouTube ID (the part after `v=` or `youtu.be/`):

    <div class="work-card__media slot" data-youtube="PASTE_ID_HERE" data-title="Project name">

The thumbnail loads automatically and the video plays inline on click.

## To add team photos
In `about.html`, replace the initial inside each `.member__photo`:

    <div class="member__photo"><span class="member__initial">O</span></div>

with:

    <div class="member__photo"><img src="assets/brian-omondi.jpg" alt="Brian Omondi"></div>

Photos are shown greyscale and turn to full colour on hover. Use portrait crops (4:5).

## To edit shared elements
The header, footer, colours and type live in `source/`. After editing, run:

    python3 build.py

This regenerates the five pages in `dist/`.

## Notes
- Fonts load from Google Fonts (Montserrat, Inter, Playfair Display).
- The contact form opens the visitor's email client with the brief filled in. If you
  want submissions to arrive in an inbox automatically, a form service such as
  Formspree can be wired to the same form with one attribute change.
- No pricing appears anywhere on the site; the rate card is request-only.
