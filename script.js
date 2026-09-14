/* ==========================================================================
   COACH HUSSIEN MOHAMED - INTERACTIVE JAVASCRIPT APP MODULE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Update copyright year
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  // Initialize Navigation
  initNavigation();

  // Initialize Scroll Reveal
  initScrollReveal();

  // Initialize Fitness Calculators
  initCalculators();

  // Initialize Skills Filters
  initSkillsFilter();

  // Initialize Modals
  initModals();
});

/* --------------------------------------------------------------------------
   1. NAVIGATION & ACTIVE PAGE HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.querySelector('header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Sticky header
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
  });

  // Mobile Menu
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Active Link matching current page filename
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   2. SCROLL REVEAL
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const progressBars = document.querySelectorAll('.progress-bar-fill');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (entry.target.classList.contains('lang-card')) {
          const bar = entry.target.querySelector('.progress-bar-fill');
          if (bar) {
            const targetWidth = bar.getAttribute('data-level') || '100%';
            bar.style.width = targetWidth;
          }
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));
  progressBars.forEach(bar => {
    const parentCard = bar.closest('.lang-card');
    if (parentCard) revealObserver.observe(parentCard);
  });
}

/* --------------------------------------------------------------------------
   3. FITNESS CALCULATORS SUITE
   -------------------------------------------------------------------------- */
function initCalculators() {
  // Tab Switcher
  const tabBtns = document.querySelectorAll('.tab-btn');
  const calcPanels = document.querySelectorAll('.calc-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      tabBtns.forEach(b => b.classList.remove('active'));
      calcPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // A. 1RM TABLE CALCULATOR
  const maxBtn = document.getElementById('calc-max-btn');
  if (maxBtn) {
    maxBtn.addEventListener('click', calculate1RMTable);
    calculate1RMTable();
  }

  function calculate1RMTable() {
    const weight = parseFloat(document.getElementById('max-weight').value) || 50;
    const reps = parseFloat(document.getElementById('max-reps').value) || 5;

    const oneRM = weight * (1 + (0.0333 * reps));
    const rounded1RM = (Math.round(oneRM * 10) / 10).toFixed(1);

    const rmHeader = document.getElementById('rm-header-text');
    if (rmHeader) {
      rmHeader.innerHTML = `Your one rep max is <span>${rounded1RM} kg</span>`;
    }

    const percentages = [
      { pct: 100, factor: 1.00, reps: 1 },
      { pct: 95,  factor: 0.95, reps: 2 },
      { pct: 90,  factor: 0.90, reps: 4 },
      { pct: 85,  factor: 0.85, reps: 6 },
      { pct: 80,  factor: 0.80, reps: 8 },
      { pct: 75,  factor: 0.75, reps: 10 },
      { pct: 70,  factor: 0.70, reps: 12 },
      { pct: 65,  factor: 0.65, reps: 16 },
      { pct: 60,  factor: 0.60, reps: 20 },
      { pct: 55,  factor: 0.55, reps: 24 },
      { pct: 50,  factor: 0.50, reps: 30 }
    ];

    const tableBody = document.getElementById('rm-table-body');
    if (tableBody) {
      tableBody.innerHTML = '';
      percentages.forEach(item => {
        const liftWeight = (Math.round((oneRM * item.factor) * 10) / 10).toFixed(1);
        const row = document.createElement('tr');
        if (item.pct === 100) row.classList.add('highlight-row');
        row.innerHTML = `
          <td><strong>${item.pct}%</strong></td>
          <td><strong>${liftWeight} kg</strong></td>
          <td>${item.reps}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  }

  // B. RELATIVE STRENGTH & TRAINING LOAD SUITE (GYM & CALISTHENICS STANDARDS)
  const EXERCISE_STANDARDS = {
    // Barbell & Heavy Compound
    'bench-press': {
      name: 'Bench Press (Barbell)',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.75, 1.00, 1.25, 1.65, 2.05],
      female: [0.45, 0.65, 0.85, 1.10, 1.40]
    },
    'squat': {
      name: 'Back Squat (Barbell)',
      category: 'barbell',
      isCalisthenics: false,
      male: [1.00, 1.30, 1.70, 2.15, 2.65],
      female: [0.70, 0.95, 1.25, 1.60, 2.00]
    },
    'deadlift': {
      name: 'Conventional Deadlift',
      category: 'barbell',
      isCalisthenics: false,
      male: [1.20, 1.55, 2.00, 2.50, 3.10],
      female: [0.85, 1.15, 1.50, 1.95, 2.45]
    },
    'sumo-deadlift': {
      name: 'Sumo Deadlift',
      category: 'barbell',
      isCalisthenics: false,
      male: [1.20, 1.55, 2.00, 2.50, 3.10],
      female: [0.85, 1.15, 1.50, 1.95, 2.45]
    },
    'overhead-press': {
      name: 'Overhead Press (OHP / Military)',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.50, 0.65, 0.85, 1.10, 1.35],
      female: [0.30, 0.42, 0.55, 0.72, 0.92]
    },
    'barbell-row': {
      name: 'Barbell Bent-Over Row',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.65, 0.85, 1.10, 1.40, 1.75],
      female: [0.40, 0.55, 0.72, 0.95, 1.20]
    },
    'incline-bench': {
      name: 'Incline Barbell Bench Press',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.65, 0.88, 1.12, 1.45, 1.80],
      female: [0.38, 0.55, 0.72, 0.95, 1.20]
    },
    'romanian-deadlift': {
      name: 'Romanian Deadlift (RDL)',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.90, 1.20, 1.55, 1.95, 2.40],
      female: [0.65, 0.88, 1.15, 1.50, 1.90]
    },
    'front-squat': {
      name: 'Front Squat',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.80, 1.05, 1.35, 1.75, 2.15],
      female: [0.55, 0.75, 1.00, 1.30, 1.65]
    },
    'close-grip-bench': {
      name: 'Close-Grip Bench Press',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.65, 0.88, 1.12, 1.45, 1.80],
      female: [0.38, 0.55, 0.72, 0.95, 1.20]
    },
    'hip-thrust': {
      name: 'Barbell Hip Thrust',
      category: 'barbell',
      isCalisthenics: false,
      male: [1.20, 1.60, 2.10, 2.70, 3.40],
      female: [1.10, 1.50, 2.00, 2.60, 3.30]
    },
    'clean-and-jerk': {
      name: 'Clean and Jerk',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.70, 0.95, 1.25, 1.60, 2.00],
      female: [0.45, 0.65, 0.88, 1.15, 1.45]
    },
    'snatch': {
      name: 'Snatch',
      category: 'barbell',
      isCalisthenics: false,
      male: [0.55, 0.75, 1.00, 1.30, 1.65],
      female: [0.35, 0.50, 0.70, 0.92, 1.20]
    },

    // Dumbbells & Gym Machines
    'incline-db-press': {
      name: 'Incline Dumbbell Bench Press',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.50, 0.70, 0.95, 1.25, 1.60],
      female: [0.30, 0.45, 0.62, 0.85, 1.10]
    },
    'flat-db-press': {
      name: 'Flat Dumbbell Bench Press',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.55, 0.75, 1.02, 1.35, 1.70],
      female: [0.32, 0.48, 0.68, 0.90, 1.15]
    },
    'db-shoulder-press': {
      name: 'Seated Dumbbell Shoulder Press',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.35, 0.50, 0.68, 0.90, 1.15],
      female: [0.20, 0.30, 0.42, 0.58, 0.75]
    },
    'db-curl': {
      name: 'Dumbbell Bicep Curl',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.25, 0.35, 0.48, 0.65, 0.85],
      female: [0.15, 0.22, 0.30, 0.42, 0.55]
    },
    'db-lateral-raise': {
      name: 'Dumbbell Lateral Raise',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.15, 0.22, 0.30, 0.42, 0.55],
      female: [0.08, 0.12, 0.18, 0.25, 0.35]
    },
    'lat-pulldown': {
      name: 'Lat Pulldown (Cable)',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.65, 0.85, 1.10, 1.40, 1.75],
      female: [0.40, 0.55, 0.72, 0.95, 1.20]
    },
    'cable-row': {
      name: 'Seated Cable Row',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.65, 0.85, 1.10, 1.40, 1.75],
      female: [0.40, 0.55, 0.72, 0.95, 1.20]
    },
    'leg-press': {
      name: 'Leg Press (Sled)',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [2.00, 2.75, 3.60, 4.60, 5.80],
      female: [1.40, 1.90, 2.55, 3.35, 4.30]
    },
    'leg-extension': {
      name: 'Leg Extension Machine',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.60, 0.80, 1.05, 1.35, 1.70],
      female: [0.40, 0.55, 0.75, 1.00, 1.25]
    },
    'leg-curl': {
      name: 'Lying Leg Curl',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.45, 0.60, 0.80, 1.05, 1.35],
      female: [0.30, 0.42, 0.55, 0.75, 0.95]
    },
    'tricep-pushdown': {
      name: 'Tricep Rope Pushdown',
      category: 'dumbbell',
      isCalisthenics: false,
      male: [0.30, 0.42, 0.58, 0.78, 1.00],
      female: [0.18, 0.26, 0.36, 0.50, 0.65]
    },

    // Calisthenics & Bodyweight
    'pull-ups': {
      name: 'Pull-ups',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.95,
      male: [1.02, 1.18, 1.40, 1.70, 2.05],
      female: [0.75, 0.92, 1.10, 1.35, 1.65]
    },
    'chin-ups': {
      name: 'Chin-ups',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.95,
      male: [1.05, 1.22, 1.45, 1.75, 2.10],
      female: [0.78, 0.95, 1.15, 1.40, 1.70]
    },
    'dips': {
      name: 'Parallel Bar Dips',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.95,
      male: [1.05, 1.25, 1.52, 1.88, 2.25],
      female: [0.80, 0.98, 1.20, 1.48, 1.80]
    },
    'push-ups': {
      name: 'Push-ups',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.65,
      male: [0.70, 0.85, 1.05, 1.30, 1.60],
      female: [0.45, 0.60, 0.78, 1.00, 1.25]
    },
    'diamond-pushups': {
      name: 'Diamond Push-ups',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.68,
      male: [0.72, 0.90, 1.12, 1.38, 1.70],
      female: [0.48, 0.65, 0.82, 1.05, 1.30]
    },
    'ring-dips': {
      name: 'Gymnastic Ring Dips',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.95,
      male: [1.00, 1.18, 1.42, 1.75, 2.10],
      female: [0.75, 0.90, 1.12, 1.38, 1.70]
    },
    'inverted-rows': {
      name: 'Inverted Bodyweight Rows',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.60,
      male: [0.65, 0.80, 1.00, 1.25, 1.55],
      female: [0.42, 0.55, 0.72, 0.92, 1.20]
    },
    'handstand-pushups': {
      name: 'Handstand Push-ups (HSPU)',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.95,
      male: [0.95, 1.08, 1.25, 1.50, 1.80],
      female: [0.70, 0.85, 1.02, 1.25, 1.50]
    },
    'pike-pushups': {
      name: 'Pike Push-ups',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.75,
      male: [0.78, 0.95, 1.15, 1.40, 1.70],
      female: [0.52, 0.68, 0.85, 1.08, 1.35]
    },
    'muscle-ups': {
      name: 'Bar Muscle-ups',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 1.00,
      male: [1.02, 1.12, 1.28, 1.50, 1.78],
      female: [0.80, 0.95, 1.10, 1.30, 1.55]
    },
    'ring-muscle-ups': {
      name: 'Ring Muscle-ups',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 1.00,
      male: [1.02, 1.14, 1.30, 1.55, 1.82],
      female: [0.80, 0.95, 1.12, 1.32, 1.58]
    },
    'pistol-squats': {
      name: 'Pistol Squats (Single Leg)',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.90,
      male: [0.95, 1.10, 1.30, 1.58, 1.90],
      female: [0.75, 0.92, 1.12, 1.38, 1.70]
    },
    'toes-to-bar': {
      name: 'Hanging Leg Raises / Toes-to-Bar',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.50,
      male: [0.55, 0.68, 0.85, 1.05, 1.30],
      female: [0.38, 0.50, 0.65, 0.82, 1.05]
    },
    'dragon-flags': {
      name: 'Dragon Flags',
      category: 'calisthenics',
      isCalisthenics: true,
      bodyweightPct: 0.65,
      male: [0.68, 0.82, 1.02, 1.28, 1.55],
      female: [0.45, 0.58, 0.75, 0.95, 1.20]
    }
  };

  let currentStrengthUnit = 'kg';

  // Unit toggle handling
  const unitKgBtn = document.getElementById('unit-kg-btn');
  const unitLbBtn = document.getElementById('unit-lb-btn');
  const unitLabels = document.querySelectorAll('.unit-label');

  if (unitKgBtn && unitLbBtn) {
    unitKgBtn.addEventListener('click', () => setStrengthUnit('kg'));
    unitLbBtn.addEventListener('click', () => setStrengthUnit('lb'));
  }

  function setStrengthUnit(newUnit) {
    if (newUnit === currentStrengthUnit) return;
    const bwInput = document.getElementById('strength-bodyweight');
    const liftInput = document.getElementById('strength-lift-weight');

    if (newUnit === 'lb') {
      currentStrengthUnit = 'lb';
      unitKgBtn.style.background = 'transparent';
      unitKgBtn.style.color = 'var(--text-muted)';
      unitLbBtn.style.background = 'var(--accent-red)';
      unitLbBtn.style.color = '#fff';
      if (bwInput) bwInput.value = (Math.round(parseFloat(bwInput.value) * 2.20462 * 2) / 2).toFixed(1);
      if (liftInput) liftInput.value = (Math.round(parseFloat(liftInput.value) * 2.20462 * 2) / 2).toFixed(1);
    } else {
      currentStrengthUnit = 'kg';
      unitLbBtn.style.background = 'transparent';
      unitLbBtn.style.color = 'var(--text-muted)';
      unitKgBtn.style.background = 'var(--accent-red)';
      unitKgBtn.style.color = '#fff';
      if (bwInput) bwInput.value = (Math.round((parseFloat(bwInput.value) / 2.20462) * 2) / 2).toFixed(1);
      if (liftInput) liftInput.value = (Math.round((parseFloat(liftInput.value) / 2.20462) * 2) / 2).toFixed(1);
    }

    unitLabels.forEach(el => el.textContent = currentStrengthUnit);
    calculateRelativeStrength();
  }

  // Movement category filtering
  const exFilterBtns = document.querySelectorAll('.ex-filter-btn');
  const exerciseSelect = document.getElementById('strength-exercise');
  const calisthenicsHint = document.getElementById('calisthenics-hint');
  const strengthWeightLabel = document.getElementById('strength-weight-label');

  if (exFilterBtns && exerciseSelect) {
    exFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        exFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        const optgroups = exerciseSelect.querySelectorAll('optgroup');
        let firstAvailable = null;

        optgroups.forEach(og => {
          const category = og.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            og.style.display = '';
            if (!firstAvailable) firstAvailable = og.querySelector('option');
          } else {
            og.style.display = 'none';
          }
        });

        if (firstAvailable) {
          exerciseSelect.value = firstAvailable.value;
          updateExerciseUI();
          calculateRelativeStrength();
        }
      });
    });
  }

  if (exerciseSelect) {
    exerciseSelect.addEventListener('change', () => {
      updateExerciseUI();
      calculateRelativeStrength();
    });
  }

  function updateExerciseUI() {
    const exKey = exerciseSelect.value;
    const ex = EXERCISE_STANDARDS[exKey];
    if (!ex) return;

    if (ex.isCalisthenics) {
      if (calisthenicsHint) calisthenicsHint.style.display = 'block';
      if (strengthWeightLabel) strengthWeightLabel.innerHTML = `Added Weight (<span class="unit-label">${currentStrengthUnit}</span>)`;
    } else {
      if (calisthenicsHint) calisthenicsHint.style.display = 'none';
      if (strengthWeightLabel) strengthWeightLabel.innerHTML = `Lift Weight (<span class="unit-label">${currentStrengthUnit}</span>)`;
    }
  }

  // Calculate Relative Strength & Training Load
  const calcStrengthBtn = document.getElementById('calc-strength-btn');
  if (calcStrengthBtn) {
    calcStrengthBtn.addEventListener('click', calculateRelativeStrength);
  }

  const bwInputEl = document.getElementById('strength-bodyweight');
  const liftInputEl = document.getElementById('strength-lift-weight');
  const repsInputEl = document.getElementById('strength-reps');
  const genderSelectEl = document.getElementById('strength-gender');
  const ageInputEl = document.getElementById('strength-age');

  [bwInputEl, liftInputEl, repsInputEl, genderSelectEl, ageInputEl].forEach(input => {
    if (input) input.addEventListener('input', calculateRelativeStrength);
  });

  function calculateRelativeStrength() {
    if (!exerciseSelect) return;
    const exKey = exerciseSelect.value;
    const ex = EXERCISE_STANDARDS[exKey] || EXERCISE_STANDARDS['bench-press'];

    const bwInputVal = parseFloat(document.getElementById('strength-bodyweight').value) || 80;
    const liftInputVal = parseFloat(document.getElementById('strength-lift-weight').value) || 0;
    const reps = Math.max(1, Math.min(50, parseFloat(document.getElementById('strength-reps').value) || 1));
    const gender = (document.getElementById('strength-gender').value === 'female') ? 'female' : 'male';

    // Normalize to KG for sports science calculations
    const bwKg = (currentStrengthUnit === 'lb') ? (bwInputVal * 0.453592) : bwInputVal;
    const liftKg = (currentStrengthUnit === 'lb') ? (liftInputVal * 0.453592) : liftInputVal;

    let total1RM_Kg = 0;
    let display1RM_Kg = 0;
    let relativeRatio = 0;

    if (ex.isCalisthenics) {
      const effectiveMass = (bwKg * ex.bodyweightPct) + liftKg;
      total1RM_Kg = effectiveMass * (1 + (reps / 30));
      relativeRatio = total1RM_Kg / bwKg;
      display1RM_Kg = (liftKg > 0) ? (total1RM_Kg - (bwKg * ex.bodyweightPct)) : total1RM_Kg;
    } else {
      total1RM_Kg = liftKg * (1 + (reps / 30));
      display1RM_Kg = total1RM_Kg;
      relativeRatio = total1RM_Kg / bwKg;
    }

    // Convert back for display
    const unitMultiplier = (currentStrengthUnit === 'lb') ? 2.20462 : 1;
    const display1RM = (Math.round(display1RM_Kg * unitMultiplier * 10) / 10).toFixed(1);
    const roundedRatio = (Math.round(relativeRatio * 100) / 100).toFixed(2);

    // Standards evaluation
    const standards = ex[gender]; // [beginner, novice, intermediate, advanced, elite]
    let tierName = 'Intermediate';
    let tierColor = '#4ade80';
    let percentile = 'Top 40%';
    let meterPercentage = 50;

    const b = standards[0];
    const n = standards[1];
    const i = standards[2];
    const a = standards[3];
    const e = standards[4];

    if (relativeRatio < n) {
      tierName = 'Beginner';
      tierColor = '#94a3b8';
      percentile = 'Top 85% of Lifters';
      const pctWithin = Math.max(0, Math.min(1, (relativeRatio - b) / (n - b)));
      meterPercentage = 10 + (pctWithin * 10);
    } else if (relativeRatio < i) {
      tierName = 'Novice';
      tierColor = '#38bdf8';
      percentile = 'Top 60% of Lifters';
      const pctWithin = Math.max(0, Math.min(1, (relativeRatio - n) / (i - n)));
      meterPercentage = 20 + (pctWithin * 20);
    } else if (relativeRatio < a) {
      tierName = 'Intermediate';
      tierColor = '#4ade80';
      percentile = 'Top 30% of Lifters';
      const pctWithin = Math.max(0, Math.min(1, (relativeRatio - i) / (a - i)));
      meterPercentage = 40 + (pctWithin * 20);
    } else if (relativeRatio < e) {
      tierName = 'Advanced';
      tierColor = '#facc15';
      percentile = 'Top 10% of Lifters';
      const pctWithin = Math.max(0, Math.min(1, (relativeRatio - a) / (e - a)));
      meterPercentage = 60 + (pctWithin * 20);
    } else {
      tierName = 'Elite (Athlete Class)';
      tierColor = 'var(--accent-red)';
      percentile = 'Top 2% (Elite Competitive)';
      const pctWithin = Math.min(1, (relativeRatio - e) / (e * 0.4));
      meterPercentage = 80 + (pctWithin * 18);
    }

    meterPercentage = Math.max(5, Math.min(95, meterPercentage));

    // Update Output Displays
    const res1rmEl = document.getElementById('res-calc-1rm');
    const resRatioEl = document.getElementById('res-relative-ratio');
    const resTierEl = document.getElementById('res-strength-tier');
    const resPctEl = document.getElementById('res-percentile');
    const meterStatusEl = document.getElementById('strength-meter-status');
    const meterPointerEl = document.getElementById('meter-pointer');
    const matrixTitleEl = document.getElementById('matrix-exercise-title');

    if (res1rmEl) {
      if (ex.isCalisthenics && liftKg <= 0) {
        res1rmEl.textContent = `BW (${display1RM} ${currentStrengthUnit})`;
      } else if (ex.isCalisthenics) {
        res1rmEl.textContent = `+${display1RM} ${currentStrengthUnit}`;
      } else {
        res1rmEl.textContent = `${display1RM} ${currentStrengthUnit}`;
      }
    }

    if (resRatioEl) resRatioEl.textContent = `${roundedRatio}x BW`;
    if (resTierEl) {
      resTierEl.textContent = tierName;
      resTierEl.style.color = tierColor;
    }
    if (resPctEl) resPctEl.textContent = percentile;
    if (meterStatusEl) {
      meterStatusEl.textContent = `${tierName} · ${roundedRatio}x Bodyweight`;
      meterStatusEl.style.color = tierColor;
    }
    if (meterPointerEl) {
      meterPointerEl.style.left = `${meterPercentage}%`;
      meterPointerEl.style.borderTopColor = tierColor;
    }
    if (matrixTitleEl) {
      matrixTitleEl.textContent = ex.name;
    }

    // Update Meter Tier Target Labels
    const tierBeginnerEl = document.getElementById('tier-val-beginner');
    const tierNoviceEl = document.getElementById('tier-val-novice');
    const tierInterEl = document.getElementById('tier-val-intermediate');
    const tierAdvEl = document.getElementById('tier-val-advanced');
    const tierEliteEl = document.getElementById('tier-val-elite');

    const fmtTier = (ratio) => {
      let reqKg = 0;
      if (ex.isCalisthenics) {
        reqKg = Math.max(0, (bwKg * ratio) - (bwKg * ex.bodyweightPct));
        const val = (Math.round(reqKg * unitMultiplier * 10) / 10).toFixed(0);
        return (val > 0) ? `+${val} ${currentStrengthUnit}` : `Bodyweight`;
      } else {
        reqKg = bwKg * ratio;
        return `${(Math.round(reqKg * unitMultiplier * 10) / 10).toFixed(0)} ${currentStrengthUnit}`;
      }
    };

    if (tierBeginnerEl) tierBeginnerEl.textContent = `< ${fmtTier(n)}`;
    if (tierNoviceEl) tierNoviceEl.textContent = fmtTier(n);
    if (tierInterEl) tierInterEl.textContent = fmtTier(i);
    if (tierAdvEl) tierAdvEl.textContent = fmtTier(a);
    if (tierEliteEl) tierEliteEl.textContent = `${fmtTier(e)}+`;

    // Populate Exercise-Specific Percentage Matrix
    const matrixBody = document.getElementById('strength-matrix-body');
    if (matrixBody) {
      matrixBody.innerHTML = '';
      const matrixPercentages = [
        { pct: 100, reps: '1 Rep (1RM)', focus: 'Absolute Limit Strength (RPE 10)' },
        { pct: 95,  reps: '2 Reps', focus: 'Heavy Peaking &amp; Potentiation (RPE 9.5)' },
        { pct: 90,  reps: '3–4 Reps', focus: 'Maximal Strength &amp; Density (RPE 9)' },
        { pct: 85,  reps: '5–6 Reps', focus: 'Functional Strength Hypertrophy (RPE 8.5)' },
        { pct: 80,  reps: '7–8 Reps', focus: 'Optimal Hypertrophy Stimulus (RPE 8)' },
        { pct: 75,  reps: '8–10 Reps', focus: 'Muscle Building Growth Zone (RPE 7.5)' },
        { pct: 70,  reps: '10–12 Reps', focus: 'Volume Accumulation (RPE 7)' },
        { pct: 65,  reps: '12–15 Reps', focus: 'Muscular Endurance &amp; Density (RPE 6.5)' },
        { pct: 60,  reps: '15–20 Reps', focus: 'Dynamic Speed &amp; Technical Form (RPE 6)' },
        { pct: 55,  reps: '20+ Reps', focus: 'Tendon Conditioning &amp; Active Recovery' },
        { pct: 50,  reps: 'Dynamic Warmup', focus: 'Compensatory Acceleration (CAT)' }
      ];

      matrixPercentages.forEach(row => {
        let loadKg = 0;
        let displayLoad = '';

        if (ex.isCalisthenics) {
          const movingLoadKg = total1RM_Kg * (row.pct / 100);
          const addedKg = movingLoadKg - (bwKg * ex.bodyweightPct);
          const addedUnitVal = Math.round(addedKg * unitMultiplier * 10) / 10;
          if (addedUnitVal > 0) {
            displayLoad = `+${addedUnitVal.toFixed(1)} ${currentStrengthUnit} (BW + Added)`;
          } else {
            displayLoad = `Bodyweight Reps`;
          }
        } else {
          loadKg = total1RM_Kg * (row.pct / 100);
          displayLoad = `${(Math.round(loadKg * unitMultiplier * 10) / 10).toFixed(1)} ${currentStrengthUnit}`;
        }

        const tr = document.createElement('tr');
        if (row.pct === 100) tr.classList.add('highlight-row');
        tr.innerHTML = `
          <td><strong>${row.pct}%</strong></td>
          <td><strong style="color:var(--text-main); font-size:1.02rem;">${displayLoad}</strong></td>
          <td>${row.reps}</td>
          <td style="color:var(--text-muted); font-size:0.85rem;">${row.focus}</td>
        `;
        matrixBody.appendChild(tr);
      });
    }
  }

  // Initialize relative strength calculator on page load
  calculateRelativeStrength();


  // C. VO2 MAX ESTIMATOR (20-SECOND PROTOCOL)
  const vo2Btn = document.getElementById('calc-vo2-btn');
  const vo2BeatsInput = document.getElementById('vo2-beats-20');
  const vo2CalcBpmSpan = document.getElementById('vo2-calc-bpm');
  const startTimerBtn = document.getElementById('start-vo2-timer-btn');
  const timerCountdownEl = document.getElementById('pulse-countdown-display');
  const timerStatusEl = document.getElementById('vo2-timer-status');
  const heartIconEl = document.getElementById('pulse-heart-icon');

  let timerInterval = null;

  // Live BPM update from 20s pulse count
  if (vo2BeatsInput && vo2CalcBpmSpan) {
    vo2BeatsInput.addEventListener('input', () => {
      const beats = parseFloat(vo2BeatsInput.value) || 0;
      const bpm = Math.round(beats * 3);
      vo2CalcBpmSpan.textContent = `${bpm} bpm`;
      vo2CalcBpmSpan.parentElement.innerHTML = `Calculated Resting HR: <span id="vo2-calc-bpm" style="color:var(--accent-red); font-weight:700;">${bpm} bpm</span> (${beats} beats &times; 3)`;
    });
  }

  // Interactive 20-Second Pulse Stopwatch
  if (startTimerBtn && timerCountdownEl) {
    startTimerBtn.addEventListener('click', () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startTimerBtn.textContent = 'Start 20s Pulse Test';
        if (timerStatusEl) timerStatusEl.textContent = 'Test paused. Click Start when ready.';
        if (heartIconEl) heartIconEl.classList.remove('pulsing');
        return;
      }

      let timeLeft = 20;
      timerCountdownEl.textContent = `${timeLeft}s`;
      startTimerBtn.textContent = 'Stop Timer';
      if (timerStatusEl) timerStatusEl.textContent = 'Counting pulses... Feel each heartbeat and keep track!';
      if (heartIconEl) heartIconEl.classList.add('pulsing');

      timerInterval = setInterval(() => {
        timeLeft -= 1;
        timerCountdownEl.textContent = `${timeLeft}s`;

        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          startTimerBtn.textContent = 'Restart Test';
          if (heartIconEl) heartIconEl.classList.remove('pulsing');
          if (timerStatusEl) {
            timerStatusEl.innerHTML = '<strong style="color:var(--accent-red);">Time is up!</strong> Enter your counted heartbeats in the pulse field above.';
          }
          timerCountdownEl.textContent = 'Done!';
        }
      }, 1000);
    });
  }

  if (vo2Btn) {
    vo2Btn.addEventListener('click', calculateVO2Max);
    calculateVO2Max();
  }

  function calculateVO2Max() {
    const age = parseFloat(document.getElementById('vo2-age').value) || 24;
    const gender = document.getElementById('vo2-gender').value;
    const beats20 = parseFloat(document.getElementById('vo2-beats-20').value) || 20;
    
    // Sports Science 20-Second Pulse Protocol: HRrest = Beats in 20s * 3
    const hrRest = Math.max(30, Math.round(beats20 * 3));
    
    // Tanaka Formula: HRmax = 208 - (0.7 * Age)
    const hrMax = Math.round(208 - (0.7 * age));

    // Uth-Sørensen-Overgaard-Pedersen VO2 max estimation: 15.3 * (HRmax / HRrest)
    let vo2 = 15.3 * (hrMax / hrRest);
    vo2 = Math.round(vo2 * 10) / 10;

    let fitnessScore = 'Good';
    if (gender === 'male') {
      if (vo2 >= 55) fitnessScore = 'Superior (Elite Athlete)';
      else if (vo2 >= 48) fitnessScore = 'Excellent (High Aerobic)';
      else if (vo2 >= 42) fitnessScore = 'Good (Above Average)';
      else if (vo2 >= 35) fitnessScore = 'Fair (Moderate)';
      else fitnessScore = 'Below Average (Cardio Needed)';
    } else {
      if (vo2 >= 48) fitnessScore = 'Superior (Elite Athlete)';
      else if (vo2 >= 41) fitnessScore = 'Excellent (High Aerobic)';
      else if (vo2 >= 35) fitnessScore = 'Good (Above Average)';
      else if (vo2 >= 30) fitnessScore = 'Fair (Moderate)';
      else fitnessScore = 'Below Average (Cardio Needed)';
    }

    const valEl = document.getElementById('res-vo2-val');
    const catEl = document.getElementById('res-vo2-cat');
    const mhrEl = document.getElementById('res-vo2-mhr');

    if (valEl) valEl.textContent = `${vo2} mL/kg/min`;
    if (catEl) catEl.textContent = fitnessScore;
    if (mhrEl) mhrEl.textContent = `${hrMax} bpm`;
  }

  // D. MAXIMUM HEART RATE ZONES
  const hrBtn = document.getElementById('calc-hr-btn');
  if (hrBtn) {
    hrBtn.addEventListener('click', calculateHRZones);
    calculateHRZones();
  }

  function calculateHRZones() {
    const age = parseFloat(document.getElementById('hr-age').value) || 24;
    const maxHR = Math.round(220 - age);

    document.getElementById('res-max-hr').textContent = `${maxHR} bpm`;
    document.getElementById('res-z1').textContent = `${Math.round(maxHR * 0.50)} - ${Math.round(maxHR * 0.60)} bpm`;
    document.getElementById('res-z2').textContent = `${Math.round(maxHR * 0.60)} - ${Math.round(maxHR * 0.70)} bpm`;
    document.getElementById('res-z3').textContent = `${Math.round(maxHR * 0.70)} - ${Math.round(maxHR * 0.80)} bpm`;
    document.getElementById('res-z4').textContent = `${Math.round(maxHR * 0.80)} - ${Math.round(maxHR * 0.90)} bpm`;
    document.getElementById('res-z5').textContent = `${Math.round(maxHR * 0.90)} - ${maxHR} bpm`;
  }

  // E. CALORIES BURNED CALCULATOR (EXPANDED ACTIVITY TYPES)
  const burnBtn = document.getElementById('calc-burn-btn');
  if (burnBtn) {
    burnBtn.addEventListener('click', calculateCaloriesBurned);
    calculateCaloriesBurned();
  }

  function calculateCaloriesBurned() {
    const met = parseFloat(document.getElementById('burn-activity').value) || 6.0;
    const weight = parseFloat(document.getElementById('burn-weight').value) || 75;
    const duration = parseFloat(document.getElementById('burn-duration').value) || 45;

    const caloriesBurned = Math.round(met * weight * (duration / 60));
    const calPerMin = (caloriesBurned / duration).toFixed(1);

    document.getElementById('res-burned-cal').textContent = `${caloriesBurned} kcal`;
    document.getElementById('res-burn-rate').textContent = `${calPerMin} kcal/min`;
  }

  // F. TDEE & MACRO CALCULATOR
  const tdeeBtn = document.getElementById('calc-tdee-btn');
  if (tdeeBtn) {
    tdeeBtn.addEventListener('click', () => {
      const gender = document.getElementById('calc-gender').value;
      const age = parseFloat(document.getElementById('calc-age').value) || 25;
      const weight = parseFloat(document.getElementById('calc-weight').value) || 75;
      const height = parseFloat(document.getElementById('calc-height').value) || 175;
      const activity = parseFloat(document.getElementById('calc-activity').value) || 1.375;
      const goal = document.getElementById('calc-goal').value;

      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      bmr = (gender === 'male') ? bmr + 5 : bmr - 161;

      let tdee = Math.round(bmr * activity);

      if (goal === 'cut') tdee = Math.round(tdee * 0.82);
      else if (goal === 'bulk') tdee = Math.round(tdee * 1.12);

      const proteinGrams = Math.round(weight * 2.2);
      const proteinCalories = proteinGrams * 4;
      const fatCalories = Math.round(tdee * 0.25);
      const fatGrams = Math.round(fatCalories / 9);
      const carbCalories = Math.max(0, tdee - proteinCalories - fatCalories);
      const carbGrams = Math.round(carbCalories / 4);

      document.getElementById('res-calories').textContent = `${tdee} kcal`;
      document.getElementById('res-protein').textContent = `${proteinGrams}g`;
      document.getElementById('res-carbs').textContent = `${carbGrams}g`;
      document.getElementById('res-fats').textContent = `${fatGrams}g`;
    });
  }

  // G. TRAINING PERCENTAGE CALCULATOR (Card-based, distinct design)
  (function initTrainingPctCalculator() {
    const tpctExercise = document.getElementById('tpct-exercise');
    const tpct1rm      = document.getElementById('tpct-1rm');
    const tpctUnit     = document.getElementById('tpct-unit');
    const tpctBtn      = document.getElementById('calc-tpct-btn');
    const tpctGrid     = document.getElementById('tpct-cards-grid');
    const tpctTitle    = document.getElementById('tpct-exercise-title');
    const tpctChips    = document.querySelectorAll('.tpct-chip');

    if (!tpctBtn || !tpctGrid) return;

    // Zone card definitions: pct, zone key, badge, reps, stimulus note, RPE
    const ZONES = [
      { pct: 100, zone: 'max',    badge: 'Max Effort',    reps: '1 Rep',          note: 'Absolute 1RM — limit strength test',               rpe: 'RPE 10'  },
      { pct: 97,  zone: 'max',    badge: 'Max Strength',  reps: '1 Rep',          note: 'Near-max peaking — heavy singles',                  rpe: 'RPE 9.5' },
      { pct: 95,  zone: 'max',    badge: 'Max Strength',  reps: '1–2 Reps',       note: 'Maximal strength / potentiation',                   rpe: 'RPE 9.5' },
      { pct: 92,  zone: 'max',    badge: 'Max Strength',  reps: '2 Reps',         note: 'Heavy doubles — high neural demand',                rpe: 'RPE 9'   },
      { pct: 90,  zone: 'max',    badge: 'Max Strength',  reps: '3–4 Reps',       note: 'Strength density — powerlifting peaking',           rpe: 'RPE 9'   },
      { pct: 87,  zone: 'heavy',  badge: 'Heavy',         reps: '4–5 Reps',       note: 'Functional strength — heavy triples/quads',         rpe: 'RPE 8.5' },
      { pct: 85,  zone: 'heavy',  badge: 'Heavy',         reps: '5–6 Reps',       note: 'Strength-hypertrophy blend (5×5 zone)',             rpe: 'RPE 8.5' },
      { pct: 82,  zone: 'heavy',  badge: 'Heavy',         reps: '5–7 Reps',       note: 'Optimal strength-size crossover',                   rpe: 'RPE 8'   },
      { pct: 80,  zone: 'heavy',  badge: 'Heavy Volume',  reps: '7–8 Reps',       note: 'Primary hypertrophy + strength stimulus',           rpe: 'RPE 8'   },
      { pct: 77,  zone: 'hyper',  badge: 'Hypertrophy',   reps: '8–9 Reps',       note: 'Optimal muscle growth zone',                        rpe: 'RPE 7.5' },
      { pct: 75,  zone: 'hyper',  badge: 'Hypertrophy',   reps: '8–10 Reps',      note: 'Size & volume accumulation',                       rpe: 'RPE 7.5' },
      { pct: 72,  zone: 'hyper',  badge: 'Hypertrophy',   reps: '10–11 Reps',     note: 'Muscle building — high metabolic stress',           rpe: 'RPE 7'   },
      { pct: 70,  zone: 'hyper',  badge: 'Hypertrophy',   reps: '10–12 Reps',     note: 'Volume accumulation / work capacity',               rpe: 'RPE 7'   },
      { pct: 67,  zone: 'volume', badge: 'Volume',        reps: '12–14 Reps',     note: 'Moderate load endurance — density work',            rpe: 'RPE 6.5' },
      { pct: 65,  zone: 'volume', badge: 'Volume',        reps: '12–15 Reps',     note: 'Muscular endurance & metabolic conditioning',      rpe: 'RPE 6.5' },
      { pct: 62,  zone: 'volume', badge: 'Volume Work',   reps: '15–18 Reps',     note: 'High-rep sarcoplasmic volume zone',                 rpe: 'RPE 6'   },
      { pct: 60,  zone: 'volume', badge: 'Volume Work',   reps: '16–20 Reps',     note: 'Technique drill / speed-strength',                  rpe: 'RPE 6'   },
      { pct: 55,  zone: 'speed',  badge: 'Speed / Form',  reps: '20–22 Reps',     note: 'CAT — compensatory acceleration technique',        rpe: 'RPE 5'   },
      { pct: 50,  zone: 'speed',  badge: 'Warm-up',       reps: '20+ Reps',       note: 'Warm-up sets / activation / tendon conditioning',  rpe: 'RPE 4'   },
      { pct: 40,  zone: 'speed',  badge: 'Active Rehab',  reps: 'High Rep / Set', note: 'Active recovery — deload / prehab work',           rpe: 'RPE 3'   },
    ];

    function renderCards(oneRMKg, unit) {
      tpctGrid.innerHTML = '';
      const factor = (unit === 'lb') ? 2.20462 : 1;
      const unitLabel = unit;

      ZONES.forEach((z, idx) => {
        const loadKg   = oneRMKg * (z.pct / 100);
        const loadDisp = (Math.round(loadKg * factor * 10) / 10).toFixed(1);

        const card = document.createElement('div');
        card.className = 'tpct-card';
        card.dataset.zone = z.zone;

        card.innerHTML = `
          <span class="tpct-rpe-tag">${z.rpe}</span>
          <div class="tpct-card-header">
            <div class="tpct-card-pct">${z.pct}<span style="font-size:1.1rem;">%</span></div>
            <div class="tpct-card-badge">${z.badge}</div>
          </div>
          <div class="tpct-card-weight">${loadDisp} ${unitLabel}</div>
          <div class="tpct-card-info">
            <strong>${z.reps}</strong><br>${z.note}
          </div>
          <div class="tpct-bar-track">
            <div class="tpct-bar-fill" style="width:0%;"></div>
          </div>
        `;

        tpctGrid.appendChild(card);

        // Staggered bar animation
        setTimeout(() => {
          const fill = card.querySelector('.tpct-bar-fill');
          if (fill) fill.style.width = `${z.pct}%`;
        }, 50 + idx * 30);
      });
    }

    function calcTrainingPct() {
      if (!tpctExercise || !tpct1rm || !tpctUnit || !tpctTitle) return;
      const exVal    = tpctExercise.value.split('|')[0];
      const oneRMKg  = parseFloat(tpct1rm.value) || 100;
      const unit     = tpctUnit.value;
      const factor   = (unit === 'lb') ? 2.20462 : 1;
      const dispRM   = (Math.round(oneRMKg * factor * 10) / 10).toFixed(1);

      tpctTitle.textContent = `${exVal} — 1RM: ${dispRM} ${unit}`;
      renderCards(oneRMKg, unit);
    }

    // Filter chip handling
    tpctChips.forEach(chip => {
      chip.addEventListener('click', () => {
        tpctChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.getAttribute('data-tpct-filter');
        if (!tpctExercise) return;

        const groups = tpctExercise.querySelectorAll('optgroup');
        let firstOpt = null;
        groups.forEach(og => {
          const cat  = og.getAttribute('data-tpct-cat');
          const show = (filter === 'all' || cat === filter);
          og.style.display = show ? '' : 'none';
          if (show && !firstOpt) firstOpt = og.querySelector('option');
        });

        if (firstOpt) {
          tpctExercise.value = firstOpt.value;
          calcTrainingPct();
        }
      });
    });

    tpctBtn.addEventListener('click', calcTrainingPct);
    if (tpctExercise) tpctExercise.addEventListener('change', calcTrainingPct);
    if (tpct1rm)      tpct1rm.addEventListener('input',  calcTrainingPct);
    if (tpctUnit)     tpctUnit.addEventListener('change', calcTrainingPct);

    // Initial render on page load
    calcTrainingPct();
  })();
}

/* --------------------------------------------------------------------------
   4. SKILLS CATEGORY MATRIX FILTER
   -------------------------------------------------------------------------- */
function initSkillsFilter() {
  const chipBtns = document.querySelectorAll('.chip-btn');
  const skillTags = document.querySelectorAll('.skill-tag');

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      chipBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillTags.forEach(tag => {
        const category = tag.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          tag.style.display = 'inline-block';
          tag.style.opacity = '1';
        } else {
          tag.style.opacity = '0';
          setTimeout(() => {
            if (tag.style.opacity === '0') tag.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   5. MODALS & REGISTRATION FORM
   -------------------------------------------------------------------------- */
function initModals() {
  const bookingModal = document.getElementById('booking-modal');
  const openBookingBtns = document.querySelectorAll('.open-booking-modal');
  const closeBookingBtn = document.getElementById('close-booking-modal');

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (bookingModal) bookingModal.classList.add('active');
    });
  });

  if (closeBookingBtn && bookingModal) {
    closeBookingBtn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) bookingModal.classList.remove('active');
    });
  }

  const lightboxModal = document.getElementById('lightbox-modal');
  const photoFrame = document.getElementById('photo-lightbox-trigger');
  const closeLightboxBtn = document.getElementById('close-lightbox-modal');

  if (photoFrame && lightboxModal) {
    photoFrame.addEventListener('click', () => {
      lightboxModal.classList.add('active');
    });
  }

  if (closeLightboxBtn && lightboxModal) {
    closeLightboxBtn.addEventListener('click', () => {
      lightboxModal.classList.remove('active');
    });
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  // Certificate Lightbox Modal
  const certModal = document.getElementById('cert-lightbox-modal');
  const certTrigger = document.getElementById('cert-lightbox-trigger');
  const closeCertBtn = document.getElementById('close-cert-lightbox-modal');

  if (certTrigger && certModal) {
    certTrigger.addEventListener('click', () => {
      certModal.classList.add('active');
    });
  }

  if (closeCertBtn && certModal) {
    closeCertBtn.addEventListener('click', () => {
      certModal.classList.remove('active');
    });
  }
  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) certModal.classList.remove('active');
    });
  }
}
