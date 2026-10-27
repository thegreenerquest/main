# GreenerQuest

GreenerQuest is a large-text, gamified carbon activity questionnaire for students, employees, and individuals. The home page offers three audience cards: **Educational Institution**, **Corporates**, and **Individuals**. Educational Institution opens a page with Junior School, Senior School, and College Students quiz cards; Corporates opens an Employee card; Individuals opens the personal quiz directly. Each questionnaire section advances with **Next** and awards participation XP. At least 85% of questions on each path are required. The final page shows the score, badges, and an activity-data summary.

## Run locally

Use Node.js 18 or newer. No package install is required.

1. Copy `.env.example` to `.env` and set the Google OAuth values described below. You can run the website without Google credentials, but automatic submission storage will stay unavailable until Google Sheets and Drive are connected.
2. Start the site with `node server.js`.
3. Open `http://localhost:3000`.

In the final questionnaire section, participants enter a valid email address and may also provide their name and age. When they finish, the site automatically appends their details, answers, and calculated emissions to the configured Google Sheet and archives a JSON snapshot in the configured Google Drive folder. Google data collection is handled by the site; there is no participant save button. Participants can download a PDF report after entering a valid email. The PDF includes any name and age provided, the overall tracked subtotal, section-by-section amounts or “Not estimated” status, field badges, GreenerQuest tier, and calculation notes.

## Emissions report

Participants choose a country before starting. The country list is alphabetized and includes Australia, China, Europe, India, Japan, Other country (global average), United Kingdom, and United States. Electricity estimates use 2025 grid-generation intensity factors from Ember's 2026 electricity review and supporting data. Europe uses the European Union-wide 2025 generation intensity of 210 gCO2e/kWh as a regional proxy. Ember's 2025 annual data are estimates and may be revised. Travel estimates use UK DESNZ 2026 factors as educational reference proxies because the questionnaire does not yet collect country-specific travel factors. Public transport is represented with a local-bus proxy. Commutes are annualized over 40 school weeks or 48 college/work weeks; car estimates use the reported ride-sharing answer.

Reference material: [Ember 2026 review and dataset](https://ember-energy.org/latest-insights/global-electricity-review-2026/supporting-materials/), [Ember 2026 regional intensity data](https://ember-energy.org/latest-insights/global-electricity-review-2026/major-countries-and-regions/), [Ember European Electricity Review 2026](https://ember-energy.org/latest-insights/european-electricity-review-2026/2025-at-a-glance/), and [UK DESNZ 2026 greenhouse-gas conversion factors](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026).

The report is deliberately a **partial tracked activity subtotal**, not a full personal footprint. It estimates commute emissions when mode, distance, and days are available, plus electricity for school/college when enough kWh and household-sharing data are provided. Meals, purchases, waste, flight counts without route distances, and employee electricity are shown as not estimated. A missing category is never treated as zero. The gamified tier uses these bands: Platinum at or below 500 kg/year, Gold at or below 1,500, Silver at or below 3,000, and Bronze above 3,000 kg CO2e/year. These are educational game tiers, not official benchmarks or certifications.

## Connect the research Google Sheet and Drive archive

The destination spreadsheet is configured as `1YUhKhtfuvdEaPBmaKNyVLrOqLEluXWaVE7_qbZoKN2s` by default. The connected Google account must be able to edit that spreadsheet and add files to the archive folder `1kbBbJJR11_4BNhIiOjQ_1iiqmTLmD4KQ`.

1. In Google Cloud Console, create a project and enable both the Google Drive API and Google Sheets API. Create an OAuth client with application type **Web application**.
2. Add the redirect URI `http://localhost:3000/auth/google/callback` to the OAuth client. When deployed, use the matching HTTPS callback URL for that site instead.
3. Copy `.env.example` to `.env`. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REDIRECT_URI`; set `GOOGLE_SHEETS_ID` to the supplied spreadsheet ID and keep `GOOGLE_DRIVE_FOLDER_ID` set to the archive folder ID. Set a private `DRIVE_ADMIN_USER` and a long, unique `DRIVE_ADMIN_PASSWORD`.
4. If the OAuth consent screen is in testing mode, add the Google account that can edit the spreadsheet and folder as a test user.
5. Start the server, then visit `/auth/google` on the same origin. Sign in with the Google account that can edit the spreadsheet and add files to the folder, then grant the requested Sheets and Drive access. The server stores a refresh token in `.carbon-quest-drive-token.json`. If a Drive-only connection already exists, reconnect after this update so Google grants the new Sheets scope.
6. Keep `.env` and `.carbon-quest-drive-token.json` private. For a public deployment, use HTTPS, persistent private storage for the token, and configure the exact deployed `APP_ORIGIN`, OAuth redirect URI, spreadsheet ID, and Drive folder ID. Do not use the example admin password.

On the first submission, GreenerQuest creates three research tabs if needed, keeping their established **GreenQuest** names so existing research records remain together: **GreenQuest Submissions** (one summary row per participant), **GreenQuest Responses** (one row per answered question), and **GreenQuest Emissions** (one row per activity section, including unestimated sections and reasons). It adds column headers to blank tabs. Existing tabs with those names must use GreenerQuest's expected headers; other spreadsheet tabs are left untouched. The same submission is also archived as a JSON file in the configured Drive folder.

The app requests the Google Sheets scope to append research records. It requests Google Drive access because the archive folder is a pre-existing folder supplied by ID. Google's narrower `drive.file` scope is intended for files opened or shared with an app, including through Google Picker; this app does not use Picker. The server only creates submission files in the configured folder, but the authorized OAuth token has broader Drive scope. Review Google's current [Drive API scope guidance](https://developers.google.com/workspace/drive/api/guides/api-specific-auth) and OAuth verification requirements before publishing broadly.

## Stored submission fields

The spreadsheet and Drive JSON snapshot include the participant email, any optional name and age, audience path, timestamp, selected country, XP, earned field badges, answers, the tracked emissions subtotal, and a summary for every questionnaire section. The email is collected in the final questionnaire section for the PDF download and is stored with the activity entry for program data collection. XP is a participation score; the GreenerQuest tier is a gamified band applied to the partial subtotal.
