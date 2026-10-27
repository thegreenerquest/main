# GreenerQuest 🌱

**GreenerQuest** is a gamified sustainability analytics website that helps students, employees, and individuals explore everyday activities that contribute to their carbon impact. It turns questionnaire responses into an educational emissions summary, participation points, badges, and a downloadable PDF report.

> **Important:** The report is an educational estimate of selected activities, not a complete carbon footprint, verified offset calculation, or official certification.

## Features

- **Audience-specific journeys:** Educational institutions, corporate employees, and individuals.
- **Questionnaire-based assessment:** Questions cover travel, energy use, food and consumption habits, and waste.
- **Engagement:** Participation XP, activity badges, and GreenerQuest tiers.
- **Emissions summary:** Estimates selected travel and electricity emissions when sufficient information is available; unavailable categories are marked as not estimated rather than treated as zero.
- **PDF report:** Participants can download a summary after entering a valid email address.
- **Optional Google integration:** Saves submissions to Google Sheets and archives JSON snapshots in Google Drive when configured.

## Audience journeys

- **Educational institutions:** Junior school, senior school, and college student journeys.
- **Corporates:** Employee journey.
- **Individuals:** Personal journey.

## Technology

- HTML, CSS, and JavaScript
- Node.js built-in HTTP server
- Google Sheets API and Google Drive API (optional, for submission storage and archiving)
- Google OAuth 2.0 (for Google integration)

No npm package installation is required for the current version. Use Node.js 18 or newer.

## Project structure

```text
GreenQuest/
├── assets/
│   └── greenquest-earth-footprint.png
├── index.html
├── educational-institution.html
├── corporates.html
├── school.html
├── junior.html
├── college.html
├── employee.html
├── individual.html
├── styles.css
├── home.js
├── app.js
├── server.js
├── .env.example
├── .gitignore
└── README.md
```

## Run locally

### 1. Install Node.js

Install **Node.js 18 or newer** from [nodejs.org](https://nodejs.org/).

Verify the installation:

```bash
node --version
```

### 2. Download or clone the repository

If you have Git installed:

```bash
git clone <your-repository-url>
cd GreenQuest
```

Alternatively, download the repository as a ZIP file from GitHub and extract it.

### 3. Configure environment variables

The site can be started without Google credentials, but automatic submission storage will not work until Google Sheets and Drive are connected.

Copy `.env.example` to `.env` and fill in the required values if you want Google integration.

On macOS/Linux:

```bash
cp .env.example .env
```

On Windows Command Prompt:

```cmd
copy .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Keep `.env` private. **Never commit OAuth client secrets, passwords, access tokens, or other credentials to GitHub.**

### 4. Start the server

From the project directory, run:

```bash
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Press `Ctrl+C` in the terminal to stop the server.

## Optional: Configure Google Sheets and Drive

Google integration is optional. To enable automatic submission storage and JSON archiving:

1. Create a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Sheets API** and **Google Drive API**.
3. Configure the OAuth consent screen and create an OAuth 2.0 client with application type **Web application**.
4. Add this authorized redirect URI for local development:
   `http://localhost:3000/auth/google/callback`
5. Copy `.env.example` to `.env` and configure:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI`
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `DRIVE_ADMIN_USER`
   - `DRIVE_ADMIN_PASSWORD`
6. Ensure the Google account used for authorization has permission to edit the target spreadsheet and add files to the target Drive folder.
7. Start the server and visit `http://localhost:3000/auth/google` to authorize access.

For deployment, configure the exact HTTPS site origin and matching OAuth redirect URI. Use secure secret storage and persistent private storage for the OAuth token. Review Google's current API scope and OAuth verification requirements before making the integration available publicly.

### Environment variables

| Variable | Purpose |
|---|---|
| `PORT` | Local server port; defaults to `3000` |
| `APP_ORIGIN` | Base URL of the application |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL |
| `GOOGLE_SHEETS_ID` | Destination spreadsheet ID |
| `GOOGLE_DRIVE_FOLDER_ID` | Destination Drive folder ID |
| `DRIVE_ADMIN_USER` | Username for restricting the data-connection route |
| `DRIVE_ADMIN_PASSWORD` | Strong password for that route |

Do not publish real spreadsheet or folder IDs if they are intended to remain private.

## Emissions methodology and limitations

The application presents a **partial tracked activity subtotal**, not a full personal carbon footprint.

- Travel estimates depend on the transport mode, distance, and travel frequency provided.
- Electricity estimates are available only when sufficient electricity-use and household-sharing information is supplied.
- Other categories may be displayed as **Not estimated** when the data needed to calculate them are not collected.
- Reference factors are educational proxies and may not represent country-specific or individual circumstances.
- XP, badges, and tiers are engagement features, not official environmental ratings or certifications.
- Carbon-credit purchases or verified offsets are not performed by this application.

Methodology references used by the application include:

- [Ember — Global Electricity Review 2026 supporting materials](https://ember-energy.org/latest-insights/global-electricity-review-2026/supporting-materials/)
- [Ember — Major countries and regions](https://ember-energy.org/latest-insights/global-electricity-review-2026/major-countries-and-regions/)
- [Ember — European Electricity Review 2026](https://ember-energy.org/latest-insights/european-electricity-review-2026/2025-at-a-glance/)
- [UK Government — Greenhouse gas reporting conversion factors 2026](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026)

## Data and privacy considerations

The questionnaire collects a valid email address for the report and may also collect a participant's name and age. When Google integration is configured, submission details, answers, and emissions summaries are stored in the configured Google Sheet and a JSON snapshot is saved in the configured Drive folder.

Before collecting real participant data or deploying publicly:

- Publish an appropriate privacy notice and explain the purpose of collection and retention.
- Collect only the data needed for the project.
- Restrict spreadsheet, Drive, and server access to authorized people.
- Use HTTPS in production and protect OAuth credentials and tokens.
- Test the Google integration and access permissions before launch.

## Contributing

1. Create a branch for your change.
2. Make and test your changes locally.
3. Commit with a clear message.
4. Push the branch and open a pull request.

## License

No license has been specified yet. Unless a license is added to this repository, reuse and redistribution are not automatically permitted.
