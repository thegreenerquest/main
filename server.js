const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs/promises');
const crypto = require('node:crypto');

loadEnvFile();

const PORT = Number(process.env.PORT || 3000);
const APP_ORIGIN = process.env.APP_ORIGIN || `http://localhost:${PORT}`;
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1kbBbJJR11_4BNhIiOjQ_1iiqmTLmD4KQ';
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1YUhKhtfuvdEaPBmaKNyVLrOqLEluXWaVE7_qbZoKN2s';
const TOKEN_PATH = process.env.CARBON_QUEST_TOKEN_PATH || path.join(__dirname, '.carbon-quest-drive-token.json');
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
// The target is an existing folder supplied by the site owner (not selected via
// Google Picker), so Drive's per-file drive.file scope cannot grant access to it.
const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive';
const GOOGLE_SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const GOOGLE_SCOPES = `${GOOGLE_DRIVE_SCOPE} ${GOOGLE_SHEETS_SCOPE}`;
const RESEARCH_TABS = {
  submissions: {
    title: 'GreenQuest Submissions',
    headers: ['submission_id', 'submitted_at', 'email', 'audience_path', 'country', 'grid_kg_co2e_per_kwh', 'grid_g_co2e_per_kwh', 'grid_dataset_year', 'xp', 'field_badges_json', 'total_emissions_kg_co2e_year', 'tier', 'estimated_sections', 'total_sections', 'section_emissions_json', 'methodology', 'data_note', 'response_count', 'name', 'age']
  },
  responses: {
    title: 'GreenQuest Responses',
    headers: ['submission_id', 'submitted_at', 'audience_path', 'country', 'section', 'question', 'answer', 'unit']
  },
  emissions: {
    title: 'GreenQuest Emissions',
    headers: ['submission_id', 'submitted_at', 'audience_path', 'country', 'section', 'emissions_kg_co2e_year', 'estimated', 'reason', 'overall_emissions_kg_co2e_year', 'tier', 'grid_kg_co2e_per_kwh', 'grid_dataset_year']
  }
};
const allowedPaths = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/educational-institution.html', 'educational-institution.html'],
  ['/corporates.html', 'corporates.html'],
  ['/school.html', 'school.html'],
  ['/junior.html', 'junior.html'],
  ['/college.html', 'college.html'],
  ['/employee.html', 'employee.html'],
  ['/individual.html', 'individual.html'],
  ['/assets/greenquest-earth-footprint.png', 'assets/greenquest-earth-footprint.png'],
  ['/styles.css', 'styles.css'],
  ['/app.js', 'app.js'],
  ['/home.js', 'home.js']
]);
const oauthStates = new Map();
const submissionAttempts = new Map();

function loadEnvFile() {
  try {
    const contents = require('node:fs').readFileSync(path.join(__dirname, '.env'), 'utf8');
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match || match[1] in process.env) continue;
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(data));
}

function sendPage(response, statusCode, title, message) {
  const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><body style="font:16px system-ui;max-width:650px;margin:12vh auto;padding:24px;color:#23352e;background:#ffffff"><h1>${escape(title)}</h1><p>${escape(message)}</p><p><a href="/index.html">Return to GreenerQuest</a></p></body></html>`;
  response.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(html);
}

function hasGoogleConfig() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REDIRECT_URI);
}

function secureEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function isGoogleDataAdmin(request) {
  const username = process.env.DRIVE_ADMIN_USER;
  const password = process.env.DRIVE_ADMIN_PASSWORD;
  const header = request.headers.authorization || '';
  if (!username || !password || !header.startsWith('Basic ')) return false;
  let credentials;
  try {
    credentials = Buffer.from(header.slice(6), 'base64').toString('utf8');
  } catch {
    return false;
  }
  const colon = credentials.indexOf(':');
  if (colon < 0) return false;
  return secureEqual(credentials.slice(0, colon), username) && secureEqual(credentials.slice(colon + 1), password);
}

function requireGoogleDataAdmin(request, response) {
  if (!isGoogleDataAdmin(request)) {
    response.writeHead(401, { 'WWW-Authenticate': 'Basic realm="GreenerQuest data collection setup", charset="UTF-8"', 'Cache-Control': 'no-store' });
    response.end('Google data collection setup is restricted to the site administrator.');
    return false;
  }
  return true;
}

async function readJsonBody(request, maxBytes = 64 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw Object.assign(new Error('The submission is too large.'), { statusCode: 413 });
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw Object.assign(new Error('The submission was not valid JSON.'), { statusCode: 400 });
  }
}

function cleanSubmission(data) {
  const track = String(data?.studentPath || '').toLowerCase();
  const trackLabels = {
    school: 'School',
    'junior school': 'Junior School',
    'senior school': 'Senior School',
    college: 'College',
    employee: 'Employee',
    individual: 'Individual'
  };
  if (!trackLabels[track]) throw Object.assign(new Error('Choose a valid questionnaire path.'), { statusCode: 400 });
  const email = String(data?.email || '').trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw Object.assign(new Error('Enter a valid email address to submit this activity report.'), { statusCode: 400 });
  }
  const rawName = data?.name ?? '';
  if (typeof rawName !== 'string' || rawName.length > 120) {
    throw Object.assign(new Error('The name must be 120 characters or fewer.'), { statusCode: 400 });
  }
  const name = rawName.trim();
  const rawAge = data?.age;
  const age = rawAge === '' || rawAge === null || rawAge === undefined ? '' : Number(rawAge);
  if (age !== '' && (!Number.isInteger(age) || age < 1 || age > 120)) {
    throw Object.assign(new Error('Enter an age from 1 to 120, or leave it blank.'), { statusCode: 400 });
  }
  if (!Array.isArray(data.responses) || data.responses.length > 40) throw Object.assign(new Error('The submission has an invalid response list.'), { statusCode: 400 });

  const responses = data.responses.map((response) => {
    if (!response || typeof response.category !== 'string' || typeof response.question !== 'string') {
      throw Object.assign(new Error('One or more answers were not valid.'), { statusCode: 400 });
    }
    const answer = response.answer;
    const validAnswer = typeof answer === 'string' || typeof answer === 'number' || (Array.isArray(answer) && answer.length <= 10 && answer.every((item) => typeof item === 'string'));
    if (!validAnswer || response.category.length > 100 || response.question.length > 240) {
      throw Object.assign(new Error('One or more answers were not valid.'), { statusCode: 400 });
    }
    return {
      category: response.category.slice(0, 100),
      question: response.question.slice(0, 240),
      answer,
      ...(typeof response.unit === 'string' ? { unit: response.unit.slice(0, 40) } : {})
    };
  });

  const xp = Number.isFinite(Number(data.score?.xp)) ? Math.max(0, Math.min(10000, Math.round(Number(data.score.xp)))) : 0;
  const fieldBadges = Array.isArray(data.score?.fieldBadges) ? data.score.fieldBadges.filter((badge) => typeof badge === 'string').slice(0, 10).map((badge) => badge.slice(0, 80)) : [];
  const gridFactors = {
    australia: { name: 'Australia', kgPerKwh: 0.525, gPerKwh: 525 },
    china: { name: 'China', kgPerKwh: 0.525, gPerKwh: 525 },
    europe: { name: 'Europe', kgPerKwh: 0.210, gPerKwh: 210 },
    india: { name: 'India', kgPerKwh: 0.670, gPerKwh: 670 },
    japan: { name: 'Japan', kgPerKwh: 0.477, gPerKwh: 477 },
    'united-kingdom': { name: 'United Kingdom', kgPerKwh: 0.2174, gPerKwh: 217.4 },
    'united-states': { name: 'United States', kgPerKwh: 0.384, gPerKwh: 384 },
    global: { name: 'Global average (other country)', kgPerKwh: 0.458, gPerKwh: 458 }
  };
  const countryFactor = gridFactors[data.country?.key];
  if (!countryFactor) throw Object.assign(new Error('Choose a valid country for the emissions report.'), { statusCode: 400 });
  const rawSections = Array.isArray(data.emissions?.sections) ? data.emissions.sections.slice(0, 8) : [];
  const sections = rawSections.map((section) => {
    const kg = section?.kg === null ? null : Number(section?.kg);
    if (typeof section?.title !== 'string' || section.title.length > 120 || !Number.isFinite(kg) && kg !== null || (kg !== null && (kg < 0 || kg > 1e9))) {
      throw Object.assign(new Error('The emissions summary was not valid.'), { statusCode: 400 });
    }
    return {
      title: section.title.slice(0, 120),
      kg,
      reason: typeof section.reason === 'string' ? section.reason.slice(0, 500) : ''
    };
  });
  const totalKg = data.emissions?.totalKg === null ? null : Number(data.emissions?.totalKg);
  if (!Number.isFinite(totalKg) && totalKg !== null || (totalKg !== null && (totalKg < 0 || totalKg > 1e9))) {
    throw Object.assign(new Error('The emissions total was not valid.'), { statusCode: 400 });
  }
  const allowedTiers = ['Platinum', 'Gold', 'Silver', 'Bronze', null];
  const tier = allowedTiers.includes(data.emissions?.tier) ? data.emissions.tier : null;
  const estimatedSections = Math.max(0, Math.min(sections.length, Math.round(Number(data.emissions?.coverage?.estimatedSections) || 0)));
  return {
    submissionId: crypto.randomUUID(),
    questionnaire: 'GreenerQuest',
    studentPath: trackLabels[track],
    email,
    name,
    age,
    submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt.slice(0, 40) : new Date().toISOString(),
    score: { xp, fieldBadges },
    country: { key: data.country.key, name: countryFactor.name, gridKgPerKwh: countryFactor.kgPerKwh, gridGPerKwh: countryFactor.gPerKwh, datasetYear: 2025 },
    emissions: {
      totalKg,
      tier,
      coverage: { estimatedSections, totalSections: Math.max(0, Math.min(8, Math.round(Number(data.emissions?.coverage?.totalSections) || sections.length))) },
      sections,
      methodology: 'Partial tracked activity subtotal; 2025 country grid factor and UK travel-factor reference proxies are documented by the questionnaire.'
    },
    note: 'Emissions are a partial tracked activity subtotal. Unmeasured sections are not zero; the tier is gamified and is not a certification.',
    responses
  };
}

async function loadSavedRefreshToken() {
  try {
    const saved = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf8'));
    return saved.refresh_token || null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function saveRefreshToken(refreshToken) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify({ refresh_token: refreshToken }), { encoding: 'utf8', mode: 0o600 });
  await fs.chmod(TOKEN_PATH, 0o600);
}

async function getAccessToken() {
  if (!hasGoogleConfig()) throw Object.assign(new Error('Google data collection is not configured. The site administrator must add the Google OAuth settings.'), { statusCode: 503 });
  const refreshToken = await loadSavedRefreshToken();
  if (!refreshToken) throw Object.assign(new Error('Google data collection is not connected yet. The site administrator must authorize Google Sheets and Drive.'), { statusCode: 503 });

  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  const tokenData = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokenData.access_token) throw Object.assign(new Error('Google authorization expired. The site administrator must reconnect Google Sheets and Drive.'), { statusCode: 503 });
  return tokenData.access_token;
}

async function saveSubmissionToDrive(data, accessToken) {
  const boundary = `carbonquest_${crypto.randomBytes(12).toString('hex')}`;
  const trackSlug = data.studentPath.toLowerCase();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `carbon-quest-${trackSlug}-${timestamp}.json`;
  const metadata = { name: fileName, mimeType: 'application/json', parents: [FOLDER_ID] };
  const payload = JSON.stringify(data, null, 2);
  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${payload}\r\n--${boundary}--`)
  ]);
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': String(body.length)
    },
    body
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.id) {
    console.error('Drive save failed with status', response.status, result.error?.status || 'unknown error');
    throw Object.assign(new Error('Google Drive could not save this submission. Check the connected account and folder access.'), { statusCode: 502 });
  }
  return { id: result.id, name: result.name || fileName };
}

function sheetsApiUrl(endpoint) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(SPREADSHEET_ID)}${endpoint}`;
}

async function googleSheetsRequest(endpoint, accessToken, options = {}) {
  const response = await fetch(sheetsApiUrl(endpoint), {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = result.error?.status || result.error?.message || `HTTP ${response.status}`;
    console.error('Google Sheets request failed:', reason);
    throw Object.assign(new Error('Google Sheets could not save this submission. Check that the Sheets API is enabled and the connected account can edit the destination sheet.'), { statusCode: 502 });
  }
  return result;
}

function cellValue(value) {
  if (value === null || value === undefined) return { userEnteredValue: { stringValue: '' } };
  if (typeof value === 'number' && Number.isFinite(value)) return { userEnteredValue: { numberValue: value } };
  if (typeof value === 'boolean') return { userEnteredValue: { boolValue: value } };
  return { userEnteredValue: { stringValue: String(value) } };
}

function appendCellsRequest(sheetId, rows) {
  return {
    appendCells: {
      sheetId,
      rows: rows.map((row) => ({ values: row.map(cellValue) })),
      fields: 'userEnteredValue'
    }
  };
}

async function getResearchSheetIds(accessToken) {
  const metadata = await googleSheetsRequest('?fields=sheets.properties(sheetId,title)', accessToken);
  const sheets = metadata.sheets || [];
  const missing = Object.values(RESEARCH_TABS).filter((tab) => !sheets.some((sheet) => sheet.properties?.title === tab.title));
  if (missing.length) {
    await googleSheetsRequest(':batchUpdate', accessToken, {
      method: 'POST',
      body: JSON.stringify({ requests: missing.map((tab) => ({ addSheet: { properties: { title: tab.title } } })) })
    });
    return getResearchSheetIds(accessToken);
  }
  const ids = {};
  for (const [key, tab] of Object.entries(RESEARCH_TABS)) {
    ids[key] = sheets.find((sheet) => sheet.properties?.title === tab.title).properties.sheetId;
  }
  return ids;
}

async function ensureResearchHeaders(accessToken, sheetIds) {
  const ranges = Object.values(RESEARCH_TABS).map((tab) => `'${tab.title}'!1:1`);
  const query = new URLSearchParams();
  for (const range of ranges) query.append('ranges', range);
  query.set('includeGridData', 'true');
  query.set('fields', 'sheets(properties(title),data(rowData(values(userEnteredValue))))');
  const result = await googleSheetsRequest(`?${query.toString()}`, accessToken);
  const requests = [];
  for (const [key, tab] of Object.entries(RESEARCH_TABS)) {
    const sheet = (result.sheets || []).find((entry) => entry.properties?.title === tab.title);
    const row = sheet?.data?.[0]?.rowData?.[0]?.values || [];
    const existing = row.map((cell) => {
      const value = cell.userEnteredValue || {};
      return value.stringValue ?? value.numberValue ?? value.boolValue ?? '';
    });
    while (existing.length && existing[existing.length - 1] === '') existing.pop();
    const hasHeader = existing.some((value) => value !== '');
    if (!hasHeader) {
      requests.push(appendCellsRequest(sheetIds[key], [tab.headers]));
    } else if (existing.length < tab.headers.length && existing.every((header, index) => header === tab.headers[index])) {
      requests.push({
        updateCells: {
          start: { sheetId: sheetIds[key], rowIndex: 0, columnIndex: existing.length },
          rows: [{ values: tab.headers.slice(existing.length).map(cellValue) }],
          fields: 'userEnteredValue'
        }
      });
    } else if (existing.length !== tab.headers.length || tab.headers.some((header, index) => existing[index] !== header)) {
      throw Object.assign(new Error(`The ${tab.title} tab already has different column headings. Rename that tab or clear its first row so GreenerQuest can create its research columns.`), { statusCode: 503 });
    }
  }
  if (requests.length) {
    await googleSheetsRequest(':batchUpdate', accessToken, { method: 'POST', body: JSON.stringify({ requests }) });
  }
}

async function saveSubmissionToSheet(data, accessToken) {
  const sheetIds = await getResearchSheetIds(accessToken);
  await ensureResearchHeaders(accessToken, sheetIds);
  const sectionDetails = JSON.stringify(data.emissions.sections.map((section) => ({ title: section.title, kg: section.kg, reason: section.reason })));
  const submissionRow = [
    data.submissionId,
    data.submittedAt,
    data.email,
    data.studentPath,
    data.country.name,
    data.country.gridKgPerKwh,
    data.country.gridGPerKwh,
    data.country.datasetYear,
    data.score.xp,
    JSON.stringify(data.score.fieldBadges),
    data.emissions.totalKg,
    data.emissions.tier || '',
    data.emissions.coverage.estimatedSections,
    data.emissions.coverage.totalSections,
    sectionDetails,
    data.emissions.methodology,
    data.note,
    data.responses.length,
    data.name,
    data.age
  ];
  const responseRows = data.responses.map((response) => [
    data.submissionId,
    data.submittedAt,
    data.studentPath,
    data.country.name,
    response.category,
    response.question,
    Array.isArray(response.answer) ? JSON.stringify(response.answer) : response.answer,
    response.unit || ''
  ]);
  const emissionsRows = data.emissions.sections.map((section) => [
    data.submissionId,
    data.submittedAt,
    data.studentPath,
    data.country.name,
    section.title,
    section.kg,
    Number.isFinite(section.kg),
    section.reason,
    data.emissions.totalKg,
    data.emissions.tier || '',
    data.country.gridKgPerKwh,
    data.country.datasetYear
  ]);
  const requests = [
    appendCellsRequest(sheetIds.submissions, [submissionRow]),
    ...(responseRows.length ? [appendCellsRequest(sheetIds.responses, responseRows)] : []),
    ...(emissionsRows.length ? [appendCellsRequest(sheetIds.emissions, emissionsRows)] : [])
  ];
  await googleSheetsRequest(':batchUpdate', accessToken, { method: 'POST', body: JSON.stringify({ requests }) });
  return { submissionId: data.submissionId };
}

function allowSubmissionRate(request) {
  const address = request.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempts = (submissionAttempts.get(address) || []).filter((time) => now - time < 60 * 60 * 1000);
  if (attempts.length >= 30) return false;
  attempts.push(now);
  submissionAttempts.set(address, attempts);
  return true;
}

function sendStaticFile(request, response, filename) {
  const extension = path.extname(filename);
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };
  fs.readFile(path.join(__dirname, filename)).then((content) => {
    response.writeHead(200, { 'Content-Type': types[extension] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    response.end(content);
  }).catch(() => {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  });
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (request.method === 'GET' && url.pathname === '/api/drive-status') {
    const connected = hasGoogleConfig() && Boolean(await loadSavedRefreshToken());
    sendJson(response, 200, { connected });
    return;
  }

  if (request.method === 'GET' && url.pathname === '/auth/google') {
    if (!requireGoogleDataAdmin(request, response)) return;
    if (!hasGoogleConfig()) {
      sendPage(response, 503, 'Google data collection setup is incomplete', 'Add the Google OAuth client settings to the private .env file before connecting Google Sheets and Drive.');
      return;
    }
    const state = crypto.randomBytes(24).toString('hex');
    oauthStates.set(state, Date.now());
    for (const [savedState, createdAt] of oauthStates) if (Date.now() - createdAt > 10 * 60 * 1000) oauthStates.delete(savedState);
    const authUrl = new URL(GOOGLE_AUTH_URL);
    authUrl.search = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      response_type: 'code',
      scope: GOOGLE_SCOPES,
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: 'true',
      state
    }).toString();
    response.writeHead(302, { Location: authUrl.toString(), 'Cache-Control': 'no-store' });
    response.end();
    return;
  }

  if (request.method === 'GET' && url.pathname === '/auth/google/callback') {
    const state = url.searchParams.get('state');
    const createdAt = state && oauthStates.get(state);
    if (!createdAt || Date.now() - createdAt > 10 * 60 * 1000) {
      sendPage(response, 400, 'Could not connect Google data collection', 'The sign-in request expired. Return to GreenerQuest and ask the site administrator to try again.');
      return;
    }
    oauthStates.delete(state);
    if (url.searchParams.get('error')) {
      sendPage(response, 400, 'Google data collection was not connected', 'The account owner cancelled or declined the Google Sheets and Drive permission request.');
      return;
    }
    if (!hasGoogleConfig() || !url.searchParams.get('code')) {
      sendPage(response, 400, 'Could not connect Google data collection', 'Google did not return an authorization code.');
      return;
    }
    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: url.searchParams.get('code'),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    const tokenData = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok) {
      console.error('Google OAuth exchange failed with status', tokenResponse.status, tokenData.error || 'unknown error');
      sendPage(response, 502, 'Could not connect Google data collection', 'Google could not complete the authorization. Check the OAuth redirect URI and try again.');
      return;
    }
    const refreshToken = tokenData.refresh_token || await loadSavedRefreshToken();
    if (!refreshToken) {
      sendPage(response, 502, 'Could not connect Google data collection', 'Google did not return offline access. Reconnect and approve the Sheets and Drive request.');
      return;
    }
    await saveRefreshToken(refreshToken);
    sendPage(response, 200, 'Google data collection connected', 'GreenerQuest will add completed questionnaire answers and calculated emissions to the configured research sheet and archive each submission in the Drive folder.');
    return;
  }

  if (request.method === 'POST' && url.pathname === '/api/submissions') {
    if (!allowSubmissionRate(request)) {
      sendJson(response, 429, { error: 'Too many submissions from this connection. Please try again later.' });
      return;
    }
    if (request.headers.origin !== APP_ORIGIN) {
      sendJson(response, 403, { error: 'This submission must come from the GreenerQuest website.' });
      return;
    }
    try {
      const data = cleanSubmission(await readJsonBody(request));
      const accessToken = await getAccessToken();
      const savedRow = await saveSubmissionToSheet(data, accessToken);
      let driveArchived = false;
      try {
        await saveSubmissionToDrive(data, accessToken);
        driveArchived = true;
      } catch (error) {
        console.error('Drive archive failed for submission', data.submissionId, error.statusCode || error.message);
      }
      sendJson(response, 201, { success: true, id: savedRow.submissionId, driveArchived });
    } catch (error) {
      sendJson(response, error.statusCode || 502, { error: error.statusCode ? error.message : 'Google Sheets could not save this submission. Try again later.' });
    }
    return;
  }

  if (request.method === 'GET' && allowedPaths.has(url.pathname)) {
    sendStaticFile(request, response, allowedPaths.get(url.pathname));
    return;
  }
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('Request failed:', error.message);
    if (!response.headersSent) sendJson(response, 500, { error: 'The request could not be completed.' });
    else response.end();
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`GreenerQuest is running at ${APP_ORIGIN}`);
  if (!hasGoogleConfig()) console.log('Google data collection is not configured; add the private OAuth settings in .env.');
});
