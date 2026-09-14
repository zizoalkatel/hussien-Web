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

  // B. TRAINING PERCENTAGE CALCULATOR (ENHANCED)
  const pctBtn = document.getElementById('calc-pct-btn');
  const pctQuickBtns = document.querySelectorAll('.pct-quick-btn');
  const pctTargetInput = document.getElementById('pct-target');
  const pct1RMInput = document.getElementById('pct-1rm');

  if (pctQuickBtns && pctTargetInput) {
    pctQuickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pctQuickBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pctTargetInput.value = btn.getAttribute('data-pct');
        calculateTrainingPercentage();
      });
    });
  }

  if (pct1RMInput) {
    pct1RMInput.addEventListener('input', calculateTrainingPercentage);
  }
  if (pctTargetInput) {
    pctTargetInput.addEventListener('input', () => {
      const val = parseFloat(pctTargetInput.value);
      pctQuickBtns.forEach(b => {
        if (parseFloat(b.getAttribute('data-pct')) === val) b.classList.add('active');
        else b.classList.remove('active');
      });
      calculateTrainingPercentage();
    });
  }

  if (pctBtn) {
    pctBtn.addEventListener('click', calculateTrainingPercentage);
    calculateTrainingPercentage();
  }

  function calculateTrainingPercentage() {
    const known1RM = parseFloat(document.getElementById('pct-1rm').value) || 100;
    const targetPct = parseFloat(document.getElementById('pct-target').value) || 75;

    const calculatedWeight = (Math.round((known1RM * (targetPct / 100)) * 10) / 10).toFixed(1);
    
    const resWeightEl = document.getElementById('res-pct-weight');
    const resLblEl = document.getElementById('res-pct-lbl');
    const resAdaptEl = document.getElementById('res-pct-adaptation');

    if (resWeightEl) resWeightEl.textContent = `${calculatedWeight} kg`;
    if (resLblEl) resLblEl.textContent = `${targetPct}% of ${known1RM} kg`;

    if (resAdaptEl) {
      if (targetPct >= 85) {
        resAdaptEl.innerHTML = '<span style="color:var(--accent-red); font-weight:600;">Maximal Strength &amp; Neural Drive</span> · Target: 1–5 Reps (RPE 8.5–10)';
      } else if (targetPct >= 70) {
        resAdaptEl.innerHTML = '<span style="color:#38bdf8; font-weight:600;">Hypertrophy &amp; Muscular Development</span> · Target: 6–12 Reps (RPE 7.5–9)';
      } else if (targetPct >= 50) {
        resAdaptEl.innerHTML = '<span style="color:#4ade80; font-weight:600;">Power &amp; Explosive Velocity / Speed-Strength</span> · Target: 3–5 Reps (Max Velocity)';
      } else {
        resAdaptEl.innerHTML = '<span style="color:#facc15; font-weight:600;">Active Recovery, Deload &amp; Form Drills</span> · High Volume';
      }
    }

    // Populate full training percentage matrix table
    const tableBody = document.getElementById('pct-table-body');
    if (tableBody) {
      tableBody.innerHTML = '';
      const matrixSteps = [
        { pct: 100, reps: '1 Rep (1RM)', focus: 'Absolute Limit Strength' },
        { pct: 95,  reps: '2 Reps', focus: 'Heavy Peaking &amp; Potentiation' },
        { pct: 90,  reps: '3–4 Reps', focus: 'Maximal Strength &amp; Density' },
        { pct: 85,  reps: '5–6 Reps', focus: 'Functional Strength Hypertrophy' },
        { pct: 80,  reps: '7–8 Reps', focus: 'Optimal Muscle Hypertrophy' },
        { pct: 75,  reps: '8–10 Reps', focus: 'Bodybuilding Growth Zone' },
        { pct: 70,  reps: '10–12 Reps', focus: 'Volume Accumulation' },
        { pct: 65,  reps: '12–15 Reps', focus: 'Muscular Endurance &amp; Density' },
        { pct: 60,  reps: '15–20 Reps', focus: 'Lactate Buffering / Deload' },
        { pct: 55,  reps: '20+ Reps', focus: 'Tendon Conditioning &amp; Rehab' },
        { pct: 50,  reps: 'Dynamic Speed', focus: 'Power Velocity Work (CAT)' }
      ];

      matrixSteps.forEach(step => {
        const weight = (Math.round((known1RM * (step.pct / 100)) * 10) / 10).toFixed(1);
        const row = document.createElement('tr');
        if (Math.abs(step.pct - targetPct) < 2) row.classList.add('highlight-row');
        row.innerHTML = `
          <td><strong>${step.pct}%</strong></td>
          <td><strong style="color:var(--text-main);">${weight} kg</strong></td>
          <td>${step.reps}</td>
          <td style="color:var(--text-muted); font-size:0.85rem;">${step.focus}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  }

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
