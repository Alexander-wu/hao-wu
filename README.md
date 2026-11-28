# Hao Wu Homepage

Website: https://alexander-wu.github.io/hao-wu/

Static HTML, CSS, and JavaScript, published from this repository's `main` branch through `.github/workflows/pages.yml`.

## Source layout

- `index.html`: profile, navigation, news, experience, and contact information.
- `publications.js`: publication metadata and figures. Selected ordering is in `app.js`.
- `styles.css`: original typography and base components.
- `theme-redblack.css`: red, black, and white theme, including dark mode.
- `homepage-layout.css`: reading-focused layout, responsive navigation, publication rows, and heading accents.
- `app.js`: filters, search, author/news disclosures, theme switch, and media controls.
- `assets/`: existing research media, profile image, and CMU seal favicon.

The original font is retained. Names, author lists, dates, and author-role labels use the text color; red marks heading accents and interactive states. Publications follow the introduction. Historical news and full author lists remain available through disclosure controls. Videos start on explicit activation.

## Preview

Run `python3 -m http.server 8765 --bind 127.0.0.1` from the repository root, then open http://127.0.0.1:8765/.

## Publishing and citation updates

Every push to `main` deploys the site through GitHub Actions. The workflow also attempts a Google Scholar refresh daily at 02:23 UTC and on manual dispatch. Blocked responses preserve the previous successful count and timestamp.

`citation-data.json` provides the current citation snapshot. `scholar-citations.js` updates the displayed count from it. `scripts/update_citations.py` updates the JSON and HTML fallback together. Preserve the `citation-counter` anchor and `strong` element beginning with `id="scholar-citation-count"`, because the updater matches that markup.

The owner's local backup is managed separately and patches the latest remote HTML rather than replacing it with a local snapshot. Before publishing source changes, check remote `main` again to avoid overwriting a newer citation update.

Basic checks:

```sh
node --check app.js
python3 -m unittest discover -s scripts -p 'test_*.py'
```

Assets and downloads use relative URLs to support the `/hao-wu/` project-site path. Keep publication metadata and historical source files when making visual changes.
