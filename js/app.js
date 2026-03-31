// ═══ CompliFlow 앱 로직 ═══

// ═══════════════════════════════════════════════
// MODAL RENDERING
// ═══════════════════════════════════════════════

function openProcessModal(taskId) {
  const proc = PROCESS_DB[taskId];
  if (!proc) {
    alert('이 업무의 세부 프로세스는 아직 준비 중입니다.');
    return;
  }

  document.getElementById('modal-title').textContent = proc.title;
  const body = document.getElementById('modal-body');
  let html = '';

  if (proc.updated) {
    html += `<div style="font-size:11px;color:var(--text3);margin-bottom:16px">최종 업데이트: ${proc.updated}</div>`;
  }

  proc.sections.forEach(sec => {
    html += `<div class="proc-section">`;
    html += `<div class="proc-section-title">${sec.title}</div>`;

    if (sec.type === 'steps') {
      sec.items.forEach((item, i) => {
        html += `
          <div class="proc-step">
            <div class="proc-step-num">${i+1}</div>
            <div class="proc-step-content">
              <div class="proc-step-title">${item.title}</div>
              <div class="proc-step-desc">${item.desc}</div>
            </div>
          </div>`;
      });
    }

    else if (sec.type === 'docs') {
      html += '<div class="proc-docs">';
      sec.items.forEach(doc => {
        const whoMap = {
          company:    { label: '회사',          cls: 'who-company' },
          director:   { label: '이사/감사',     cls: 'who-director' },
          shareholder:{ label: '주주',          cls: 'who-shareholder' },
          lawfirm:    { label: '법무사/법무법인',cls: 'who-lawfirm' },
          auditor:    { label: '감사인/회계법인',cls: 'who-auditor' },
        };
        const w = whoMap[doc.who] || { label: doc.who, cls: 'who-company' };
        html += `
          <div class="proc-doc-card">
            <span class="proc-doc-who ${w.cls}">${w.label}</span>
            <div class="proc-doc-name">${doc.name}</div>
            ${doc.note ? `<div class="proc-doc-note">${doc.note}</div>` : ''}
          </div>`;
      });
      html += '</div>';
    }

    else if (sec.type === 'lawfirm') {
      sec.items.forEach((item, i) => {
        html += `
          <div class="proc-step">
            <div class="proc-step-num" style="background:var(--amber)">${i+1}</div>
            <div class="proc-step-content">
              <div class="proc-step-title">${item.title}</div>
              <div class="proc-step-desc">${item.desc}</div>
            </div>
          </div>`;
      });
    }

    else if (sec.type === 'tips') {
      sec.items.forEach(tip => {
        html += `<div class="proc-tip">${tip}</div>`;
      });
    }

    html += '</div>';
  });

  body.innerHTML = html;
  document.getElementById('proc-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('proc-modal').classList.remove('open');
  document.body.style.overflow = '';
}


// ═══════════════════════════════════════════════
// DATE CALCULATION
// ═══════════════════════════════════════════════

function calcDate(task, pf, exceptions = {}) {
  let base;
  if (task.dBase === 'R') {
    base = new Date(pf.fyDate);
  } else {
    base = new Date(pf.agmDate);
  }
  let offset = task.dOffset;

  if (task.exceptionToggle && exceptions[task.exceptionToggle.id]) {
    if (task.exceptionToggle.shortDays) {
      offset += task.exceptionToggle.shortDays;
    }
  }
  if (task.id === 't13' && exceptions['ex_short_notice']) {
    offset = -10;
  }

  const d = new Date(base);
  d.setDate(d.getDate() + offset);
  return d;
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  const dow = ['일','월','화','수','목','금','토'][d.getDay()];
  return `${y}.${m}.${dd} (${dow})`;
}

function formatMonth(d) {
  return `${d.getFullYear()}년 ${d.getMonth()+1}월`;
}

function refDayLabel(task, exceptions) {
  const base = task.dBase;
  let offset = task.dOffset;
  if (task.exceptionToggle && exceptions && exceptions[task.exceptionToggle.id]) {
    if (task.exceptionToggle.shortDays) offset += task.exceptionToggle.shortDays;
  }
  if (task.id === 't13' && exceptions && exceptions['ex_short_notice']) offset = -10;

  const code = base;
  if (offset === 0) return `${code}-Day`;
  if (offset > 0) return `${code}+${offset}`;
  return `${code}${offset}`;
}

function todayDday(d) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(d);
  target.setHours(0,0,0,0);
  const diff = Math.round((target - today) / 86400000);
  if (diff === 0) return '오늘';
  if (diff > 0) return `${diff}일 후`;
  return `${Math.abs(diff)}일 전`;
}


// ═══════════════════════════════════════════════
// MEETING TYPE UI
// ═══════════════════════════════════════════════

const MEETING_TYPE_META = {
  agm: {
    hint: '정기주총: 사업연도 종료 후 3개월 이내 개최. 재무제표 승인, 임원선임 등 연간 법정 의결 처리.',
    dateLabel: '정기주총 예정일',
    dateHint: '이사회 결의 후 확정 (예: 2026-03-27)',
    fyLabel: '결산일',
    fyHint: '사업연도 말일 (예: 2025-12-31)',
    agendaTitle: '정기주총 안건 설정',
    agendaDesc: '이번 정기주총에서 처리할 안건을 선택하세요. 선택한 안건에 따라 추가 업무와 후속 절차가 자동으로 반영됩니다.',
    timelineTitle: '정기주주총회 업무 타임라인',
    dDayLabel: '주총일 (D-day)',
    rDayLabel: '결산일 (Reference)',
  },
  egm: {
    hint: '임시주총: 긴급 안건(정관 변경, 임원 선임 등) 처리를 위해 수시 소집. 공고·통지 절차는 정기주총과 동일.',
    dateLabel: '임시주총 예정일',
    dateHint: '이사회 소집결의 후 확정',
    fyLabel: '최근 결산일 (세무 일정 계산용)',
    fyHint: '직전 사업연도 말일 (예: 2025-12-31)',
    agendaTitle: '임시주총 안건 설정',
    agendaDesc: '임시주주총회에서 처리할 안건을 선택하세요. 재무제표 승인은 임시주총 대상이 아닙니다.',
    timelineTitle: '임시주주총회 업무 타임라인',
    dDayLabel: '임시주총일 (D-day)',
    rDayLabel: '최근 결산일 (R)',
  },
  bod: {
    hint: '이사회만: 주주총회 없이 이사회 결의만으로 처리 가능한 사항. 대표이사 선임, 자기거래 승인, 중요 계약 등.',
    dateLabel: '이사회 예정일',
    dateHint: '이사회 개최 예정일',
    fyLabel: '최근 결산일 (세무 일정 계산용, 선택)',
    fyHint: '직전 사업연도 말일 (선택사항)',
    agendaTitle: '이사회 안건 설정',
    agendaDesc: '이번 이사회에서 처리할 안건을 선택하세요.',
    timelineTitle: '이사회 업무 타임라인',
    dDayLabel: '이사회일 (D-day)',
    rDayLabel: '최근 결산일 (R)',
  },
};

function getMeetingType() {
  return getOptValue('pf-meeting-type') || 'agm';
}

function updateMeetingTypeUI() {
  const mt = getMeetingType();
  const meta = MEETING_TYPE_META[mt];
  const isBOD = mt === 'bod';
  const isGSM = !isBOD;

  // Hint text
  document.getElementById('meeting-type-hint').textContent = meta.hint;

  // Date labels
  document.getElementById('meeting-date-label').innerHTML = `${meta.dateLabel} <span class="required">*</span>`;
  document.getElementById('meeting-date-hint').textContent = meta.dateHint;
  document.getElementById('fy-date-label').innerHTML = isBOD
    ? `${meta.fyLabel}`
    : `${meta.fyLabel} <span class="required">*</span>`;
  document.getElementById('fy-date-hint').textContent = meta.fyHint;

  // Schedule option group visibility
  document.getElementById('gsm-schedule-group').style.display = isGSM ? '' : 'none';
  // BOD schedule group always visible

  // Reset GSM schedule to 'normal' when switching to BOD (and vice versa keeps state)
  if (isBOD) {
    const gsmGroup = document.querySelector('.opt-group[data-field="pf-gsm-schedule"]');
    if (gsmGroup) {
      gsmGroup.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
      gsmGroup.querySelector('[data-value="normal"]').classList.add('selected');
    }
  }

  updateScheduleHints();

  // Agenda section visibility
  document.getElementById('agenda-gsm-ordinary-section').style.display = isGSM ? '' : 'none';
  document.getElementById('agenda-gsm-special-section').style.display  = isGSM ? '' : 'none';

  initAgenda();
}

// 소집일정 옵션별 안내 문구 및 UI 업데이트
const SCHEDULE_HINTS = {
  gsm: {
    normal:        '법정 소집통지 기간: 주총일 2주 전 (상법 §363①). 상장사는 자본시장법에 의해 2주 단축 불가.',
    short_charter: '정관으로 10일 전으로 단축 (상법 §363① 단서). 비상장 + 자본금 10억 미만 회사에만 허용.',
    unanimous:     '주주 전원 동의 시 소집통지 생략 가능 (상법 §363④). 전원 동의서 서면 징구 필요. 소집결정 이사회와 서류비치 의무는 별도 이행 권장.',
  },
  bod: {
    normal:        '법정 소집통지 기간: 7일 전 (상법 §390②). 각 이사 및 감사에게 서면·전자 통지.',
    short_charter: '정관으로 7일 미만으로 단축 가능 (상법 §390② 단서). 회사 규모·상장 여부 무관하게 허용. 아래에 정관상 기간을 입력하세요.',
    unanimous:     '이사 전원의 동의 시 소집절차(통지) 생략 후 즉시 개최 가능 (상법 §390③). 동의 확인 서면 보관 권장.',
  },
};

function updateScheduleHints() {
  const gsmSched = getOptValue('pf-gsm-schedule') || 'normal';
  const bodSched = getOptValue('pf-bod-schedule') || 'normal';

  const gsmHintEl = document.getElementById('gsm-schedule-hint');
  if (gsmHintEl) gsmHintEl.textContent = SCHEDULE_HINTS.gsm[gsmSched] || '';

  const bodHintEl = document.getElementById('bod-schedule-hint');
  if (bodHintEl) bodHintEl.textContent = SCHEDULE_HINTS.bod[bodSched] || '';

  // 정관 단축 일수 입력란 표시/숨김
  const bodCharterRow = document.getElementById('bod-charter-days-row');
  if (bodCharterRow) bodCharterRow.style.display = bodSched === 'short_charter' ? 'block' : 'none';
}


// ═══════════════════════════════════════════════
// UI LOGIC
// ═══════════════════════════════════════════════

let currentStep = 0;
let currentExceptions = {};
let currentTasks = [];
let currentProfile = {};

function goStep(n) {
  if (n === 2) {
    const mt = getMeetingType();
    const isBOD = mt === 'bod';

    // Required profile fields
    const alwaysRequired = ['pf-listing', 'pf-type', 'pf-asset'];
    const gsmRequired    = ['pf-audit', 'pf-auditor-type'];
    const required = isBOD ? alwaysRequired : [...alwaysRequired, ...gsmRequired];

    for (const field of required) {
      if (!getOptValue(field)) {
        const group = document.querySelector(`.opt-group[data-field="${field}"]`);
        if (group) group.style.outline = '2px solid var(--red)';
        setTimeout(() => { if (group) group.style.outline = ''; }, 2000);
        alert('필수 항목을 모두 선택해주세요.');
        return;
      }
    }

    const meetingDate = document.getElementById('pf-agm-date').value;
    const fyDate = document.getElementById('pf-fy-date').value;
    if (!meetingDate) {
      alert(`${MEETING_TYPE_META[mt].dateLabel}을 입력해주세요.`);
      return;
    }
    if (!isBOD && !fyDate) {
      alert('결산일을 입력해주세요.');
      return;
    }

    // Refresh agenda rendering with current meeting type
    initAgenda();
  }

  currentStep = n;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-'+n).classList.add('active');
  document.querySelectorAll('.step').forEach(s => {
    const sn = +s.dataset.step;
    s.classList.remove('active','done');
    if (sn === n) s.classList.add('active');
    else if (sn < n) s.classList.add('done');
  });
  window.scrollTo({top:0,behavior:'smooth'});
}

// Initialize agenda checkboxes
function initAgenda() {
  const mt = getMeetingType();
  const meta = MEETING_TYPE_META[mt];
  const isBOD = mt === 'bod';
  const isEGM = mt === 'egm';

  // Update Step 2 texts
  const titleEl = document.getElementById('agenda-step-title');
  const descEl  = document.getElementById('agenda-step-desc');
  if (titleEl) titleEl.textContent = meta.agendaTitle;
  if (descEl)  descEl.textContent  = meta.agendaDesc;

  // Section visibility
  document.getElementById('agenda-gsm-ordinary-section').style.display = isBOD ? 'none' : '';
  document.getElementById('agenda-gsm-special-section').style.display  = isBOD ? 'none' : '';
  document.getElementById('agenda-bod-section').style.display = 'block';

  // BOD agendas (always rendered)
  renderCheckboxGroup('agenda-bod', AGENDA_BOD);

  // GSM agendas (filtered for EGM: agmOnly items not forced-checked)
  if (!isBOD) {
    const ordinaryItems = AGENDA_GSM_ORDINARY.map(item => {
      if (item.agmOnly && isEGM) {
        return { ...item, checked: false, always: false };
      }
      return item;
    });
    renderCheckboxGroup('agenda-gsm-ordinary', ordinaryItems);
    renderCheckboxGroup('agenda-gsm-special', AGENDA_GSM_SPECIAL);
  }
}

function renderCheckboxGroup(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(it => `
    <label class="checkbox-item ${it.checked?'checked':''}" data-id="${it.id}">
      <input type="checkbox" ${it.checked?'checked':''} ${it.always?'disabled':''} value="${it.id}" onchange="this.parentElement.classList.toggle('checked',this.checked)">
      <div class="cb-content">
        <div class="cb-title">${it.title}</div>
        <div class="cb-desc">${it.desc}</div>
      </div>
    </label>
  `).join('');
}

function getSelectedAgendas() {
  const checks = document.querySelectorAll('#panel-2 input[type="checkbox"]:checked');
  return Array.from(checks).map(c => c.value);
}

function selectOpt(btn) {
  const group = btn.parentElement;
  group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function getOptValue(field) {
  const group = document.querySelector(`.opt-group[data-field="${field}"]`);
  if (!group) return '';
  const sel = group.querySelector('.opt-btn.selected');
  return sel ? sel.dataset.value : '';
}

function getProfile() {
  const mt = getMeetingType();
  const fyDate = document.getElementById('pf-fy-date').value;
  const bodCharterDaysEl = document.getElementById('pf-bod-charter-days');
  return {
    meetingType:     mt,
    listing:         getOptValue('pf-listing'),
    audit:           getOptValue('pf-audit'),
    type:            getOptValue('pf-type'),
    asset:           getOptValue('pf-asset'),
    fy:              getOptValue('pf-fy'),
    auditorType:     getOptValue('pf-auditor-type'),
    conglomerate:    getOptValue('pf-conglomerate'),
    holding:         getOptValue('pf-holding'),
    finance:         getOptValue('pf-finance'),
    foreign:         getOptValue('pf-foreign'),
    fyDate:          fyDate || document.getElementById('pf-agm-date').value,
    agmDate:         document.getElementById('pf-agm-date').value,
    gsmSchedule:     getOptValue('pf-gsm-schedule') || 'normal',
    bodSchedule:     getOptValue('pf-bod-schedule') || 'normal',
    bodCharterDays:  bodCharterDaysEl ? (parseInt(bodCharterDaysEl.value) || 3) : 3,
  };
}

function generateTimeline() {
  currentProfile  = getProfile();
  const agendas   = getSelectedAgendas();
  currentExceptions = {};
  currentTasks    = buildTasks(currentProfile, agendas);
  goStep(3);
  renderTimeline();
}

function renderTimeline() {
  const pf   = currentProfile;
  const tasks = currentTasks;
  const mt   = pf.meetingType || 'agm';
  const meta = MEETING_TYPE_META[mt];

  // Step 3 title
  const tlTitle = document.getElementById('timeline-step-title');
  if (tlTitle) tlTitle.textContent = meta.timelineTitle;

  // Profile summary
  const labels = {
    listing:     { kospi:'코스피 상장', kosdaq:'코스닥 상장', private:'비상장' },
    audit:       { yes:'외감 대상', no:'외감 비대상' },
    asset:       { under100b:'1천억 미만', '100b-2t':'1천억~2조', over2t:'2조 이상' },
    auditorType: { auditor:'감사', committee:'감사위원회' },
    meetingType: { agm:'정기주주총회', egm:'임시주주총회', bod:'이사회' },
  };

  const summaryItems = [
    { l:'회의 유형',  v: labels.meetingType[mt] || mt },
    { l:'상장 여부',  v: labels.listing[pf.listing] || '-' },
    { l:'자산 규모',  v: labels.asset[pf.asset] || '-' },
    { l:'감사기구',   v: labels.auditorType[pf.auditorType] || '-' },
    { l:'결산일',     v: pf.fyDate || '-' },
    { l: mt === 'bod' ? '이사회 예정일' : mt === 'egm' ? '임시주총 예정일' : '주총 예정일', v: pf.agmDate },
    ...(mt !== 'bod' ? [{ l:'주총 소집기간', v: { normal:'법정 2주', short_charter:'정관 단축 10일', unanimous:'주주 전원 동의' }[pf.gsmSchedule] || '-' }] : []),
    { l:'이사회 소집기간', v: { normal:'법정 7일', short_charter:`정관 단축 ${pf.bodCharterDays}일`, unanimous:'이사 전원 동의' }[pf.bodSchedule] || '-' },
  ];

  document.getElementById('profile-summary').innerHTML = summaryItems
    .map(s => `<div class="summary-item"><div class="si-label">${s.l}</div><div class="si-value">${s.v}</div></div>`)
    .join('');

  // Reference day legend
  const refLegend = document.getElementById('ref-day-legend');
  if (refLegend) refLegend.remove();
  const legendEl = document.createElement('div');
  legendEl.id = 'ref-day-legend';
  legendEl.innerHTML = `
    <div class="ref-legend">
      <div class="ref-legend-title">기준일 범례</div>
      <div class="ref-legend-items">
        <div class="ref-legend-item">
          <span class="ref-code ref-R">R</span>
          <div>
            <div class="ref-name">${meta.rDayLabel}</div>
            <div class="ref-date">${pf.fyDate ? formatDate(new Date(pf.fyDate)) : '-'}</div>
          </div>
        </div>
        <div class="ref-legend-item">
          <span class="ref-code ref-D">D</span>
          <div>
            <div class="ref-name">${meta.dDayLabel}</div>
            <div class="ref-date">${formatDate(new Date(pf.agmDate))}</div>
          </div>
        </div>
      </div>
      <div class="ref-legend-help">각 업무의 기한은 기준일로부터의 상대일수로 표기됩니다. 예) R+90 = 결산일로부터 90일 후, D-14 = 주총·이사회일 14일 전</div>
    </div>
  `;
  document.getElementById('profile-summary').after(legendEl);

  // Stats
  document.getElementById('stat-bar').innerHTML = `
    <div class="stat-box"><div class="stat-num">${tasks.length}</div><div class="stat-label">전체 업무</div></div>
    <div class="stat-box"><div class="stat-num">${tasks.filter(t=>t.tags.includes('필수')).length}</div><div class="stat-label">필수 업무</div></div>
    <div class="stat-box"><div class="stat-num">${tasks.filter(t=>t.tags.includes('등기')).length}</div><div class="stat-label">등기 사항</div></div>
    <div class="stat-box"><div class="stat-num">${tasks.filter(t=>t.tags.includes('공시')).length}</div><div class="stat-label">공시 사항</div></div>
    <div class="stat-box"><div class="stat-num">${tasks.filter(t=>t.tags.includes('신고')).length}</div><div class="stat-label">신고 사항</div></div>
  `;

  // Filter buttons
  const categories = [...new Set(tasks.map(t => t.category))];
  const allCats = ['전체', ...categories];
  document.getElementById('tl-filter').innerHTML = allCats
    .map(c => `<button class="tl-filter-btn ${c==='전체'?'active':''}" onclick="filterTimeline(this,'${c}')">${c}</button>`)
    .join('');

  renderTasks(tasks);
}

function renderTasks(tasks, filterCat='전체') {
  const pf   = currentProfile;
  const tlEl = document.getElementById('timeline');

  const groups = {};
  tasks.forEach(t => {
    if (filterCat !== '전체' && t.category !== filterCat) return;
    const d = calcDate(t, pf, currentExceptions);
    const key = formatMonth(d);
    if (!groups[key]) groups[key] = [];
    groups[key].push({...t, date: d});
  });

  let html = '';
  for (const [month, items] of Object.entries(groups)) {
    html += `<div class="tl-month"><div class="tl-month-header">${month}</div>`;
    items.sort((a,b)=>a.date-b.date).forEach(t => {
      const today = new Date(); today.setHours(0,0,0,0);
      const td = new Date(t.date); td.setHours(0,0,0,0);
      let dateClass = '';
      if (td.getTime() === today.getTime()) dateClass = 'today';
      else if (td < today) dateClass = 'overdue';
      else if ((td - today) / 86400000 <= 7) dateClass = 'upcoming';

      const badges = t.tags.map(tag => {
        const map = {
          '필수':'b-required','조건부':'b-conditional',
          '공시':'b-disclosure','등기':'b-registration',
          '신고':'b-filing','상장':'b-conditional',
          '외감':'b-conditional','기업집단':'b-conditional',
        };
        return `<span class="tl-badge ${map[tag]||'b-conditional'}">${tag}</span>`;
      }).join('');

      let exToggle = '';
      if (t.exceptionToggle) {
        const ex = t.exceptionToggle;
        if (!ex.condition || ex.condition !== false) {
          const checked = currentExceptions[ex.id] ? 'checked' : '';
          exToggle = `<label class="exception-toggle">
            <input type="checkbox" ${checked} onchange="toggleException('${ex.id}',this.checked)">
            <div><strong>${ex.label}</strong><br><span style="font-size:11px;opacity:.8">${ex.effect}</span></div>
          </label>`;
        }
      }

      const refLabel = refDayLabel(t, currentExceptions);
      const todayLabel = todayDday(t.date);
      const isR = t.dBase === 'R';

      html += `
      <div class="tl-item" id="tl-${t.id}">
        <div class="tl-header" onclick="toggleItem(this.parentElement)">
          <div class="tl-date ${dateClass}">
            <div class="tl-date-main">${formatDate(t.date).slice(5)}</div>
            <div class="tl-ref-label ${isR?'ref-R':'ref-D'}">${refLabel}</div>
            <div class="tl-date-sub">${todayLabel}</div>
          </div>
          <div class="tl-body">
            <div class="tl-body-top">
              <span class="tl-title">${t.title}</span>
              ${badges}
              <span class="tl-expand-icon">&#9662;</span>
            </div>
            <div class="tl-summary">${t.content}</div>
          </div>
        </div>
        <div class="tl-detail" onclick="event.stopPropagation()">
          <div class="tl-detail-grid">
            <div class="tl-detail-section">
              <h4>상세 내용</h4>
              <p>${t.detail}</p>
            </div>
            <div class="tl-detail-section">
              <h4>관련 법령</h4>
              <p>${t.law}</p>
            </div>
          </div>
          ${t.filing?`<div class="tl-detail-full"><div class="tl-detail-section"><h4>공시 / 등기 / 신고</h4><p>${t.filing}</p></div></div>`:''}
          ${t.exception?`<div class="tl-detail-full"><div class="tl-detail-section"><h4>비고 (예외사항)</h4><p>${t.exception}</p></div></div>`:''}
          ${exToggle}
          <button class="proc-detail-btn" onclick="event.stopPropagation();openProcessModal('${t.id}')">세부 프로세스 보기 &rarr;</button>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (!html) html = '<p style="text-align:center;color:var(--text3);padding:40px">해당 조건에 맞는 업무가 없습니다.</p>';
  tlEl.innerHTML = html;
}

function toggleItem(el) {
  el.classList.toggle('expanded');
}

function filterTimeline(btn, cat) {
  document.querySelectorAll('.tl-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks(currentTasks, cat);
}

function toggleException(exId, checked) {
  currentExceptions[exId] = checked;
  const activeFilter = document.querySelector('.tl-filter-btn.active');
  const cat = activeFilter ? activeFilter.textContent : '전체';
  renderTasks(currentTasks, cat);
}


// ═══════════════════════════════════════════════
// API KEY MANAGEMENT
// ═══════════════════════════════════════════════

function saveApiKey(value) {
  localStorage.setItem('cf_api_key', value.trim());
}

function loadApiKey() {
  return localStorage.getItem('cf_api_key') || '';
}

function toggleApiKeyVisibility() {
  const input  = document.getElementById('api-key-input');
  const btn    = document.getElementById('api-key-toggle');
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '숨기기';
  } else {
    input.type = 'password';
    btn.textContent = '표시';
  }
}


// ═══════════════════════════════════════════════
// LAW CHECK - Claude API + Web Search
// ═══════════════════════════════════════════════

let lawCheckRunning = false;

async function runLawCheck() {
  if (lawCheckRunning) return;
  lawCheckRunning = true;

  const btn         = document.getElementById('law-check-btn');
  const btnText     = document.getElementById('law-check-btn-text');
  const spinner     = document.getElementById('law-check-spinner');
  const statusBar   = document.getElementById('law-status-bar');
  const resultsDiv  = document.getElementById('law-results');
  const resultsContent = document.getElementById('law-results-content');

  btn.disabled = true;
  spinner.style.display = 'inline-block';
  btnText.textContent = '검색 중...';
  statusBar.innerHTML = '<span style="color:var(--accent)">AI가 최신 법령 개정사항을 검색하고 있습니다...</span>';

  resultsDiv.style.display = 'block';
  resultsContent.innerHTML = `
    <div class="ai-progress" id="ai-progress">
      <div class="ai-progress-step active" id="prog-search"><div class="ai-progress-dot"></div>주총·이사회 관련 법령 개정사항 웹 검색 중...</div>
      <div class="ai-progress-step pending" id="prog-analyze"><div class="ai-progress-dot"></div>검색 결과 분석 대기 중</div>
      <div class="ai-progress-step pending" id="prog-compare"><div class="ai-progress-dot"></div>시스템 내장 데이터와 비교 대기 중</div>
    </div>`;

  const today = new Date();
  const dateStr = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;

  const systemPrompt = `당신은 한국 상법, 외감법, 자본시장법, 공정거래법 전문가입니다. 주어진 검색 결과를 바탕으로, 주주총회 및 이사회 실무에 영향을 미치는 법령 개정사항을 분석하세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트나 마크다운을 포함하지 마세요.

{
  "search_date": "${dateStr}",
  "items": [
    {
      "title": "개정사항 제목",
      "law": "법령명 및 조문 번호",
      "status": "enacted 또는 upcoming",
      "effective_date": "시행일",
      "summary": "핵심 내용 2~3문장",
      "agm_impact": "주총·이사회 실무에 미치는 영향 1~2문장",
      "is_new": true 또는 false
    }
  ],
  "conclusion": "전체 요약 1~2문장"
}

is_new 판단 기준: 아래 내장 데이터에 이미 포함된 사항이면 false, 새로운 사항이면 true.

내장 데이터(시스템 최종 반영일: 2026.3.24.):
- 1차 개정 상법(2025.7.22.): 이사 충실의무 확대, 외관대표이사, 간이영업양도
- 1차 개정 유예(2026.7.23.): 독립이사 제도, 합산 3%룰
- 2차 개정 상법(2026.9.10.): 집중투표제 의무화, 감사위원 분리선출 2명
- 3차 개정 상법(2026.3.6.): 자기주식 소각 의무화
- 배당기준일 유연화(2023), 지점등기 폐지(2024)`;

  const userPrompt = `오늘은 ${dateStr}입니다. 2025~2026년 한국 상법, 외감법, 자본시장법, 공정거래법 중 주주총회 및 이사회 실무에 영향을 미치는 개정사항을 모두 찾아서 정리해 주세요. 특히:
1. 이미 시행 중인 개정사항
2. 시행 예정인 개정사항
3. 국회 계류 중이거나 입법예고 중인 사항
4. 최근 법무부 유권해석이나 금감원 가이드라인

각 항목별로 주총 및 이사회 준비에 어떤 영향을 미치는지 구체적으로 설명해 주세요.`;

  const apiKey = loadApiKey();
  if (!apiKey) {
    statusBar.innerHTML = '<span style="color:var(--red)"><strong>&#9888; API 키 없음</strong> &mdash; 위 입력란에 Anthropic API Key를 입력해주세요.</span>';
    btn.disabled = false;
    spinner.style.display = 'none';
    btnText.textContent = '법령 개정사항 검색';
    lawCheckRunning = false;
    return;
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: systemPrompt,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    document.getElementById('prog-search').className = 'ai-progress-step done';
    document.getElementById('prog-analyze').className = 'ai-progress-step active';

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || `HTTP ${response.status}`;
      statusBar.innerHTML = `<span style="color:var(--red)"><strong>&#9888; API 오류</strong> &mdash; ${errMsg}</span>`;
      resultsContent.innerHTML = `<div style="padding:16px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text2)">${errMsg}</div>`;
      return;
    }

    document.getElementById('prog-analyze').className = 'ai-progress-step done';
    document.getElementById('prog-compare').className = 'ai-progress-step active';

    let fullText = '';
    if (data.content) {
      fullText = data.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
    }

    document.getElementById('prog-compare').className = 'ai-progress-step done';

    let parsed = null;
    try {
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch(e) {}

    if (parsed && parsed.items && parsed.items.length > 0) {
      const newCount   = parsed.items.filter(i => i.is_new).length;

      if (newCount > 0) {
        statusBar.innerHTML = `<span style="color:var(--red)"><strong>&#9888; 새로운 개정사항 ${newCount}건 발견</strong> &mdash; 아래 결과를 확인하고 시스템 업데이트 필요 여부를 검토하세요.</span>`;
      } else {
        statusBar.innerHTML = `<span style="color:var(--green)"><strong>&#10003; 추가 개정사항 없음</strong> &mdash; 시스템 내장 데이터가 최신 상태입니다. (확인: ${parsed.items.length}건 검토)</span>`;
      }

      let cardsHtml = '';
      const sorted = [...parsed.items].sort((a,b) => (b.is_new?1:0) - (a.is_new?1:0));
      sorted.forEach(item => {
        const cls = item.is_new ? 'ai-new' : 'ai-known';
        const badge = item.is_new
          ? '<span class="ai-result-badge new-badge">신규 확인 필요</span>'
          : '<span class="ai-result-badge known-badge">반영 완료</span>';
        const statusBadge = item.status === 'enacted'
          ? '<span class="law-badge enacted" style="font-size:9px;padding:1px 6px">시행중</span>'
          : '<span class="law-badge upcoming" style="font-size:9px;padding:1px 6px">시행예정</span>';
        cardsHtml += `
          <div class="ai-result-card ${cls}" onclick="this.classList.toggle('open')">
            <div class="ai-result-header">
              ${badge} ${statusBadge}
              <span class="ai-result-title">${item.title}</span>
              <span style="color:var(--text3);font-size:11px">${item.effective_date||''}</span>
            </div>
            <div class="ai-result-body">
              <div style="margin-bottom:8px"><strong>법령:</strong> ${item.law||''}</div>
              <div style="margin-bottom:8px"><strong>내용:</strong> ${item.summary||''}</div>
              <div><strong>주총·이사회 영향:</strong> ${item.agm_impact||''}</div>
            </div>
          </div>`;
      });
      if (parsed.conclusion) {
        cardsHtml += `<div style="margin-top:12px;padding:12px 14px;background:var(--surface2);border-radius:var(--radius);font-size:13px;color:var(--text2);line-height:1.6"><strong>종합 판단:</strong> ${parsed.conclusion}</div>`;
      }
      resultsContent.innerHTML = cardsHtml;
    } else {
      statusBar.innerHTML = '<span style="color:var(--green)"><strong>&#10003; 검색 완료</strong> &mdash; 아래 결과를 확인하세요.</span>';
      resultsContent.innerHTML = `<div style="padding:16px;background:var(--surface2);border-radius:var(--radius);font-size:13px;color:var(--text2);line-height:1.7;white-space:pre-wrap">${fullText || '검색 결과를 표시할 수 없습니다. 네트워크를 확인해 주세요.'}</div>`;
    }

  } catch (err) {
    const isNetworkErr = err instanceof TypeError &&
      (err.message.includes('Load failed') || err.message.includes('Failed to fetch') || err.message.includes('NetworkError'));

    if (isNetworkErr) {
      statusBar.innerHTML = `<span style="color:var(--red)"><strong>&#9888; 네트워크 차단</strong> &mdash; 브라우저가 외부 API 요청을 차단했습니다.</span>`;
      resultsContent.innerHTML = `
        <div style="padding:16px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text2);line-height:1.8">
          <strong style="color:var(--text)">원인</strong><br>
          로컬 프리뷰 또는 일부 브라우저 환경에서는 보안 정책(CORS/CSP)으로 인해 외부 API 호출이 차단됩니다.<br><br>
          <strong style="color:var(--text)">해결 방법</strong>
          <ol style="margin:8px 0 0 16px;padding:0">
            <li>아래 <strong>GitHub Pages 주소</strong>로 접속해 사용하세요.<br>
              <a href="https://wacky0712-lab.github.io/compliflow" target="_blank"
                style="color:var(--accent);word-break:break-all">
                https://wacky0712-lab.github.io/compliflow
              </a>
            </li>
            <li>API 키를 입력하고 다시 시도하세요.</li>
          </ol>
        </div>`;
    } else {
      statusBar.innerHTML = `<span style="color:var(--red)"><strong>&#9888; 검색 실패</strong> &mdash; ${err.message}</span>`;
      resultsContent.innerHTML = `<div style="padding:16px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius);font-size:13px;color:var(--text2)">오류: ${err.message}</div>`;
    }
  }

  btn.disabled = false;
  spinner.style.display = 'none';
  btnText.textContent = '다시 검색';
  document.getElementById('law-check-time').textContent = `마지막 검색: ${new Date().toLocaleString('ko-KR')}`;
  lawCheckRunning = false;
}


// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════

(function(){
  const now  = new Date();
  const year = now.getFullYear();
  document.getElementById('pf-fy-date').value  = `${year-1}-12-31`;
  document.getElementById('pf-agm-date').value = `${year}-03-27`;

  // 저장된 API 키 복원
  const savedKey = loadApiKey();
  if (savedKey) {
    document.getElementById('api-key-input').value = savedKey;
  }

  updateScheduleHints();
  initAgenda();
})();
