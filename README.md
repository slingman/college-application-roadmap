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
- **Application Quick Reference** — per-school platform, essay, recommendation, interview, testing-policy and deadline details for her actual list, verified against each school's official requirements at time of writing, plus a free-text "Why this school" note per school.
- **Recommenders** — tracks who's writing for her, their subject/role, and status (Not Asked/Asked/Confirmed/Submitted).
- **Writing Tracker** — a Google Doc link each for her personal statement and activities list, plus a per-school collapsible list of supplemental essay prompts with their own doc links and done-checkboxes. Only the link is ever stored here — the actual writing stays in Google Docs.
- Financial aid checklist, psychology-applicant checklist, application-platform reference, an overall progress bar, and a days-to-target/days-to-deadline countdown.

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

## Optional: "Choose from Drive" for the Writing Tracker

The Writing Tracker's doc-link fields work fine with a pasted URL out of the box. To enable the "Choose from Drive" buttons instead (pick a file straight from Google Drive), you need your own Google Cloud credentials — this can't be preconfigured since it's tied to a Google account:

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and create a project (any name, e.g. "Lotus College Roadmap").
2. **APIs & Services → Library** — enable the **Google Picker API** and **Google Drive API**.
3. **APIs & Services → Credentials → Create Credentials → API key.** Restrict it (Application restrictions → HTTP referrers) to your site's URL, e.g. `https://slingman.github.io/*`, plus `http://localhost:*` if you want to test locally.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → Application type **Web application**. Under Authorized JavaScript origins, add the same URL(s) as step 3 (no trailing slash or path).
5. **APIs & Services → OAuth consent screen** — set User type to **External**, fill in the required fields, and under **Test users** add the Google account that will use the picker (Lotus's). Leave the app in "Testing" status — no Google verification needed for personal use; she'll just see a one-time "Google hasn't verified this app" click-through on first sign-in.
6. Open `assets/timeline.js`, find `GOOGLE_API_KEY` and `GOOGLE_CLIENT_ID` near the Google Drive picker code, and paste in the API key from step 3 and the Client ID from step 4.

Until those two values are filled in, the "Choose from Drive" buttons stay disabled and pasting a link manually keeps working exactly as before. The picker only ever requests the narrow `drive.file` scope — it can see a file only after she explicitly picks it, never the rest of her Drive.

## Important
This is a planning dashboard, not an authoritative deadline database. Deadlines, testing policies, application platforms and requirements can change year to year — verify each school's current admissions, scholarship, financial-aid and testing requirements on its official website before submitting anything.
