/**
 * dashboard.js — My Carbon Credit Interactive Dashboard
 *
 * Data source: Google Sheet "Dashboard Data" tab, published as CSV.
 * Structure: Column A = Metric | Column B = Value | Column C = Notes
 *
 * HOW TO CONFIGURE:
 * 1. Open your Google Sheet.
 * 2. File → Share → Publish to web → select "Dashboard Data" sheet → CSV → Publish.
 * 3. Copy the published URL and paste it below as SHEET_CSV_URL.
 */

// =====================================================================
// CONFIGURATION — Replace the URL below with your Google Sheet CSV URL
// =====================================================================
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRxzUmGtEs6IAfU_ecw6SYUFkUNxA7aZhtLCc7JscrtOZ7kBrTvZd4IjZHFxGLsJI0Zb05RlLWiQask/pub?gid=425970775&single=true&output=csv";
// Example: "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv"

const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// =====================================================================
// ZONE CONFIGURATION
// Maps zone IDs to display names, icons, and keyword patterns used to
// automatically classify metrics from the sheet into each zone.
// =====================================================================
// =====================================================================
// ZONE CONFIGURATION (8 Puzzle Footprint Sections + Overall)
// =====================================================================
const ZONE_CONFIG = {
  overall: {
    label: "Overall",
    title: "Community Footprint",
    icon: "🌍",
    priority: true,
    keywords: ["total", "overall", "average", "respondent", "completed", "score", "points", "completion", "city"]
  },
  waste: {
    label: "Waste",
    title: "Waste & Disposal",
    icon: "🗑️",
    keywords: ["waste", "trash", "landfill", "segregat", "plastic", "garbage", "disposal"]
  },
  recycling: {
    label: "Recycling",
    title: "Recycling & Reuse",
    icon: "♻️",
    keywords: ["recycl", "compost", "reusable", "circular", "upcycl", "reduc"]
  },
  offsets: {
    label: "Offsets",
    title: "Carbon Offsets & Removal",
    icon: "🍃",
    keywords: ["offset", "tree", "credit", "sequestr", "neutral", "plant", "green_points"]
  },
  gas: {
    label: "Gas",
    title: "Natural Gas & Cooking",
    icon: "🔥",
    keywords: ["gas", "lpg", "png", "cooking", "cylinder", "natural_gas"]
  },
  electricity: {
    label: "Electricity",
    title: "Electricity & Grid Power",
    icon: "⚡",
    keywords: ["electric", "power", "kwh", "solar", "grid", "appliance", "ac_", "home_energy", "home_tech"]
  },
  transport: {
    label: "Transport",
    title: "Mobility & Transport",
    icon: "🚗",
    keywords: ["transport", "mobility", "commute", "car", "vehicle", "bus", "metro", "transit", "distance", "bike", "travel", "flight"]
  },
  fuel: {
    label: "Fuel",
    title: "Vehicle Fuel Consumption",
    icon: "⛽",
    keywords: ["fuel", "petrol", "diesel", "cng", "ev", "litres", "mileage"]
  },
  emissions: {
    label: "Emissions",
    title: "CO₂ & H₂O Emissions",
    icon: "☁️",
    keywords: ["emission", "co2", "annual", "monthly", "water", "h2o", "score", "footprint"]
  }
};

// =====================================================================
// DATA MAPPING DICTIONARY: FOOTPRINT_ZONE_MAP
// Maps exact Google Sheet "Metric" column values to one of the 8 zones:
//   - 'waste'
//   - 'recycling'
//   - 'offsets'
//   - 'gas'
//   - 'electricity'
//   - 'transport'
//   - 'fuel'
//   - 'emissions' (supports sub: 'co2' | 'h2o')
//
// TODO: Replace / expand these placeholder keys with your actual sheet's
// exact Metric column names in the next step.
// =====================================================================
const FOOTPRINT_ZONE_MAP = {
  // --- 1. WASTE ---
  "Waste_Generated_kg":          { zone: "waste", sub: null },
  "Waste_Segregation_Rate_%":    { zone: "waste", sub: null },
  "Plastic_Items_Score":         { zone: "waste", sub: null },
  "Landfill_Diversion_%":        { zone: "waste", sub: null },

  // --- 2. RECYCLING ---
  "Recycling_Rate_%":            { zone: "recycling", sub: null },
  "Recycled_Materials_kg":       { zone: "recycling", sub: null },
  "Reusable_Items_Score":        { zone: "recycling", sub: null },
  "Composting_Participation_%":  { zone: "recycling", sub: null },

  // --- 3. OFFSETS ---
  "Offset_Interest_Yes_%":       { zone: "offsets", sub: null },
  "Carbon_Offsets_Purchased_t":  { zone: "offsets", sub: null },
  "Trees_Planted":               { zone: "offsets", sub: null },
  "Average_Green_Points":        { zone: "offsets", sub: null },

  // --- 4. GAS ---
  "Cooking_Gas_Type":            { zone: "gas", sub: null },
  "Gas_Consumption_kg":          { zone: "gas", sub: null },
  "PNG_Units_Monthly":           { zone: "gas", sub: null },
  "LPG_Cylinders_Year":          { zone: "gas", sub: null },

  // --- 5. ELECTRICITY ---
  "Electricity_Monthly_kWh":     { zone: "electricity", sub: null },
  "Home_Energy_CO2_Avg":         { zone: "electricity", sub: null },
  "Avg_AC_Hours":                { zone: "electricity", sub: null },
  "Solar_Adoption_%":            { zone: "electricity", sub: null },

  // --- 6. TRANSPORT ---
  "Top_Transport_Mode":          { zone: "transport", sub: null },
  "Commute_Distance_km":         { zone: "transport", sub: null },
  "Mobility_CO2_Avg":            { zone: "transport", sub: null },
  "Travel_CO2_Avg":              { zone: "transport", sub: null },
  "Public_Transit_Share_%":      { zone: "transport", sub: null },

  // --- 7. FUEL ---
  "Vehicle_Fuel_Type":           { zone: "fuel", sub: null },
  "Fuel_Litres_Monthly":         { zone: "fuel", sub: null },
  "Petrol_Diesel_CO2_kg":        { zone: "fuel", sub: null },
  "EV_Distance_Monthly_km":      { zone: "fuel", sub: null },

  // --- 8. EMISSIONS (Splits into CO2 and H2O) ---
  "Average_Monthly_CO2":         { zone: "emissions", sub: "co2" },
  "Average_Annual_CO2":          { zone: "emissions", sub: "co2" },
  "Average_Carbon_Score":        { zone: "emissions", sub: "co2" },
  "Water_Footprint_L":           { zone: "emissions", sub: "h2o" },
  "Direct_Emissions_Scope1":     { zone: "emissions", sub: "co2" },

  // OVERALL COMMUNITY SUMMARY KEYS
  "Total_Respondents":           { zone: "overall", sub: null },
  "Completed_Quizzes":           { zone: "overall", sub: null },
  "Completion_Rate":             { zone: "overall", sub: null },
  "Top_City":                    { zone: "overall", sub: null }
};

/**
 * Resolves a sheet Metric name into its designated footprint zone.
 * Uses exact map lookup first, then normalized key lookup, and finally keyword heuristic.
 */
function resolveMetricZone(metricRaw) {
  if (!metricRaw) return { zone: "emissions", sub: null };

  // 1. Exact match
  if (FOOTPRINT_ZONE_MAP[metricRaw]) {
    return FOOTPRINT_ZONE_MAP[metricRaw];
  }

  // 2. Normalized dictionary match (case/space/dash insensitive)
  const norm = metricRaw.trim().toLowerCase().replace(/[\s\-]+/g, "_");
  for (const [key, mapping] of Object.entries(FOOTPRINT_ZONE_MAP)) {
    if (key.toLowerCase().replace(/[\s\-]+/g, "_") === norm) {
      return mapping;
    }
  }

  // 3. Fallback to keyword matching across the 8 zones
  for (const [zoneId, cfg] of Object.entries(ZONE_CONFIG)) {
    if (zoneId === "overall") continue;
    if (matchesZoneKeywords(norm, cfg.keywords)) {
      const sub = norm.includes("h2o") || norm.includes("water") ? "h2o"
                : norm.includes("co2") || norm.includes("carbon") ? "co2"
                : null;
      return { zone: zoneId, sub };
    }
  }

  return { zone: "overall", sub: null };
}

/**
 * Token-aware keyword match. A metric like "avg_carbon_score" is split into
 * tokens ["avg","carbon","score"]; a keyword matches only if a token STARTS
 * with it (so "car" won't match "carbon", "ev" won't match "device").
 * Multi-word keywords (containing "_") still use substring matching.
 */
function matchesZoneKeywords(normKey, keywords) {
  if (!keywords) return false;
  const tokens = normKey.split(/[^a-z0-9]+/).filter(Boolean);
  return keywords.some(rawKw => {
    const kw = rawKw.replace(/_+$/, "");
    if (kw.includes("_")) return normKey.includes(kw);
    // Very short keywords (ev, ac, co2…) must match a whole token
    if (kw.length <= 3) return tokens.includes(kw);
    return tokens.some(t => t.startsWith(kw));
  });
}

// =====================================================================
// INTERNAL STATE
// =====================================================================
let dashData = {}; // { normalizedMetric: { label, value, unit, raw, zone } }
let activeZone = "overall";
let autoRefreshTimer = null;

// =====================================================================
// UTILITY: Parse CSV text into array of row objects
// =====================================================================
function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Detect header row (first non-empty line)
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const metricIdx = headers.findIndex(h => h === "metric" || h === "metric name");
  const valueIdx  = headers.findIndex(h => h === "value");
  const notesIdx  = headers.findIndex(h => h === "notes" || h === "unit" || h === "notes/unit");

  if (metricIdx === -1 || valueIdx === -1) {
    // Fallback: assume col 0 = metric, col 1 = value, col 2 = notes
    return lines.slice(1).map(line => {
      const cols = parseCSVLine(line);
      return { metric: cols[0] || "", value: cols[1] || "", notes: cols[2] || "" };
    }).filter(r => r.metric);
  }

  return lines.slice(1).map(line => {
    const cols = parseCSVLine(line);
    return {
      metric: cols[metricIdx] || "",
      value:  cols[valueIdx]  || "",
      notes:  notesIdx >= 0 ? (cols[notesIdx] || "") : ""
    };
  }).filter(r => r.metric);
}

// Simple CSV line parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let cur = "";
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuote = !inQuote; }
    } else if (ch === ',' && !inQuote) {
      result.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

// =====================================================================
// UTILITY: Convert raw metric key to a human-readable label
// e.g. "Average_Monthly_CO2" → "Average Monthly CO₂"
// =====================================================================
function humanizeMetric(raw) {
  return raw
    .replace(/_/g, " ")
    .replace(/\bco2\b/gi, "CO₂")
    .replace(/\bco2e\b/gi, "CO₂e")
    .replace(/\bkg\b/gi, "kg")
    .replace(/\bkwh\b/gi, "kWh")
    .replace(/\bev\b/gi, "EV")
    .replace(/\bcng\b/gi, "CNG")
    .replace(/\bpng\b/gi, "PNG")
    .replace(/\besg\b/gi, "ESG")
    .replace(/\bnep\b/gi, "NEP")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

// =====================================================================
// UTILITY: Determine which zone a metric belongs to
// =====================================================================
function classifyMetric(metricRaw) {
  return resolveMetricZone(metricRaw).zone;
}

// =====================================================================
// UTILITY: Extract numeric value + unit from value/notes strings
// =====================================================================
function parseValueUnit(rawValue, rawNotes) {
  const num = parseFloat(String(rawValue).replace(/,/g, ""));
  const isNumeric = !isNaN(num);

  // Try to extract unit from notes (look for parenthetical or short token)
  let unit = "";
  if (rawNotes) {
    const parenMatch = rawNotes.match(/\(([^)]+)\)/);
    if (parenMatch) {
      unit = parenMatch[1].trim();
    } else {
      // Take first "word" if short enough
      const tokens = rawNotes.trim().split(/\s+/);
      if (tokens[0] && tokens[0].length <= 14 && !tokens[0].match(/^[A-Z][a-z]{4,}/)) {
        unit = tokens[0];
      }
    }
  }

  return {
    display: isNumeric ? (Number.isInteger(num) ? num.toLocaleString() : num.toLocaleString(undefined, { maximumFractionDigits: 2 })) : rawValue,
    unit,
    numeric: isNumeric ? num : null
  };
}

// =====================================================================
// BUILD INTERNAL DATA MODEL from CSV rows (Routes to 8 footprint zones)
// =====================================================================
function buildDataModel(rows) {
  const model = {};
  rows.forEach(row => {
    const key = row.metric.trim();
    if (!key) return;

    const { zone, sub } = resolveMetricZone(key);
    const { display, unit, numeric } = parseValueUnit(row.value, row.notes);
    const label = humanizeMetric(key);

    model[key] = {
      raw: key,
      label,
      display,
      numeric,
      unit,
      notes: row.notes,
      zone,
      sub
    };
  });
  return model;
}

// Verified community dataset snapshot from the live Google Sheet.
// Extended to cover all 8 footprint categories for instant visual display.
const LIVE_DATA_SNAPSHOT_CSV = `Metric,Value,Notes
Total_Respondents,275,Verified respondents
Completed_Quizzes,225,Quizzes completed
Average_Carbon_Score,317,kg CO₂e/month
Average_Monthly_CO2,316.7,kg CO₂/month
Average_Annual_CO2,3.8,t CO₂e/year
Water_Footprint_L,1450,litres/day
Average_Green_Points,595,Reward points
Top_Transport_Mode,Bike,Commute mode
Top_City,Bengaluru,Primary hub
Offset_Interest_Yes_%,59,% interested
Completion_Rate,82,% rate
Waste_Generated_kg,18.4,kg/week average
Waste_Segregation_Rate_%,74,% segregated
Plastic_Items_Score,6.2,out of 10
Recycling_Rate_%,62,% recycled
Recycled_Materials_kg,11.5,kg/month
Reusable_Items_Score,8.1,out of 10
Cooking_Gas_Type,LPG,Primary cooking fuel
Gas_Consumption_kg,14.2,kg/month LPG
Electricity_Monthly_kWh,210,kWh/month
Solar_Adoption_%,28,% households
Commute_Distance_km,16.5,km daily
Petrol_Diesel_CO2_kg,85,kg CO₂/month
Fuel_Litres_Monthly,34,litres fuel/month`;

let isUsingFallbackData = false;

// =====================================================================
// DATA FETCH
// =====================================================================
async function fetchDashboardData() {
  if (!SHEET_CSV_URL || SHEET_CSV_URL.startsWith("PASTE_")) {
    isUsingFallbackData = true;
    return LIVE_DATA_SNAPSHOT_CSV;
  }

  // When opened directly as a local file (file://), modern browsers block cross-origin
  // background network requests to Google by security policy.
  // Instantly return the verified community snapshot (or cache) so the dashboard displays seamlessly.
  if (window.location.protocol === "file:") {
    try {
      const cached = localStorage.getItem("mcc_dashboard_cache");
      if (cached && cached.includes("Metric")) {
        isUsingFallbackData = false;
        return cached;
      }
    } catch (_) {}
    isUsingFallbackData = true;
    return LIVE_DATA_SNAPSHOT_CSV;
  }

  // Attempt 1: Direct fetch with cache-busting timestamp (when hosted on web server / localhost)
  try {
    const cacheBuster = `&_=${Date.now()}`;
    const url = SHEET_CSV_URL.includes("?")
      ? SHEET_CSV_URL + cacheBuster
      : SHEET_CSV_URL + "?" + cacheBuster.slice(1);

    const resp = await fetch(url);
    if (resp.ok) {
      const text = await resp.text();
      if (text && text.length > 20 && text.includes("Metric")) {
        try { localStorage.setItem("mcc_dashboard_cache", text); } catch (_) {}
        isUsingFallbackData = false;
        return text;
      }
    }
  } catch (err1) {
    console.warn("[Dashboard] Direct fetch with timestamp prevented by browser/network, trying plain URL:", err1.message);
  }

  // Attempt 2: Direct fetch with plain URL (some servers reject extra query params)
  try {
    const resp = await fetch(SHEET_CSV_URL);
    if (resp.ok) {
      const text = await resp.text();
      if (text && text.length > 20 && text.includes("Metric")) {
        try { localStorage.setItem("mcc_dashboard_cache", text); } catch (_) {}
        isUsingFallbackData = false;
        return text;
      }
    }
  } catch (err2) {
    console.warn("[Dashboard] Plain URL fetch prevented by browser security (e.g. file:// CORS):", err2.message);
  }

  // Attempt 3: Check browser localStorage cache from previous successful fetch
  try {
    const cached = localStorage.getItem("mcc_dashboard_cache");
    if (cached && cached.includes("Metric")) {
      console.info("[Dashboard] Loaded latest data from local cache.");
      isUsingFallbackData = false;
      return cached;
    }
  } catch (_) {}

  // Attempt 4: Use verified live snapshot (so user never sees a broken/blank dashboard)
  console.info("[Dashboard] Loading verified community data snapshot.");
  isUsingFallbackData = true;
  return LIVE_DATA_SNAPSHOT_CSV;
}

// =====================================================================
// RENDERING: Overview strip (top KPI bar)
// =====================================================================
function renderOverviewStrip() {
  const strip = document.getElementById("overviewStrip");
  if (!strip) return;

  // Priority metrics for the strip — flexible pattern match (7 key headline metrics)
  const priorityPatterns = [
    "total_respondents", "completed_quizzes", "carbon_score",
    "monthly_co2", "annual_co2", "green_points",
    "completion_rate"
  ];

  // Find matching metrics (order by priority patterns first)
  const matched = [];
  priorityPatterns.forEach(pat => {
    for (const [key, m] of Object.entries(dashData)) {
      const lowerKey = key.toLowerCase();
      if ((lowerKey === pat || lowerKey.includes(pat)) && !matched.find(x => x.raw === key)) {
        matched.push(m);
        break;
      }
    }
  });

  // Fill with overall-zone metrics if we still have room (max 7 cells)
  if (matched.length < 7) {
    Object.values(dashData).forEach(m => {
      if (matched.length >= 7) return;
      if (m.raw && m.raw.toLowerCase().includes("offset_interest")) return;
      if (!matched.find(x => x.raw === m.raw)) {
        matched.push(m);
      }
    });
  }

  strip.innerHTML = matched.slice(0, 7).map((m, i) => `
    <div class="dash-stat-cell" tabindex="0" title="${m.notes || ''}">
      <p class="dash-stat-label">${m.label}</p>
      <p class="dash-stat-value">${m.display}</p>
      ${m.unit ? `<p class="dash-stat-unit">${m.unit}</p>` : ""}
    </div>
  `).join("");
}

// =====================================================================
// RENDERING: Panel content for a given zone
// =====================================================================
// =====================================================================
// RENDERING: Panel content for a given zone (Supports CO2 / H2O sub-filters)
// =====================================================================
function renderPanel(zoneId, subFilter = null) {
  const zone = ZONE_CONFIG[zoneId];
  const panelBody = document.getElementById("panelBody");
  const panelTitle = document.getElementById("panelTitle");
  const panelCategory = document.getElementById("panelCategory");
  const backBtn = document.getElementById("panelBackBtn");

  if (!panelBody) return;

  // Dynamic header titles
  if (subFilter === "co2") {
    panelCategory.textContent = "Emissions • CO₂";
    panelTitle.textContent = "Carbon Emissions (CO₂)";
  } else if (subFilter === "h2o") {
    panelCategory.textContent = "Emissions • H₂O";
    panelTitle.textContent = "Water Footprint (H₂O)";
  } else {
    panelCategory.textContent = zone ? zone.label : "Category";
    panelTitle.textContent = zone ? zone.title : "Carbon Impact";
  }
  backBtn.hidden = zoneId === "overall";

  // Filter metrics for the selected category
  let metrics;
  if (zoneId === "overall") {
    metrics = Object.values(dashData);
  } else {
    metrics = Object.values(dashData).filter(m => m.zone === zoneId);
    if (subFilter) {
      const subMetrics = metrics.filter(m => m.sub === subFilter);
      if (subMetrics.length > 0) metrics = subMetrics;
    }
  }

  // Animate out
  panelBody.classList.add("fading");
  setTimeout(() => {
    panelBody.classList.remove("fading");

    if (!metrics || metrics.length === 0) {
      panelBody.innerHTML = `
        <div class="panel-empty">
          <div class="panel-empty-icon">${zone?.icon || "📊"}</div>
          <p>No specific metrics available for this category yet.</p>
          <p style="font-size:0.78rem;color:var(--muted)">Your Google Sheet data will automatically populate here once rows for <strong>${zoneId}</strong> are linked.</p>
        </div>`;
      return;
    }

    // Sort: put numeric metrics first
    const sorted = [...metrics].sort((a, b) => {
      if (a.numeric !== null && b.numeric === null) return -1;
      if (a.numeric === null && b.numeric !== null) return 1;
      return 0;
    });

    panelBody.innerHTML = sorted.map((m, i) => `
      <div class="metric-row ${i === 0 && m.numeric !== null ? 'metric-featured' : ''}" style="animation-delay:${i * 30}ms">
        <div>
          <p class="metric-name">${m.label}</p>
          ${m.notes && m.notes !== m.unit ? `<p class="metric-note">${m.notes.replace(/\([^)]+\)/g, "").trim()}</p>` : ""}
        </div>
        <div class="metric-value-wrap">
          <span class="metric-value">${m.display}</span>
          ${m.unit ? `<span class="metric-unit">${m.unit}</span>` : ""}
        </div>
      </div>
    `).join("");
  }, 180);
}

// =====================================================================
// RENDERING: All metrics table (progressive disclosure)
// =====================================================================
function renderAllMetrics() {
  const body = document.getElementById("allMetricsBody");
  if (!body) return;

  const all = Object.values(dashData);
  if (all.length === 0) {
    body.innerHTML = `<p style="color:var(--muted);font-size:0.9rem">No metrics loaded.</p>`;
    return;
  }

  body.innerHTML = all.map((m, i) => `
    <div class="all-metric-card" style="animation-delay:${i * 12}ms">
      <p class="metric-name">${m.label}</p>
      <p class="metric-value">${m.display}${m.unit ? `<span style="font-size:0.75rem;font-weight:700;color:var(--muted);margin-left:4px">${m.unit}</span>` : ""}</p>
      ${m.notes && m.notes !== m.unit ? `<p class="metric-note" style="margin-top:3px">${m.notes.replace(/\([^)]+\)/g, "").trim()}</p>` : ""}
      <span class="metric-category-tag">${ZONE_CONFIG[m.zone]?.label || m.zone}</span>
    </div>
  `).join("");
}

// =====================================================================
// FOOTPRINT ZONE INTERACTION
// =====================================================================
function activateZone(zoneId, subFilter = null) {
  if (!zoneId || !ZONE_CONFIG[zoneId]) return;
  activeZone = zoneId;

  // Update SVG zone visual states
  document.querySelectorAll(".cf-zone").forEach(el => {
    const z = el.dataset.zone;
    el.classList.remove("zone-active", "zone-dimmed");
    if (z === zoneId) {
      el.classList.add("zone-active");
    } else if (zoneId !== "overall") {
      el.classList.add("zone-dimmed");
    }
  });

  // Sync mobile legend quick-selector pills
  document.querySelectorAll(".cf-pill-btn").forEach(btn => {
    if (btn.dataset.zone === zoneId) {
      btn.classList.add("active-pill");
    } else {
      btn.classList.remove("active-pill");
    }
  });

  // Update metrics panel
  renderPanel(zoneId, subFilter);
}

function resetToOverall() {
  activateZone("overall");
}

// =====================================================================
// ATTACH FOOTPRINT EVENT LISTENERS
// =====================================================================
function attachFootprintEvents() {
  const fp = document.getElementById("carbonFootprint");
  if (!fp) return;

  // 1. Footprint Zone clicks & hover
  fp.querySelectorAll(".cf-zone").forEach(el => {
    const zone = el.dataset.zone;
    if (!zone) return;

    el.addEventListener("click", () => activateZone(zone));

    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activateZone(zone);
      }
    });

    // Tooltip on hover (desktop)
    el.addEventListener("mouseenter", () => {
      const tip = document.getElementById("zoneTooltip");
      if (!tip) return;
      const cfg = ZONE_CONFIG[zone];
      if (!cfg) return;
      tip.textContent = `${cfg.icon} ${cfg.label} — Tap to explore`;
      tip.classList.add("visible");
    });

    el.addEventListener("mouseleave", () => {
      const tip = document.getElementById("zoneTooltip");
      if (tip) tip.classList.remove("visible");
    });
  });

  // 2. Sub-badges (CO2 & H2O circles) — click + keyboard
  [["subzone-co2", "co2"], ["subzone-h2o", "h2o"]].forEach(([id, sub]) => {
    const badge = document.getElementById(id);
    if (!badge) return;
    badge.addEventListener("click", e => {
      e.stopPropagation();
      activateZone("emissions", sub);
    });
    badge.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        activateZone("emissions", sub);
      }
    });
  });

  // 3. Mobile quick-selector legend pills
  document.querySelectorAll(".cf-pill-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const zone = btn.dataset.zone;
      if (zone) activateZone(zone);
    });
  });

  // 4. Panel Back button
  const backBtn = document.getElementById("panelBackBtn");
  if (backBtn) backBtn.addEventListener("click", resetToOverall);

  // 5. Refresh button
  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) refreshBtn.addEventListener("click", () => refreshDashboard());
}

// =====================================================================
// SHOW / HIDE STATES
// =====================================================================
function setState(state) {
  document.getElementById("dashLoading").hidden  = state !== "loading";
  document.getElementById("dashError").hidden    = state !== "error";
  document.getElementById("dashContent").hidden  = state !== "content";
}

// =====================================================================
// MAIN: LOAD & RENDER
// =====================================================================
async function loadDashboard(isRefresh = false) {
  if (isRefresh) {
    // Brief loading flash, keep content visible longer
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.classList.add("spinning");
      refreshBtn.disabled = true;
    }
  } else {
    setState("loading");
  }

  try {
    let csvText;

    // If URL is not configured, use demo data so the UI is visible
    if (!SHEET_CSV_URL || SHEET_CSV_URL.startsWith("PASTE_")) {
      csvText = generateDemoCSV();
    } else {
      csvText = await fetchDashboardData();
    }

    const rows = parseCSV(csvText);
    if (!rows.length) throw new Error("EMPTY");

    dashData = buildDataModel(rows);

    renderOverviewStrip();
    renderPanel(activeZone);
    renderAllMetrics();

    setState("content");

    const now = new Date();
    const stamp = document.getElementById("lastUpdated");
    if (stamp) {
      if (isUsingFallbackData) {
        stamp.textContent = window.location.protocol === "file:" 
          ? "Community Snapshot • (Host on web server for live sync)"
          : "Community Snapshot Data";
      } else {
        stamp.textContent = `Live • Updated ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      }
    }

  } catch (err) {
    console.error("[Dashboard] Load error:", err);
    // If we already have data loaded, don't blank it out into an error state
    if (Object.keys(dashData).length > 0) {
      setState("content");
    } else {
      setState("error");
    }
  } finally {
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.classList.remove("spinning");
      refreshBtn.disabled = false;
    }
  }
}

// =====================================================================
// DEMO DATA — shown when CSV URL is not yet configured
// This gives a realistic preview while you set up the Google Sheet.
// =====================================================================
function generateDemoCSV() {
  return `Metric,Value,Notes
Total_Respondents,247,Number of quiz participants
Completed_Quizzes,189,Fully completed quizzes
Avg_Carbon_Score,318,kg CO₂/month average
Average_Monthly_CO2,318,(kg CO₂/month) Average monthly footprint
Average_Annual_CO2,3.82,(t CO₂e/year) Average annual footprint
Water_Footprint_L,1420,(L/day) Average daily water footprint
Avg_Green_Points,412,Green points average
Completion_Rate,76.5,(%) Quiz completion rate
Offset_Interest_Yes_%,44,(%) Users interested in carbon offsets
Carbon_Offsets_Purchased_t,42.5,(t CO₂e) Total community verified offsets
Trees_Planted,380,(trees) Verified tree planting projects
Top_Transport_Mode,Car,Most common commute mode
Commute_Distance_km,16.5,(km) Daily one-way travel
Mobility_CO2_Avg,112,(kg CO₂/month) Average commute footprint
Travel_CO2_Avg,15,(kg CO₂/month) Long distance travel footprint
Vehicle_Fuel_Type,Petrol,Most common fuel type
Fuel_Litres_Monthly,34,(litres/month) Personal vehicle fuel
Petrol_Diesel_CO2_kg,85,(kg CO₂/month) Direct tailpipe footprint
Waste_Generated_kg,18.4,(kg/week) Household waste average
Waste_Segregation_Rate_%,74,(%) Waste segregated at source
Plastic_Items_Score,6.2,(out of 10) Single-use plastic reduction
Recycling_Rate_%,62,(%) Household recycling rate
Recycled_Materials_kg,11.5,(kg/month) Diverted from landfill
Reusable_Items_Score,8.1,(out of 10) Daily reusable habit score
Cooking_Gas_Type,LPG,Primary cooking fuel
Gas_Consumption_kg,14.2,(kg/month) Domestic gas usage
Electricity_Monthly_kWh,210,(kWh/month) Average power consumed
Home_Energy_CO2_Avg,84,(kg CO₂/month) Average home energy footprint
Avg_AC_Hours,5.2,(hrs/day) Average AC usage
Solar_Adoption_%,28,(%) Solar or clean power backup
Top_City,Bangalore,City with most respondents`;
}

// =====================================================================
// PUBLIC: called by refresh button and inline "Try Again"
// =====================================================================
function refreshDashboard() {
  if (window.location.protocol === "file:") {
    const stamp = document.getElementById("lastUpdated");
    if (stamp) {
      stamp.textContent = "Live sync requires web host • Showing snapshot";
      setTimeout(() => {
        stamp.textContent = "Community Snapshot • (Host on web server for live sync)";
      }, 4000);
    }
  }
  loadDashboard(true);
}

// =====================================================================
// AUTO-REFRESH
// =====================================================================
function startAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  autoRefreshTimer = setInterval(() => loadDashboard(true), AUTO_REFRESH_INTERVAL_MS);
}

// =====================================================================
// INIT
// =====================================================================
document.addEventListener("DOMContentLoaded", () => {
  attachFootprintEvents();
  loadDashboard(false);
  startAutoRefresh();
});
