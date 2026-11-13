const sections = [
  {
    id: "profile",
    label: "Your Sustainability Profile",
    title: "Start with a light profile.",
    prompt: "These answers help normalize the score without making the experience feel like paperwork.",
    questions: [
      {
        id: "lifestyle",
        label: "Which describes your current lifestyle?",
        type: "single",
        value: "hybrid",
        options: [
          ["office", "Office-based professional", "Regular office commute"],
          ["wfh", "Work-from-home professional", "Home energy matters more"],
          ["hybrid", "Hybrid worker", "A mix of commute and home energy"],
          ["student", "Student", "Campus or daily local travel"],
          ["business", "Business owner", "Variable work and travel pattern"]
        ]
      },
      {
        id: "location",
        label: "Where are you based?",
        type: "select",
        value: "Bengaluru, Karnataka",
        options: ["Bengaluru, Karnataka", "Chennai, Tamil Nadu", "Delhi NCR", "Hyderabad, Telangana", "Mumbai, Maharashtra", "Pune, Maharashtra", "Other city / state"]
      },
      {
        id: "household",
        label: "How many people share your home?",
        type: "single",
        value: "2-3",
        options: [
          ["1", "1", "Solo household"],
          ["2-3", "2-3", "Shared home"],
          ["4-5", "4-5", "Family household"],
          ["5+", "5+", "Larger shared home"]
        ]
      },
      {
        id: "profileNote",
        label: "Anything unique about your lifestyle we should remember later?",
        type: "text",
        value: "",
        placeholder: "Example: I split time between two cities."
      }
    ]
  },
  {
    id: "mobility",
    label: "Your Mobility Story",
    title: "How do you move around?",
    prompt: "Mobility is often the biggest swing factor, especially when work-from-office days change.",
    questions: [
      {
        id: "mobilityStyle",
        label: "What is your everyday travel style?",
        type: "single",
        value: "personalVehicle",
        options: [
          ["personalVehicle", "Personal vehicle", "Car or personal four-wheeler"],
          ["bikeScooter", "Bike / Scooter", "Two-wheeler commute"],
          ["publicTransport", "Public transport", "Bus or shared road transport"],
          ["metroTrain", "Metro / Train", "Electric rail or train"],
          ["walk", "Walk", "No fuel footprint"],
          ["cycle", "Cycle", "Active commute"],
          ["cab", "Cab / Ride-share", "App cab or shared ride"]
        ]
      },
      {
        id: "dailyDistance",
        label: "How far is your workplace or daily destination?",
        type: "range",
        value: 12,
        min: 0,
        max: 55,
        step: 1,
        suffix: " km"
      },
      {
        id: "travelDays",
        label: "How many days do you typically travel each week?",
        type: "range",
        value: 3,
        min: 1,
        max: 7,
        step: 1,
        suffix: " days"
      },
      {
        id: "ridePower",
        label: "What powers your ride?",
        type: "single",
        value: "petrol",
        conditional: { question: "mobilityStyle", values: ["personalVehicle", "bikeScooter", "cab"] },
        options: [
          ["petrol", "Petrol", "Common fuel baseline"],
          ["diesel", "Diesel", "Higher tailpipe factor"],
          ["ev", "EV", "Lower operating emissions"],
          ["hybrid", "Hybrid", "Improved fuel efficiency"]
        ]
      },
      {
        id: "nonWorkTravel",
        label: "How would you describe your non-work travel?",
        type: "single",
        value: "local",
        options: [
          ["local", "Mostly local", "Errands close to home"],
          ["city", "Frequent city travel", "Regular cross-city movement"],
          ["longDistance", "Long-distance traveller", "Road trips or intercity travel"]
        ]
      },
      {
        id: "mobilityNote",
        label: "Any travel habit we should account for later?",
        type: "text",
        value: "",
        placeholder: "Example: I share my ride with two colleagues."
      }
    ]
  },
  {
    id: "home",
    label: "Your Home Energy Pattern",
    title: "What powers your everyday life?",
    prompt: "This estimates individual home energy impact from AC, devices, cooking, and household sharing.",
    questions: [
      {
        id: "acHours",
        label: "During peak summer, how long does your AC usually run?",
        type: "range",
        value: 4,
        min: 0,
        max: 12,
        step: 1,
        suffix: " hrs/day"
      },
      {
        id: "devices",
        label: "Which of these are part of your daily routine?",
        type: "multi",
        value: ["laptop", "wifi", "fan"],
        options: [
          ["laptop", "Laptop", "Portable work device"],
          ["desktop", "Desktop", "Higher device load"],
          ["monitor", "Monitor", "External display"],
          ["tv", "TV", "Entertainment load"],
          ["wifi", "WiFi Router", "Always-on device"],
          ["ac", "AC", "Cooling load"],
          ["fan", "Fan", "Low-power cooling"],
          ["heater", "Water Heater", "High heat load"]
        ]
      },
      {
        id: "workDeviceHours",
        label: "How many hours are your work devices used daily?",
        type: "range",
        value: 8,
        min: 0,
        max: 12,
        step: 1,
        suffix: " hrs"
      },
      {
        id: "cookingSource",
        label: "What is your cooking energy source?",
        type: "single",
        value: "lpg",
        options: [
          ["lpg", "LPG", "Cylinder cooking fuel"],
          ["induction", "Induction", "Electric cooking"],
          ["png", "PNG", "Piped natural gas"],
          ["mixed", "Mixed", "Combination of fuels"]
        ]
      },
      {
        id: "homeNote",
        label: "Anything about your home setup we should include later?",
        type: "text",
        value: "",
        placeholder: "Example: Solar panels cover part of my daytime load."
      }
    ]
  },
  {
    id: "travel",
    label: "Travel Footprint",
    title: "Do you travel often?",
    prompt: "Annual travel can quietly dominate an individual footprint, so this keeps it visible.",
    questions: [
      {
        id: "flightFrequency",
        label: "How often do you fly annually?",
        type: "single",
        value: "occasional",
        options: [
          ["never", "Never", "No annual flight estimate"],
          ["occasional", "Occasionally (1-3)", "A few flights per year"],
          ["frequent", "Frequent (4-8)", "Regular domestic or regional flying"],
          ["veryFrequent", "Very frequent (8+)", "High annual flight footprint"]
        ]
      },
      {
        id: "longDistanceMode",
        label: "Your preferred long-distance travel?",
        type: "single",
        value: "train",
        options: [
          ["train", "Train", "Lower-carbon long-distance option"],
          ["flight", "Flight", "Faster but higher impact"],
          ["roadTrip", "Road trip", "Depends on vehicle and distance"]
        ]
      },
      {
        id: "travelNote",
        label: "What kind of trips should the next version ask you about?",
        type: "text",
        value: "",
        placeholder: "Example: Two international work trips and quarterly family travel."
      }
    ]
  },
  {
    id: "choices",
    label: "Sustainability Choices",
    title: "How green are your habits?",
    prompt: "These answers help segment recommendations and future carbon credit options.",
    questions: [
      {
        id: "initiatives",
        label: "Do you currently contribute to sustainability initiatives?",
        type: "multi",
        value: ["waste"],
        options: [
          ["tree", "Tree planting", "Nature-based action"],
          ["waste", "Waste segregation", "Daily household habit"],
          ["renewable", "Renewable energy support", "Clean energy contribution"],
          ["none", "Not currently", "Good place to start"]
        ]
      },
      {
        id: "offsetInterest",
        label: "Would you consider offsetting unavoidable emissions?",
        type: "single",
        value: "maybe",
        options: [
          ["yes", "Yes", "Ready to explore offsets"],
          ["maybe", "Maybe", "Needs more trust and clarity"],
          ["no", "No", "Prefer reduction-first actions"]
        ]
      },
      {
        id: "impactPreference",
        label: "Which impact would you most like to support?",
        type: "single",
        value: "verifiedCredits",
        options: [
          ["afforestation", "Afforestation & plantation", "Trees and green cover"],
          ["biodiversity", "Biodiversity conservation", "Protect natural ecosystems"],
          ["renewableFarms", "Renewable energy farms", "Clean power generation"],
          ["verifiedCredits", "Verified carbon credits", "Audited offset projects"]
        ]
      },
      {
        id: "choiceNote",
        label: "What would make you trust a carbon credit recommendation?",
        type: "text",
        value: "",
        placeholder: "Example: Project photos, registry link, price, and verification details."
      }
    ]
  }
];

const factors = {
  electricity: 0.716,
  mobility: {
    personalVehicle: 0.192,
    bikeScooter: 0.103,
    publicTransport: 0.089,
    metroTrain: 0.041,
    walk: 0,
    cycle: 0,
    cab: 0.165
  },
  ridePower: {
    petrol: 1,
    diesel: 1.14,
    ev: 0.24,
    hybrid: 0.68
  },
  cooking: {
    lpg: 42,
    induction: 18,
    png: 29,
    mixed: 34
  },
  flightsAnnual: {
    never: 0,
    occasional: 360,
    frequent: 950,
    veryFrequent: 1800
  },
  nonWorkTravelMonthly: {
    local: 16,
    city: 44,
    longDistance: 95
  },
  longDistanceMonthly: {
    train: 10,
    flight: 65,
    roadTrip: 38
  }
};

const colors = {
  mobility: "#2d8f90",
  energy: "#e7b94e",
  travel: "#d86a52",
  choices: "#6c8c3f"
};

const form = document.querySelector("#carbonForm");
const tabs = document.querySelectorAll(".step-tab");
const loginDialog = document.querySelector("#loginDialog");
const factorDialog = document.querySelector("#factorDialog");
const profile = { name: "", email: "", provider: "" };
let activeStep = "profile";
let latestResult = null;

function getQuestion(id) {
  return sections.flatMap((section) => section.questions).find((question) => question.id === id);
}

function getValue(id) {
  return getQuestion(id).value;
}

function setValue(id, value) {
  getQuestion(id).value = value;
}

function isVisible(question) {
  if (!question.conditional) return true;
  return question.conditional.values.includes(getValue(question.conditional.question));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderQuestions() {
  form.innerHTML = sections
    .map((section) => `
      <section class="quest-card ${section.id === activeStep ? "active" : ""}" data-panel="${section.id}" aria-labelledby="${section.id}-title">
        <div class="card-heading">
          <p class="micro-label">${section.label}</p>
          <h2 id="${section.id}-title">${section.title}</h2>
          <p>${section.prompt}</p>
        </div>
        <div class="question-stack">
          ${section.questions.map(renderQuestion).join("")}
        </div>
      </section>
    `)
    .join("");
}

function renderQuestion(question) {
  const hiddenClass = isVisible(question) ? "" : " hidden-question";
  if (question.type === "single") {
    const gridClass = question.options.length > 4 ? "choice-grid compact-grid" : "choice-grid three";
    return `
      <fieldset class="question-block${hiddenClass}" data-question="${question.id}">
        <legend>${question.label}</legend>
        <div class="${gridClass}">
          ${question.options
            .map(([value, label, helper]) => `
              <label class="choice-card">
                <input type="radio" name="${question.id}" value="${value}" ${question.value === value ? "checked" : ""} />
                <span>${label}</span>
                <small>${helper}</small>
              </label>
            `)
            .join("")}
        </div>
      </fieldset>
    `;
  }

  if (question.type === "multi") {
    return `
      <fieldset class="question-block${hiddenClass}" data-question="${question.id}">
        <legend>${question.label}</legend>
        <div class="choice-grid compact-grid">
          ${question.options
            .map(([value, label, helper]) => `
              <label class="choice-card">
                <input type="checkbox" name="${question.id}" value="${value}" ${question.value.includes(value) ? "checked" : ""} />
                <span>${label}</span>
                <small>${helper}</small>
              </label>
            `)
            .join("")}
        </div>
      </fieldset>
    `;
  }

  if (question.type === "range") {
    return `
      <label class="range-field question-block${hiddenClass}" data-question="${question.id}">
        <span>${question.label} <strong id="${question.id}Value">${question.value}${question.suffix}</strong></span>
        <input name="${question.id}" type="range" min="${question.min}" max="${question.max}" step="${question.step}" value="${question.value}" />
      </label>
    `;
  }

  if (question.type === "select") {
    return `
      <label class="select-field question-block${hiddenClass}" data-question="${question.id}">
        <span>${question.label}</span>
        <select name="${question.id}">
          ${question.options.map((option) => `<option ${question.value === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </label>
    `;
  }

  return `
    <label class="text-field question-block${hiddenClass}" data-question="${question.id}">
      <span>${question.label}</span>
      <textarea name="${question.id}" rows="3" placeholder="${escapeHtml(question.placeholder)}">${escapeHtml(question.value)}</textarea>
    </label>
  `;
}

function syncFromForm(event) {
  const target = event.target;
  const question = getQuestion(target.name);
  if (!question) return;
  let shouldRenderQuestions = false;

  if (question.type === "multi") {
    const checked = Array.from(form.querySelectorAll(`input[name="${question.id}"]:checked`)).map((input) => input.value);
    setValue(question.id, checked.includes("none") && checked.length > 1 ? checked.filter((value) => value !== "none") : checked);
    shouldRenderQuestions = question.id === "initiatives";
  } else if (question.type === "range") {
    setValue(question.id, Number(target.value));
    const valueLabel = document.querySelector(`#${question.id}Value`);
    if (valueLabel) valueLabel.textContent = `${question.value}${question.suffix}`;
  } else {
    setValue(question.id, target.value);
  }

  if (question.id === "lifestyle") {
    syncLifestyleDefaults();
    shouldRenderQuestions = true;
  }
  if (question.id === "mobilityStyle") shouldRenderQuestions = true;
  if (shouldRenderQuestions) renderQuestions();
  calculate();
}

function syncLifestyleDefaults() {
  const lifestyle = getValue("lifestyle");
  if (lifestyle === "wfh") setValue("travelDays", 1);
  if (lifestyle === "hybrid") setValue("travelDays", 3);
  if (lifestyle === "office") setValue("travelDays", 5);
  if (lifestyle === "traveller" && getValue("flightFrequency") === "never") setValue("flightFrequency", "frequent");
}

function householdPeople() {
  const household = getValue("household");
  if (household === "1") return 1;
  if (household === "2-3") return 2.5;
  if (household === "4-5") return 4.5;
  return 5.5;
}

function estimateHomeEnergy() {
  const devices = getValue("devices");
  const workHours = getValue("workDeviceHours");
  const acHours = getValue("acHours");
  let kwh = 55;

  if (devices.includes("laptop")) kwh += workHours * 0.06 * 30;
  if (devices.includes("desktop")) kwh += workHours * 0.18 * 30;
  if (devices.includes("monitor")) kwh += workHours * 0.04 * 30;
  if (devices.includes("tv")) kwh += 9;
  if (devices.includes("wifi")) kwh += 7;
  if (devices.includes("fan")) kwh += 11;
  if (devices.includes("heater")) kwh += 35;
  if (devices.includes("ac")) kwh += acHours * 1.2 * 30;

  const electricity = (kwh / householdPeople()) * factors.electricity;
  const cooking = factors.cooking[getValue("cookingSource")] / householdPeople();
  return electricity + cooking;
}

function calculate() {
  const mobilityStyle = getValue("mobilityStyle");
  const fuelMultiplier = ["personalVehicle", "bikeScooter", "cab"].includes(mobilityStyle) ? factors.ridePower[getValue("ridePower")] : 1;
  const mobility = getValue("dailyDistance") * 2 * getValue("travelDays") * 4.33 * factors.mobility[mobilityStyle] * fuelMultiplier;
  const energy = estimateHomeEnergy();
  const travel = factors.flightsAnnual[getValue("flightFrequency")] / 12 + factors.longDistanceMonthly[getValue("longDistanceMode")] + factors.nonWorkTravelMonthly[getValue("nonWorkTravel")];
  const choices = getValue("initiatives").includes("none") ? 16 : Math.max(0, 18 - getValue("initiatives").length * 4);
  const total = mobility + energy + travel + choices;

  latestResult = {
    total,
    annual: (total * 12) / 1000,
    categories: [
      { key: "mobility", label: "Mobility", value: mobility },
      { key: "energy", label: "Home energy", value: energy },
      { key: "travel", label: "Travel footprint", value: travel },
      { key: "choices", label: "Sustainability choices", value: choices }
    ]
  };

  renderResult(latestResult);
}

function renderResult(result) {
  const rounded = Math.round(result.total);
  const maxCategory = Math.max(...result.categories.map((category) => category.value), 1);
  const level = getLevel(result.total);

  document.querySelector("#monthlyScore").textContent = `${rounded} kg CO2e`;
  document.querySelector("#annualScore").textContent = `${result.annual.toFixed(1)} t CO2e`;
  document.querySelector("#levelName").textContent = level.name;
  document.querySelector("#scoreNumber").textContent = rounded;
  document.querySelector(".score-ring").style.setProperty("--score-angle", `${Math.min(result.total / 650, 1) * 360}deg`);
  document.querySelector("#scoreNarrative").textContent = level.copy;

  renderBreakdown(result.categories, maxCategory);
  renderRecommendations(result);
  renderBadges();
  renderCompletion();
}

function getLevel(total) {
  if (total < 260) return { name: "Canopy", copy: "Strong score. Your daily routine already has several low-carbon patterns." };
  if (total < 460) return { name: "Grove", copy: "Balanced footprint. One or two habit shifts can make the score noticeably lighter." };
  if (total < 720) return { name: "Sprout", copy: "Good baseline. Target the highest category first for visible reduction." };
  return { name: "Trailhead", copy: "Your profile has a few heavy categories. Start with commute, cooling, or flights." };
}

function renderBreakdown(categories, maxCategory) {
  document.querySelector("#breakdownList").innerHTML = categories
    .map((category) => `
      <div class="breakdown-item">
        <div class="breakdown-top">
          <span>${category.label}</span>
          <span>${Math.round(category.value)} kg</span>
        </div>
        <div class="mini-track">
          <span style="width:${Math.max((category.value / maxCategory) * 100, 3)}%; --bar-color:${colors[category.key]}"></span>
        </div>
      </div>
    `)
    .join("");
}

function renderRecommendations(result) {
  const sorted = [...result.categories].sort((a, b) => b.value - a.value);
  const tips = sorted.slice(0, 3).map((category) => {
    if (category.key === "mobility") return "<strong>Mobility:</strong> reduce one high-emission travel day, use metro/train, or switch personal rides toward EV/hybrid.";
    if (category.key === "energy") return "<strong>Home energy:</strong> cut peak AC hours, improve cooling efficiency, and track device-heavy workdays.";
    if (category.key === "travel") return "<strong>Travel:</strong> prefer train for long-distance trips where practical and offset unavoidable flights with verified projects.";
    return "<strong>Choices:</strong> add one repeatable initiative such as waste segregation, renewable support, or a verified credit contribution.";
  });

  document.querySelector("#recommendations").innerHTML = tips.map((tip) => `<li>${tip}</li>`).join("");
}

function renderBadges() {
  const badges = [];
  if (["walk", "cycle", "metroTrain"].includes(getValue("mobilityStyle"))) badges.push("Low-carbon mover");
  if (getValue("devices").includes("ac") && getValue("acHours") <= 3) badges.push("Cooling mindful");
  if (getValue("flightFrequency") === "never") badges.push("No-flight year");
  if (getValue("offsetInterest") === "yes") badges.push("Offset ready");
  if (!badges.length) badges.push("Baseline builder");

  document.querySelector("#badgeRow").innerHTML = badges.map((badge) => `<span class="badge">${badge}</span>`).join("");
}

function renderCompletion() {
  const visibleQuestions = sections.flatMap((section) => section.questions).filter(isVisible);
  const answered = visibleQuestions.filter((question) => {
    const value = question.value;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "";
  }).length;
  const complete = Math.round((answered / visibleQuestions.length) * 100);
  document.querySelector("#completionText").textContent = `${complete}% complete`;
  document.querySelector("#completionBar").style.width = `${complete}%`;
}

function activateStep(step) {
  activeStep = step;
  tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.step === step));
  renderQuestions();
}

function downloadReport() {
  if (!profile.email) {
    loginDialog.showModal();
    return;
  }

  const lines = [
    "My Carbon Credit Individual Footprint Report",
    `Name: ${profile.name || "Guest"}`,
    `Email: ${profile.email}`,
    `Login provider: ${profile.provider || "Email prototype"}`,
    `Monthly footprint: ${Math.round(latestResult.total)} kg CO2e`,
    `Annual estimate: ${latestResult.annual.toFixed(2)} t CO2e`,
    "",
    "Breakdown:",
    ...latestResult.categories.map((category) => `- ${category.label}: ${Math.round(category.value)} kg CO2e/month`),
    "",
    "Question responses:",
    ...sections.flatMap((section) => [
      section.label,
      ...section.questions.filter(isVisible).map((question) => `- ${question.label}: ${Array.isArray(question.value) ? question.value.join(", ") : question.value || "Not answered"}`)
    ]),
    "",
    "Recommended actions:",
    ...Array.from(document.querySelectorAll("#recommendations li")).map((item, index) => `${index + 1}. ${item.textContent}`)
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "my-carbon-credit-score.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

form.addEventListener("input", syncFromForm);
form.addEventListener("change", syncFromForm);

tabs.forEach((tab) => tab.addEventListener("click", () => activateStep(tab.dataset.step)));

document.querySelector("#loginButton").addEventListener("click", () => loginDialog.showModal());
document.querySelector("#factorButton").addEventListener("click", () => factorDialog.showModal());
document.querySelector("#downloadButton").addEventListener("click", downloadReport);
document.querySelector("#downloadTopButton").addEventListener("click", downloadReport);

document.querySelector("#saveProfileButton").addEventListener("click", () => {
  profile.provider = "Email prototype";
  profile.name = document.querySelector("#userName").value.trim();
  profile.email = document.querySelector("#userEmail").value.trim();
  if (profile.email) document.querySelector("#loginButton").textContent = profile.name || "Logged in";
});

renderQuestions();
calculate();
