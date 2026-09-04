# Lotus's College Application Roadmap

A single-page planning dashboard for Lotus's Class of 2027 college applications — psychology-focused, covering UC, CSU, Common App and financial-aid milestones. Static HTML/CSS/JS, no build step, no external dependencies.

## Files
- `index.html` — page markup
- `assets/styles.css` — all styling
- `assets/timeline.js` — all interactivity (see below)

## Features

- **Senior-year timeline** — month-by-month task cards from August through Decision Day, with checkboxes.
- **Lotus's College List** — a live list of the schools she's chosen, built from two inputs: checking a school in the reference list below, or typing a school into the free-form "Add another school" box. Both update the list automatically.
- **Psychology Programs to Consider** — a ~50-school reference list (Reach / Target / Likely / CSU & Other), each with a checkbox to add it to her list. It's a planning shortlist, not a ranking.
- **Application Status Timeline** — for every school currently on her list, an editable deadline and a status (Not Started / In Progress / Submitted / Decision Received), sorted by what's due soonest. Deadlines prefill for her confirmed schools and are otherwise left for her to fill in.
- **Application Quick Reference** — per-school platform, essay, recommendation, interview and deadline details for her actual list, verified against each school's official requirements at time of writing.
- Financial aid checklist, psychology-applicant checklist, application-platform reference, and an overall progress bar.

## How saving works

Everything you check, type, or edit — task checkboxes, her school list, custom schools, deadlines, statuses — is saved to the browser's `localStorage` as you go. There's no backend and no account.

That means state is **per-browser, per-device**: it persists across reloads and new tabs on the same browser, but won't follow you to a different browser, a different device, or a private/incognito window, and clearing site data wipes it. Nothing is sent anywhere.

## Use locally
Open `index.html` in a browser.

## Deploy with GitHub Pages
1. Push `index.html` and the `assets/` folder to a GitHub repository (keep them in the same relative layout).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `master` (or `main`) and `/ (root)`, then Save.

No third-party dependencies, so it works as a simple GitHub Pages site.

## Important
This is a planning dashboard, not an authoritative deadline database. Deadlines, testing policies, application platforms and requirements can change year to year — verify each school's current admissions, scholarship, financial-aid and testing requirements on its official website before submitting anything.
