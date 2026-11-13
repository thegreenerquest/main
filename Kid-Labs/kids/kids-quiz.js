/**
 * MyCarbonCredit Kids Quiz — Interactive Controller & Journey Engine
 * Supports:
   *  - Explorer Mode (Ages 8–10) & Changemaker Mode (Ages 11–14)
   *  - 5 Mandatory Carbon Footprint Missions (Activities 1–5)
   *  - 10 Balanced, Shuffled Scored Green Quests (Activities 6–15)
   *  - Interactive visual mini-scenes for every question & mission
   *  - Progressive persistence, refresh/resume safety & Google Sheets integration
   */
  (function () {
    "use strict";

    const KIDS_RESPONSE_ID_KEY = "mccKidsResponseId";
    const KIDS_STATE_KEY = "mccKidsQuizState";

    // Default state structure for a Kids Quiz attempt (no preselected choice tiles)
    function createDefaultMissionsData() {
      return {
        FP01: {
          mode: "",
          fuel: "",
          oneWayKm: 5,
          schoolDaysPerWeek: 0,
          selectedDays: [],
          returnTrip: "",
          occupancy: 2,
          hasSecondLeg: false,
          leg2Mode: "walk",
          leg2Km: 0.5,
          leg2Occupancy: 2
        },
        FP02: {
          journeyType: "",
          journeyTypes: [],
          mode: "",
          modes: [],
          fuel: "na",
          distanceKm: 3,
          tripsPerWeek: 3,
          occupancy: 2
        },
        FP03: {
          billAvailable: "",
          guardianAssisted: false,
          monthlyKwh: 180,
          householdSize: 4,
          reportingPeriod: ""
        },
        FP04: {
          notebooksPerYear: 10,
          stationerySetsPerYear: 2,
          uniformSetsPerYear: 2,
          primaryDevice: "",
          deviceAge: "",
          deviceOwnership: "",
          dailyHours: 1.5
        },
        FP05: {
          dietCategory: "",
          mealsPerDay: 3,
          dairyServingsPerDay: 2,
          portionSize: "",
          wasteFrequency: "",
          wasteGramsPerWeek: 0,
          wasteDisposal: ""
        }
      };
    }

    let state = {
      responseId: "",
      ageGroup: "8-10", // "8-10" | "11-14"
      quizMode: "Explorer Mode", // "Explorer Mode" | "Changemaker Mode"
      screen: "landing", // "landing" | "ageMode" | "modeIntro" | "stage" | "results"
      startDate: "",
      completionDate: "",
      completionStatus: "Not Started", // "Not Started" | "In Progress" | "Completed"
      studentProfile: {
        childName: "",
        studentClass: "",
        rollNumber: "",
        guardianAssisted: false
      },
      selectedQuestionIds: [],
      questionOrder: [],
      currentStep: 0, // 0..4 = 5 Missions, 5..14 = 10 Scored Questions
      missionsData: createDefaultMissionsData(),
      quizAnswers: {}, // { KID001: "A", ... }
      lockedQuestions: {}, // { KID001: true, ... }
      sceneInteractions: {}, // { KID001: true, ... }
      finalSubmitted: false,
      lastSyncOk: true
    };

  // DOM References
  const el = {
    headerModePill: document.getElementById("headerModePill"),
    headerModeText: document.getElementById("headerModeText"),
    kidsHeaderScore: document.getElementById("kidsHeaderScore"),
    kidsStudentLabel: document.getElementById("kidsStudentLabel"),
    kidsHomeNavBtn: document.getElementById("kidsHomeNavBtn"),

    // Screens
    landingScreen: document.getElementById("kidsLandingScreen"),
    ageModeScreen: document.getElementById("kidsAgeModeScreen"),
    modeIntroScreen: document.getElementById("kidsModeIntroScreen"),
    stageScreen: document.getElementById("kidsStageScreen"),
    resultsScreen: document.getElementById("kidsResultsScreen"),

    // Landing & Resume
    resumeBanner: document.getElementById("kidsResumeBanner"),
    resumeMeta: document.getElementById("kidsResumeMeta"),
    resumeAttemptBtn: document.getElementById("resumeAttemptBtn"),
    discardAttemptBtn: document.getElementById("discardAttemptBtn"),
    startKidsQuizBtn: document.getElementById("startKidsQuizBtn"),

    // Mode Selection
    cardExplorerMode: document.getElementById("cardExplorerMode"),
    cardChangemakerMode: document.getElementById("cardChangemakerMode"),
    selectExplorerBtn: document.getElementById("selectExplorerBtn"),
    selectChangemakerBtn: document.getElementById("selectChangemakerBtn"),
    backToKidsLandingBtn: document.getElementById("backToKidsLandingBtn"),

    // Mode Intro & Optional Student Fields
    introModeBadge: document.getElementById("introModeBadge"),
    kidsIntroHeading: document.getElementById("kidsIntroHeading"),
    kidsIntroDescription: document.getElementById("kidsIntroDescription"),
    introResponseIdPreview: document.getElementById("introResponseIdPreview"),
    childNameInput: document.getElementById("kidsChildNameInput"),
    classInput: document.getElementById("kidsClassInput"),
    rollNumberInput: document.getElementById("kidsRollNumberInput"),
    nameError: document.getElementById("kidsNameError"),
    classError: document.getElementById("kidsClassError"),
    rollError: document.getElementById("kidsRollError"),
    guardianAssistCheckbox: document.getElementById("kidsGuardianAssistCheckbox"),
    changeModeFromIntroBtn: document.getElementById("changeModeFromIntroBtn"),
    beginMissionsBtn: document.getElementById("beginMissionsBtn"),

    // Stage
    stageTypeChip: document.getElementById("stageTypeChip"),
    stageOverallCounter: document.getElementById("stageOverallCounter"),
    missionProgressBar: document.getElementById("missionProgressBar"),
    questProgressBar: document.getElementById("questProgressBar"),
    missionBarLabel: document.getElementById("missionBarLabel"),
    questBarLabel: document.getElementById("questBarLabel"),
    questsTransitionBanner: document.getElementById("questsTransitionBanner"),
    activityCategoryBadge: document.getElementById("activityCategoryBadge"),
    activityDimensionBadge: document.getElementById("activityDimensionBadge"),
    activityTitle: document.getElementById("activityTitle"),
    activitySubtitle: document.getElementById("activitySubtitle"),
    interactiveContainer: document.getElementById("kidsInteractiveContainer"),
    answerContainer: document.getElementById("kidsAnswerContainer"),
    feedbackBanner: document.getElementById("kidsFeedbackBanner"),
    feedbackEmoji: document.getElementById("kidsFeedbackEmoji"),
    feedbackHeading: document.getElementById("kidsFeedbackHeading"),
    feedbackText: document.getElementById("kidsFeedbackText"),
    stageBackBtn: document.getElementById("stageBackBtn"),
    stageCheckAnswerBtn: document.getElementById("stageCheckAnswerBtn"),
    stageNextBtn: document.getElementById("stageNextBtn"),

    // Results
    resultModeBadge: document.getElementById("resultModeBadge"),
    resultStageBadge: document.getElementById("resultStageBadge"),
    resultsHeroHeading: document.getElementById("resultsHeroHeading"),
    resultsHeroCopy: document.getElementById("resultsHeroCopy"),
    kidsScoreRing: document.getElementById("kidsScoreRing"),
    resultGreenScoreValue: document.getElementById("resultGreenScoreValue"),
    resultScorePercentText: document.getElementById("resultScorePercentText"),
    resultSyncStatusText: document.getElementById("resultSyncStatusText"),
    unlockedBadgesCountTag: document.getElementById("unlockedBadgesCountTag"),
    kidsBadgesGrid: document.getElementById("kidsBadgesGrid"),
    kidsDimensionsList: document.getElementById("kidsDimensionsList"),
    strongestTopicTag: document.getElementById("strongestTopicTag"),
    kidsTopicsList: document.getElementById("kidsTopicsList"),
    footprintOverallStatusChip: document.getElementById("footprintOverallStatusChip"),
    fpMonthlyKgValue: document.getElementById("fpMonthlyKgValue"),
    fpAnnualKgValue: document.getElementById("fpAnnualKgValue"),
    fpReportingPeriodValue: document.getElementById("fpReportingPeriodValue"),
    fpHouseholdAllocationLabel: document.getElementById("fpHouseholdAllocationLabel"),
    kidsFootprintBreakdownList: document.getElementById("kidsFootprintBreakdownList"),
    kidsRecommendationsGrid: document.getElementById("kidsRecommendationsGrid"),
    kidsDownloadReportBtn: document.getElementById("kidsDownloadReportBtn"),
    kidsRetrySyncBtn: document.getElementById("kidsRetrySyncBtn"),
    kidsRestartBtn: document.getElementById("kidsRestartBtn")
  };

  // =========================================================================
  // 1. RESPONSE_ID GENERATION & STATE PERSISTENCE
  // =========================================================================
  function generateKidsResponseId() {
    const now = new Date();
    const pad = (n, len = 2) => String(n).padStart(len, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return (
      "MCC-KIDS-" +
      now.getFullYear() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      "-" +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds()) +
      "-" +
      rand
    );
  }

  function saveState() {
    try {
      if (state.responseId) {
        window.localStorage.setItem(KIDS_RESPONSE_ID_KEY, state.responseId);
        window.localStorage.setItem(KIDS_STATE_KEY, JSON.stringify(state));
      } else {
        window.localStorage.removeItem(KIDS_RESPONSE_ID_KEY);
        window.localStorage.removeItem(KIDS_STATE_KEY);
      }
    } catch (err) {
      console.warn("[KidsQuiz] Could not persist state to localStorage:", err);
    }
    updateHeaderUI();
  }

  function resetStateToClean() {
    try {
      window.localStorage.removeItem(KIDS_STATE_KEY);
      window.localStorage.removeItem(KIDS_RESPONSE_ID_KEY);
    } catch (err) {
      console.warn("[KidsQuiz] Could not clear localStorage:", err);
    }
    state = {
      responseId: "",
      ageGroup: "",
      quizMode: "",
      screen: "landing",
      startDate: "",
      completionDate: "",
      completionStatus: "Not Started",
      studentProfile: {
        childName: "",
        studentClass: "",
        rollNumber: "",
        guardianAssisted: false
      },
      selectedQuestionIds: [],
      questionOrder: [],
      currentStep: 0,
      missionsData: createDefaultMissionsData(),
      quizAnswers: {},
      lockedQuestions: {},
      sceneInteractions: {},
      finalSubmitted: false,
      lastSyncOk: true
    };
    if (el.childNameInput) el.childNameInput.value = "";
    if (el.classInput) el.classInput.value = "";
    if (el.rollNumberInput) el.rollNumberInput.value = "";
    if (el.guardianAssistCheckbox) el.guardianAssistCheckbox.checked = false;
    updateHeaderUI();
  }

  function loadStoredState() {
    try {
      const raw = window.localStorage.getItem(KIDS_STATE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.responseId) return false;

      state = {
        ...state,
        ...parsed,
        currentStep: Math.min(14, Number(parsed.currentStep) || 0),
        studentProfile: {
          ...state.studentProfile,
          ...(parsed.studentProfile || {})
        },
        missionsData: {
          ...createDefaultMissionsData(),
          ...(parsed.missionsData || {})
        },
        quizAnswers: parsed.quizAnswers || {},
        lockedQuestions: parsed.lockedQuestions || {},
        sceneInteractions: parsed.sceneInteractions || {}
      };
      if (Array.isArray(state.questionOrder) && state.questionOrder.length > 10) {
        state.questionOrder = state.questionOrder.slice(0, 10);
        state.selectedQuestionIds = [...state.questionOrder].sort();
      }
      return true;
    } catch (err) {
      console.warn("[KidsQuiz] Failed to restore state:", err);
      return false;
    }
  }

  function initializeNewAttempt(ageGroup) {
    const modeName = ageGroup === "11-14" ? "Changemaker Mode" : "Explorer Mode";
    const selection = window.MCCKidsData.selectBalancedQuestions(ageGroup);

    state = {
      responseId: generateKidsResponseId(),
      ageGroup,
      quizMode: modeName,
      screen: "modeIntro",
      startDate: new Date().toISOString(),
      completionDate: "",
      completionStatus: "In Progress",
      studentProfile: {
        childName: "",
        studentClass: "",
        rollNumber: "",
        guardianAssisted: false
      },
      selectedQuestionIds: selection.selectedQuestionIds,
      questionOrder: selection.questionOrder,
      currentStep: 0,
      missionsData: createDefaultMissionsData(),
      quizAnswers: {},
      lockedQuestions: {},
      sceneInteractions: {},
      finalSubmitted: false,
      lastSyncOk: true
    };
    saveState();
  }

  function computeLiveGreenScore() {
    let sum = 0;
    Object.entries(state.quizAnswers).forEach(([qId, opt]) => {
      if (state.lockedQuestions[qId] && opt) {
        const res = window.MCCKidsData.evaluateSingleAnswer(qId, opt);
        sum += res.awardedPoints;
      }
    });
    return Math.min(100, sum);
  }

  function updateHeaderUI() {
    if (state.completionStatus === "In Progress" || state.completionStatus === "Completed") {
      el.headerModePill.hidden = false;
      el.headerModeText.textContent = `${state.quizMode} (${state.ageGroup})`;
    } else {
      el.headerModePill.hidden = true;
    }

    el.kidsHeaderScore.textContent = computeLiveGreenScore();

    const name = (state.studentProfile?.childName || "").trim();
    const cls = (state.studentProfile?.studentClass || "").trim();
    if (name) {
      el.kidsStudentLabel.textContent = cls ? `${name} (${cls})` : name;
    } else {
      el.kidsStudentLabel.textContent = "Kids Planet";
    }

    el.kidsHomeNavBtn.hidden = state.screen === "landing";
  }

  // =========================================================================
  // 2. SCREEN NAVIGATION
  // =========================================================================
  function showScreen(screenName) {
    state.screen = screenName;
    el.landingScreen.hidden = screenName !== "landing";
    el.ageModeScreen.hidden = screenName !== "ageMode";
    el.modeIntroScreen.hidden = screenName !== "modeIntro";
    el.stageScreen.hidden = screenName !== "stage";
    el.resultsScreen.hidden = screenName !== "results";

    if (screenName === "landing") {
      renderLandingResumeBanner();
    } else if (screenName === "modeIntro") {
      renderModeIntroScreen();
    } else if (screenName === "stage") {
      renderCurrentStageActivity();
    } else if (screenName === "results") {
      renderResultsDashboard();
    }

    saveState();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderLandingResumeBanner() {
    const hasActiveAttempt =
      state.responseId &&
      state.completionStatus === "In Progress" &&
      Array.isArray(state.questionOrder) &&
      state.questionOrder.length === 10;

    if (hasActiveAttempt) {
      el.resumeBanner.hidden = false;
      const actNum = Math.min(15, Math.max(1, (state.currentStep || 0) + 1));
      el.resumeMeta.textContent = `${state.quizMode} (Ages ${state.ageGroup}) • Activity ${actNum} of 15 • ID: ${state.responseId}`;
    } else {
      el.resumeBanner.hidden = true;
    }
  }

  function renderModeIntroScreen() {
    const isChangemaker = state.ageGroup === "11-14";
    el.introModeBadge.textContent = `${state.quizMode} • Ages ${state.ageGroup}`;
    el.kidsIntroHeading.textContent = isChangemaker
      ? "Welcome to Changemaker Mode (Ages 11–14)!"
      : "Welcome to Explorer Mode (Ages 8–10)!";
    el.kidsIntroDescription.textContent = isChangemaker
      ? "Investigate real-world environmental scenarios, compare lifecycle impacts, and map your personal carbon footprint across 5 missions and 10 Changemaker quests."
      : "Join Terra the Sprout on 5 fun Carbon Footprint Missions and 10 colourful Nature & Planet Quests! Your answers are saved automatically as you play.";

    el.introResponseIdPreview.textContent = state.responseId;
    el.childNameInput.value = state.studentProfile.childName || "";
    el.classInput.value = state.studentProfile.studentClass || "";
    el.rollNumberInput.value = state.studentProfile.rollNumber || "";
    el.guardianAssistCheckbox.checked = Boolean(state.studentProfile.guardianAssisted);
    validateStudentInputsFromIntro(false);
  }

  function validateStudentInputsFromIntro(showFocus = false) {
    let valid = true;
    let firstInvalidEl = null;

    // 1. Validate Child Name (optional, but if provided: letters, spaces, dots, hyphens only; no numbers or negative signs)
    const rawName = (el.childNameInput?.value || "").replace(/[^a-zA-Z\s.'-]/g, "");
    if (el.childNameInput && el.childNameInput.value !== rawName) {
      el.childNameInput.value = rawName;
    }
    const trimmedName = rawName.trim();
    if (el.nameError) {
      el.nameError.hidden = true;
      el.nameError.textContent = "";
    }
    el.childNameInput?.classList.remove("input-invalid");

    // 2. Validate Class / Grade (optional, but if provided: valid school class 1–12 with optional section A–Z, e.g. "5", "5B", "Class 6A", "Std 7", "8th B")
    if (el.classInput) {
      // Strip negative signs immediately
      const cleanedClass = el.classInput.value.replace(/-/g, "");
      if (el.classInput.value !== cleanedClass) {
        el.classInput.value = cleanedClass;
      }
      const clsVal = cleanedClass.trim();
      let classIsValid = true;
      let classErrMsg = "";

      if (clsVal.length > 0) {
        const match = clsVal.match(/^(?:class|grade|std|standard)?\s*(\d{1,2})(?:st|nd|rd|th)?\s*([a-zA-Z])?$/i);
        if (!match) {
          classIsValid = false;
          classErrMsg = "Enter a valid school class (e.g., 5, 5B, or Class 7A).";
        } else {
          const gradeNum = Number(match[1]);
          if (gradeNum < 1 || gradeNum > 12) {
            classIsValid = false;
            classErrMsg = "Class / Grade must be between 1 and 12 (e.g., 4A or 8B).";
          }
        }
      }

      if (!classIsValid) {
        valid = false;
        firstInvalidEl = firstInvalidEl || el.classInput;
        el.classInput.classList.add("input-invalid");
        if (el.classError) {
          el.classError.textContent = classErrMsg;
          el.classError.hidden = false;
        }
      } else {
        el.classInput.classList.remove("input-invalid");
        if (el.classError) {
          el.classError.textContent = "";
          el.classError.hidden = true;
        }
      }
    }

    // 3. Validate Roll Number (optional, but if provided: positive whole integer 1–999 only)
    if (el.rollNumberInput) {
      const rawRoll = el.rollNumberInput.value.trim();
      let rollIsValid = true;
      let rollErrMsg = "";

      if (rawRoll.length > 0) {
        if (!/^\d+$/.test(rawRoll)) {
          rollIsValid = false;
          rollErrMsg = "Roll No. must contain positive digits only (1–999).";
        } else {
          const rollNum = Number(rawRoll);
          if (rollNum < 1 || rollNum > 999) {
            rollIsValid = false;
            rollErrMsg = "Roll No. must be between 1 and 999.";
          }
        }
      }

      if (!rollIsValid) {
        valid = false;
        firstInvalidEl = firstInvalidEl || el.rollNumberInput;
        el.rollNumberInput.classList.add("input-invalid");
        if (el.rollError) {
          el.rollError.textContent = rollErrMsg;
          el.rollError.hidden = false;
        }
      } else {
        el.rollNumberInput.classList.remove("input-invalid");
        if (el.rollError) {
          el.rollError.textContent = "";
          el.rollError.hidden = true;
        }
      }
    }

    if (!valid && showFocus && firstInvalidEl) {
      firstInvalidEl.focus();
    }
    return valid;
  }

  function syncStudentInputsFromIntro() {
    validateStudentInputsFromIntro(false);
    state.studentProfile.childName = (el.childNameInput?.value || "").trim();
    state.studentProfile.studentClass = (el.classInput?.value || "").trim();
    state.studentProfile.rollNumber = (el.rollNumberInput?.value || "").trim();
    state.studentProfile.guardianAssisted = Boolean(el.guardianAssistCheckbox?.checked);
    if (state.studentProfile.guardianAssisted) {
      state.missionsData.FP03.guardianAssisted = true;
    }
    saveState();
  }

  // =========================================================================
  // 3. STAGE RENDERER (Activities 1–5 = Missions, Activities 6–15 = Scored Quests)
  // =========================================================================
  function getOrderedQuestions() {
    const questions = window.MCCKidsData.reconstructQuestionsFromOrder(state.ageGroup, state.questionOrder);
    if (!Array.isArray(state.questionOrder) || state.questionOrder.length !== 10) {
      state.questionOrder = questions.map((q) => q.Question_ID);
      state.selectedQuestionIds = [...state.questionOrder].sort();
      saveState();
    }
    return questions;
  }

  function triggerStageCardEntrance() {
    const card = document.querySelector(".kids-activity-card");
    if (!card) return;
    card.classList.remove("kids-card-enter");
    void card.offsetWidth;
    card.classList.add("kids-card-enter");
  }

  function spawnEcoParticleBurst(originEl, emojis = ["🌿", "✨", "🌱", "⭐", "💚"]) {
    if (!originEl || typeof originEl.getBoundingClientRect !== "function") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = originEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 8;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "kids-eco-particle";
      p.textContent = emojis[i % emojis.length];
      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.35 - 0.175);
      const dist = 42 + Math.random() * 44;
      const tx = Math.round(Math.cos(angle) * dist);
      const ty = Math.round(Math.sin(angle) * dist - 18);
      const rot = Math.round((Math.random() - 0.5) * 90);
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.setProperty("--tx", `${tx}px`);
      p.style.setProperty("--ty", `${ty}px`);
      p.style.setProperty("--rot", `${rot}deg`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
  }

  function triggerOptionSelectionEffects(originEl, evalRes) {
    if (!originEl || typeof originEl.getBoundingClientRect !== "function") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = originEl.getBoundingClientRect();
    const badge = document.createElement("div");
    const pts = evalRes ? evalRes.awardedPoints : 0;
    const isOptimal = pts === 10;
    const isGood = pts >= 7;

    badge.className = `kids-floating-points ${pts >= 7 ? "" : "points-tier-learn"}`;
    badge.textContent =
      pts > 0
        ? `+${pts} Green Pts ${isOptimal ? "🌟" : isGood ? "🌱" : "💡"}`
        : "💡 Green Tip Unlocked!";
    badge.style.left = `${rect.left + rect.width / 2}px`;
    badge.style.top = `${rect.top + 12}px`;
    document.body.appendChild(badge);
    setTimeout(() => badge.remove(), 1200);

    if (pts >= 7) {
      spawnEcoParticleBurst(originEl, isOptimal ? ["🌟", "🌿", "✨", "🌱", "💚"] : ["🌱", "✨", "🌿", "🍃"]);
    } else {
      spawnEcoParticleBurst(originEl, ["💡", "✨", "🌱"]);
    }

    const scorePill = el.kidsHeaderScore?.closest(".kids-score-pill") || el.kidsHeaderScore;
    if (scorePill) {
      scorePill.classList.remove("kids-score-bump");
      void scorePill.offsetWidth;
      scorePill.classList.add("kids-score-bump");
    }
  }

  function renderCurrentStageActivity(animateCard = false) {
    const step = state.currentStep; // 0..14
    const isMission = step < 5;
    const overallActivityNum = step + 1;

    if (animateCard) {
      triggerStageCardEntrance();
    }

    el.stageOverallCounter.textContent = `Activity ${overallActivityNum} of 15`;
    el.stageBackBtn.style.visibility = "visible";

    // Update dual progress bars
    if (isMission) {
      const mNum = step + 1;
      el.stageTypeChip.className = "kids-stage-chip stage-mission";
      el.stageTypeChip.textContent = `🗺️ Carbon Footprint Mission ${mNum} of 5`;
      el.missionProgressBar.style.width = `${(mNum / 5) * 100}%`;
      el.questProgressBar.style.width = `0%`;
      el.missionBarLabel.textContent = `Mission ${mNum}/5 Active (Activity Data Only)`;
      el.questBarLabel.textContent = `10 Green Quests Next (100 Green Pts)`;
      el.questsTransitionBanner.hidden = true;
      renderFootprintMission(step, true);
    } else {
      const qIdx = step - 5; // 0..9
      const qNum = qIdx + 1;
      el.stageTypeChip.className = "kids-stage-chip stage-quest";
      el.stageTypeChip.textContent = `🌟 Green Score Quest ${qNum} of 10`;
      el.missionProgressBar.style.width = `100%`;
      el.questProgressBar.style.width = `${(qNum / 10) * 100}%`;
      el.missionBarLabel.textContent = `5/5 Footprint Missions Completed ✓`;
      el.questBarLabel.textContent = `Quest ${qNum}/10 (${computeLiveGreenScore()} / 100 Green Pts)`;
      el.questsTransitionBanner.hidden = qIdx !== 0;
      renderScoredQuestion(qIdx);
    }
  }

  // =========================================================================
  // 4. FIVE ESSENTIAL CARBON FOOTPRINT MISSIONS (Interactive Renderers)
  // =========================================================================
  function isMissionStepComplete(missionIndex) {
    if (missionIndex === 0) {
      const m1 = state.missionsData.FP01;
      const needsFuel = ["car", "two_wheeler", "auto", "school_bus", "public_bus"].includes(m1.mode);
      const hasDays = Array.isArray(m1.selectedDays) && m1.selectedDays.length > 0;
      return Boolean(m1.mode) && (!needsFuel || Boolean(m1.fuel)) && hasDays && Boolean(m1.returnTrip);
    }
    if (missionIndex === 1) {
      const m2 = state.missionsData.FP02;
      const selectedList = Array.isArray(m2.journeyTypes) && m2.journeyTypes.length > 0
        ? m2.journeyTypes
        : m2.journeyType
        ? String(m2.journeyType).split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const selectedModes = Array.isArray(m2.modes) && m2.modes.length > 0
        ? m2.modes
        : m2.mode
        ? String(m2.mode).split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const isNone = selectedList.includes("none") || m2.journeyType === "none";
      return selectedList.length > 0 && (isNone || selectedModes.length > 0);
    }
    if (missionIndex === 2) {
      const m3 = state.missionsData.FP03;
      return Boolean(m3.billAvailable) && Boolean(m3.reportingPeriod);
    }
    if (missionIndex === 3) {
      const m4 = state.missionsData.FP04;
      return (
        Boolean(m4.primaryDevice) &&
        (m4.primaryDevice === "none" || (Boolean(m4.deviceOwnership) && Boolean(m4.deviceAge)))
      );
    }
    if (missionIndex === 4) {
      const m5 = state.missionsData.FP05;
      return (
        Boolean(m5.dietCategory) &&
        Boolean(m5.portionSize) &&
        Boolean(m5.wasteFrequency) &&
        Boolean(m5.wasteDisposal)
      );
    }
    return true;
  }

  function updateMissionStepStatus(missionIndex) {
    el.stageNextBtn.disabled = !isMissionStepComplete(missionIndex);
  }

  function renderFootprintMission(missionIndex, refreshScene = false) {
    const missionsList = window.MCCKidsData.getFootprintMissions(state.ageGroup);
    const missionMeta = missionsList[missionIndex];

    el.activityCategoryBadge.textContent = `🧭 Mission ${missionIndex + 1}: ${missionMeta.Topic}`;
    el.activityDimensionBadge.textContent = "Carbon Footprint Data • 0 Green Points";
    el.activityTitle.textContent = missionMeta.Prompt;
    el.activitySubtitle.textContent = missionMeta.Subtitle;

    el.feedbackBanner.hidden = true;
    el.stageCheckAnswerBtn.hidden = true;
    el.stageNextBtn.disabled = !isMissionStepComplete(missionIndex);
    el.stageNextBtn.textContent = missionIndex === 4 ? "Finish Missions & Start Quests →" : `Save Mission ${missionIndex + 1} & Next →`;

    // Only render the left-side interactive scene when navigating to this mission (or if empty)
    if (refreshScene || !el.interactiveContainer.innerHTML.trim()) {
      renderMissionScenePreview(missionIndex);
    }

    // Render specific mission interactive controls on the right side
    if (missionIndex === 0) renderMission1SchoolCommute();
    else if (missionIndex === 1) renderMission2DailyTravel();
    else if (missionIndex === 2) renderMission3Electricity();
    else if (missionIndex === 3) renderMission4SuppliesDevices();
    else if (missionIndex === 4) renderMission5FoodWaste();
  }

  function renderMissionScenePreview(missionIndex) {
    updateMissionStepStatus(missionIndex);
    const mKey = `FP0${missionIndex + 1}`;
    const isPositiveState = Boolean(state.sceneInteractions[mKey]);
    const meterPct = isPositiveState ? 100 : 45;
    const meterTierClass = isPositiveState ? "meter-tier-optimal" : "";
    const hintPill = `<span class="scene-widget-hint">${isPositiveState ? "✨ Scene Active • Tap to Toggle" : "👆 Tap to Interact"}</span>`;

    const missionScenes = [
      {
        prompt: "🚌 Interactive Eco-Scene (School Commute)",
        idleEmoji: "🚗🚌🚲",
        activeEmoji: "🚲🚌🌿",
        idleTitle: "Tap to Explore Green School Commutes",
        activeTitle: "Shared & Active Commute Mode!",
        idleReadout: "🚌 Tap the button above to see how walking, cycling, and school buses cut per-student emissions!",
        activeReadout: "🌿 Walking and cycling use zero fuel, and sharing a school bus or metro divides emissions across dozens of students!"
      },
      {
        prompt: "🚲 Interactive Eco-Scene (Weekly Outings)",
        idleEmoji: "🛵🚗🌳",
        activeEmoji: "🚲🚶✨",
        idleTitle: "Tap to Explore Low-Carbon Outings",
        activeTitle: "Active Neighbourhood Explorer!",
        idleReadout: "🚲 Tap the button above to see how short local trips add up across the week!",
        activeReadout: "🌟 Walking or cycling to nearby parks, friends, and hobby classes keeps neighbourhood air clean and healthy!"
      },
      {
        prompt: "⚡ Interactive Eco-Scene (Home Electricity)",
        idleEmoji: "💡❄️🔌",
        activeEmoji: "☀️🌬️💚",
        idleTitle: "Tap to Test Fair Home Energy Sharing",
        activeTitle: "Fair 1/N Family Share Active!",
        idleReadout: "⚡ Tap the button above to learn how household electricity is shared fairly across family members!",
        activeReadout: "💡 A home's electricity is shared by everyone living together—switching off unused fans and lights lowers the whole family's footprint!"
      },
      {
        prompt: "🎒 Interactive Eco-Scene (Supplies & Devices)",
        idleEmoji: "📓✏️💻",
        activeEmoji: "♻️📚✨",
        idleTitle: "Tap to Inspect School Bag Footprint",
        activeTitle: "Long-Life Supplies & Smart Sharing!",
        idleReadout: "🎒 Tap the button above to discover where school supply and gadget emissions come from!",
        activeReadout: "📚 Reusing leftover notebook pages and caring for shared devices for more years saves raw materials and factory energy!"
      },
      {
        prompt: "🍱 Interactive Eco-Scene (Food & Zero Waste)",
        idleEmoji: "🍽️🥛🥗",
        activeEmoji: "🍱🌱🌟",
        idleTitle: "Tap to Pack a Zero-Waste Plate",
        activeTitle: "Clean Plate & Compost Champion!",
        idleReadout: "🍎 Tap the button above to see why finishing our plate and composting scraps matter!",
        activeReadout: "🌱 Taking mindful portions and composting fruit/veggie peels prevents methane gas in landfills!"
      }
    ];

    const sc = missionScenes[missionIndex] || missionScenes[0];

    el.interactiveContainer.innerHTML = `
      <div class="kids-scene-stage">
        <div class="kids-scene-top">
          <span class="kids-scene-prompt">${sc.prompt}</span>
          <div class="kids-scene-meter">
            <span>Eco Meter</span>
            <div class="kids-scene-meter-bar">
              <div class="kids-scene-meter-fill ${meterTierClass}" style="width:${meterPct}%;"></div>
            </div>
          </div>
        </div>
        <div class="kids-scene-canvas ${isPositiveState ? "scene-canvas-active" : ""}">
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? sc.activeEmoji : sc.idleEmoji}</span>
            <span>${isPositiveState ? sc.activeTitle : sc.idleTitle}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState ? sc.activeReadout : sc.idleReadout}
          </div>
        </div>
      </div>
    `;

    const sceneBtn = document.getElementById("sceneActionBtn");
    if (sceneBtn) {
      sceneBtn.addEventListener("click", () => {
        state.sceneInteractions[mKey] = !state.sceneInteractions[mKey];
        if (state.sceneInteractions[mKey]) {
          spawnEcoParticleBurst(sceneBtn, ["🌿", "✨", "🌱", "⭐"]);
        }
        saveState();
        renderMissionScenePreview(missionIndex);
      });
    }
  }

  // --- MISSION 1: My Journey to School ---
  function renderMission1SchoolCommute() {
    const m1 = state.missionsData.FP01;
    const modes = [
      { id: "walk", label: "Walking", icon: "🚶", helper: "Zero fuel!" },
      { id: "cycle", label: "Cycling", icon: "🚲", helper: "Pedal power!" },
      { id: "school_bus", label: "School Bus", icon: "🚌", helper: "Shared ride" },
      { id: "public_bus", label: "Public Bus", icon: "🚍", helper: "City transit" },
      { id: "metro_train", label: "Metro / Train", icon: "🚇", helper: "Electric rail" },
      { id: "auto", label: "Auto-Rickshaw", icon: "🛺", helper: "3-wheeler" },
      { id: "two_wheeler", label: "Two-Wheeler", icon: "🛵", helper: "Scooter/Bike" },
      { id: "car", label: "Car", icon: "🚗", helper: "Family/Pool car" }
    ];

    const needsFuel = ["car", "two_wheeler", "auto", "school_bus", "public_bus"].includes(m1.mode);
    const fuels = [
      { id: "petrol", label: "Petrol ⛽" },
      { id: "diesel", label: "Diesel 🛢️" },
      { id: "cng", label: "CNG 🌱" },
      { id: "ev", label: "Electric ⚡" },
      { id: "hybrid", label: "Hybrid 🔋" }
    ];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    el.answerContainer.innerHTML = `
      <div class="mission-form-grid">
        <div class="mission-block">
          <div class="mission-block-label">
            <span>1. What is your main mode of transport to school?</span>
          </div>
          <div class="mission-tile-selector" id="m1ModeGrid">
            ${modes.map((m) => `
              <button type="button" class="mission-choice-tile ${m1.mode === m.id ? "selected" : ""}" data-mode="${m.id}">
                <span class="mission-choice-icon">${m.icon}</span>
                <strong>${m.label}</strong>
                <small>${m.helper}</small>
              </button>
            `).join("")}
          </div>
        </div>

        ${needsFuel ? `
          <div class="mission-block">
            <div class="mission-block-label">
              <span>2. Vehicle Fuel / Energy Type</span>
              <small style="color:var(--kids-muted);">Ask a parent/driver if unsure</small>
            </div>
            <div class="mission-days-pills" id="m1FuelPills">
              ${fuels.map((f) => `
                <button type="button" class="mission-day-pill ${m1.fuel === f.id ? "selected" : ""}" data-fuel="${f.id}" style="padding:0 14px;">
                  ${f.label}
                </button>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <div class="mission-block">
          <div class="mission-block-label">
            <span>3. One-way distance from home to school (in km)</span>
            <span class="mission-number-badge" id="m1DistReadout">${m1.oneWayKm} km</span>
          </div>
          <p class="mission-block-helper">Slide or type the one-way distance. (Quick guide: Nearby walk ~1 km, Neighbourhood ~3–5 km, Across town ~10–15 km)</p>
          <div class="mission-slider-row">
            <input type="range" id="m1DistSlider" min="0.5" max="35" step="0.5" value="${m1.oneWayKm}" />
            <input type="number" class="kids-input" id="m1DistInput" min="0.2" max="80" step="0.5" value="${m1.oneWayKm}" style="width:95px;" />
          </div>
        </div>

        <div class="mission-block">
          <div class="mission-block-label">
            <span>4. School days per week &amp; Return journey</span>
            <span class="mission-number-badge">${m1.schoolDaysPerWeek} days/wk</span>
          </div>
          <div class="mission-days-pills" id="m1DaysPills">
            ${weekDays.map((d) => `
              <button type="button" class="mission-day-pill ${(m1.selectedDays || []).includes(d) ? "selected" : ""}" data-day="${d}">
                ${d}
              </button>
            `).join("")}
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
            <button type="button" class="mission-day-pill ${m1.returnTrip === "both_ways" ? "selected" : ""}" id="m1ReturnBoth" style="padding:0 16px;">
              🔄 Both ways (To &amp; From School)
            </button>
            <button type="button" class="mission-day-pill ${m1.returnTrip === "one_way" ? "selected" : ""}" id="m1ReturnOneWay" style="padding:0 16px;">
              ➡️ One-way only on this mode
            </button>
          </div>
        </div>

        ${m1.mode && m1.mode !== "walk" && m1.mode !== "cycle" ? `
          <div class="mission-block">
            <div class="mission-block-label">
              <span>5. How many people usually travel together in this vehicle?</span>
              <span class="mission-number-badge" id="m1OccReadout">${m1.occupancy} people</span>
            </div>
            <p class="mission-block-helper">Sharing rides (like carpooling or taking a bus) divides emissions across passengers!</p>
            <div class="mission-slider-row">
              <input type="range" id="m1OccSlider" min="1" max="45" step="1" value="${m1.occupancy}" />
            </div>
          </div>
        ` : ""}

        <div class="mission-block">
          <label style="display:flex; align-items:center; gap:10px; font-weight:800; cursor:pointer;">
            <input type="checkbox" id="m1SecondLegToggle" ${m1.hasSecondLeg ? "checked" : ""} style="width:18px; height:18px; accent-color:var(--kids-leaf);" />
            <span>➕ I use a second transport leg on my school journey (mixed-mode trip, e.g. auto/car to bus or metro stop)</span>
          </label>
          ${m1.hasSecondLeg ? `
            <div class="kids-field-row" style="margin-top:8px;">
              <div class="kids-field-group">
                <label for="m1Leg2Mode">Second Leg Mode</label>
                <select class="kids-select" id="m1Leg2Mode">
                  <option value="walk" ${m1.leg2Mode === "walk" ? "selected" : ""}>🚶 Walking (0 CO₂e)</option>
                  <option value="cycle" ${m1.leg2Mode === "cycle" ? "selected" : ""}>🚲 Cycling (0 CO₂e)</option>
                  <option value="school_bus" ${m1.leg2Mode === "school_bus" ? "selected" : ""}>🚌 School Bus</option>
                  <option value="public_bus" ${m1.leg2Mode === "public_bus" ? "selected" : ""}>🚍 Public Bus</option>
                  <option value="metro_train" ${m1.leg2Mode === "metro_train" ? "selected" : ""}>🚇 Metro / Train</option>
                  <option value="auto" ${m1.leg2Mode === "auto" ? "selected" : ""}>🛺 Auto-Rickshaw</option>
                  <option value="two_wheeler" ${m1.leg2Mode === "two_wheeler" ? "selected" : ""}>🛵 Two-Wheeler</option>
                  <option value="car" ${m1.leg2Mode === "car" ? "selected" : ""}>🚗 Car</option>
                </select>
              </div>
              <div class="kids-field-group">
                <label for="m1Leg2Km">Second Leg One-Way Distance (km)</label>
                <input type="number" class="kids-input" id="m1Leg2Km" min="0.2" max="25" step="0.2" value="${m1.leg2Km || 1}" />
              </div>
            </div>
          ` : ""}
        </div>
      </div>
    `;

    // Bind events
    el.answerContainer.querySelectorAll("#m1ModeGrid .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        m1.mode = btn.dataset.mode;
        if (m1.mode === "walk" || m1.mode === "cycle" || m1.mode === "metro_train") {
          m1.fuel = "na";
          m1.occupancy = 1;
        } else {
          if (m1.fuel === "na") m1.fuel = "";
          if (m1.mode === "school_bus" || m1.mode === "public_bus") m1.occupancy = 25;
          else if (m1.mode === "auto") m1.occupancy = 3;
          else m1.occupancy = 2;
        }
        saveState();
        renderFootprintMission(0);
      });
    });

    el.answerContainer.querySelectorAll("#m1FuelPills .mission-day-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        m1.fuel = btn.dataset.fuel;
        saveState();
        renderFootprintMission(0);
      });
    });

    const distSlider = document.getElementById("m1DistSlider");
    const distInput = document.getElementById("m1DistInput");
    const distReadout = document.getElementById("m1DistReadout");
    function blockNegativeKey(e) {
      if (["-", "+", "e", "E"].includes(e.key)) {
        e.preventDefault();
      }
    }
    function updateDist(val, syncInputBox = true) {
      const raw = String(val).replace(/-/g, "");
      const parsed = Number(raw);
      const num = Number.isFinite(parsed) && parsed > 0 ? Math.min(80, Math.max(0.2, parsed)) : 0.5;
      m1.oneWayKm = num;
      if (distSlider) distSlider.value = Math.min(35, num);
      if (distInput && syncInputBox) distInput.value = num;
      if (distReadout) distReadout.textContent = `${num} km`;
      saveState();
      updateMissionStepStatus(0);
    }
    distSlider?.addEventListener("input", (e) => updateDist(e.target.value, true));
    distInput?.addEventListener("keydown", blockNegativeKey);
    distInput?.addEventListener("input", (e) => {
      if (String(e.target.value).includes("-") || Number(e.target.value) < 0) {
        e.target.value = String(e.target.value).replace(/-/g, "");
      }
      if (e.target.value !== "") {
        updateDist(e.target.value, false);
      }
    });
    distInput?.addEventListener("change", (e) => updateDist(e.target.value, true));

    el.answerContainer.querySelectorAll("#m1DaysPills .mission-day-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const day = btn.dataset.day;
        const set = new Set(m1.selectedDays || []);
        if (set.has(day)) set.delete(day);
        else set.add(day);
        m1.selectedDays = Array.from(set);
        m1.schoolDaysPerWeek = m1.selectedDays.length;
        saveState();
        renderFootprintMission(0);
      });
    });

    document.getElementById("m1ReturnBoth")?.addEventListener("click", () => {
      m1.returnTrip = "both_ways";
      saveState();
      renderFootprintMission(0);
    });
    document.getElementById("m1ReturnOneWay")?.addEventListener("click", () => {
      m1.returnTrip = "one_way";
      saveState();
      renderFootprintMission(0);
    });

    const occSlider = document.getElementById("m1OccSlider");
    const occReadout = document.getElementById("m1OccReadout");
    occSlider?.addEventListener("input", (e) => {
      m1.occupancy = Math.max(1, Number(e.target.value) || 1);
      if (occReadout) occReadout.textContent = `${m1.occupancy} people`;
      saveState();
      updateMissionStepStatus(0);
    });

    document.getElementById("m1SecondLegToggle")?.addEventListener("change", (e) => {
      m1.hasSecondLeg = e.target.checked;
      saveState();
      renderFootprintMission(0);
    });

    document.getElementById("m1Leg2Mode")?.addEventListener("change", (e) => {
      m1.leg2Mode = e.target.value;
      saveState();
      updateMissionStepStatus(0);
    });

    const leg2KmInput = document.getElementById("m1Leg2Km");
    leg2KmInput?.addEventListener("keydown", blockNegativeKey);
    leg2KmInput?.addEventListener("input", (e) => {
      if (String(e.target.value).includes("-") || Number(e.target.value) < 0) {
        e.target.value = String(e.target.value).replace(/-/g, "");
      }
      const parsed = Number(e.target.value);
      m1.leg2Km = Number.isFinite(parsed) && parsed > 0 ? Math.min(25, Math.max(0.2, parsed)) : 0.2;
      saveState();
      updateMissionStepStatus(0);
    });
    leg2KmInput?.addEventListener("change", (e) => {
      const parsed = Number(String(e.target.value).replace(/-/g, ""));
      const clamped = Number.isFinite(parsed) && parsed > 0 ? Math.min(25, Math.max(0.2, parsed)) : 0.5;
      m1.leg2Km = clamped;
      e.target.value = clamped;
      saveState();
      updateMissionStepStatus(0);
    });
  }

  // --- MISSION 2: My Daily Travel (Outside School) ---
  function renderMission2DailyTravel() {
    const m2 = state.missionsData.FP02;
    const selectedTypes = Array.isArray(m2.journeyTypes) && m2.journeyTypes.length > 0
      ? m2.journeyTypes
      : m2.journeyType
      ? String(m2.journeyType).split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const isNoneSelected = selectedTypes.includes("none");

    const selectedModes = Array.isArray(m2.modes) && m2.modes.length > 0
      ? m2.modes
      : m2.mode
      ? String(m2.mode).split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const hasVehicleMode = selectedModes.some((md) => md !== "walk" && md !== "cycle");

    const journeyTypes = [
      { id: "sports_tuition", label: "Tuition / Coaching", icon: "📚", helper: "After-school classes" },
      { id: "sports_hobby", label: "Sports / Music / Art", icon: "⚽", helper: "Practice & clubs" },
      { id: "park_friends", label: "Park & Friends", icon: "🌳", helper: "Local playtime" },
      { id: "family_shopping", label: "Family Outings", icon: "🛍️", helper: "Weekend trips" },
      { id: "none", label: "No Extra Travel", icon: "🏡", helper: "Stay local / walk" }
    ];
    const modes = [
      { id: "walk", label: "Walking", icon: "🚶" },
      { id: "cycle", label: "Cycling", icon: "🚲" },
      { id: "public_bus", label: "Bus / Metro", icon: "🚌" },
      { id: "auto", label: "Auto", icon: "🛺" },
      { id: "two_wheeler", label: "Two-Wheeler", icon: "🛵" },
      { id: "car", label: "Car", icon: "🚗" }
    ];

    el.answerContainer.innerHTML = `
      <div class="mission-form-grid">
        <div class="mission-block">
          <div class="mission-block-label">
            <span>1. What are your non-school travel activities each week? <small style="color:var(--kids-leaf); font-weight:800;">(Select all that apply)</small></span>
            <small style="color:var(--kids-muted);">Do not include your school commute from Mission 1</small>
          </div>
          <div class="mission-tile-selector" id="m2TypeGrid">
            ${journeyTypes.map((jt) => {
              const isSelected = selectedTypes.includes(jt.id);
              return `
              <button type="button" class="mission-choice-tile ${isSelected ? "selected" : ""}" data-jtype="${jt.id}" aria-pressed="${isSelected ? "true" : "false"}">
                <span class="mission-choice-icon">${jt.icon}</span>
                <strong>${jt.label} ${isSelected ? "✓" : ""}</strong>
                <small>${jt.helper}</small>
              </button>
            `;
            }).join("")}
          </div>
        </div>

        ${!isNoneSelected ? `
          <div class="mission-block">
            <div class="mission-block-label">
              <span>2. How do you usually travel for these outings? <small style="color:var(--kids-leaf); font-weight:800;">(Select all that apply)</small></span>
            </div>
            <div class="mission-tile-selector" id="m2ModeGrid">
              ${modes.map((m) => {
                const isModeSelected = selectedModes.includes(m.id);
                return `
                <button type="button" class="mission-choice-tile ${isModeSelected ? "selected" : ""}" data-mode="${m.id}" aria-pressed="${isModeSelected ? "true" : "false"}">
                  <span class="mission-choice-icon">${m.icon}</span>
                  <strong>${m.label} ${isModeSelected ? "✓" : ""}</strong>
                </button>
              `;
              }).join("")}
            </div>
          </div>

          <div class="mission-block">
            <div class="mission-block-label">
              <span>3. Approximate round-trip distance per outing (km)</span>
              <span class="mission-number-badge" id="m2DistReadout">${m2.distanceKm} km</span>
            </div>
            <div class="mission-slider-row">
              <input type="range" id="m2DistSlider" min="0.5" max="30" step="0.5" value="${m2.distanceKm}" />
            </div>
          </div>

          <div class="mission-block">
            <div class="mission-block-label">
              <span>4. Total non-school trips per week across your selected activities</span>
              <span class="mission-number-badge" id="m2TripsReadout">${m2.tripsPerWeek} trips/week</span>
            </div>
            <div class="mission-slider-row">
              <input type="range" id="m2TripsSlider" min="1" max="14" step="1" value="${m2.tripsPerWeek}" />
            </div>
          </div>

          ${hasVehicleMode ? `
            <div class="mission-block">
              <div class="mission-block-label">
                <span>5. Shared or individual ride (people in vehicle)</span>
                <span class="mission-number-badge" id="m2OccReadout">${m2.occupancy} people</span>
              </div>
              <div class="mission-slider-row">
                <input type="range" id="m2OccSlider" min="1" max="15" step="1" value="${m2.occupancy}" />
              </div>
            </div>
          ` : ""}
        ` : ""}
      </div>
    `;

    el.answerContainer.querySelectorAll("#m2TypeGrid .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        const clickedId = btn.dataset.jtype;
        let nextSet = new Set(selectedTypes);

        if (clickedId === "none") {
          nextSet = new Set(["none"]);
        } else {
          nextSet.delete("none");
          if (nextSet.has(clickedId)) {
            nextSet.delete(clickedId);
          } else {
            nextSet.add(clickedId);
          }
        }

        m2.journeyTypes = Array.from(nextSet);
        m2.journeyType = m2.journeyTypes.includes("none") ? "none" : m2.journeyTypes.join(", ");
        saveState();
        renderFootprintMission(1);
      });
    });

    el.answerContainer.querySelectorAll("#m2ModeGrid .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        const clickedMode = btn.dataset.mode;
        const modeSet = new Set(selectedModes);
        if (modeSet.has(clickedMode)) {
          modeSet.delete(clickedMode);
        } else {
          modeSet.add(clickedMode);
        }
        m2.modes = Array.from(modeSet);
        m2.mode = m2.modes.join(", ");
        saveState();
        renderFootprintMission(1);
      });
    });

    document.getElementById("m2DistSlider")?.addEventListener("input", (e) => {
      m2.distanceKm = Number(e.target.value);
      document.getElementById("m2DistReadout").textContent = `${m2.distanceKm} km`;
      saveState();
      updateMissionStepStatus(1);
    });

    document.getElementById("m2TripsSlider")?.addEventListener("input", (e) => {
      m2.tripsPerWeek = Number(e.target.value);
      document.getElementById("m2TripsReadout").textContent = `${m2.tripsPerWeek} trips/week`;
      saveState();
      updateMissionStepStatus(1);
    });

    document.getElementById("m2OccSlider")?.addEventListener("input", (e) => {
      m2.occupancy = Number(e.target.value);
      document.getElementById("m2OccReadout").textContent = `${m2.occupancy} people`;
      saveState();
      updateMissionStepStatus(1);
    });
  }

  // --- MISSION 3: Electricity at Home ---
  function renderMission3Electricity() {
    const m3 = state.missionsData.FP03;
    const billOptions = [
      { id: "yes", label: "Yes, we checked the bill/meter", icon: "🧾", helper: "Exact monthly kWh" },
      { id: "estimate", label: "Approximate home estimate", icon: "💡", helper: "Typical home band" },
      { id: "unavailable", label: "Bill not available right now", icon: "❓", helper: "Mark as incomplete" }
    ];
    const periods = [
      {
        id: "Typical Month",
        icon: "🌤️",
        label: "Regular / Average Month",
        helper: "Normal weather & usual fan/appliance use (Typical Month)"
      },
      {
        id: "Summer Month (Higher AC/Fan)",
        icon: "☀️",
        label: "Hot Summer Month (Mar–Jun)",
        helper: "Higher electricity use when ACs, coolers & fans run more"
      },
      {
        id: "Winter / Monsoon Month",
        icon: "🌧️",
        label: "Cooler Winter / Monsoon Month (Jul–Feb)",
        helper: "Lower AC & fan use during rainy or cooler months"
      }
    ];

    el.answerContainer.innerHTML = `
      <div class="mission-form-grid">
        <div class="mission-block">
          <div class="mission-block-label">
            <span>1. Is your household electricity bill or consumption information available?</span>
          </div>
          <div class="mission-tile-selector" id="m3BillGrid">
            ${billOptions.map((bo) => `
              <button type="button" class="mission-choice-tile ${m3.billAvailable === bo.id ? "selected" : ""}" data-bill="${bo.id}">
                <span class="mission-choice-icon">${bo.icon}</span>
                <strong>${bo.label}</strong>
                <small>${bo.helper}</small>
              </button>
            `).join("")}
          </div>
          <label style="display:flex; align-items:center; gap:10px; font-weight:700; font-size:0.9rem; margin-top:6px; cursor:pointer;">
            <input type="checkbox" id="m3GuardianCheck" ${m3.guardianAssisted ? "checked" : ""} style="width:18px; height:18px; accent-color:var(--kids-leaf);" />
            <span>👨‍👩‍👧 A parent or guardian helped provide or check this electricity information</span>
          </label>
        </div>

        <div class="mission-block">
          <div class="mission-block-label">
            <span>2. How many people live in your home (Household Size)?</span>
            <span class="mission-number-badge" id="m3HouseReadout">${m3.householdSize} people</span>
          </div>
          <p class="mission-block-helper">We never attribute the whole home's electricity to one child—we divide shared household electricity equally across all ${m3.householdSize} family members (1/${m3.householdSize} share).</p>
          <div class="mission-slider-row">
            <input type="range" id="m3HouseSlider" min="1" max="12" step="1" value="${m3.householdSize}" />
          </div>
        </div>

        ${m3.billAvailable !== "unavailable" ? `
          <div class="mission-block">
            <div class="mission-block-label">
              <span>3. Monthly Household Electricity Consumption (kWh / units)</span>
              <span class="mission-number-badge" id="m3KwhReadout">${m3.monthlyKwh} kWh/mo</span>
            </div>
            <p class="mission-block-helper">1 Unit on an Indian electricity bill = 1 kWh. (Small flat ~100–150 kWh, Medium home ~180–250 kWh, Large home with ACs ~300–500 kWh)</p>
            <div class="mission-slider-row">
              <input type="range" id="m3KwhSlider" min="30" max="800" step="10" value="${m3.monthlyKwh}" />
              <input type="number" class="kids-input" id="m3KwhInput" min="10" max="2500" step="5" value="${m3.monthlyKwh}" style="width:105px;" />
            </div>
            <div class="mission-days-pills" style="margin-top:6px;">
              <button type="button" class="mission-day-pill" data-preset="120" style="padding:0 12px; font-size:0.8rem;">Small Home (~120 kWh)</button>
              <button type="button" class="mission-day-pill" data-preset="200" style="padding:0 12px; font-size:0.8rem;">Typical Home (~200 kWh)</button>
              <button type="button" class="mission-day-pill" data-preset="340" style="padding:0 12px; font-size:0.8rem;">AC Home (~340 kWh)</button>
            </div>
          </div>
        ` : `
          <div class="mission-allocation-callout" style="background:#fff6e8; border-color:rgba(213,164,107,0.5);">
            <strong>ℹ️ Transparency Note:</strong> Since the electricity bill is unavailable right now, your household electricity category will be clearly marked as <em>"Incomplete – Bill Data Unavailable"</em> on your dashboard rather than guessing a fake number.
          </div>
        `}

        <div class="mission-block">
          <div class="mission-block-label">
            <span>4. Reporting Period (Which season or bill month is this electricity usage from?)</span>
          </div>
          <p class="mission-block-helper">Electricity use changes with the weather! Pick the season that matches your electricity bill or estimate:</p>
          <div class="mission-tile-selector" id="m3PeriodPills">
            ${periods.map((p) => `
              <button type="button" class="mission-choice-tile ${m3.reportingPeriod === p.id ? "selected" : ""}" data-period="${p.id}">
                <span class="mission-choice-icon">${p.icon}</span>
                <strong>${p.label}</strong>
                <small>${p.helper}</small>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    el.answerContainer.querySelectorAll("#m3BillGrid .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        m3.billAvailable = btn.dataset.bill;
        if (m3.billAvailable !== "unavailable" && (!m3.monthlyKwh || m3.monthlyKwh <= 0)) {
          m3.monthlyKwh = 180;
        }
        saveState();
        renderFootprintMission(2);
      });
    });

    document.getElementById("m3GuardianCheck")?.addEventListener("change", (e) => {
      m3.guardianAssisted = e.target.checked;
      saveState();
      updateMissionStepStatus(2);
    });

    document.getElementById("m3HouseSlider")?.addEventListener("input", (e) => {
      m3.householdSize = Math.max(1, Number(e.target.value) || 4);
      document.getElementById("m3HouseReadout").textContent = `${m3.householdSize} people`;
      saveState();
      updateMissionStepStatus(2);
    });

    const kwhSlider = document.getElementById("m3KwhSlider");
    const kwhInput = document.getElementById("m3KwhInput");
    const kwhReadout = document.getElementById("m3KwhReadout");
    function updateKwh(val, syncInputBox = true) {
      const cleaned = String(val).replace(/-/g, "");
      const parsed = Number(cleaned);
      const num = Number.isFinite(parsed) && parsed > 0 ? Math.min(2500, Math.max(10, parsed)) : 180;
      m3.monthlyKwh = num;
      if (kwhSlider) kwhSlider.value = Math.min(800, num);
      if (kwhInput && syncInputBox) kwhInput.value = num;
      if (kwhReadout) kwhReadout.textContent = `${num} kWh/mo`;
      saveState();
      updateMissionStepStatus(2);
    }
    kwhSlider?.addEventListener("input", (e) => updateKwh(e.target.value, true));
    kwhInput?.addEventListener("keydown", (e) => {
      if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
    });
    kwhInput?.addEventListener("input", (e) => {
      if (String(e.target.value).includes("-") || Number(e.target.value) < 0) {
        e.target.value = String(e.target.value).replace(/-/g, "");
      }
      if (e.target.value !== "") {
        updateKwh(e.target.value, false);
      }
    });
    kwhInput?.addEventListener("change", (e) => updateKwh(e.target.value, true));

    el.answerContainer.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => updateKwh(btn.dataset.preset, true));
    });

    el.answerContainer.querySelectorAll("#m3PeriodPills .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        m3.reportingPeriod = btn.dataset.period;
        saveState();
        renderFootprintMission(2);
      });
    });
  }

  // --- MISSION 4: My School Supplies and Digital Devices ---
  function renderMission4SuppliesDevices() {
    const m4 = state.missionsData.FP04;
    const devices = [
      { id: "tablet", label: "Tablet / iPad", icon: "📱" },
      { id: "laptop", label: "Laptop", icon: "💻" },
      { id: "desktop", label: "Desktop PC", icon: "🖥️" },
      { id: "smartphone", label: "Smartphone", icon: "📲" },
      { id: "none", label: "No Personal Device", icon: "📕" }
    ];
    const ages = [
      { id: "under_1_yr", label: "New (< 1 year)" },
      { id: "1_3_yrs", label: "1–3 years old" },
      { id: "3_5_yrs", label: "3–5 years old" },
      { id: "over_5_yrs", label: "5+ years (Long life!)" }
    ];

    el.answerContainer.innerHTML = `
      <div class="mission-form-grid">
        <div class="mission-block">
          <div class="mission-block-label">
            <span>1. School Supplies Purchased in the Last 12 Months</span>
          </div>
          <div class="kids-field-row" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));">
            <div class="kids-field-group">
              <label for="m4Notebooks">📓 New Notebooks &amp; Books: <strong id="m4NbVal">${m4.notebooksPerYear}</strong></label>
              <input type="range" id="m4Notebooks" min="0" max="30" step="1" value="${m4.notebooksPerYear}" />
            </div>
            <div class="kids-field-group">
              <label for="m4Stationery">✏️ Stationery Sets / Pouches: <strong id="m4StVal">${m4.stationerySetsPerYear}</strong></label>
              <input type="range" id="m4Stationery" min="0" max="8" step="1" value="${m4.stationerySetsPerYear}" />
            </div>
            <div class="kids-field-group">
              <label for="m4Uniforms">👕 New Uniform &amp; Shoe Sets: <strong id="m4UnVal">${m4.uniformSetsPerYear}</strong></label>
              <input type="range" id="m4Uniforms" min="0" max="6" step="1" value="${m4.uniformSetsPerYear}" />
            </div>
          </div>
        </div>

        <div class="mission-block">
          <div class="mission-block-label">
            <span>2. Primary Electronic Device Used for Study or Play</span>
          </div>
          <div class="mission-tile-selector" id="m4DeviceGrid">
            ${devices.map((d) => `
              <button type="button" class="mission-choice-tile ${m4.primaryDevice === d.id ? "selected" : ""}" data-dev="${d.id}">
                <span class="mission-choice-icon">${d.icon}</span>
                <strong>${d.label}</strong>
              </button>
            `).join("")}
          </div>
        </div>

        ${m4.primaryDevice !== "none" ? `
          <div class="mission-block">
            <div class="mission-block-label">
              <span>3. Device Ownership &amp; Age</span>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button type="button" class="mission-day-pill ${m4.deviceOwnership === "shared" ? "selected" : ""}" id="m4OwnShared" style="padding:0 16px;">
                👨‍👩‍👧 Shared Family Device
              </button>
              <button type="button" class="mission-day-pill ${m4.deviceOwnership === "personal" ? "selected" : ""}" id="m4OwnPersonal" style="padding:0 16px;">
                🧒 My Personal Device
              </button>
            </div>
            <div class="mission-days-pills" id="m4AgePills" style="margin-top:8px;">
              ${ages.map((a) => `
                <button type="button" class="mission-day-pill ${m4.deviceAge === a.id ? "selected" : ""}" data-age="${a.id}" style="padding:0 14px;">
                  ${a.label}
                </button>
              `).join("")}
            </div>
          </div>

          <div class="mission-block">
            <div class="mission-block-label">
              <span>4. Approximate Daily Screen / Usage Duration</span>
              <span class="mission-number-badge" id="m4HoursReadout">${m4.dailyHours} hrs/day</span>
            </div>
            <div class="mission-slider-row">
              <input type="range" id="m4HoursSlider" min="0.5" max="8" step="0.5" value="${m4.dailyHours}" />
            </div>
          </div>
        ` : ""}
      </div>
    `;

    document.getElementById("m4Notebooks")?.addEventListener("input", (e) => {
      m4.notebooksPerYear = Number(e.target.value);
      document.getElementById("m4NbVal").textContent = m4.notebooksPerYear;
      saveState();
      updateMissionStepStatus(3);
    });
    document.getElementById("m4Stationery")?.addEventListener("input", (e) => {
      m4.stationerySetsPerYear = Number(e.target.value);
      document.getElementById("m4StVal").textContent = m4.stationerySetsPerYear;
      saveState();
      updateMissionStepStatus(3);
    });
    document.getElementById("m4Uniforms")?.addEventListener("input", (e) => {
      m4.uniformSetsPerYear = Number(e.target.value);
      document.getElementById("m4UnVal").textContent = m4.uniformSetsPerYear;
      saveState();
      updateMissionStepStatus(3);
    });

    el.answerContainer.querySelectorAll("#m4DeviceGrid .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        m4.primaryDevice = btn.dataset.dev;
        saveState();
        renderFootprintMission(3);
      });
    });

    document.getElementById("m4OwnShared")?.addEventListener("click", () => {
      m4.deviceOwnership = "shared";
      saveState();
      renderFootprintMission(3);
    });
    document.getElementById("m4OwnPersonal")?.addEventListener("click", () => {
      m4.deviceOwnership = "personal";
      saveState();
      renderFootprintMission(3);
    });

    el.answerContainer.querySelectorAll("#m4AgePills .mission-day-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        m4.deviceAge = btn.dataset.age;
        saveState();
        renderFootprintMission(3);
      });
    });

    document.getElementById("m4HoursSlider")?.addEventListener("input", (e) => {
      m4.dailyHours = Number(e.target.value);
      document.getElementById("m4HoursReadout").textContent = `${m4.dailyHours} hrs/day`;
      saveState();
      updateMissionStepStatus(3);
    });
  }

  // --- MISSION 5: My Food and Food Waste ---
  function renderMission5FoodWaste() {
    const m5 = state.missionsData.FP05;
    const diets = [
      { id: "plant_rich", label: "Mostly Plant-Based", icon: "🥦", helper: "Dal, veggies, fruits & grains" },
      { id: "vegetarian", label: "Vegetarian + Dairy", icon: "🥗", helper: "Veggies, grains, milk & curd" },
      { id: "eggetarian", label: "Eggetarian", icon: "🍳", helper: "Vegetarian meals + eggs" },
      { id: "mixed_nonveg", label: "Mixed (Veg & Non-Veg)", icon: "🍗", helper: "Includes chicken, fish or meat" }
    ];
    const wasteFreqs = [
      { id: "never", label: "Clean Plate Champion!", grams: 0, icon: "🌟" },
      { id: "rarely", label: "Rarely (1–2 times/wk)", grams: 150, icon: "🙂" },
      { id: "sometimes", label: "Sometimes (3–4 times/wk)", grams: 400, icon: "🍽️" },
      { id: "often", label: "Often (Almost daily)", grams: 750, icon: "🗑️" }
    ];
    const disposals = [
      { id: "compost", label: "Composted for plants 🌱" },
      { id: "animal_feed", label: "Fed safely to animals/birds 🐦" },
      { id: "segregated", label: "Segregated wet-waste bin ♻️" },
      { id: "landfill", label: "Mixed dustbin / Landfill 🗑️" }
    ];

    el.answerContainer.innerHTML = `
      <div class="mission-form-grid">
        <div class="mission-block">
          <div class="mission-block-label">
            <span>1. What types of food do you usually eat?</span>
          </div>
          <div class="mission-tile-selector" id="m5DietGrid">
            ${diets.map((d) => `
              <button type="button" class="mission-choice-tile ${m5.dietCategory === d.id ? "selected" : ""}" data-diet="${d.id}">
                <span class="mission-choice-icon">${d.icon}</span>
                <strong>${d.label}</strong>
                <small>${d.helper}</small>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="mission-block">
          <div class="mission-block-label">
            <span>2. Daily Dairy Servings &amp; Portion Size</span>
            <span class="mission-number-badge" id="m5DairyReadout">${m5.dairyServingsPerDay} glasses/day</span>
          </div>
          <div class="mission-slider-row">
            <input type="range" id="m5DairySlider" min="0" max="5" step="1" value="${m5.dairyServingsPerDay}" />
          </div>
          <div class="mission-days-pills" id="m5PortionPills" style="margin-top:8px;">
            <button type="button" class="mission-day-pill ${m5.portionSize === "small" ? "selected" : ""}" data-portion="small" style="padding:0 14px;">🥛 Small Portion (100 ml)</button>
            <button type="button" class="mission-day-pill ${m5.portionSize === "medium" ? "selected" : ""}" data-portion="medium" style="padding:0 14px;">🥛 Regular Portion (200 ml)</button>
            <button type="button" class="mission-day-pill ${m5.portionSize === "large" ? "selected" : ""}" data-portion="large" style="padding:0 14px;">🥛 Large Portion (300 ml)</button>
          </div>
        </div>

        <div class="mission-block">
          <div class="mission-block-label">
            <span>3. How often is food left uneaten or wasted on your plate?</span>
            <span class="mission-number-badge" id="m5WasteReadout">~${m5.wasteGramsPerWeek} g/week</span>
          </div>
          <div class="mission-tile-selector" id="m5WasteGrid">
            ${wasteFreqs.map((wf) => `
              <button type="button" class="mission-choice-tile ${m5.wasteFrequency === wf.id ? "selected" : ""}" data-wfreq="${wf.id}" data-grams="${wf.grams}">
                <span class="mission-choice-icon">${wf.icon}</span>
                <strong>${wf.label}</strong>
                <small>~${wf.grams}g / week</small>
              </button>
            `).join("")}
          </div>
        </div>

        <div class="mission-block">
          <div class="mission-block-label">
            <span>4. How is food waste (like fruit peels or leftovers) managed at home/school?</span>
          </div>
          <div class="mission-days-pills" id="m5DisposalPills">
            ${disposals.map((dsp) => `
              <button type="button" class="mission-day-pill ${m5.wasteDisposal === dsp.id ? "selected" : ""}" data-disp="${dsp.id}" style="padding:0 14px;">
                ${dsp.label}
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    el.answerContainer.querySelectorAll("#m5DietGrid .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        m5.dietCategory = btn.dataset.diet;
        saveState();
        renderFootprintMission(4);
      });
    });

    document.getElementById("m5DairySlider")?.addEventListener("input", (e) => {
      m5.dairyServingsPerDay = Number(e.target.value);
      document.getElementById("m5DairyReadout").textContent = `${m5.dairyServingsPerDay} glasses/day`;
      saveState();
      updateMissionStepStatus(4);
    });

    el.answerContainer.querySelectorAll("#m5PortionPills .mission-day-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        m5.portionSize = btn.dataset.portion;
        saveState();
        renderFootprintMission(4);
      });
    });

    el.answerContainer.querySelectorAll("#m5WasteGrid .mission-choice-tile").forEach((btn) => {
      btn.addEventListener("click", () => {
        m5.wasteFrequency = btn.dataset.wfreq;
        m5.wasteGramsPerWeek = Number(btn.dataset.grams) || 0;
        saveState();
        renderFootprintMission(4);
      });
    });

    el.answerContainer.querySelectorAll("#m5DisposalPills .mission-day-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        m5.wasteDisposal = btn.dataset.disp;
        saveState();
        renderFootprintMission(4);
      });
    });
  }

  // =========================================================================
  // 5. INTERACTIVE SCORED QUESTIONS (Quests 1–15) & VISUAL MINI-SCENES
  // =========================================================================
  function getCategoryIcon(category) {
    const map = {
      "Water Conservation": "💧",
      "Energy Conservation": "⚡",
      "Waste & Recycling": "♻️",
      "Food Sustainability": "🍎",
      "Nature & Biodiversity": "🦋",
      "Circular Economy": "🔄",
      "Sustainable Purchasing": "🛍️",
      "Green Transport": "🚲",
      "Climate Awareness": "🌍",
      "Digital Sustainability": "💻",
      "Product Lifecycle": "📓",
      "Carbon Literacy": "🌱",
      "Sustainable Lifestyle": "🌟"
    };
    return map[category] || "🌿";
  }

  function formatOptionTextWithBracketHint(text) {
    const str = String(text || "");
    const match = str.match(/^(.*?)\s*(\([^()]+\))\s*$/);
    if (!match) return escapeHtml(str);
    return `${escapeHtml(match[1])} <span class="kids-option-hint">${escapeHtml(match[2])}</span>`;
  }

  function renderScoredQuestion(qIdx, lastClickedOpt = "") {
    const orderedQuestions = getOrderedQuestions();
    const q = orderedQuestions[qIdx];
    if (!q) return;

    const qId = q.Question_ID;
    const selectedOpt = state.quizAnswers[qId] || "";

    el.activityCategoryBadge.textContent = `${getCategoryIcon(q.Category)} ${q.Category} • ${q.Sub_Category}`;
    el.activityDimensionBadge.textContent = `${q.Assessment_Dimension} (Max 10 Pts)`;
    el.activityTitle.textContent = q.Question_Text;
    el.activitySubtitle.textContent = `💡 Interactive Scene: ${q.Interaction_Idea}`;

    // Render Question-Specific Interactive Visual Scene ONLY when navigating to the question (not when clicking options A/B/C/D)
    if (!lastClickedOpt) {
      renderQuestionInteractiveScene(q);
    }

    // Render 4 Options (A, B, C, D) — NEVER exposing option scores in the DOM!
    const optionsList = [
      { key: "A", text: q.Option_A },
      { key: "B", text: q.Option_B },
      { key: "C", text: q.Option_C },
      { key: "D", text: q.Option_D }
    ];

    el.answerContainer.innerHTML = `
      <div class="kids-options-grid" role="radiogroup" aria-label="${escapeHtml(q.Question_Text)}">
        ${optionsList.map((opt) => `
          <button
            type="button"
            class="kids-option-btn ${selectedOpt === opt.key ? "selected" : ""} ${lastClickedOpt === opt.key ? "just-picked" : ""}"
            data-opt="${opt.key}"
            role="radio"
            aria-checked="${selectedOpt === opt.key ? "true" : "false"}"
          >
            <span class="kids-option-letter">${opt.key}</span>
            <span class="kids-option-text">${formatOptionTextWithBracketHint(opt.text)}</span>
            <span class="kids-option-check" aria-hidden="true">✓</span>
          </button>
        `).join("")}
      </div>
    `;

    el.answerContainer.querySelectorAll(".kids-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = btn.dataset.opt;
        state.quizAnswers[qId] = chosen;
        state.lockedQuestions[qId] = true;
        const evalRes = window.MCCKidsData.evaluateSingleAnswer(qId, chosen);
        triggerOptionSelectionEffects(btn, evalRes);
        saveState();
        renderScoredQuestion(qIdx, chosen);
        el.questBarLabel.textContent = `Quest ${qIdx + 1}/10 (${computeLiveGreenScore()} / 100 Green Pts)`;
        savePartialProgressToBackend(`Quest_${qIdx + 1}`);
      });
    });

    // Feedback & Action Buttons
    if (selectedOpt) {
      state.lockedQuestions[qId] = true;
      const evalRes = window.MCCKidsData.evaluateSingleAnswer(qId, selectedOpt);
      showEncouragingFeedback(q, evalRes);
      el.stageCheckAnswerBtn.hidden = true;
      el.stageNextBtn.disabled = false;
      el.stageNextBtn.textContent = qIdx === 9 ? "Complete Quiz & See Results 🎉" : "Next Quest →";
    } else {
      el.feedbackBanner.hidden = true;
      el.stageCheckAnswerBtn.hidden = true;
      el.stageNextBtn.disabled = true;
      el.stageNextBtn.textContent = qIdx === 9 ? "Complete Quiz & See Results 🎉" : "Next Quest →";
    }
  }

  function renderQuestionInteractiveScene(q) {
    const qId = q.Question_ID;
    const isPositiveState = Boolean(state.sceneInteractions[qId]);

    // Eco Meter & scene state ONLY change when the user clicks #sceneActionBtn directly
    const meterPct = isPositiveState ? 100 : 42;
    const meterTierClass = isPositiveState ? "meter-tier-optimal" : "";

    const hintPill = `<span class="scene-widget-hint">${isPositiveState ? "✨ Scene Active • Tap to Toggle" : "👆 Tap to Interact"}</span>`;

    let sceneHtml = "";
    switch (q.sceneType) {
      case "water_tap":
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "🚰✨💧" : "🚰💧"}</span>
            <span>${isPositiveState ? "Tap Turned OFF (Water Saved!)" : "Tap to Turn Off Running Water"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "💧 Splashy the Water Drop cheers! Turning off unused taps keeps the water tank full and clean."
              : "💧 Tap the faucet button above to see the water tank react!"}
          </div>
        `;
        break;

      case "energy_switch":
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "☀️🌬️🔋" : "💡🌀"}</span>
            <span>${isPositiveState ? "Clean Eco-Power Mode ON!" : "Tap to Flip Smart Energy Switch"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "⚡ Smart Energy Meter is in the Green Zone! Clean renewable energy & smart switching save watts."
              : "⚡ Tap the switchboard button above to test clean energy & power saving!"}
          </div>
        `;
        break;

      case "waste_bins":
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "♻️🌱✨" : "🗑️🍌"}</span>
            <span>${isPositiveState ? "Sorted into Compost & Recycling!" : "Tap to Sort Waste & Use Reusables"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "♻️ Clean-up complete! Organic scraps become compost and recyclables stay out of landfills."
              : "♻️ Tap the sorting station button above to test waste segregation!"}
          </div>
        `;
        break;

      case "food_plate":
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "🍱🌟🍎" : "🍽️🥗"}</span>
            <span>${isPositiveState ? "Zero-Waste Portion & Reusable Box!" : "Tap to Pack a Zero-Waste Plate"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "🍎 Mindful portions and safe leftover storage keep edible food off the waste meter!"
              : "🍎 Tap the plate station button above to test smart food portions!"}
          </div>
        `;
        break;

      case "circular_loop":
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "🛠️🔄✨" : "📦🛍️"}</span>
            <span>${isPositiveState ? "Repaired, Reused & Shared!" : "Tap to Activate Circular Workshop"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "🔄 Circular Loop active! Extending product life saves raw materials and manufacturing energy."
              : "🔄 Tap the workshop button above to explore repairing, reusing, and sharing!"}
          </div>
        `;
        break;

      case "transport_road":
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "🚲🚌🌿" : "🚗💨"}</span>
            <span>${isPositiveState ? "Active & Shared Mobility Lane!" : "Tap to Compare Travel Modes"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "🚲 Walking, cycling safely, and sharing rides keeps the air cleaner for everyone!"
              : "🚲 Tap the street simulator button above to compare per-passenger travel!"}
          </div>
        `;
        break;

      case "climate_earth":
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "🌍🌿✨" : "🌡️☀️"}</span>
            <span>${isPositiveState ? "Climate Action Tracker Active!" : "Tap to Explore Earth's Climate Balance"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "🌍 Measurable climate action and nature restoration help keep Earth's atmosphere in balance!"
              : "🌍 Tap the Earth Explorer button above to visualise climate balance!"}
          </div>
        `;
        break;

      case "emission_detective": {
        let detEmoji = "🔍🌍";
        let detTitle = "Tap to Trace Where Emissions Come From";
        let detReadout = "🕵️ Tap the detector button above to investigate what causes greenhouse gas emissions!";

        if (q.Question_ID === "YA023") {
          detEmoji = isPositiveState ? "🚜🏭🚚" : "🌾🚜🚚";
          detTitle = isPositiveState
            ? "Emission Source: Farm → Factory → Truck!"
            : "Tap to Trace Food Supply Chain";
          detReadout = isPositiveState
            ? "🔍 Tractors, processing factories, cold storage, and transport trucks all use energy and fuel, which release greenhouse gases!"
            : "🚜 Tap the button above to trace where greenhouse gas emissions happen in food production!";
        } else if (q.Question_ID === "YA022") {
          detEmoji = isPositiveState ? "🌲🏭🚚" : "📓🔍";
          detTitle = isPositiveState
            ? "Lifecycle Emissions: Raw Materials → Factory → Shipping!"
            : "Tap to Inspect Notebook Lifecycle";
          detReadout = isPositiveState
            ? "🔍 Harvesting materials, making paper in factories, and shipping notebooks all use energy and release emissions before the notebook reaches your desk!"
            : "📓 Tap the button above to see why products have a carbon footprint before you use them!";
        } else {
          detEmoji = isPositiveState ? "☀️🌍🌡️" : "🌍☀️";
          detTitle = isPositiveState
            ? "Greenhouse Blanket Effect: Trapping Heat in the Air!"
            : "Tap to Inspect Earth's Atmosphere";
          detReadout = isPositiveState
            ? "🔍 Greenhouse gases absorb and trap heat in Earth's atmosphere like a warm blanket, causing global warming!"
            : "🌍 Tap the button above to see how greenhouse gases affect Earth's temperature!";
        }

        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${detEmoji}</span>
            <span>${detTitle}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${detReadout}
          </div>
        `;
        break;
      }

      case "nature_garden":
      default:
        sceneHtml = `
          <button type="button" class="scene-widget-btn ${isPositiveState ? "active" : ""}" id="sceneActionBtn">
            <span class="scene-widget-emoji">${isPositiveState ? "🌳🦋🐝" : "🌱🌸"}</span>
            <span>${isPositiveState ? "Habitat Blooming & Pollinators Happy!" : "Tap to Care for the Living Garden"}</span>
            ${hintPill}
          </button>
          <div class="scene-status-readout">
            ${isPositiveState
              ? "🦋 Trees absorb CO₂ and native flowers support bees and butterflies across the ecosystem!"
              : "🦋 Tap the garden button above to watch plants and pollinators thrive!"}
          </div>
        `;
        break;
    }

    const meterLabel = q.Question_Type === "Knowledge" ? "Knowledge Meter" : "Eco Meter";

    el.interactiveContainer.innerHTML = `
      <div class="kids-scene-stage">
        <div class="kids-scene-top">
          <span class="kids-scene-prompt">🎮 Interactive Eco-Scene (${escapeHtml(q.Sub_Category)})</span>
          <div class="kids-scene-meter">
            <span>${meterLabel}</span>
            <div class="kids-scene-meter-bar">
              <div class="kids-scene-meter-fill ${meterTierClass}" style="width:${meterPct}%;"></div>
            </div>
          </div>
        </div>
        <div class="kids-scene-canvas ${isPositiveState ? "scene-canvas-active" : ""}">
          ${sceneHtml}
        </div>
      </div>
    `;

    const sceneBtn = document.getElementById("sceneActionBtn");
    if (sceneBtn) {
      sceneBtn.addEventListener("click", () => {
        state.sceneInteractions[qId] = !state.sceneInteractions[qId];
        if (state.sceneInteractions[qId]) {
          spawnEcoParticleBurst(sceneBtn, ["🌿", "✨", "🌱", "⭐"]);
        }
        saveState();
        renderQuestionInteractiveScene(q);
      });
    }
  }

  function showEncouragingFeedback(q, evalRes) {
    el.feedbackBanner.hidden = false;
    if (evalRes.tier === "optimal") {
      el.feedbackEmoji.textContent = "🌟";
      el.feedbackHeading.textContent =
        state.ageGroup === "11-14"
          ? "Spot-on sustainability thinking! (+10 Green Points)"
          : "Super Planet Hero choice! (+10 Green Points)";
    } else if (evalRes.tier === "good") {
      el.feedbackEmoji.textContent = "🌱";
      el.feedbackHeading.textContent =
        state.ageGroup === "11-14"
          ? `Good progress! (+${evalRes.awardedPoints} Green Points)`
          : `Nice green habit! (+${evalRes.awardedPoints} Green Points)`;
    } else {
      // Never shame a child for a lower-scoring choice
      el.feedbackEmoji.textContent = "💡";
      el.feedbackHeading.textContent =
        state.ageGroup === "11-14"
          ? "Helpful insight for your next decision!"
          : "Every day is a chance to learn a new green habit!";
    }
    el.feedbackText.textContent = q.Explanation;
  }

  // =========================================================================
  // 6. STAGE NAVIGATION & PROGRESSIVE SAVING
  // =========================================================================
  function lockCurrentQuestionIfAnswered() {
    if (state.currentStep < 5) return;
    const qIdx = state.currentStep - 5;
    const orderedQuestions = getOrderedQuestions();
    const q = orderedQuestions[qIdx];
    if (!q) return;
    const qId = q.Question_ID;
    if (state.quizAnswers[qId]) {
      state.lockedQuestions[qId] = true;
      state.sceneInteractions[qId] = true;
      saveState();
    }
  }

  async function savePartialProgressToBackend(stepLabel) {
    if (typeof saveQuizResponse !== "function") return;
    const payload = {
      Module: "kids",
      Response_ID: state.responseId,
      Is_Final: false,
      Step_Label: stepLabel,
      Timestamp: new Date().toISOString(),
      Age_Group: state.ageGroup,
      Quiz_Mode: state.quizMode,
      Device_Type: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
      Selected_Question_IDs: state.selectedQuestionIds.join(","),
      Question_Order: state.questionOrder.join(","),
      Student_Profile: state.studentProfile,
      Footprint_Missions: state.missionsData,
      Quiz_Answers: state.quizAnswers
    };
    try {
      await saveQuizResponse(payload);
    } catch (err) {
      console.warn("[KidsQuiz] Partial save warning:", err);
    }
  }

  function handleCheckAnswerClick() {
    if (state.currentStep < 5) return;
    lockCurrentQuestionIfAnswered();
    const qIdx = state.currentStep - 5;
    renderScoredQuestion(qIdx);
    savePartialProgressToBackend(`Quest_${qIdx + 1}`);
  }

  async function handleNextClick() {
    if (state.currentStep >= 5) {
      const qIdx = state.currentStep - 5;
      const orderedQuestions = getOrderedQuestions();
      const q = orderedQuestions[qIdx];
      if (!q || !state.quizAnswers[q.Question_ID]) return;

      state.lockedQuestions[q.Question_ID] = true;
      state.sceneInteractions[q.Question_ID] = true;
      saveState();
      savePartialProgressToBackend(`Quest_${qIdx + 1}`);
    } else {
      if (!isMissionStepComplete(state.currentStep)) return;
      // Save mission progress
      savePartialProgressToBackend(`Mission_${state.currentStep + 1}`);
    }

    if (state.currentStep < 14) {
      state.currentStep += 1;
      saveState();
      renderCurrentStageActivity(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Completed all 15 activities!
      await completeAttemptAndShowResults();
    }
  }

  function handleBackClick() {
    if (state.currentStep > 0) {
      state.currentStep -= 1;
      saveState();
      renderCurrentStageActivity(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      showScreen("modeIntro");
    }
  }

  // =========================================================================
  // 7. FINAL PAYLOAD BUILDER & SUBMISSION (Unified Kids Sheets Schema)
  // =========================================================================
  function buildFinalKidsPayload() {
    const scoreSummary = window.MCCKidsData.calculateFullGreenScore(state.questionOrder, state.quizAnswers);
    const footprintSummary = window.MCCKidsData.calculateKidsCarbonFootprint(state.missionsData);
    const achievements = window.MCCKidsData.evaluateAchievements(scoreSummary);
    const recommendations = window.MCCKidsData.buildKidsRecommendations(
      state.ageGroup,
      scoreSummary,
      footprintSummary,
      state.missionsData
    );

    const unlockedBadgesList = achievements.filter((b) => b.unlocked).map((b) => b.name);
    const startMs = state.startDate ? new Date(state.startDate).getTime() : Date.now();
    const durationSec = Math.max(10, Math.round((Date.now() - startMs) / 1000));

    const participantLabel =
      [
        state.studentProfile.childName,
        state.studentProfile.studentClass ? `Class: ${state.studentProfile.studentClass}` : "",
        state.studentProfile.rollNumber ? `Roll: ${state.studentProfile.rollNumber}` : ""
      ]
        .filter(Boolean)
        .join(" | ") || "Anonymous Explorer";

    return {
      Module: "kids",
      Is_Final: true,
      Response_ID: state.responseId,
      Timestamp: new Date().toISOString(),

      // 1. Respondent Master (Matches Kids_Respondent_Master + Section 10 fields)
      Respondent_Master: {
        Response_ID: state.responseId,
        Timestamp: new Date().toISOString(),
        Participant_ID: participantLabel,
        Child_Name: state.studentProfile.childName || "",
        Student_Class: state.studentProfile.studentClass || "",
        Roll_Number: state.studentProfile.rollNumber || "",
        Guardian_Assisted: Boolean(state.studentProfile.guardianAssisted),
        Age_Group: state.ageGroup,
        Quiz_Mode: state.quizMode,
        Start_Date: state.startDate,
        Completion_Date: state.completionDate,
        Completion_Status: "Completed",
        Selected_Question_IDs: state.selectedQuestionIds.join(","),
        Question_Order: state.questionOrder.join(","),
        Total_Questions: 10,
        Correct_Answers: scoreSummary.Optimal_Answers_Count,
        Quiz_Score_Percentage: scoreSummary.Quiz_Score_Percentage,
        Green_Points: scoreSummary.Overall_Green_Score,
        Overall_Green_Score: scoreSummary.Overall_Green_Score,
        Awareness_Score: scoreSummary.Environmental_Awareness_Score,
        Sustainable_Habit_Score: scoreSummary.Sustainable_Habit_Score,
        Decision_Making_Score: scoreSummary.Decision_Making_Score,
        Practical_Application_Score: scoreSummary.Practical_Application_Score,
        Awareness_Breakdown: JSON.stringify(scoreSummary.categories),
        Green_Points_Breakdown: JSON.stringify(scoreSummary.dimensions),
        Consistency_Score: scoreSummary.Quiz_Score_Percentage,
        Learning_Stage: scoreSummary.Learning_Stage,
        Carbon_Footprint_Total: footprintSummary.Total_Monthly_CO2e_kg,
        Annual_CO2e_kg: footprintSummary.Total_Annual_CO2e_kg,
        Calculation_Status: footprintSummary.Calculation_Status,
        Is_Final: true,
        Badge: unlockedBadgesList.join(", ") || "Planet Protector",
        Quiz_Version: "1.1",
        Certificate_Generated: false,
        Consent_Given: true,
        Device_Type: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
        Browser: navigator.userAgent,
        Completion_Time_sec: durationSec,
        Quiz_Completed: true,
        Source: window.location.hostname || "local"
      },

      // 2. Quiz Responses (Both question records & map)
      Quiz_Responses: {
        Response_ID: state.responseId,
        Age_Group: state.ageGroup,
        Quiz_Mode: state.quizMode,
        Selected_Question_IDs: state.selectedQuestionIds.join(","),
        Question_Order: state.questionOrder.join(","),
        Answers_Map: state.quizAnswers,
        Records: scoreSummary.questionRecords.map((r) => ({
          Response_ID: state.responseId,
          Question_ID: r.Question_ID,
          Category: r.Category,
          Topic_Category: r.Topic_Category,
          Selected_Option: r.Selected_Option,
          Awarded_Points: r.Awarded_Points,
          Maximum_Points: r.Maximum_Points,
          Submission_Timestamp: state.completionDate
        }))
      },

      // 3. Five Footprint Missions
      Footprint_Missions: {
        Response_ID: state.responseId,
        Age_Group: state.ageGroup,
        FP01_School_Commute: state.missionsData.FP01,
        FP02_Daily_Travel: state.missionsData.FP02,
        FP03_Household_Electricity: state.missionsData.FP03,
        FP04_Supplies_Devices: state.missionsData.FP04,
        FP05_Food_Waste: state.missionsData.FP05
      },

      // 4. Carbon Breakdown & Category Scores
      Carbon_Breakdown: {
        Response_ID: state.responseId,
        Nature_Biodiversity_Score: scoreSummary.categories["Nature & Biodiversity"]?.earned || 0,
        Water_Conservation_Score: scoreSummary.categories["Water Conservation"]?.earned || 0,
        Energy_Conservation_Score: scoreSummary.categories["Energy Conservation"]?.earned || 0,
        Waste_Recycling_Score: scoreSummary.categories["Waste & Recycling"]?.earned || 0,
        Food_Sustainability_Score: scoreSummary.categories["Food Sustainability"]?.earned || 0,
        Green_Transport_Score: scoreSummary.categories["Green Transport"]?.earned || 0,
        Climate_Awareness_Score: scoreSummary.categories["Climate Awareness"]?.earned || 0,
        Overall_Knowledge_Score: scoreSummary.Environmental_Awareness_Score,
        Strongest_Category: scoreSummary.Strongest_Category,
        Improvement_Area: scoreSummary.Improvement_Area,
        Environmental_Awareness_Score: scoreSummary.Environmental_Awareness_Score,
        Sustainable_Habit_Score: scoreSummary.Sustainable_Habit_Score,
        Decision_Making_Score: scoreSummary.Decision_Making_Score,
        Practical_Application_Score: scoreSummary.Practical_Application_Score,
        Overall_Green_Score: scoreSummary.Overall_Green_Score,
        School_Commute_CO2e_kg: footprintSummary.Categories_Map.schoolCommute,
        Daily_Travel_CO2e_kg: footprintSummary.Categories_Map.dailyTravel,
        Allocated_Electricity_CO2e_kg: footprintSummary.Categories_Map.electricity,
        Supplies_Devices_CO2e_kg: footprintSummary.Categories_Map.suppliesDevices,
        Food_Waste_CO2e_kg: footprintSummary.Categories_Map.foodWaste,
        Total_Monthly_CO2e_kg: footprintSummary.Total_Monthly_CO2e_kg,
        Total_Annual_CO2e_kg: footprintSummary.Total_Annual_CO2e_kg,
        Calculation_Status: footprintSummary.Calculation_Status,
        Emission_Rows: footprintSummary.Breakdown.map((row) => ({
          Response_ID: state.responseId,
          ...row
        }))
      },

      // 5. Recommendations
      Recommendations: {
        Response_ID: state.responseId,
        Recommendation_1: recommendations[0]?.Recommendation_Text || "",
        Recommendation_2: recommendations[1]?.Recommendation_Text || "",
        Recommendation_3: recommendations[2]?.Recommendation_Text || "",
        Recommendation_4: recommendations[3]?.Recommendation_Text || "",
        Priority: recommendations[0]?.Priority || "High",
        Suggested_Action: recommendations[0]?.Category || "Daily Green Habits",
        Green_Points_Opportunity: 100 - scoreSummary.Overall_Green_Score,
        Status: "Active",
        Items: recommendations.map((rec) => ({
          Response_ID: state.responseId,
          ...rec
        }))
      }
    };
  }

  async function completeAttemptAndShowResults() {
    // Ensure all 15 questions are marked locked
    state.questionOrder.forEach((qId) => {
      if (state.quizAnswers[qId]) state.lockedQuestions[qId] = true;
    });

    if (!state.completionDate) {
      state.completionDate = new Date().toISOString();
    }
    state.completionStatus = "Completed";
    saveState();

    showScreen("results");

    if (!state.finalSubmitted) {
      await submitFinalResultsToCloud();
    }
  }

  async function submitFinalResultsToCloud() {
    if (typeof saveQuizResponse !== "function") return;
    el.resultSyncStatusText.textContent = `Saving to Google Sheets (${state.responseId})...`;
    try {
      const payload = buildFinalKidsPayload();
      const ok = await saveQuizResponse(payload);
      state.finalSubmitted = Boolean(ok);
      state.lastSyncOk = Boolean(ok);
      saveState();
      if (ok) {
        el.resultSyncStatusText.textContent = `✓ Saved against ${state.responseId}`;
        el.kidsRetrySyncBtn.hidden = true;
      } else {
        el.resultSyncStatusText.textContent = `Saved locally (${state.responseId}) • Cloud sync pending`;
        el.kidsRetrySyncBtn.hidden = false;
      }
    } catch (err) {
      state.lastSyncOk = false;
      saveState();
      el.resultSyncStatusText.textContent = `Saved locally (${state.responseId}) • Tap Retry to sync`;
      el.kidsRetrySyncBtn.hidden = false;
    }
  }

  // =========================================================================
  // 8. RESULTS DASHBOARD RENDERER
  // =========================================================================
  function renderResultsDashboard() {
    const scoreSummary = window.MCCKidsData.calculateFullGreenScore(state.questionOrder, state.quizAnswers);
    const footprintSummary = window.MCCKidsData.calculateKidsCarbonFootprint(state.missionsData);
    const achievements = window.MCCKidsData.evaluateAchievements(scoreSummary);
    const recommendations = window.MCCKidsData.buildKidsRecommendations(
      state.ageGroup,
      scoreSummary,
      footprintSummary,
      state.missionsData
    );

    const childName = (state.studentProfile?.childName || "").trim();
    el.resultModeBadge.textContent = `${state.quizMode} (Ages ${state.ageGroup})`;
    el.resultStageBadge.textContent = scoreSummary.Learning_Stage;
    el.resultsHeroHeading.textContent = childName
      ? `Awesome Job, ${childName}!`
      : "Awesome Job, Planet Explorer!";

    el.resultGreenScoreValue.textContent = scoreSummary.Overall_Green_Score;
    el.resultScorePercentText.textContent = `${scoreSummary.Quiz_Score_Percentage}% Overall Green Score`;
    const deg = Math.round((scoreSummary.Overall_Green_Score / 100) * 360);
    el.kidsScoreRing.style.setProperty("--kids-score-deg", `${deg}deg`);
    el.resultSyncStatusText.textContent = state.finalSubmitted
      ? `✓ Saved against ${state.responseId}`
      : `Attempt ID: ${state.responseId}`;

    // E. Render Achievements
    const unlockedCount = achievements.filter((b) => b.unlocked).length;
    el.unlockedBadgesCountTag.textContent = `${unlockedCount} / ${achievements.length} Unlocked`;
    el.kidsBadgesGrid.innerHTML = achievements
      .map(
        (b) => `
        <div class="kids-badge-card ${b.unlocked ? "unlocked" : "locked"}">
          <span class="kids-badge-emoji" aria-hidden="true">${b.icon}</span>
          <strong>${escapeHtml(b.name)}</strong>
          <p>${escapeHtml(b.description)}</p>
          <span class="kids-badge-status">${escapeHtml(b.progressText)}</span>
        </div>
      `
      )
      .join("");

    // B1. Render 4 Assessment Dimensions
    const dimMeta = [
      { key: "Sustainable Habits", label: "1. Sustainable Habits (Self-reported)", max: 30, color: "#2f7048" },
      { key: "Decision-making", label: "2. Decision-making (Scenarios)", max: 30, color: "#4b815d" },
      { key: "Environmental Awareness", label: "3. Environmental Awareness (Knowledge)", max: 20, color: "#a46d29" },
      { key: "Practical Application", label: "4. Practical Application (Action Plans)", max: 20, color: "#2b7a78" }
    ];

    el.kidsDimensionsList.innerHTML = dimMeta
      .map((dm) => {
        const earned = scoreSummary.dimensions[dm.key]?.earned || 0;
        const pct = Math.round((earned / dm.max) * 100);
        return `
          <div class="kids-dim-row">
            <div class="kids-dim-top">
              <span>${escapeHtml(dm.label)}</span>
              <strong>${earned} / ${dm.max} pts (${pct}%)</strong>
            </div>
            <div class="kids-dim-track">
              <div class="kids-dim-fill" style="width:${Math.max(4, pct)}%; background:${dm.color};"></div>
            </div>
          </div>
        `;
      })
      .join("");

    // B2. Render Topic-wise Performance
    el.strongestTopicTag.textContent = `Top: ${scoreSummary.Strongest_Category}`;
    el.kidsTopicsList.innerHTML = Object.entries(scoreSummary.categories)
      .map(([catName, stats]) => {
        const pct = stats.percentage || 0;
        return `
          <div class="kids-dim-row">
            <div class="kids-dim-top">
              <span>${getCategoryIcon(catName)} ${escapeHtml(catName)}</span>
              <strong>${stats.earned} / ${stats.max} pts (${pct}%)</strong>
            </div>
            <div class="kids-dim-track">
              <div class="kids-dim-fill" style="width:${Math.max(4, pct)}%;"></div>
            </div>
          </div>
        `;
      })
      .join("");

    // C. Render Carbon Footprint Summary
    el.footprintOverallStatusChip.textContent = footprintSummary.Calculation_Status;
    el.footprintOverallStatusChip.className = footprintSummary.Calculation_Status.includes("Partial")
      ? "kids-fp-status-chip incomplete"
      : "kids-fp-status-chip";

    el.fpMonthlyKgValue.textContent = footprintSummary.Total_Monthly_CO2e_kg.toFixed(1);
    el.fpAnnualKgValue.textContent = footprintSummary.Total_Annual_CO2e_kg.toFixed(0);
    el.fpReportingPeriodValue.textContent = footprintSummary.Reporting_Period;
    el.fpHouseholdAllocationLabel.textContent = `1/${footprintSummary.Household_Size} Household Share`;

    el.kidsFootprintBreakdownList.innerHTML = footprintSummary.Breakdown.map((row) => {
      const isInc = row.Calculation_Status.startsWith("Incomplete");
      return `
        <div class="kids-fp-row">
          <div class="kids-fp-row-head">
            <strong>${escapeHtml(row.Emission_Category)}</strong>
            <div style="display:flex; align-items:center; gap:10px;">
              <span class="kids-fp-status-chip ${isInc ? "incomplete" : ""}">${escapeHtml(row.Calculation_Status)}</span>
              <strong style="color:var(--kids-leaf); font-size:1.05rem;">
                ${isInc ? "Data N/A" : `${row.Calculated_Emissions.toFixed(2)} kg CO₂e/mo`}
              </strong>
            </div>
          </div>
          <p class="kids-fp-assumptions">
            <strong>Activity:</strong> ${escapeHtml(String(row.Activity_Data))} ${escapeHtml(row.Activity_Unit)} &middot;
            <strong>Factor ID:</strong> <code>${escapeHtml(row.Emission_Factor_ID)}</code> &middot;
            ${escapeHtml(row.Assumptions)}
          </p>
        </div>
      `;
    }).join("");

    // D. Render Personalised Recommendations
    el.kidsRecommendationsGrid.innerHTML = recommendations
      .map(
        (rec) => `
        <div class="kids-rec-card">
          <div class="kids-rec-top">
            <span class="kids-rec-cat">${escapeHtml(rec.Category)}</span>
            <span class="kids-rec-priority">${escapeHtml(rec.Priority)} Priority</span>
          </div>
          <p>${escapeHtml(rec.Recommendation_Text)}</p>
        </div>
      `
      )
      .join("");
  }

  // =========================================================================
  // 9. PRINTABLE / DOWNLOADABLE KIDS PLANET PROTECTOR REPORT
  // =========================================================================
  function downloadKidsPrintableReport() {
    const scoreSummary = window.MCCKidsData.calculateFullGreenScore(state.questionOrder, state.quizAnswers);
    const footprintSummary = window.MCCKidsData.calculateKidsCarbonFootprint(state.missionsData);
    const achievements = window.MCCKidsData.evaluateAchievements(scoreSummary);
    const recommendations = window.MCCKidsData.buildKidsRecommendations(
      state.ageGroup,
      scoreSummary,
      footprintSummary,
      state.missionsData
    );

    const issuedOn = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    const childName = state.studentProfile.childName || "Young Planet Protector";
    const studentClass = state.studentProfile.studentClass || "—";
    const rollNo = state.studentProfile.rollNumber || "—";

    const reportHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MyCarbonCredit Kids Report – ${escapeHtml(childName)}</title>
  <style>
    :root { --ink:#102119; --muted:#556459; --leaf:#2f7048; --paper:#fbfaf5; --line:#ded8ca; --gold:#d5a46b; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--paper); color:var(--ink); font-family:Inter,Segoe UI,Arial,sans-serif; padding:24px; }
    .sheet { max-width:920px; margin:0 auto; background:#fff; border:8px solid #e4dbc6; border-radius:24px; padding:36px 42px; box-shadow:0 16px 48px rgba(0,0,0,0.08); }
    .top { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--line); padding-bottom:18px; gap:16px; flex-wrap:wrap; }
    .kicker { color:var(--leaf); font-weight:900; text-transform:uppercase; letter-spacing:0.12em; font-size:0.78rem; margin:0 0 6px; }
    h1 { margin:0; font-size:2rem; color:var(--ink); }
    .student-meta { display:flex; gap:18px; flex-wrap:wrap; margin-top:14px; background:#f7faf7; padding:12px 16px; border-radius:14px; border:1px solid var(--line); font-size:0.92rem; }
    .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin:22px 0; }
    .kpi { border:1.5px solid var(--line); border-radius:16px; padding:16px; text-align:center; background:#fcfbf8; }
    .kpi strong { display:block; font-size:1.85rem; color:var(--leaf); }
    .kpi span { font-size:0.82rem; color:var(--muted); font-weight:700; }
    h2 { font-size:1.2rem; margin:22px 0 10px; color:var(--ink); border-bottom:1px solid var(--line); padding-bottom:6px; }
    table { width:100%; border-collapse:collapse; font-size:0.88rem; margin-top:8px; }
    th, td { text-align:left; padding:10px 12px; border-bottom:1px solid var(--line); }
    th { background:#f5f3eb; font-weight:800; }
    .badges { display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
    .badge-pill { padding:8px 14px; border-radius:999px; background:#eef7ef; border:1px solid rgba(47,112,72,0.3); font-weight:800; font-size:0.85rem; color:var(--leaf); }
    .note { margin-top:22px; font-size:0.78rem; color:var(--muted); line-height:1.55; background:#fbfaf5; padding:14px; border-radius:12px; border:1px solid var(--line); }
    @media print { body { padding:0; background:#fff; } .sheet { box-shadow:none; border-width:4px; } }
  </style>
</head>
<body>
  <main class="sheet">
    <div class="top">
      <div>
        <p class="kicker">MyCarbonCredit Kids • Sustainability Assessment &amp; Footprint Report</p>
        <h1>${escapeHtml(childName)}</h1>
      </div>
      <div style="text-align:right; font-size:0.85rem; color:var(--muted);">
        <strong>Mode:</strong> ${escapeHtml(state.quizMode)} (Ages ${escapeHtml(state.ageGroup)})<br/>
        <strong>Response ID:</strong> ${escapeHtml(state.responseId)}<br/>
        <strong>Date:</strong> ${escapeHtml(issuedOn)}
      </div>
    </div>

    <div class="student-meta">
      <div><strong>Student Name:</strong> ${escapeHtml(childName)}</div>
      <div><strong>Class / Grade:</strong> ${escapeHtml(studentClass)}</div>
      <div><strong>Roll Number:</strong> ${escapeHtml(rollNo)}</div>
      <div><strong>Learning Stage:</strong> ${escapeHtml(scoreSummary.Learning_Stage)}</div>
    </div>

    <div class="grid-3">
      <div class="kpi">
        <strong>${scoreSummary.Overall_Green_Score} / 100</strong>
        <span>Overall Green Score (${scoreSummary.Quiz_Score_Percentage}%)</span>
      </div>
      <div class="kpi">
        <strong>${footprintSummary.Total_Monthly_CO2e_kg.toFixed(1)} kg</strong>
        <span>Estimated Monthly Footprint (CO₂e)</span>
      </div>
      <div class="kpi">
        <strong>${footprintSummary.Total_Annual_CO2e_kg.toFixed(0)} kg</strong>
        <span>Estimated Annual Footprint (CO₂e)</span>
      </div>
    </div>

    <h2>1. Assessment Dimensions Breakdown (10 Scored Quests)</h2>
    <table>
      <thead>
        <tr><th>Assessment Dimension</th><th>Score Earned</th><th>Maximum Points</th><th>Mastery</th></tr>
      </thead>
      <tbody>
        <tr><td>Sustainable Habits (Self-reported)</td><td>${scoreSummary.Sustainable_Habit_Score}</td><td>30</td><td>${Math.round((scoreSummary.Sustainable_Habit_Score / 30) * 100)}%</td></tr>
        <tr><td>Decision-making (Scenarios)</td><td>${scoreSummary.Decision_Making_Score}</td><td>30</td><td>${Math.round((scoreSummary.Decision_Making_Score / 30) * 100)}%</td></tr>
        <tr><td>Environmental Awareness (Knowledge)</td><td>${scoreSummary.Environmental_Awareness_Score}</td><td>20</td><td>${Math.round((scoreSummary.Environmental_Awareness_Score / 20) * 100)}%</td></tr>
        <tr><td>Practical Application (Action Plans)</td><td>${scoreSummary.Practical_Application_Score}</td><td>20</td><td>${Math.round((scoreSummary.Practical_Application_Score / 20) * 100)}%</td></tr>
      </tbody>
    </table>

    <h2>2. Unlocked Achievement Badges</h2>
    <div class="badges">
      ${achievements.filter((b) => b.unlocked).map((b) => `<span class="badge-pill">${b.icon} ${escapeHtml(b.name)}</span>`).join("")}
    </div>

    <h2>3. Estimated Carbon Footprint Breakdown (5 Footprint Missions)</h2>
    <table>
      <thead>
        <tr><th>Category</th><th>Activity Data</th><th>Monthly Estimate</th><th>Status &amp; Allocation Notes</th></tr>
      </thead>
      <tbody>
        ${footprintSummary.Breakdown.map((r) => `
          <tr>
            <td><strong>${escapeHtml(r.Emission_Category)}</strong></td>
            <td>${escapeHtml(String(r.Activity_Data))} ${escapeHtml(r.Activity_Unit)}</td>
            <td>${r.Calculation_Status.startsWith("Incomplete") ? "N/A" : `${r.Calculated_Emissions.toFixed(2)} kg CO₂e`}</td>
            <td>${escapeHtml(r.Assumptions)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <h2>4. Personalised Recommendations</h2>
    <ul>
      ${recommendations.map((r) => `<li><strong>${escapeHtml(r.Category)} (${escapeHtml(r.Priority)}):</strong> ${escapeHtml(r.Recommendation_Text)}</li>`).join("")}
    </ul>

    <div class="note">
      <strong>Methodological &amp; Educational Note:</strong> Generated by MyCarbonCredit (PGDM Capstone Project · Goa Institute of Management). Green Points measure quiz habits, decisions, and awareness out of 100 and do not represent direct kg CO₂e saved. Carbon footprint values are indicative estimates using CEA India Grid Baseline (2024), India GHG Program transport factors, and ISO 14067 product proxies with per-capita household allocation.
    </div>
  </main>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `mycarboncredit-kids-report-${state.responseId}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function escapeHtml(val) {
    return String(val ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // =========================================================================
  // 10. EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function bindEvents() {
    el.startKidsQuizBtn?.addEventListener("click", () => {
      if (state.completionStatus === "Completed") {
        resetStateToClean();
      }
      showScreen("ageMode");
    });

    el.resumeAttemptBtn?.addEventListener("click", () => {
      if (state.completionStatus === "Completed") {
        resetStateToClean();
        showScreen("ageMode");
      } else {
        showScreen("stage");
      }
    });

    el.discardAttemptBtn?.addEventListener("click", () => {
      resetStateToClean();
      showScreen("ageMode");
    });

    el.kidsHomeNavBtn?.addEventListener("click", () => {
      if (state.completionStatus === "Completed") {
        resetStateToClean();
      }
      showScreen("landing");
    });

    document.getElementById("backToAgeSelection")?.addEventListener("click", () => {
      if (state.completionStatus === "Completed") {
        resetStateToClean();
      }
    });

    function chooseAgeMode(ageGroup) {
      resetStateToClean();
      initializeNewAttempt(ageGroup);
      showScreen("modeIntro");
    }

    el.selectExplorerBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      chooseAgeMode("8-10");
    });
    el.cardExplorerMode?.addEventListener("click", () => chooseAgeMode("8-10"));

    el.selectChangemakerBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      chooseAgeMode("11-14");
    });
    el.cardChangemakerMode?.addEventListener("click", () => chooseAgeMode("11-14"));

    el.backToKidsLandingBtn?.addEventListener("click", () => showScreen("landing"));
    el.changeModeFromIntroBtn?.addEventListener("click", () => {
      resetStateToClean();
      showScreen("ageMode");
    });

    // Sync optional student profile inputs live & block invalid keystrokes on Class/Roll
    el.classInput?.addEventListener("keydown", (e) => {
      if (e.key === "-") e.preventDefault();
    });
    el.rollNumberInput?.addEventListener("keydown", (e) => {
      if (["-", "+", "e", "E", "."].includes(e.key)) e.preventDefault();
    });
    el.rollNumberInput?.addEventListener("input", (e) => {
      const digitsOnly = String(e.target.value).replace(/\D/g, "");
      if (e.target.value !== digitsOnly) {
        e.target.value = digitsOnly;
      }
      syncStudentInputsFromIntro();
    });
    [el.childNameInput, el.classInput].forEach((inp) => {
      inp?.addEventListener("input", syncStudentInputsFromIntro);
    });
    el.guardianAssistCheckbox?.addEventListener("change", syncStudentInputsFromIntro);

    el.beginMissionsBtn?.addEventListener("click", () => {
      if (!validateStudentInputsFromIntro(true)) {
        return;
      }
      syncStudentInputsFromIntro();
      state.currentStep = 0;
      showScreen("stage");
      savePartialProgressToBackend("Attempt_Started");
    });

    el.stageBackBtn?.addEventListener("click", handleBackClick);
    el.stageCheckAnswerBtn?.addEventListener("click", handleCheckAnswerClick);
    el.stageNextBtn?.addEventListener("click", handleNextClick);

    el.kidsDownloadReportBtn?.addEventListener("click", downloadKidsPrintableReport);
    el.kidsRetrySyncBtn?.addEventListener("click", submitFinalResultsToCloud);
    el.kidsRestartBtn?.addEventListener("click", () => {
      resetStateToClean();
      showScreen("ageMode");
    });
  }

  function syncEmissionFactorsFromSheet() {
    if (typeof CONFIG === "undefined" || !CONFIG.API_URL) return;
    try {
      const cbName = "__mccKidsEfCb_" + Math.floor(Math.random() * 100000);
      const script = document.createElement("script");
      window[cbName] = function (res) {
        try {
          if (res && res.status === "success" && Array.isArray(res.data) && res.data.length > 0) {
            window.MCCKidsData.setEmissionFactors(res.data);
          }
        } finally {
          delete window[cbName];
          script.remove();
        }
      };
      script.onerror = function () {
        delete window[cbName];
        script.remove();
      };
      script.src = `${CONFIG.API_URL}?action=getEmissionFactors&callback=${cbName}`;
      document.head.appendChild(script);
    } catch (err) {
      // Fallback to built-in central emission factors table silently
    }
  }

  function init() {
    bindEvents();
    syncEmissionFactorsFromSheet();
    const restored = loadStoredState();
    updateHeaderUI();

    if (restored && state.responseId) {
      if (state.completionStatus === "Completed") {
        // Previous attempt was already completed; clear it so re-entering starts a fresh attempt
        resetStateToClean();
        showScreen("landing");
      } else if (state.screen === "stage" && state.completionStatus === "In Progress") {
        showScreen("stage");
      } else if (state.screen === "modeIntro" && state.completionStatus === "In Progress") {
        showScreen("modeIntro");
      } else {
        showScreen("landing");
      }
    } else {
      showScreen("landing");
    }
  }

  init();
})();
