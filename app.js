/**
 * B.Tech CSE Attendance Calculator & Predictor
 * Core Application Engine & Reactive State Controller
 */

(function () {
  'use strict';

  // --- STORAGE KEYS ---
  const STORAGE_KEY_DATA = 'attendx_cse_data_v1';
  const STORAGE_KEY_THEME = 'attendx_theme_v1';

  // --- INITIAL DEMO SUBJECTS (Includes the exact Data Structures example) ---
  const DEFAULT_CSE_SUBJECTS = [
    {
      id: 'ds-algo-1',
      name: 'Data Structures & Algorithms',
      totalConducted: 40,
      attended: 30,
      absent: 10,
      futureAttended: 8,
      futureMissed: 2,
      showFuture: true
    },
    {
      id: 'os-2',
      name: 'Operating Systems',
      totalConducted: 36,
      attended: 29,
      absent: 7,
      futureAttended: 4,
      futureMissed: 0,
      showFuture: true
    },
    {
      id: 'dbms-3',
      name: 'Database Management Systems',
      totalConducted: 32,
      attended: 22,
      absent: 10,
      futureAttended: 6,
      futureMissed: 0,
      showFuture: true
    },
    {
      id: 'cn-4',
      name: 'Computer Networks',
      totalConducted: 28,
      attended: 25,
      absent: 3,
      futureAttended: 2,
      futureMissed: 2,
      showFuture: true
    },
    {
      id: 'toc-5',
      name: 'Theory of Computation',
      totalConducted: 30,
      attended: 24,
      absent: 6,
      futureAttended: 3,
      futureMissed: 1,
      showFuture: true
    }
  ];

  // --- APP STATE ---
  let appState = {
    student: {
      name: 'Alex Sharma',
      roll: '21BCSE1042',
      college: 'National Institute of Technology',
      department: 'B.Tech - Computer Science & Engineering',
      semester: 'Semester 6'
    },
    requiredTarget: 75,
    subjects: JSON.parse(JSON.stringify(DEFAULT_CSE_SUBJECTS)),
    globalFutureVisible: true
  };

  // --- DOM ELEMENTS ---
  const elStudentName = document.getElementById('student-name');
  const elStudentRoll = document.getElementById('student-roll');
  const elCollegeName = document.getElementById('college-name');
  const elDepartmentName = document.getElementById('department-name');
  const elSemesterVal = document.getElementById('semester-val');

  const elRequiredTarget = document.getElementById('required-target-input');
  const elTargetPresets = document.querySelectorAll('.btn-preset');

  const elOverallCurrentPct = document.getElementById('overall-current-pct');
  const elOverallPredictedPct = document.getElementById('overall-predicted-pct');
  const elCurrentGaugeBar = document.getElementById('current-gauge-bar');
  const elPredictedGaugeBar = document.getElementById('predicted-gauge-bar');
  const elCurrentOverallStatusBadge = document.getElementById('current-overall-status-badge');
  const elPredictedDeltaBadge = document.getElementById('predicted-delta-badge');

  const elStatTotalAttended = document.getElementById('stat-total-attended');
  const elStatTotalAbsent = document.getElementById('stat-total-absent');
  const elStatTotalConducted = document.getElementById('stat-total-conducted');
  const elStatFutureTotal = document.getElementById('stat-future-total');
  const elStatFutureAttended = document.getElementById('stat-future-attended');
  const elStatFutureMissed = document.getElementById('stat-future-missed');

  const elOverallAdviceText = document.getElementById('overall-advice-text');
  const elOverallAdviceBanner = document.getElementById('overall-advice-banner');
  const elPredictedAdviceText = document.getElementById('predicted-advice-text');
  const elPredictedAdviceBanner = document.getElementById('predicted-advice-banner');

  const elMetricSubjectCount = document.getElementById('metric-subject-count');
  const elMetricSafeCount = document.getElementById('metric-safe-count');
  const elMetricDangerCount = document.getElementById('metric-danger-count');
  const elMetricRequiredTarget = document.getElementById('metric-required-target');

  const elSubjectsContainer = document.getElementById('subjects-container');
  const elEmptyState = document.getElementById('empty-state');

  const elBtnAddSubject = document.getElementById('btn-add-subject');
  const elBtnToggleFutureAll = document.getElementById('btn-toggle-future-all');
  const elFutureToggleText = document.getElementById('future-toggle-text');
  const elBtnRecalculate = document.getElementById('btn-recalculate');
  const elBtnLoadDemo = document.getElementById('btn-load-demo');
  const elBtnReset = document.getElementById('btn-reset');
  const elBtnPrint = document.getElementById('btn-print');
  const elBtnThemeToggle = document.getElementById('btn-theme-toggle');
  const elThemeIcon = document.getElementById('theme-icon');

  const elBtnToggleProfile = document.getElementById('btn-toggle-profile');
  const elProfileFields = document.getElementById('profile-fields');
  const elProfileChevron = document.getElementById('profile-chevron');

  const elExplainerHeader = document.getElementById('explainer-header');
  const elBtnToggleExplainer = document.getElementById('btn-toggle-explainer');
  const elExplainerContent = document.getElementById('explainer-content');
  const elExplainerChevron = document.getElementById('explainer-chevron');

  const elCalcModal = document.getElementById('calc-modal');
  const elModalSubjectTitle = document.getElementById('modal-subject-title');
  const elModalContent = document.getElementById('modal-content');
  const elBtnCloseModal = document.getElementById('btn-close-modal');
  const elBtnModalDone = document.getElementById('btn-modal-done');

  // --- INITIALIZATION ---
  function init() {
    loadTheme();
    loadStateFromStorage();
    bindEvents();
    renderAll();
    refreshLucideIcons();
  }

  // --- THEME HANDLING ---
  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEY_THEME, newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
  }

  function updateThemeIcon(theme) {
    if (!elThemeIcon) return;
    elThemeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    refreshLucideIcons();
  }

  // --- LOCAL STORAGE ---
  function saveStateToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(appState));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  function loadStateFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DATA);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.subjects && Array.isArray(parsed.subjects)) {
          appState = parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse saved storage data, loading defaults.', e);
    }

    // Sync input values to appState
    if (elStudentName) elStudentName.value = appState.student.name || '';
    if (elStudentRoll) elStudentRoll.value = appState.student.roll || '';
    if (elCollegeName) elCollegeName.value = appState.student.college || '';
    if (elDepartmentName) elDepartmentName.value = appState.student.department || '';
    if (elSemesterVal) elSemesterVal.value = appState.student.semester || 'Semester 6';
    if (elRequiredTarget) elRequiredTarget.value = appState.requiredTarget || 75;
    syncTargetPresetButtons(appState.requiredTarget);
  }

  // --- MATH & CALCULATIONS ENGINE ---

  /**
   * Calculate Subject Current Attendance %
   * Formula: (Attended / Total Conducted) * 100
   * Safe for total = 0
   */
  function calcCurrentPct(attended, totalConducted) {
    if (!totalConducted || totalConducted <= 0) return 0;
    const safeAttended = Math.min(Math.max(0, attended), totalConducted);
    return Math.min(100, Math.max(0, (safeAttended / totalConducted) * 100));
  }

  /**
   * Calculate Subject Predicted Attendance %
   * Formula: ((Attended + FutureAttended) / (Total Conducted + FutureAttended + FutureMissed)) * 100
   */
  function calcPredictedPct(attended, totalConducted, futureAttended, futureMissed) {
    const futureTotal = Math.max(0, futureAttended) + Math.max(0, futureMissed);
    const combinedTotal = Math.max(0, totalConducted) + futureTotal;
    const combinedAttended = Math.max(0, attended) + Math.max(0, futureAttended);

    if (combinedTotal <= 0) return 0;
    return Math.min(100, Math.max(0, (combinedAttended / combinedTotal) * 100));
  }

  /**
   * Classes needed continuously to reach Required Target R%
   * Formula: ceil((R * Total - 100 * Attended) / (100 - R))
   */
  function calcClassesNeeded(attended, totalConducted, targetR) {
    const safeAtt = Math.max(0, attended);
    const safeTot = Math.max(0, totalConducted);
    const R = Number(targetR);

    if (R <= 0) return 0;
    if (safeTot === 0) return 0;

    const currentPct = (safeAtt / safeTot) * 100;
    if (currentPct >= R) return 0;

    if (R >= 100) {
      // If student missed even 1 class, 100% is impossible
      return safeAtt < safeTot ? Infinity : 0;
    }

    const numerator = (R * safeTot) - (100 * safeAtt);
    const denominator = 100 - R;
    const needed = Math.ceil(numerator / denominator);
    return Math.max(0, needed);
  }

  /**
   * Safe classes you can miss while keeping Attendance >= R%
   * Formula: floor((100 * Attended - R * Total) / R)
   */
  function calcSafeBunks(attended, totalConducted, targetR) {
    const safeAtt = Math.max(0, attended);
    const safeTot = Math.max(0, totalConducted);
    const R = Number(targetR);

    if (R <= 0) return 999;
    if (safeTot === 0) return 0;

    const currentPct = (safeAtt / safeTot) * 100;
    if (currentPct < R) return 0;

    const numerator = (100 * safeAtt) - (R * safeTot);
    const safeMisses = Math.floor(numerator / R);
    return Math.max(0, safeMisses);
  }

  // --- RENDER FUNCTIONS ---

  function renderAll() {
    renderDashboard();
    renderSubjectCards();
    updatePrintTemplate();
    refreshLucideIcons();
  }

  function renderDashboard() {
    const R = Number(appState.requiredTarget) || 75;
    elMetricRequiredTarget.textContent = `${R}%`;

    let totalAttended = 0;
    let totalAbsent = 0;
    let totalConducted = 0;
    let futureAttended = 0;
    let futureMissed = 0;

    let safeSubjectCount = 0;
    let dangerSubjectCount = 0;

    appState.subjects.forEach(sub => {
      const att = Number(sub.attended) || 0;
      const tot = Number(sub.totalConducted) || 0;
      const abs = Math.max(0, tot - att);
      const futAtt = Number(sub.futureAttended) || 0;
      const futMiss = Number(sub.futureMissed) || 0;

      totalAttended += att;
      totalAbsent += abs;
      totalConducted += tot;
      futureAttended += futAtt;
      futureMissed += futMiss;

      const currPct = calcCurrentPct(att, tot);
      if (tot > 0) {
        if (currPct >= R) {
          safeSubjectCount++;
        } else {
          dangerSubjectCount++;
        }
      }
    });

    // Weighted Overall Attendance %
    const overallCurrentPct = totalConducted > 0 ? ((totalAttended / totalConducted) * 100) : 0;
    
    // Weighted Overall Predicted %
    const futureConducted = futureAttended + futureMissed;
    const combinedTotal = totalConducted + futureConducted;
    const combinedAttended = totalAttended + futureAttended;
    const overallPredictedPct = combinedTotal > 0 ? ((combinedAttended / combinedTotal) * 100) : 0;

    // Stat text updates
    elStatTotalAttended.textContent = totalAttended;
    elStatTotalAbsent.textContent = totalAbsent;
    elStatTotalConducted.textContent = totalConducted;
    elStatFutureTotal.textContent = futureConducted;
    elStatFutureAttended.textContent = futureAttended;
    elStatFutureMissed.textContent = futureMissed;

    elMetricSubjectCount.textContent = appState.subjects.length;
    elMetricSafeCount.textContent = safeSubjectCount;
    elMetricDangerCount.textContent = dangerSubjectCount;

    // Gauge numbers
    elOverallCurrentPct.textContent = `${overallCurrentPct.toFixed(2)}%`;
    elOverallPredictedPct.textContent = `${overallPredictedPct.toFixed(2)}%`;

    // Circular Gauge Animation (circumference = 339.29 for r=54)
    const circumference = 339.29;
    const currentOffset = circumference - (Math.min(100, overallCurrentPct) / 100) * circumference;
    const predictedOffset = circumference - (Math.min(100, overallPredictedPct) / 100) * circumference;

    if (elCurrentGaugeBar) elCurrentGaugeBar.style.strokeDashoffset = isNaN(currentOffset) ? circumference : currentOffset;
    if (elPredictedGaugeBar) elPredictedGaugeBar.style.strokeDashoffset = isNaN(predictedOffset) ? circumference : predictedOffset;

    // Current Overall Status Badge & Advice Banner
    if (totalConducted === 0) {
      elCurrentOverallStatusBadge.className = 'status-badge badge-neutral';
      elCurrentOverallStatusBadge.textContent = 'No Classes Yet';
      elOverallAdviceBanner.className = 'advice-banner banner-neutral';
      elOverallAdviceText.textContent = 'Enter attendance data for your subjects to calculate stats.';
    } else if (overallCurrentPct >= R) {
      elCurrentOverallStatusBadge.className = 'status-badge badge-safe';
      elCurrentOverallStatusBadge.textContent = 'Above Required';
      const safeBunks = calcSafeBunks(totalAttended, totalConducted, R);
      elOverallAdviceBanner.className = 'advice-banner banner-safe';
      elOverallAdviceText.innerHTML = `Great job! You are in the safe zone. You can safely miss up to <strong>${safeBunks} class${safeBunks === 1 ? '' : 'es'}</strong> overall while remaining &ge; ${R}%.`;
    } else {
      elCurrentOverallStatusBadge.className = 'status-badge badge-danger';
      elCurrentOverallStatusBadge.textContent = 'Shortage Alert';
      const needed = calcClassesNeeded(totalAttended, totalConducted, R);
      elOverallAdviceBanner.className = 'advice-banner banner-danger';
      if (needed === Infinity) {
        elOverallAdviceText.innerHTML = `Attendance shortage! 100% requirement cannot be met due to prior absences.`;
      } else {
        elOverallAdviceText.innerHTML = `Shortage alert! You need to attend the next <strong>${needed} class${needed === 1 ? '' : 'es'}</strong> continuously to reach ${R}%.`;
      }
    }

    // Predicted Delta Badge & Advice
    const delta = overallPredictedPct - overallCurrentPct;
    const sign = delta > 0 ? '+' : '';
    elPredictedDeltaBadge.textContent = `${sign}${delta.toFixed(2)}% Delta`;

    if (futureConducted === 0) {
      elPredictedDeltaBadge.className = 'status-badge badge-neutral';
      elPredictedAdviceBanner.className = 'advice-banner banner-neutral';
      elPredictedAdviceText.textContent = 'Add upcoming future classes below to simulate your final standing.';
    } else if (overallPredictedPct >= R) {
      elPredictedDeltaBadge.className = 'status-badge badge-safe';
      elPredictedAdviceBanner.className = 'advice-banner banner-safe';
      elPredictedAdviceText.innerHTML = `Predicted: <strong>${overallPredictedPct.toFixed(2)}%</strong>. You will be safely above the ${R}% requirement!`;
    } else {
      elPredictedDeltaBadge.className = 'status-badge badge-danger';
      elPredictedAdviceBanner.className = 'advice-banner banner-danger';
      elPredictedAdviceText.innerHTML = `Predicted: <strong>${overallPredictedPct.toFixed(2)}%</strong>. Below target! Plan to attend more upcoming classes.`;
    }
  }

  function renderSubjectCards() {
    if (!elSubjectsContainer) return;

    if (appState.subjects.length === 0) {
      elSubjectsContainer.innerHTML = '';
      elEmptyState.style.display = 'flex';
      return;
    } else {
      elEmptyState.style.display = 'none';
    }

    const R = Number(appState.requiredTarget) || 75;
    let html = '';

    appState.subjects.forEach((sub, index) => {
      const att = Number(sub.attended) || 0;
      const tot = Number(sub.totalConducted) || 0;
      const abs = Math.max(0, tot - att);
      const futAtt = Number(sub.futureAttended) || 0;
      const futMiss = Number(sub.futureMissed) || 0;

      const currentPct = calcCurrentPct(att, tot);
      const predictedPct = calcPredictedPct(att, tot, futAtt, futMiss);
      const needed = calcClassesNeeded(att, tot, R);
      const safeBunks = calcSafeBunks(att, tot, R);

      // Card status class
      let statusClass = 'is-warning';
      let fillClass = 'fill-warning';
      let statusBadge = '<span class="status-badge badge-neutral">No Classes</span>';
      let guidanceMsg = `<span class="text-secondary">No classes conducted yet</span>`;

      if (tot > 0) {
        if (currentPct >= R) {
          statusClass = 'is-safe';
          fillClass = 'fill-safe';
          statusBadge = `<span class="status-badge badge-safe"><i data-lucide="check-circle-2"></i> ${currentPct.toFixed(1)}% Safe</span>`;
          if (safeBunks > 0) {
            guidanceMsg = `<span class="text-success"><i data-lucide="coffee"></i> Can miss <strong>${safeBunks}</strong> more class${safeBunks === 1 ? '' : 'es'}</span>`;
          } else {
            guidanceMsg = `<span class="text-warning"><i data-lucide="alert-circle"></i> On borderline! Don't miss next class</span>`;
          }
        } else {
          statusClass = 'is-danger';
          fillClass = 'fill-danger';
          statusBadge = `<span class="status-badge badge-danger"><i data-lucide="alert-triangle"></i> Shortage</span>`;
          if (needed === Infinity) {
            guidanceMsg = `<span class="text-danger"><i data-lucide="x-circle"></i> Cannot reach 100%</span>`;
          } else {
            guidanceMsg = `<span class="text-danger"><i data-lucide="trending-up"></i> Attend next <strong>${needed}</strong> class${needed === 1 ? '' : 'es'}</span>`;
          }
        }
      }

      const showFuture = sub.showFuture !== false;

      html += `
        <div class="subject-card ${statusClass}" data-id="${sub.id}">
          <!-- Card Header -->
          <div class="subject-card-header">
            <div class="subject-title-input-wrap">
              <input type="text" class="subject-title-input" value="${escapeHtml(sub.name)}" 
                     data-id="${sub.id}" data-field="name" placeholder="Subject Name..." title="Click to rename subject">
            </div>
            <div class="subject-header-actions">
              ${statusBadge}
              <button class="btn btn-icon btn-sm btn-ghost btn-duplicate-sub" data-id="${sub.id}" title="Duplicate Subject">
                <i data-lucide="copy"></i>
              </button>
              <button class="btn btn-icon btn-sm btn-ghost text-danger btn-delete-sub" data-id="${sub.id}" title="Delete Subject">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="subject-card-body">
            <!-- Percentages Display -->
            <div class="pct-display-row">
              <div class="pct-badge-current">
                <span class="pct-label">Current Attendance</span>
                <span class="pct-huge-number ${currentPct >= R ? 'text-success' : (tot === 0 ? 'text-secondary' : 'text-danger')}">
                  ${currentPct.toFixed(2)}%
                </span>
              </div>
              <div class="pct-badge-future">
                <span class="pct-label">Predicted (With Future)</span>
                <span class="pct-future-number">
                  ${predictedPct.toFixed(2)}%
                </span>
              </div>
            </div>

            <!-- Visual Progress Bar -->
            <div class="subject-progress-wrap">
              <div class="progress-track">
                <div class="progress-fill-current ${fillClass}" style="width: ${Math.min(100, currentPct)}%;"></div>
                <div class="progress-target-marker" style="left: ${R}%;" title="Target Requirement: ${R}%"></div>
              </div>
              <div class="progress-subtext">
                <span>0%</span>
                <span>Target: ${R}%</span>
                <span>100%</span>
              </div>
            </div>

            <!-- Stepper Controls for Conducted, Attended, Absent -->
            <div class="stepper-grid">
              <!-- Total Conducted -->
              <div class="stepper-box">
                <label>Total Classes</label>
                <div class="stepper-controls">
                  <button class="btn-step" data-action="dec" data-field="total" data-id="${sub.id}">-</button>
                  <input type="number" class="stepper-input input-total" data-id="${sub.id}" data-field="totalConducted" min="0" value="${tot}">
                  <button class="btn-step" data-action="inc" data-field="total" data-id="${sub.id}">+</button>
                </div>
              </div>

              <!-- Attended -->
              <div class="stepper-box">
                <label class="text-success">Attended</label>
                <div class="stepper-controls">
                  <button class="btn-step" data-action="dec" data-field="attended" data-id="${sub.id}">-</button>
                  <input type="number" class="stepper-input input-attended" data-id="${sub.id}" data-field="attended" min="0" max="${tot}" value="${att}">
                  <button class="btn-step" data-action="inc" data-field="attended" data-id="${sub.id}">+</button>
                </div>
              </div>

              <!-- Absent -->
              <div class="stepper-box">
                <label class="text-danger">Absent</label>
                <div class="stepper-controls">
                  <button class="btn-step" data-action="dec" data-field="absent" data-id="${sub.id}">-</button>
                  <input type="number" class="stepper-input input-absent" data-id="${sub.id}" data-field="absent" min="0" max="${tot}" value="${abs}">
                  <button class="btn-step" data-action="inc" data-field="absent" data-id="${sub.id}">+</button>
                </div>
              </div>
            </div>

            <!-- Future Classes Simulator Box -->
            <div class="future-simulator-box" style="${showFuture ? '' : 'display: none;'}">
              <div class="future-sim-header">
                <span><i data-lucide="calendar-plus"></i> Upcoming Future Classes Plan</span>
                <span>+${futAtt + futMiss} Planned</span>
              </div>
              <div class="future-sim-grid">
                <div class="stepper-box">
                  <label class="text-success">Will Attend</label>
                  <div class="stepper-controls">
                    <button class="btn-step" data-action="dec" data-field="futureAttended" data-id="${sub.id}">-</button>
                    <input type="number" class="stepper-input input-future-att" data-id="${sub.id}" data-field="futureAttended" min="0" value="${futAtt}">
                    <button class="btn-step" data-action="inc" data-field="futureAttended" data-id="${sub.id}">+</button>
                  </div>
                </div>
                <div class="stepper-box">
                  <label class="text-danger">Will Miss</label>
                  <div class="stepper-controls">
                    <button class="btn-step" data-action="dec" data-field="futureMissed" data-id="${sub.id}">-</button>
                    <input type="number" class="stepper-input input-future-miss" data-id="${sub.id}" data-field="futureMissed" min="0" value="${futMiss}">
                    <button class="btn-step" data-action="inc" data-field="futureMissed" data-id="${sub.id}">+</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Card Guidance Footer -->
          <div class="subject-guidance-footer">
            <div class="guidance-msg">
              ${guidanceMsg}
            </div>
            <button class="btn-inspect-math" data-id="${sub.id}">
              <i data-lucide="sigma"></i> Step Math
            </button>
          </div>
        </div>
      `;
    });

    elSubjectsContainer.innerHTML = html;
  }

  // --- PRINT TEMPLATE SYNC ---
  function updatePrintTemplate() {
    const elPrintStudentInfo = document.getElementById('print-student-info');
    const elPrintOverallSummary = document.getElementById('print-overall-summary');
    const elPrintSubjectsTbody = document.getElementById('print-subjects-tbody');
    const elPrintDateTime = document.getElementById('print-date-time');
    const elPrintTargetPct = document.getElementById('print-target-pct');

    const R = Number(appState.requiredTarget) || 75;
    if (elPrintTargetPct) elPrintTargetPct.textContent = R;
    if (elPrintDateTime) elPrintDateTime.textContent = new Date().toLocaleString();

    if (elPrintStudentInfo) {
      elPrintStudentInfo.innerHTML = `
        <div><strong>Student Name:</strong> ${escapeHtml(appState.student.name || 'N/A')}</div>
        <div><strong>Roll Number / UID:</strong> ${escapeHtml(appState.student.roll || 'N/A')}</div>
        <div><strong>College:</strong> ${escapeHtml(appState.student.college || 'N/A')}</div>
        <div><strong>Branch / Dept:</strong> ${escapeHtml(appState.student.department || 'N/A')} (${escapeHtml(appState.student.semester || 'N/A')})</div>
      `;
    }

    let totalAttended = 0;
    let totalAbsent = 0;
    let totalConducted = 0;
    let totalFutAtt = 0;
    let totalFutMiss = 0;

    let rowsHtml = '';
    appState.subjects.forEach((sub, i) => {
      const att = Number(sub.attended) || 0;
      const tot = Number(sub.totalConducted) || 0;
      const abs = Math.max(0, tot - att);
      const futAtt = Number(sub.futureAttended) || 0;
      const futMiss = Number(sub.futureMissed) || 0;

      totalAttended += att;
      totalAbsent += abs;
      totalConducted += tot;
      totalFutAtt += futAtt;
      totalFutMiss += futMiss;

      const currPct = calcCurrentPct(att, tot);
      const predPct = calcPredictedPct(att, tot, futAtt, futMiss);
      const needed = calcClassesNeeded(att, tot, R);
      const safeBunks = calcSafeBunks(att, tot, R);

      let actionText = 'On Track';
      if (tot > 0) {
        if (currPct >= R) {
          actionText = safeBunks > 0 ? `Safe (+${safeBunks} bunks)` : `Safe (Borderline)`;
        } else {
          actionText = needed === Infinity ? `Shortage (Cannot meet 100%)` : `Shortage (Need +${needed} classes)`;
        }
      }

      rowsHtml += `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(sub.name)}</td>
          <td>${tot}</td>
          <td>${att}</td>
          <td>${abs}</td>
          <td><strong>${currPct.toFixed(2)}%</strong></td>
          <td>+${futAtt}</td>
          <td>+${futMiss}</td>
          <td><strong>${predPct.toFixed(2)}%</strong></td>
          <td>${actionText}</td>
        </tr>
      `;
    });

    if (elPrintSubjectsTbody) elPrintSubjectsTbody.innerHTML = rowsHtml;

    const overallCurrentPct = totalConducted > 0 ? ((totalAttended / totalConducted) * 100) : 0;
    const combinedTotal = totalConducted + totalFutAtt + totalFutMiss;
    const combinedAttended = totalAttended + totalFutAtt;
    const overallPredictedPct = combinedTotal > 0 ? ((combinedAttended / combinedTotal) * 100) : 0;

    if (elPrintOverallSummary) {
      elPrintOverallSummary.innerHTML = `
        <div><div>Total Conducted</div><strong>${totalConducted}</strong></div>
        <div><div>Total Attended</div><strong>${totalAttended}</strong></div>
        <div><div>Current Overall %</div><strong>${overallCurrentPct.toFixed(2)}%</strong></div>
        <div><div>Predicted Overall %</div><strong>${overallPredictedPct.toFixed(2)}%</strong></div>
      `;
    }
  }

  // --- STEP-BY-STEP CALCULATION MODAL EXPLAINER ---
  function showSubjectStepMath(subjectId) {
    const sub = appState.subjects.find(s => s.id === subjectId);
    if (!sub) return;

    const R = Number(appState.requiredTarget) || 75;
    const att = Number(sub.attended) || 0;
    const tot = Number(sub.totalConducted) || 0;
    const abs = Math.max(0, tot - att);
    const futAtt = Number(sub.futureAttended) || 0;
    const futMiss = Number(sub.futureMissed) || 0;

    const currentPct = calcCurrentPct(att, tot);
    const predPct = calcPredictedPct(att, tot, futAtt, futMiss);
    const needed = calcClassesNeeded(att, tot, R);
    const safeBunks = calcSafeBunks(att, tot, R);

    elModalSubjectTitle.textContent = `${sub.name} - Exact Math Breakdown`;

    const futConducted = futAtt + futMiss;
    const newTotal = tot + futConducted;
    const newAttended = att + futAtt;

    elModalContent.innerHTML = `
      <div class="step-card">
        <div class="step-title"><i data-lucide="check"></i> 1. Verification of Total Classes</div>
        <div class="step-calc">Total (${tot}) = Attended (${att}) + Absent (${abs})</div>
        <div class="step-expl">Verified: Conducted count is precisely equal to attended plus missed hours.</div>
      </div>

      <div class="step-card">
        <div class="step-title"><i data-lucide="percent"></i> 2. Current Attendance % Formula</div>
        <div class="step-calc">Current % = (Attended / Total) &times; 100 = (${att} / ${tot || 1}) &times; 100 = <strong>${currentPct.toFixed(2)}%</strong></div>
        <div class="step-expl">Your current standing is <strong>${currentPct >= R ? 'ABOVE' : 'BELOW'}</strong> the required target of ${R}%.</div>
      </div>

      <div class="step-card">
        <div class="step-title"><i data-lucide="sparkles"></i> 3. Predicted Attendance (Future Simulator)</div>
        <div class="step-calc">Future % = ((${att} + ${futAtt}) / (${tot} + ${futAtt} + ${futMiss})) &times; 100 = (${newAttended} / ${newTotal || 1}) &times; 100 = <strong>${predPct.toFixed(2)}%</strong></div>
        <div class="step-expl">After attending ${futAtt} upcoming classes and missing ${futMiss}, your attendance shifts from ${currentPct.toFixed(2)}% to <strong>${predPct.toFixed(2)}%</strong>.</div>
      </div>

      <div class="step-card">
        <div class="step-title"><i data-lucide="target"></i> 4. Target Action Recommendation (${R}%)</div>
        ${
          currentPct >= R
            ? `<div class="step-calc">Safe Misses Allowed (y) = floor((100 &times; ${att} - ${R} &times; ${tot}) / ${R}) = <strong>${safeBunks} classes</strong></div>
               <div class="step-expl text-success">You can safely bunk up to ${safeBunks} class${safeBunks === 1 ? '' : 'es'} without dropping below ${R}%.</div>`
            : `<div class="step-calc">Classes Needed Continuously (x) = ceil((${R} &times; ${tot} - 100 &times; ${att}) / (100 - ${R})) = <strong>${needed === Infinity ? 'N/A' : needed + ' classes'}</strong></div>
               <div class="step-expl text-danger">You must attend the next ${needed} classes consecutively without missing any to restore ${R}% attendance.</div>`
        }
      </div>
    `;

    elCalcModal.style.display = 'flex';
    refreshLucideIcons();
  }

  function closeModal() {
    elCalcModal.style.display = 'none';
  }

  // --- EVENT HANDLERS & BINDINGS ---
  function bindEvents() {
    // Theme toggle
    if (elBtnThemeToggle) {
      elBtnThemeToggle.addEventListener('click', toggleTheme);
    }

    // Student profile inputs
    if (elStudentName) {
      elStudentName.addEventListener('input', (e) => {
        appState.student.name = e.target.value;
        saveStateToStorage();
        updatePrintTemplate();
      });
    }
    if (elStudentRoll) {
      elStudentRoll.addEventListener('input', (e) => {
        appState.student.roll = e.target.value;
        saveStateToStorage();
        updatePrintTemplate();
      });
    }
    if (elCollegeName) {
      elCollegeName.addEventListener('input', (e) => {
        appState.student.college = e.target.value;
        saveStateToStorage();
        updatePrintTemplate();
      });
    }
    if (elDepartmentName) {
      elDepartmentName.addEventListener('input', (e) => {
        appState.student.department = e.target.value;
        saveStateToStorage();
        updatePrintTemplate();
      });
    }
    if (elSemesterVal) {
      elSemesterVal.addEventListener('change', (e) => {
        appState.student.semester = e.target.value;
        saveStateToStorage();
        updatePrintTemplate();
      });
    }

    // Toggle Profile Section
    if (elBtnToggleProfile) {
      elBtnToggleProfile.addEventListener('click', () => {
        const isHidden = elProfileFields.style.display === 'none';
        elProfileFields.style.display = isHidden ? 'grid' : 'none';
        elProfileChevron.setAttribute('data-lucide', isHidden ? 'chevron-up' : 'chevron-down');
        refreshLucideIcons();
      });
    }

    // Toggle Formula Explainer Section
    if (elExplainerHeader) {
      elExplainerHeader.addEventListener('click', () => {
        const isHidden = elExplainerContent.style.display === 'none';
        elExplainerContent.style.display = isHidden ? 'block' : 'none';
        elExplainerChevron.setAttribute('data-lucide', isHidden ? 'chevron-up' : 'chevron-down');
        refreshLucideIcons();
      });
    }

    // Required target input
    if (elRequiredTarget) {
      elRequiredTarget.addEventListener('input', (e) => {
        let val = Number(e.target.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 100) val = 100;
        appState.requiredTarget = val;
        syncTargetPresetButtons(val);
        saveStateToStorage();
        renderAll();
      });
    }

    // Required target preset chips
    elTargetPresets.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = Number(btn.getAttribute('data-target'));
        appState.requiredTarget = target;
        if (elRequiredTarget) elRequiredTarget.value = target;
        syncTargetPresetButtons(target);
        saveStateToStorage();
        renderAll();
        showToast(`Target attendance set to ${target}%`, 'info');
      });
    });

    // Add Subject Button
    if (elBtnAddSubject) {
      elBtnAddSubject.addEventListener('click', () => addNewSubject());
    }

    // Empty state Add button
    const btnEmptyAdd = document.getElementById('btn-empty-add');
    if (btnEmptyAdd) {
      btnEmptyAdd.addEventListener('click', () => addNewSubject());
    }

    // Load Demo Buttons
    if (elBtnLoadDemo) {
      elBtnLoadDemo.addEventListener('click', () => loadDemoData());
    }
    const btnEmptyDemo = document.getElementById('btn-empty-demo');
    if (btnEmptyDemo) {
      btnEmptyDemo.addEventListener('click', () => loadDemoData());
    }

    // Reset Button
    if (elBtnReset) {
      elBtnReset.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all subjects and student details?')) {
          appState.subjects = [];
          appState.student = {
            name: '',
            roll: '',
            college: '',
            department: 'B.Tech CSE',
            semester: 'Semester 6'
          };
          if (elStudentName) elStudentName.value = '';
          if (elStudentRoll) elStudentRoll.value = '';
          if (elCollegeName) elCollegeName.value = '';
          saveStateToStorage();
          renderAll();
          showToast('All data has been reset', 'warning');
        }
      });
    }

    // Print / Save Button
    if (elBtnPrint) {
      elBtnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Recalculate Button (also serves as explicit manual trigger)
    if (elBtnRecalculate) {
      elBtnRecalculate.addEventListener('click', () => {
        renderAll();
        showToast('Attendance statistics re-calculated successfully', 'success');
      });
    }

    // Toggle All Future Simulators
    if (elBtnToggleFutureAll) {
      elBtnToggleFutureAll.addEventListener('click', () => {
        appState.globalFutureVisible = !appState.globalFutureVisible;
        appState.subjects.forEach(s => s.showFuture = appState.globalFutureVisible);
        elFutureToggleText.textContent = appState.globalFutureVisible ? 'Hide Future Classes' : 'Add Future Classes';
        saveStateToStorage();
        renderSubjectCards();
        refreshLucideIcons();
      });
    }

    // Quick Add CSE Subject Chips
    const quickChips = document.querySelectorAll('#quick-subject-chips .chip');
    quickChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const subName = chip.getAttribute('data-name');
        addNewSubject(subName);
      });
    });

    // Subject Container Event Delegation (for live edits & steppers)
    if (elSubjectsContainer) {
      elSubjectsContainer.addEventListener('click', handleSubjectContainerClick);
      elSubjectsContainer.addEventListener('input', handleSubjectContainerInput);
    }

    // Modal close bindings
    if (elBtnCloseModal) elBtnCloseModal.addEventListener('click', closeModal);
    if (elBtnModalDone) elBtnModalDone.addEventListener('click', closeModal);
    if (elCalcModal) {
      elCalcModal.addEventListener('click', (e) => {
        if (e.target === elCalcModal) closeModal();
      });
    }

    // Keyboard Shortcuts (e.g. Esc to close modal)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elCalcModal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  function syncTargetPresetButtons(target) {
    elTargetPresets.forEach(btn => {
      const bTarget = Number(btn.getAttribute('data-target'));
      if (bTarget === target) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- SUBJECT DELEGATION ACTIONS ---

  function handleSubjectContainerClick(e) {
    const btn = e.target.closest('button');
    if (!btn) return;

    const subId = btn.getAttribute('data-id');

    // Delete Subject
    if (btn.classList.contains('btn-delete-sub')) {
      e.stopPropagation();
      appState.subjects = appState.subjects.filter(s => s.id !== subId);
      saveStateToStorage();
      renderAll();
      showToast('Subject removed', 'warning');
      return;
    }

    // Duplicate Subject
    if (btn.classList.contains('btn-duplicate-sub')) {
      e.stopPropagation();
      const orig = appState.subjects.find(s => s.id === subId);
      if (orig) {
        const duplicate = JSON.parse(JSON.stringify(orig));
        duplicate.id = 'sub-' + Date.now();
        duplicate.name = duplicate.name + ' (Copy)';
        appState.subjects.push(duplicate);
        saveStateToStorage();
        renderAll();
        showToast(`Duplicated "${orig.name}"`, 'success');
      }
      return;
    }

    // Inspect Math Modal
    if (btn.classList.contains('btn-inspect-math')) {
      e.stopPropagation();
      showSubjectStepMath(subId);
      return;
    }

    // Stepper Plus/Minus Buttons
    if (btn.classList.contains('btn-step')) {
      const action = btn.getAttribute('data-action');
      const field = btn.getAttribute('data-field');
      handleStepper(subId, field, action);
    }
  }

  function handleStepper(subId, field, action) {
    const sub = appState.subjects.find(s => s.id === subId);
    if (!sub) return;

    const delta = action === 'inc' ? 1 : -1;

    if (field === 'total') {
      const newTotal = Math.max(0, sub.totalConducted + delta);
      sub.totalConducted = newTotal;
      // Keep attended within bounds
      if (sub.attended > newTotal) sub.attended = newTotal;
      sub.absent = Math.max(0, newTotal - sub.attended);
    } else if (field === 'attended') {
      const newAtt = Math.max(0, sub.attended + delta);
      if (action === 'inc' && newAtt > sub.totalConducted) {
        // Incrementing attended above total automatically bumps total by 1
        sub.totalConducted = newAtt;
      }
      sub.attended = newAtt;
      sub.absent = Math.max(0, sub.totalConducted - sub.attended);
    } else if (field === 'absent') {
      const newAbs = Math.max(0, sub.absent + delta);
      if (action === 'inc' && newAbs > sub.totalConducted - sub.attended) {
        // Bumping absent increases total classes conducted
        sub.totalConducted = sub.attended + newAbs;
      } else if (action === 'dec') {
        // Decrementing absent decreases total classes conducted
        sub.totalConducted = Math.max(sub.attended, sub.totalConducted - 1);
      }
      sub.absent = Math.max(0, sub.totalConducted - sub.attended);
    } else if (field === 'futureAttended') {
      sub.futureAttended = Math.max(0, sub.futureAttended + delta);
    } else if (field === 'futureMissed') {
      sub.futureMissed = Math.max(0, sub.futureMissed + delta);
    }

    saveStateToStorage();
    renderAll();
  }

  function handleSubjectContainerInput(e) {
    const input = e.target;
    const subId = input.getAttribute('data-id');
    const field = input.getAttribute('data-field');
    if (!subId || !field) return;

    const sub = appState.subjects.find(s => s.id === subId);
    if (!sub) return;

    if (field === 'name') {
      sub.name = input.value;
      saveStateToStorage();
      updatePrintTemplate();
      return;
    }

    const val = parseInt(input.value, 10);
    const safeVal = isNaN(val) ? 0 : Math.max(0, val);

    if (field === 'totalConducted') {
      sub.totalConducted = safeVal;
      if (sub.attended > safeVal) sub.attended = safeVal;
      sub.absent = Math.max(0, safeVal - sub.attended);
    } else if (field === 'attended') {
      sub.attended = safeVal;
      if (safeVal > sub.totalConducted) {
        sub.totalConducted = safeVal;
      }
      sub.absent = Math.max(0, sub.totalConducted - sub.attended);
    } else if (field === 'absent') {
      sub.absent = safeVal;
      sub.totalConducted = sub.attended + safeVal;
    } else if (field === 'futureAttended') {
      sub.futureAttended = safeVal;
    } else if (field === 'futureMissed') {
      sub.futureMissed = safeVal;
    }

    saveStateToStorage();
    renderAll();
  }

  // --- ACTIONS: ADD SUBJECT & DEMO LOADER ---

  function addNewSubject(customName) {
    const newId = 'sub-' + Date.now();
    const name = customName || `Subject ${appState.subjects.length + 1}`;
    appState.subjects.push({
      id: newId,
      name: name,
      totalConducted: 0,
      attended: 0,
      absent: 0,
      futureAttended: 0,
      futureMissed: 0,
      showFuture: appState.globalFutureVisible
    });

    saveStateToStorage();
    renderAll();
    showToast(`Added "${name}"`, 'success');

    // Auto focus the title of the newly created card
    setTimeout(() => {
      const card = document.querySelector(`.subject-card[data-id="${newId}"] .subject-title-input`);
      if (card) {
        card.focus();
        card.select();
      }
    }, 100);
  }

  function loadDemoData() {
    appState.subjects = JSON.parse(JSON.stringify(DEFAULT_CSE_SUBJECTS));
    appState.student = {
      name: 'Alex Sharma',
      roll: '21BCSE1042',
      college: 'National Institute of Technology',
      department: 'B.Tech - Computer Science & Engineering',
      semester: 'Semester 6'
    };
    appState.requiredTarget = 75;

    if (elStudentName) elStudentName.value = appState.student.name;
    if (elStudentRoll) elStudentRoll.value = appState.student.roll;
    if (elCollegeName) elCollegeName.value = appState.student.college;
    if (elDepartmentName) elDepartmentName.value = appState.student.department;
    if (elSemesterVal) elSemesterVal.value = appState.student.semester;
    if (elRequiredTarget) elRequiredTarget.value = 75;
    syncTargetPresetButtons(75);

    saveStateToStorage();
    renderAll();
    showToast('Loaded B.Tech CSE sample subjects & Data Structures example', 'success');
  }

  // --- HELPER UTILITIES ---

  function refreshLucideIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'danger') iconName = 'alert-octagon';

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    refreshLucideIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
