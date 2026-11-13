/**
 * MyCarbonCredit – Age Group Selection ("Choose Your Green Journey")
 * ------------------------------------------------------------------
 * Sits between the quiz landing page and the three age-based journeys:
 *
 *   Individual   (21+)    -> existing quiz, started via the unchanged startQuiz() in quiz.js
 *   Young Adults (15–20)  -> young-adults/index.html  (separate module)
 *   Kids         (8–14)   -> kids/index.html          (separate module)
 *
 * Isolation guarantees (protects the existing Individual quiz):
 *  - Never reads or writes the Individual keys "mccQuizState" / "mccCurrentResponseId".
 *  - Never calls restart()/resetResponseId(); no Individual answers, points or IDs are touched.
 *  - Only toggles the landing and age-selection sections; every other screen stays owned by quiz.js.
 *  - The chosen journey is kept under its own namespaced key: "mccAgeJourneySelection".
 *
 * Loaded after quiz.js. quiz.js opens this screen through window.MCCAgeSelection.open().
 */
(function () {
  "use strict";

  const SELECTION_STORAGE_KEY = "mccAgeJourneySelection";
  const SCREEN_HASH = "#age-selection";

  // Contiguous, non-overlapping age bands: 8–14 | 15–20 | 21+
  const JOURNEYS = Object.freeze({
    individual: { label: "MyCarbonCredit Individual", ageRange: "21+", minAge: 21, maxAge: null },
    youngAdults: { label: "MyCarbonCredit Young Adults", ageRange: "15-20", minAge: 15, maxAge: 20, href: "young-adults/index.html" },
    kids: { label: "MyCarbonCredit Kids", ageRange: "8-14", minAge: 8, maxAge: 14, href: "kids/index.html" }
  });

  const ageScreen = document.getElementById("ageSelectionScreen");
  const landing = document.getElementById("landingScreen");
  if (!ageScreen || !landing) return; // markup not present – quiz.js falls back to startQuiz()

  const heading = document.getElementById("ageSelectionTitle");
  const backButton = document.getElementById("ageBackButton");
  const startButton = document.getElementById("startQuizButton");

  /* ---------- helpers ---------- */

  function isOpen() {
    return !ageScreen.hidden;
  }

  function rememberSelection(journeyKey) {
    const journey = JOURNEYS[journeyKey];
    if (!journey) return;
    try {
      window.localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify({
        journey: journeyKey,
        label: journey.label,
        ageRange: journey.ageRange,
        selectedAt: new Date().toISOString()
      }));
    } catch (error) {
      // Storage may be unavailable (private mode / quota) – selection persistence is optional.
    }
  }

  function clearScreenHash() {
    if (window.location.hash === SCREEN_HASH) {
      history.replaceState(history.state, "", window.location.pathname + window.location.search);
    }
  }

  function focusWithoutScroll(element) {
    if (!element) return;
    try {
      element.focus({ preventScroll: true });
    } catch (error) {
      element.focus();
    }
  }

  /* ---------- screen transitions ---------- */

  function open(options) {
    const pushHistory = !options || options.pushHistory !== false;
    landing.hidden = true;
    ageScreen.hidden = false;
    ageScreen.scrollTop = 0;

    // Hide the wallet pill while on the journey selection screen
    const walletPill = document.getElementById("walletPill");
    if (walletPill) {
      walletPill.style.display = "none";
    }

    // Clear stale quiz state from prior tests so old points do not linger
    try {
      window.localStorage.removeItem("mccQuizState");
      window.localStorage.removeItem("mccCurrentResponseId");
    } catch (error) {
      // ignore storage errors
    }

    const walletPointsEl = document.getElementById("walletPoints");
    if (walletPointsEl) {
      walletPointsEl.textContent = "0";
    }

    if (pushHistory && window.location.hash !== SCREEN_HASH) {
      history.pushState({ mccAgeSelection: true }, "", SCREEN_HASH);
    }
    focusWithoutScroll(heading);
  }

  function showLanding() {
    ageScreen.hidden = true;
    landing.hidden = false;
    const walletPill = document.getElementById("walletPill");
    if (walletPill) {
      walletPill.style.display = "";
    }
    focusWithoutScroll(startButton);
  }

  function backToLanding() {
    // If we added the history entry ourselves, step back so the browser Back button stays in sync.
    if (history.state && history.state.mccAgeSelection && window.location.hash === SCREEN_HASH) {
      history.back(); // handled by the popstate listener below
      return;
    }
    clearScreenHash();
    showLanding();
  }

  function startIndividual() {
    rememberSelection("individual");
    ageScreen.hidden = true;
    clearScreenHash();
    const walletPill = document.getElementById("walletPill");
    if (walletPill) {
      walletPill.style.display = "";
    }
    if (typeof window.restart === "function") {
      window.restart();
    } else if (typeof window.startQuiz === "function") {
      window.startQuiz(); // existing Individual quiz – untouched
    } else {
      landing.hidden = false;
    }
  }

  /* ---------- events ---------- */

  backButton?.addEventListener("click", backToLanding);
  document.getElementById("exploreIndividualButton")?.addEventListener("click", startIndividual);

  // Entire card clickable
  ageScreen.querySelectorAll(".age-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".age-card-cta")) return;
      const cta = card.querySelector(".age-card-cta");
      if (cta) cta.click();
    });
  });

  // Young Adults / Kids are real links (work without JS, open-in-new-tab, etc.).
  // We only record the selection; navigation is left to the browser.
  ageScreen.querySelectorAll("a.age-card-cta[data-journey]").forEach((link) => {
    link.addEventListener("click", () => rememberSelection(link.dataset.journey));
  });

  // Keyboard: Escape returns to the landing page.
  ageScreen.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      backToLanding();
    }
  });

  // Browser Back/Forward support between landing <-> age selection only.
  window.addEventListener("popstate", () => {
    if (window.location.hash === SCREEN_HASH) {
      if (!landing.hidden) open({ pushHistory: false });
    } else if (isOpen()) {
      showLanding();
    }
  });

  // Deep link (e.g. from GreenerQuest "Gaming Labs" button or "Back" from Kids/Young Adults -> quiz.html#age-selection)
  if (window.location.hash === SCREEN_HASH) {
    open({ pushHistory: false });
  }

  window.MCCAgeSelection = Object.freeze({
    open,
    close: backToLanding,
    journeys: JOURNEYS,
    storageKey: SELECTION_STORAGE_KEY
  });
})();
