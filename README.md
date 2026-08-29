# College Application Master Roadmap

A static HTML dashboard for a Class of 2027 psychology-focused college applicant. No build step, no external dependencies — just `index.html` plus its styles and script under `assets/`.

## Files
- `index.html` — page markup
- `assets/styles.css` — all styling
- `assets/timeline.js` — checklist persistence (localStorage), progress bar, and today's-date display

## Use locally
Open `index.html` in a browser.

## Deploy with GitHub Pages
1. Create a GitHub repository.
2. Upload `index.html` and the `assets/` folder (keep them in the same relative layout).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then Save.

The page has no third-party dependencies, so it works as a simple GitHub Pages site.

## Important
The page is a planning dashboard, not an authoritative deadline database. Verify each school's current admissions, scholarship, financial-aid, testing and application requirements on its official website before submitting.
