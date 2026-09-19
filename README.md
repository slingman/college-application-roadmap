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

The Writing Tracker's doc-link fields (Personal Statement, UC PIQs, Activities List, and per-essay-prompt links) work fine with a pasted URL out of the box. To enable the "Choose from Drive" buttons instead — which also unlocks last-edited time and live word count for Personal Statement/PIQs — you need your own Google Cloud credentials. This can't be preconfigured since it's tied to a Google account:

1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and create a project (any name, e.g. "Lotus College Roadmap").
2. **APIs & Services → Library** — enable the **Google Picker API**, **Google Drive API**, and **Google Docs API** (the last one powers the live word count).
3. **APIs & Services → Credentials → Create Credentials → API key.** Under **API restrictions**, restrict it to just those three APIs. Leave **Application restrictions** set to **None** — an HTTP referrer restriction here will break the Picker specifically (it renders in a Google-hosted iframe that doesn't reliably pass your site's referrer), so the API restriction is what actually locks this key down.
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID** → Application type **Web application**. Under Authorized JavaScript origins, add your site's URL, e.g. `https://slingman.github.io` (no trailing slash or path), plus `http://localhost:PORT` if you want to test locally.
5. **APIs & Services → OAuth consent screen** — set User type to **External**, fill in the required fields, and under **Test users** (Audience tab) add every Google account that will use the picker (yours for testing, Lotus's for real use — up to 100 test users). Then on the **Data Access** tab, click **Add or Remove Scopes** and add both `.../auth/drive.file` and `.../auth/documents.readonly` — scopes have to be declared here before the code can request them. Leave the app in "Testing" status — no Google verification needed for personal use; listed test users will just see a one-time "Google hasn't verified this app" click-through on first sign-in.
6. Open `assets/timeline.js`, find `GOOGLE_API_KEY` and `GOOGLE_CLIENT_ID` near the Google Drive picker code, and paste in the API key from step 3 and the Client ID from step 4.

Until those two values are filled in, the "Choose from Drive" buttons stay disabled and pasting a link manually keeps working exactly as before. The picker requests `drive.file` (it can see a file only after she explicitly picks it, never the rest of her Drive) plus `documents.readonly` (used only to read the word count of a file already picked that way). Last-edited time and word count only ever show up for a doc added via the picker — a pasted link has no permission behind it, so stats just stay blank for it, same as before she signs in for the first time each session.

## Important
This is a planning dashboard, not an authoritative deadline database. Deadlines, testing policies, application platforms and requirements can change year to year — verify each school's current admissions, scholarship, financial-aid and testing requirements on its official website before submitting anything.
