/**
 * Main Application Controller
 * ระบบ Dashboard สรุปฐานข้อมูลภาระงาน นางสาวศุภวรรณ อารีจิตรานุสรณ์
 */

(function () {
  const ICONS = {
    overview: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>`,
    calculator: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/><line x1="16" y1="18" x2="16.01" y2="18"/></svg>`,
    hardhat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M4 15v-3a6 6 0 0 1 6-6h0"/><path d="M14 6h0a6 6 0 0 1 6 6v3"/></svg>`,
    "clipboard-check": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>`,
    coins: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/></svg>`,
    "file-text": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
    gavel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14 13-7.5 7.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
    "heart-handshake": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
  };

  const state = {
    settings: window.WorkloadEngine.loadSettings(),
    dataset: null,
    analytics: null,
    activeView: "overview", // 'overview' or sheetId
    filters: {
      pa: "ALL",
      status: "ALL",
      search: ""
    },
    sort: {
      col: "__default",
      dir: "asc"
    },
    isSyncing: false,
    autoTimer: null
  };

  // DOM refs
  const el = {};

  function cacheDom() {
    el.sidebar = document.getElementById("sidebar");
    el.sidebarBackdrop = document.getElementById("sidebarBackdrop");
    el.menuToggle = document.getElementById("menuToggle");
    el.navList = document.getElementById("navList");
    el.syncDot = document.getElementById("syncDot");
    el.syncStatusText = document.getElementById("syncStatusText");
    el.syncBtn = document.getElementById("syncBtn");
    el.autoRefreshSelect = document.getElementById("autoRefreshSelect");
    el.openSheetLink = document.getElementById("openSheetLink");
    el.settingsBtn = document.getElementById("settingsBtn");
    el.printBtn = document.getElementById("printBtn");

    el.paFilterPills = document.getElementById("paFilterPills");
    el.statusFilterSelect = document.getElementById("statusFilterSelect");
    el.searchInput = document.getElementById("searchInput");
    el.clearSearchBtn = document.getElementById("clearSearchBtn");
    el.resetFiltersBtn = document.getElementById("resetFiltersBtn");

    el.errorBanner = document.getElementById("errorBanner");
    el.mainContent = document.getElementById("mainContent");

    el.detailModal = document.getElementById("detailModal");
    el.detailModalBody = document.getElementById("detailModalBody");
    el.detailModalTitle = document.getElementById("detailModalTitle");
    el.detailModalSheetBadge = document.getElementById("detailModalSheetBadge");
    el.detailModalClose = document.getElementById("detailModalClose");

    el.settingsModal = document.getElementById("settingsModal");
    el.settingsClose = document.getElementById("settingsClose");
    el.sheetIdInput = document.getElementById("sheetIdInput");
    el.sheetsEditorBody = document.getElementById("sheetsEditorBody");
    el.addSheetRowBtn = document.getElementById("addSheetRowBtn");
    el.resetDefaultSheetsBtn = document.getElementById("resetDefaultSheetsBtn");
    el.saveSettingsBtn = document.getElementById("saveSettingsBtn");

    el.profileAvatarBtn = document.getElementById("profileAvatarBtn");
    el.profileAvatarImg = document.getElementById("profileAvatarImg");
    el.profileAvatarFallback = document.getElementById("profileAvatarFallback");
    el.settingsAvatarPreview = document.getElementById("settingsAvatarPreview");
    el.settingsAvatarFallback = document.getElementById("settingsAvatarFallback");
    el.profileImageUrlInput = document.getElementById("profileImageUrlInput");
    el.profileFileInput = document.getElementById("profileFileInput");
    el.clearProfileImageBtn = document.getElementById("clearProfileImageBtn");
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatMoney(num) {
    if (num == null || isNaN(num)) return "-";
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  }

  function formatCompactMoney(num) {
    if (!num || isNaN(num)) return "0 บาท";
    if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)} ล้านบาท`;
    }
    return `${formatMoney(num)} บาท`;
  }

  function formatSyncTime(dateObj) {
    if (!(dateObj instanceof Date) || isNaN(dateObj)) return "-";
    return dateObj.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function getStatusBadgeHtml(statusKey, statusRaw, statusLabel) {
    const label = statusRaw || statusLabel || "ไม่ระบุ";
    let cls = "badge-neutral";
    if (statusKey === "completed") cls = "badge-success";
    else if (statusKey === "in_progress") cls = "badge-warning";
    else if (statusKey === "not_started") cls = "badge-slate";
    else if (statusKey === "cancelled") cls = "badge-danger";
    else if (statusKey === "not_attended") cls = "badge-muted";
    return `<span class="status-badge ${cls}">${esc(label)}</span>`;
  }

  function linkifyText(text) {
    const escaped = esc(text);
    return escaped.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="inline-link">$1</a>'
    );
  }

  function updateSyncHeader() {
    const sid = window.WorkloadEngine.extractSpreadsheetId(state.settings.spreadsheetId);
    el.openSheetLink.href = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sid)}/edit`;

    if (state.isSyncing) {
      el.syncDot.className = "sync-dot is-syncing";
      el.syncStatusText.textContent = "กำลังซิงค์ข้อมูลจาก Google Sheet...";
      el.syncBtn.disabled = true;
      el.syncBtn.classList.add("is-spinning");
      return;
    }

    el.syncBtn.disabled = false;
    el.syncBtn.classList.remove("is-spinning");

    if (!state.dataset) {
      el.syncDot.className = "sync-dot is-offline";
      el.syncStatusText.textContent = "ยังไม่ได้เชื่อมต่อ";
      return;
    }

    const timeStr = formatSyncTime(state.dataset.fetchedAt);
    if (state.dataset.fromCache) {
      el.syncDot.className = "sync-dot is-cached";
      el.syncStatusText.textContent = `แสดงข้อมูลแคช (ซิงค์ล่าสุด ${timeStr})`;
    } else if (state.dataset.errors && state.dataset.errors.length > 0) {
      el.syncDot.className = "sync-dot is-cached";
      el.syncStatusText.textContent = `อัปเดตแล้ว ${state.dataset.successCount}/${state.dataset.totalSheets} ชีท (${timeStr})`;
    } else {
      el.syncDot.className = "sync-dot is-live";
      el.syncStatusText.textContent = `เชื่อมต่อสดครบ ${state.dataset.totalSheets} ชีท • อัปเดต ${timeStr}`;
    }
  }

  function setupAutoRefresh() {
    if (state.autoTimer) {
      clearInterval(state.autoTimer);
      state.autoTimer = null;
    }
    const ms = state.settings.autoRefreshMs || 0;
    el.autoRefreshSelect.value = String(ms);
    if (ms > 0) {
      state.autoTimer = setInterval(() => {
        syncData({ silent: true });
      }, ms);
    }
  }

  async function syncData({ silent = false } = {}) {
    if (state.isSyncing) return;
    state.isSyncing = true;
    updateSyncHeader();

    try {
      const fresh = await window.WorkloadEngine.loadAllSheets(state.settings);
      if (fresh.successCount === 0) {
        throw new Error("ไม่สามารถดึงข้อมูลจาก Google Sheet ได้ (ตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือสิทธิ์การแชร์ชีท)");
      }
      state.dataset = fresh;
      hideErrorBanner();
      if (fresh.errors.length > 0) {
        showErrorBanner(
          `โหลดสำเร็จ ${fresh.successCount}/${fresh.totalSheets} ชีท — ไม่สามารถโหลดชีท: ${fresh.errors.map((e) => e.sheetName).join(", ")}`
        );
      }
    } catch (err) {
      if (!silent || !state.dataset) {
        const cached = window.WorkloadEngine.loadCache();
        if (cached && !state.dataset) {
          state.dataset = cached;
        }
        showErrorBanner(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ Google Sheet");
      }
    } finally {
      state.isSyncing = false;
      updateSyncHeader();
      recomputeAndRender();
    }
  }

  function showErrorBanner(msg) {
    el.errorBanner.textContent = msg;
    el.errorBanner.hidden = false;
  }

  function hideErrorBanner() {
    el.errorBanner.hidden = true;
    el.errorBanner.textContent = "";
  }

  function recomputeAndRender() {
    if (!state.dataset) {
      renderLoadingState();
      return;
    }

    state.analytics = window.WorkloadEngine.computeAnalytics(
      state.settings.sheets,
      state.dataset.sheetDatasets,
      state.filters
    );

    renderPaFilters();
    renderSidebarNav();
    renderActiveView();
  }

  function renderLoadingState() {
    el.mainContent.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <h3>กำลังดึงข้อมูลจาก Google Sheet แบบเรียลไทม์...</h3>
        <p>กำลังเชื่อมต่อทั้ง ${state.settings.sheets.length} ชีท เพื่อประมวลผลสรุปภาระงาน</p>
      </div>
    `;
  }

  function renderPaFilters() {
    const years = state.analytics ? state.analytics.allPaYears : [];
    const pills = [
      { id: "ALL", label: "ทุกปี PA" },
      ...years.map((y) => ({ id: y, label: y }))
    ];

    el.paFilterPills.innerHTML = pills
      .map(
        (p) => `
        <button type="button" class="filter-pill ${state.filters.pa === p.id ? "is-active" : ""}" data-pa="${esc(p.id)}">
          ${esc(p.label)}
        </button>
      `
      )
      .join("");

    el.paFilterPills.querySelectorAll(".filter-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.pa = btn.getAttribute("data-pa");
        recomputeAndRender();
      });
    });

    el.statusFilterSelect.value = state.filters.status;
    el.clearSearchBtn.hidden = !state.filters.search;
  }

  function renderSidebarNav() {
    const analytics = state.analytics;
    const bySheetMap = {};
    if (analytics) {
      analytics.bySheet.forEach((s) => {
        bySheetMap[s.config.id] = s;
      });
    }

    const totalAll = analytics ? analytics.totalTasks : 0;

    let html = `
      <div class="nav-group">
        <button type="button" class="nav-item ${state.activeView === "overview" ? "is-active" : ""}" data-view="overview">
          <span class="nav-icon">${ICONS.overview}</span>
          <span class="nav-text">ภาพรวมทั้งหมด</span>
          <span class="nav-count">${totalAll}</span>
        </button>
      </div>
    `;

    window.WORKLOAD_CONFIG.groups.forEach((grp) => {
      const groupSheets = state.settings.sheets.filter((s) => s.group === grp.id);
      if (groupSheets.length === 0) return;

      html += `<div class="nav-group"><div class="nav-group-title">${esc(grp.label)}</div>`;
      groupSheets.forEach((s) => {
        const info = bySheetMap[s.id];
        const count = info ? info.total : 0;
        const inProg = info ? info.counts.in_progress : 0;
        html += `
          <button type="button" class="nav-item ${state.activeView === s.id ? "is-active" : ""}" data-view="${esc(s.id)}">
            <span class="nav-icon" style="color:${esc(s.accent)}">${ICONS[s.icon] || ICONS["file-text"]}</span>
            <span class="nav-text">${esc(s.shortName || s.name)}</span>
            <span class="nav-badges">
              ${inProg > 0 ? `<span class="nav-dot-warn" title="กำลังดำเนินการ ${inProg} งาน">${inProg}</span>` : ""}
              <span class="nav-count">${count}</span>
            </span>
          </button>
        `;
      });
      html += `</div>`;
    });

    // Any custom sheets with group not in default groups
    const knownGroups = new Set(window.WORKLOAD_CONFIG.groups.map((g) => g.id));
    const otherSheets = state.settings.sheets.filter((s) => !knownGroups.has(s.group));
    if (otherSheets.length > 0) {
      html += `<div class="nav-group"><div class="nav-group-title">ชีทเพิ่มเติม</div>`;
      otherSheets.forEach((s) => {
        const info = bySheetMap[s.id];
        const count = info ? info.total : 0;
        html += `
          <button type="button" class="nav-item ${state.activeView === s.id ? "is-active" : ""}" data-view="${esc(s.id)}">
            <span class="nav-icon" style="color:${esc(s.accent || "#475569")}">${ICONS[s.icon] || ICONS["file-text"]}</span>
            <span class="nav-text">${esc(s.shortName || s.name)}</span>
            <span class="nav-count">${count}</span>
          </button>
        `;
      });
      html += `</div>`;
    }

    el.navList.innerHTML = html;

    el.navList.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        switchView(view);
        closeMobileSidebar();
      });
    });
  }

  function switchView(viewId) {
    state.activeView = viewId;
    state.sort = { col: "__default", dir: "asc" };
    renderSidebarNav();
    renderActiveView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderActiveView() {
    if (state.activeView === "overview") {
      renderOverviewView();
    } else {
      renderSheetDetailView(state.activeView);
    }
  }

  function renderOverviewView() {
    const a = state.analytics;
    const fin = a.financials;
    const totalFinancial = fin.designBudget + fin.supervisionBudget;

    el.mainContent.innerHTML = `
      <section class="page-head">
        <div>
          <h2 class="page-title">ภาพรวมภาระงานทั้งหมด</h2>
          <p class="page-subtitle">สรุปข้อมูลเชื่อมโยงแบบเรียลไทม์จาก Google Sheet ทั้ง ${a.bySheet.length} ประเภทงาน ${state.filters.pa !== "ALL" ? `• กรองเฉพาะ ${esc(state.filters.pa)}` : ""}</p>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-outline btn-sm" id="exportAllCsvBtn">ส่งออก CSV ทั้งหมด</button>
        </div>
      </section>

      <section class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">ภาระงานรวมทั้งหมด</div>
          <div class="kpi-value">${a.totalTasks} <span class="kpi-unit">รายการ</span></div>
          <div class="kpi-meta">ครอบคลุม ${a.bySheet.filter((s) => s.total > 0).length} / ${a.bySheet.length} ชีทงาน</div>
        </div>

        <div class="kpi-card kpi-success">
          <div class="kpi-label">อัตราความสำเร็จ (แล้วเสร็จ/เข้าร่วม)</div>
          <div class="kpi-value">${a.completionRate}<span class="kpi-unit">%</span></div>
          <div class="kpi-meta">ดำเนินการแล้วเสร็จ ${a.statusCounts.completed} รายการ</div>
        </div>

        <button type="button" class="kpi-card kpi-warning kpi-clickable" id="jumpActiveSpotlight">
          <div class="kpi-label">งานที่กำลังดำเนินการ / ติดตาม</div>
          <div class="kpi-value">${a.statusCounts.in_progress} <span class="kpi-unit">รายการ</span></div>
          <div class="kpi-meta">ยังไม่เริ่ม ${a.statusCounts.not_started} • ยกเลิก/หยุด ${a.statusCounts.cancelled}</div>
        </button>

        <div class="kpi-card kpi-indigo">
          <div class="kpi-label">มูลค่าโครงการ (ออกแบบ + คุมงาน)</div>
          <div class="kpi-value">${formatCompactMoney(totalFinancial)}</div>
          <div class="kpi-meta">ออกแบบ ${formatCompactMoney(fin.designBudget)} • คุมงาน ${formatCompactMoney(fin.supervisionBudget)} • กก.ราคากลาง ${formatCompactMoney(fin.committeePriceBudget)}</div>
        </div>

        <div class="kpi-card kpi-teal">
          <div class="kpi-label">การประชุมคุมงาน &amp; คณะกรรมการ</div>
          <div class="kpi-value">${a.totalMeetings} <span class="kpi-unit">ครั้ง</span></div>
          <div class="kpi-meta">นับรวมบันทึกวันประชุมทุกคณะ</div>
        </div>
      </section>

      <section class="charts-grid-2">
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">ภาระงานแยกตามประเภทชีท (${a.bySheet.length} ชีท)</h3>
              <p class="panel-desc">คลิกที่แต่ละแถบเพื่อเปิดดูรายละเอียดและตารางข้อมูลของชีทนั้น</p>
            </div>
          </div>
          <div class="panel-body" id="chartSheetWorkload"></div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">สัดส่วนสถานะการดำเนินงาน</h3>
              <p class="panel-desc">คลิกที่รายการสถานะเพื่อกรองข้อมูล</p>
            </div>
          </div>
          <div class="panel-body" id="chartStatusDonut"></div>
        </div>
      </section>

      <section class="charts-grid-2">
        <div class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">เปรียบเทียบภาระงานรายปีงบประมาณ (PA)</h3>
              <p class="panel-desc">แสดงแนวโน้มจำนวนงานรวมและสถานะแยกตามรอบ PA</p>
            </div>
          </div>
          <div class="panel-body" id="chartPaTrend"></div>
        </div>

        <div class="panel">
          <div class="panel-head">
            <div>
              <h3 class="panel-title">หน่วยงาน / เจ้าของโครงการที่รับผิดชอบ</h3>
              <p class="panel-desc">สรุปจากคอลัมน์เจ้าของโครงการและหน่วยงาน</p>
            </div>
          </div>
          <div class="panel-body" id="chartAgencies"></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">สรุปแยกตามประเภทงาน (10 ชีท)</h3>
            <p class="panel-desc">เลือกการ์ดประเภทงานที่ต้องการตรวจสอบเชิงลึก</p>
          </div>
        </div>
        <div class="sheet-cards-grid" id="sheetCardsGrid">
          ${a.bySheet
            .map((s) => {
              const cfg = s.config;
              const done = s.counts.completed || 0;
              const prog = s.counts.in_progress || 0;
              const pct = s.total > 0 ? Math.round((done / s.total) * 100) : 0;
              let extraInfo = "";
              if (s.budget > 0) extraInfo = `วงเงิน/มูลค่า ${formatCompactMoney(s.budget)}`;
              else if (s.meetings > 0) extraInfo = `ประชุมรวม ${s.meetings} ครั้ง`;
              else extraInfo = `แล้วเสร็จ/เข้าร่วม ${pct}%`;

              return `
                <button type="button" class="sheet-card" data-sheet-id="${esc(cfg.id)}">
                  <div class="sheet-card-top">
                    <span class="sheet-card-icon" style="background:${esc(cfg.accent)}15;color:${esc(cfg.accent)}">
                      ${ICONS[cfg.icon] || ICONS["file-text"]}
                    </span>
                    <span class="sheet-card-count">${s.total} <small>งาน</small></span>
                  </div>
                  <div class="sheet-card-title">${esc(cfg.name)}</div>
                  <div class="sheet-card-stats">
                    <span class="pill-mini pill-done">เสร็จ ${done}</span>
                    ${prog > 0 ? `<span class="pill-mini pill-prog">กำลังทำ ${prog}</span>` : ""}
                  </div>
                  <div class="sheet-card-foot">${esc(extraInfo)}</div>
                </button>
              `;
            })
            .join("")}
        </div>
      </section>

      <section class="panel" id="activeSpotlightSection">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">รายการที่อยู่ระหว่างดำเนินการ / รอดำเนินการ (${a.activeItems.length})</h3>
            <p class="panel-desc">รวบรวมงานที่ยังไม่ปิดจบจากทุกชีทเพื่อช่วยติดตามความคืบหน้า คลิกแถวเพื่อดูรายละเอียด</p>
          </div>
        </div>
        <div class="table-wrap">
          ${renderActiveSpotlightTable(a.activeItems)}
        </div>
      </section>
    `;

    // Render charts
    window.WorkloadCharts.renderSheetWorkloadChart(
      document.getElementById("chartSheetWorkload"),
      a.bySheet,
      (sid) => switchView(sid)
    );

    window.WorkloadCharts.renderStatusDonut(
      document.getElementById("chartStatusDonut"),
      a.statusCounts,
      a.totalTasks,
      state.filters.status,
      (statusKey) => {
        state.filters.status = statusKey;
        recomputeAndRender();
      }
    );

    window.WorkloadCharts.renderPaTrendChart(
      document.getElementById("chartPaTrend"),
      a.paSeries,
      state.filters.pa,
      (pa) => {
        state.filters.pa = pa;
        recomputeAndRender();
      }
    );

    window.WorkloadCharts.renderHorizontalMetricBars(
      document.getElementById("chartAgencies"),
      a.topAgencies,
      "ไม่มีข้อมูลหน่วยงานในตัวกรองที่เลือก"
    );

    // Wire events
    document.querySelectorAll("#sheetCardsGrid .sheet-card").forEach((card) => {
      card.addEventListener("click", () => {
        switchView(card.getAttribute("data-sheet-id"));
      });
    });

    const jumpBtn = document.getElementById("jumpActiveSpotlight");
    if (jumpBtn) {
      jumpBtn.addEventListener("click", () => {
        const target = document.getElementById("activeSpotlightSection");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    const exportBtn = document.getElementById("exportAllCsvBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => exportAllFilteredCsv(a.allFilteredRows));
    }

    bindRowClickHandlers();
  }

  function renderActiveSpotlightTable(items) {
    if (!items || items.length === 0) {
      return `<div class="empty-state">ไม่มีงานค้างดำเนินการในตัวกรองปัจจุบัน</div>`;
    }

    const rowsHtml = items
      .map(
        (r) => `
        <tr class="clickable-row" data-uid="${esc(r.uid)}" data-sheet-id="${esc(r.sheetId)}">
          <td><span class="sheet-tag" style="border-color:${esc(r.sheetAccent)}40;color:${esc(r.sheetAccent)};background:${esc(r.sheetAccent)}10">${esc(r.sheetName)}</span></td>
          <td class="col-nowrap">${esc(r.pa)}</td>
          <td class="col-title">${esc(r.title)}</td>
          <td>${esc(r.ownerRaw || "-")}</td>
          <td class="col-nowrap">${getStatusBadgeHtml(r.statusKey, r.statusRaw, r.statusLabel)}</td>
          <td class="col-nowrap">${esc(r.primaryDateText || "-")}</td>
          <td class="col-nowrap">${r.meetingCount > 0 ? `<span class="meeting-pill">${r.meetingCount} ครั้ง</span>` : "-"}</td>
        </tr>
      `
      )
      .join("");

    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>ประเภทงาน (ชีท)</th>
            <th>PA</th>
            <th>งาน / โครงการ</th>
            <th>หน่วยงาน</th>
            <th>สถานะ</th>
            <th>วันที่เริ่ม / ประชุมล่าสุด</th>
            <th>ประชุม</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    `;
  }

  function renderSheetDetailView(sheetId) {
    const info = state.analytics.bySheet.find((s) => s.config.id === sheetId);
    if (!info) {
      switchView("overview");
      return;
    }

    const cfg = info.config;
    const ds = state.dataset.sheetDatasets[sheetId];
    const sid = window.WorkloadEngine.extractSpreadsheetId(state.settings.spreadsheetId);
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sid)}/edit#gid=${encodeURIComponent(cfg.gid)}`;

    const rows = sortRows(info.rows, state.sort);

    // Sheet-specific KPI cards
    const done = info.counts.completed || 0;
    const prog = info.counts.in_progress || 0;
    const actionable = info.total - (info.counts.not_attended || 0) - (info.counts.cancelled || 0);
    const pct = actionable > 0 ? Math.round((done / actionable) * 100) : 0;

    let thirdKpiHtml = `
      <div class="kpi-card kpi-warning">
        <div class="kpi-label">กำลังดำเนินการ / รอดำเนินการ</div>
        <div class="kpi-value">${prog + (info.counts.not_started || 0)} <span class="kpi-unit">รายการ</span></div>
        <div class="kpi-meta">กำลังทำ ${prog} • ยังไม่เริ่ม ${info.counts.not_started || 0} • ยกเลิก/หยุด ${info.counts.cancelled || 0}</div>
      </div>
    `;

    let fourthKpiHtml = "";
    if (cfg.id === "design") {
      const actualSum = rows.reduce((acc, r) => acc + (r.actualBudget || 0), 0);
      fourthKpiHtml = `
        <div class="kpi-card kpi-indigo">
          <div class="kpi-label">วงเงินโครงการรวม</div>
          <div class="kpi-value">${formatCompactMoney(info.budget)}</div>
          <div class="kpi-meta">งบก่อสร้างจริงรวม ${formatCompactMoney(actualSum)}</div>
        </div>
      `;
    } else if (info.budget > 0) {
      fourthKpiHtml = `
        <div class="kpi-card kpi-indigo">
          <div class="kpi-label">${esc(cfg.primaryBudgetCol || "งบประมาณรวม")}</div>
          <div class="kpi-value">${formatCompactMoney(info.budget)}</div>
          <div class="kpi-meta">${info.meetings > 0 ? `การประชุมรวม ${info.meetings} ครั้ง` : "รวมตามรายการที่กรอง"}</div>
        </div>
      `;
    } else if (info.meetings > 0 || cfg.meetingPrefix) {
      fourthKpiHtml = `
        <div class="kpi-card kpi-teal">
          <div class="kpi-label">จำนวนการประชุมรวม</div>
          <div class="kpi-value">${info.meetings} <span class="kpi-unit">ครั้ง</span></div>
          <div class="kpi-meta">เฉลี่ย ${info.total > 0 ? (info.meetings / info.total).toFixed(1) : 0} ครั้ง/โครงการ</div>
        </div>
      `;
    } else {
      const otherLabel = cfg.id === "public_service" ? "ไม่ได้เข้าร่วม" : "ยกเลิก / อื่นๆ";
      const otherCount = cfg.id === "public_service"
        ? (info.counts.not_attended || 0)
        : (info.counts.cancelled || 0) + (info.counts.unspecified || 0);
      fourthKpiHtml = `
        <div class="kpi-card">
          <div class="kpi-label">${otherLabel}</div>
          <div class="kpi-value">${otherCount} <span class="kpi-unit">รายการ</span></div>
          <div class="kpi-meta">จากทั้งหมด ${info.total} รายการ</div>
        </div>
      `;
    }

    // Build table columns
    const columns = getDisplayColumnsForSheet(cfg, ds);

    // Breakdown metrics for mini charts
    const paBreakdownMap = {};
    rows.forEach((r) => {
      paBreakdownMap[r.pa] = (paBreakdownMap[r.pa] || 0) + 1;
    });
    const paBreakdownItems = Object.entries(paBreakdownMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count, color: cfg.accent }));

    const secondaryGroupTitle =
      cfg.id === "design" ? "สถานะการก่อสร้าง / เจ้าของโครงการ" :
      cfg.categoryCol ? `แยกตาม${cfg.categoryCol}` :
      cfg.ownerCol ? `แยกตาม${cfg.ownerCol}` : "สรุปสถานะในชีทนี้";

    const secondaryItems = buildSheetSecondaryBreakdown(cfg, rows);

    el.mainContent.innerHTML = `
      <section class="page-head">
        <div>
          <div class="breadcrumb">
            <button type="button" class="link-btn" id="backToOverviewBtn">ภาพรวมทั้งหมด</button>
            <span>/</span>
            <span>${esc(cfg.name)}</span>
          </div>
          <h2 class="page-title">
            <span class="title-dot" style="background:${esc(cfg.accent)}"></span>
            ${esc(cfg.name)}
          </h2>
          <p class="page-subtitle">${esc(cfg.description)}</p>
        </div>
        <div class="page-actions">
          <a href="${esc(sheetUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">เปิดชีทนี้ใน Google Sheet ↗</a>
          <button type="button" class="btn btn-primary btn-sm" id="exportSheetCsvBtn">ส่งออก CSV ชีทนี้</button>
        </div>
      </section>

      <section class="kpi-grid kpi-grid-4">
        <div class="kpi-card">
          <div class="kpi-label">จำนวนงานทั้งหมดในชีท</div>
          <div class="kpi-value">${info.total} <span class="kpi-unit">รายการ</span></div>
          <div class="kpi-meta">จากทั้งหมด ${info.rawTotal} รายการ (ก่อนกรอง)</div>
        </div>
        <div class="kpi-card kpi-success">
          <div class="kpi-label">${cfg.id === "public_service" ? "เข้าร่วมกิจกรรม" : "ดำเนินการแล้วเสร็จ"}</div>
          <div class="kpi-value">${done} <span class="kpi-unit">รายการ (${pct}%)</span></div>
          <div class="kpi-meta">เทียบกับรายการที่ดำเนินงานได้</div>
        </div>
        ${thirdKpiHtml}
        ${fourthKpiHtml}
      </section>

      <section class="charts-grid-2">
        <div class="panel">
          <div class="panel-head"><h3 class="panel-title">จำนวนงานแยกตามปี PA</h3></div>
          <div class="panel-body" id="sheetPaBreakdown"></div>
        </div>
        <div class="panel">
          <div class="panel-head"><h3 class="panel-title">${esc(secondaryGroupTitle)}</h3></div>
          <div class="panel-body" id="sheetSecondaryBreakdown"></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div>
            <h3 class="panel-title">ตารางข้อมูล: ${esc(cfg.name)} (${rows.length} รายการ)</h3>
            <p class="panel-desc">คลิกหัวคอลัมน์เพื่อเรียงลำดับ หรือคลิกที่แถวเพื่อดูรายละเอียดครบทุกคอลัมน์และประวัติการประชุม</p>
          </div>
        </div>
        <div class="table-wrap">
          ${renderSheetTable(cfg, columns, rows)}
        </div>
      </section>
    `;

    window.WorkloadCharts.renderHorizontalMetricBars(
      document.getElementById("sheetPaBreakdown"),
      paBreakdownItems
    );

    window.WorkloadCharts.renderHorizontalMetricBars(
      document.getElementById("sheetSecondaryBreakdown"),
      secondaryItems
    );

    document.getElementById("backToOverviewBtn").addEventListener("click", () => switchView("overview"));
    document.getElementById("exportSheetCsvBtn").addEventListener("click", () => exportSheetCsv(cfg, columns, rows));

    // Sort headers
    el.mainContent.querySelectorAll("th[data-sort-col]").forEach((th) => {
      th.addEventListener("click", () => {
        const col = th.getAttribute("data-sort-col");
        if (state.sort.col === col) {
          state.sort.dir = state.sort.dir === "asc" ? "desc" : "asc";
        } else {
          state.sort = { col, dir: "asc" };
        }
        renderSheetDetailView(sheetId);
      });
    });

    bindRowClickHandlers();
  }

  function buildSheetSecondaryBreakdown(cfg, rows) {
    const counts = {};
    rows.forEach((r) => {
      let key = "";
      if (cfg.id === "design") {
        key = r.secondaryStatus || r.ownerRaw || "ไม่ระบุ";
      } else if (cfg.categoryCol && r.category) {
        key = r.category;
      } else if (cfg.ownerCol && r.ownerRaw) {
        key = r.owners[0] || r.ownerRaw;
      } else {
        key = r.statusRaw || r.statusLabel || "ไม่ระบุ";
      }
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));
  }

  function getDisplayColumnsForSheet(cfg, ds) {
    const baseCols = (cfg.summaryCols && cfg.summaryCols.length > 0)
      ? cfg.summaryCols.slice()
      : (ds && ds.columns ? ds.columns.filter((c) => c.label && !/^ประชุมครั้งที่/.test(c.label)).slice(0, 8).map((c) => c.label) : ["PA", "งาน"]);

    // Append virtual meeting count column if sheet tracks meetings
    if (cfg.meetingPrefix && !baseCols.includes("__meetings")) {
      baseCols.push("__meetings");
    }
    return baseCols;
  }

  function renderSheetTable(cfg, columns, rows) {
    if (!rows || rows.length === 0) {
      return `<div class="empty-state">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</div>`;
    }

    const theadHtml = columns
      .map((col) => {
        const label = col === "__meetings" ? "ประชุม" : col;
        const isSorted = state.sort.col === col;
        const arrow = isSorted ? (state.sort.dir === "asc" ? " ↑" : " ↓") : "";
        return `<th class="sortable-th ${isSorted ? "is-sorted" : ""}" data-sort-col="${esc(col)}">${esc(label)}${arrow}</th>`;
      })
      .join("");

    const tbodyHtml = rows
      .map((r) => {
        const tds = columns
          .map((col) => {
            if (col === "__meetings") {
              return `<td class="col-nowrap">${r.meetingCount > 0 ? `<span class="meeting-pill">${r.meetingCount} ครั้ง</span>` : "-"}</td>`;
            }
            if (col === cfg.titleCol || col === "งาน / โครงการ" || col === "งาน") {
              return `<td class="col-title">${esc(r.title)}</td>`;
            }
            if (col === cfg.statusCol) {
              return `<td class="col-nowrap">${getStatusBadgeHtml(r.statusKey, r.statusRaw, r.statusLabel)}</td>`;
            }
            if (col === "PA") {
              return `<td class="col-nowrap">${esc(r.pa)}</td>`;
            }
            if (col === "ลำดับ") {
              return `<td class="col-num">${esc(r.seq || "-")}</td>`;
            }
            if (r.numbers && r.numbers[col] != null) {
              const suffix = col === "ระยะเวลาจริง" ? " วัน" : "";
              return `<td class="col-num">${formatMoney(r.numbers[col])}${suffix}</td>`;
            }
            const val = r.formatted && r.formatted[col] ? r.formatted[col] : "";
            if (col === "หมายเหตุ" && val) {
              return `<td class="col-remark">${linkifyText(val)}</td>`;
            }
            return `<td>${val ? esc(val) : "-"}</td>`;
          })
          .join("");

        return `<tr class="clickable-row" data-uid="${esc(r.uid)}" data-sheet-id="${esc(r.sheetId)}">${tds}</tr>`;
      })
      .join("");

    return `
      <table class="data-table">
        <thead><tr>${theadHtml}</tr></thead>
        <tbody>${tbodyHtml}</tbody>
      </table>
    `;
  }

  function sortRows(rows, sort) {
    if (!sort || sort.col === "__default") return rows;
    const col = sort.col;
    const mul = sort.dir === "asc" ? 1 : -1;

    return rows.slice().sort((a, b) => {
      if (col === "__meetings") {
        return (a.meetingCount - b.meetingCount) * mul;
      }
      if (col === "PA") {
        return a.pa.localeCompare(b.pa, "th") * mul;
      }
      if (col === "ลำดับ") {
        const na = parseFloat(a.seq) || 999999;
        const nb = parseFloat(b.seq) || 999999;
        return (na - nb) * mul;
      }
      if (a.numbers && b.numbers && (a.numbers[col] != null || b.numbers[col] != null)) {
        const na = a.numbers[col] ?? -1;
        const nb = b.numbers[col] ?? -1;
        return (na - nb) * mul;
      }
      if (a.dates && b.dates && (a.dates[col] || b.dates[col])) {
        const da = a.dates[col] ? a.dates[col].getTime() : 0;
        const db = b.dates[col] ? b.dates[col].getTime() : 0;
        return (da - db) * mul;
      }
      const sa = (a.formatted[col] || "").toString();
      const sb = (b.formatted[col] || "").toString();
      return sa.localeCompare(sb, "th") * mul;
    });
  }

  function bindRowClickHandlers() {
    el.mainContent.querySelectorAll("tr.clickable-row").forEach((tr) => {
      tr.addEventListener("click", (e) => {
        if (e.target && e.target.closest("a")) return;
        const uid = tr.getAttribute("data-uid");
        const sheetId = tr.getAttribute("data-sheet-id");
        openDetailModal(sheetId, uid);
      });
    });
  }

  function openDetailModal(sheetId, uid) {
    const ds = state.dataset && state.dataset.sheetDatasets[sheetId];
    if (!ds) return;
    const record = ds.rows.find((r) => r.uid === uid);
    if (!record) return;

    el.detailModalSheetBadge.textContent = record.sheetName;
    el.detailModalSheetBadge.style.background = `${record.sheetAccent}18`;
    el.detailModalSheetBadge.style.color = record.sheetAccent;
    el.detailModalTitle.textContent = record.title;

    const regularEntries = [];
    ds.columns.forEach((col) => {
      const label = col.label || col.id;
      if (/^ประชุมครั้งที่\s*\d+/.test(label)) return;
      const val = record.formatted[label];
      if (val === "" || val == null) return;
      if (label === "งาน" || label === "งาน / โครงการ") return;
      regularEntries.push({ label, val, isNumber: record.numbers[label] != null });
    });

    const fieldsHtml = regularEntries
      .map((item) => {
        let displayVal = linkifyText(item.val);
        if (item.label === "สถานะแบบ" || item.label === "สถานะ" || item.label === "สถานะการก่อสร้าง") {
          displayVal = esc(item.val);
        }
        return `
          <div class="detail-field">
            <div class="detail-field-label">${esc(item.label)}</div>
            <div class="detail-field-value">${displayVal}</div>
          </div>
        `;
      })
      .join("");

    const meetingsHtml = record.meetings.length > 0
      ? `
        <div class="detail-meetings">
          <h4>ประวัติการประชุม (${record.meetings.length} ครั้ง)</h4>
          <div class="meeting-timeline">
            ${record.meetings
              .map(
                (m) => `
                <div class="meeting-chip">
                  <span class="meeting-chip-lbl">${esc(m.label)}</span>
                  <strong class="meeting-chip-date">${esc(m.dateText)}</strong>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      `
      : "";

    const sid = window.WorkloadEngine.extractSpreadsheetId(state.settings.spreadsheetId);
    const sheetUrl = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(sid)}/edit#gid=${encodeURIComponent(record.sheetGid)}`;

    el.detailModalBody.innerHTML = `
      <div class="detail-status-bar">
        <span><strong>ปีประเมิน:</strong> ${esc(record.pa)}</span>
        <span>${getStatusBadgeHtml(record.statusKey, record.statusRaw, record.statusLabel)}</span>
      </div>
      <div class="detail-grid">${fieldsHtml}</div>
      ${meetingsHtml}
      <div class="detail-footer">
        <a href="${esc(sheetUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">แก้ไข / ดูข้อมูลต้นฉบับใน Google Sheet ↗</a>
      </div>
    `;

    el.detailModal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeDetailModal() {
    el.detailModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function normalizeImageUrl(rawUrl) {
    const s = (rawUrl || "").trim();
    if (!s) return "";
    // Support Google Drive share links: /file/d/<ID>/view or ?id=<ID>
    const driveMatch = s.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) || s.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w400`;
    }
    return s;
  }

  function applyAvatarToElements(imgEl, fallbackEl, src) {
    if (!imgEl || !fallbackEl) return;
    if (!src) {
      imgEl.hidden = true;
      imgEl.removeAttribute("src");
      fallbackEl.hidden = false;
      return;
    }
    imgEl.onload = () => {
      imgEl.hidden = false;
      fallbackEl.hidden = true;
    };
    imgEl.onerror = () => {
      imgEl.hidden = true;
      fallbackEl.hidden = false;
    };
    imgEl.src = src;
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      imgEl.hidden = false;
      fallbackEl.hidden = true;
    }
  }

  function renderProfileAvatar() {
    const custom = normalizeImageUrl(state.settings.profileImage);
    if (custom) {
      applyAvatarToElements(el.profileAvatarImg, el.profileAvatarFallback, custom);
      return;
    }

    const candidates = (window.WORKLOAD_CONFIG.owner && window.WORKLOAD_CONFIG.owner.defaultAvatarCandidates) || [];
    if (candidates.length === 0) {
      applyAvatarToElements(el.profileAvatarImg, el.profileAvatarFallback, "");
      return;
    }

    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        applyAvatarToElements(el.profileAvatarImg, el.profileAvatarFallback, "");
        return;
      }
      const probe = new Image();
      const candidateSrc = candidates[idx++];
      probe.onload = () => {
        applyAvatarToElements(el.profileAvatarImg, el.profileAvatarFallback, candidateSrc);
      };
      probe.onerror = tryNext;
      probe.src = candidateSrc;
    };
    tryNext();
  }

  function resizeImageFileToDataUrl(file, maxSize = 320) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const size = Math.min(maxSize, Math.max(img.width, img.height));
          const scale = size / Math.max(img.width, img.height);
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.88));
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function openSettingsModal() {
    el.sheetIdInput.value = state.settings.spreadsheetId;
    el.profileImageUrlInput.value = state.settings.profileImage || "";
    const previewSrc = normalizeImageUrl(state.settings.profileImage) || (el.profileAvatarImg.hidden ? "" : el.profileAvatarImg.src);
    applyAvatarToElements(el.settingsAvatarPreview, el.settingsAvatarFallback, previewSrc);
    renderSheetsEditor(state.settings.sheets);
    el.settingsModal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeSettingsModal() {
    el.settingsModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  function renderSheetsEditor(sheets) {
    el.sheetsEditorBody.innerHTML = sheets
      .map(
        (s, idx) => `
        <tr data-idx="${idx}">
          <td><input type="text" class="input-sm edit-name" value="${esc(s.name)}" placeholder="ชื่อชีท"></td>
          <td><input type="text" class="input-sm edit-gid" value="${esc(s.gid)}" placeholder="GID"></td>
          <td>
            <select class="input-sm edit-group">
              ${window.WORKLOAD_CONFIG.groups
                .map((g) => `<option value="${esc(g.id)}" ${s.group === g.id ? "selected" : ""}>${esc(g.label)}</option>`)
                .join("")}
            </select>
          </td>
          <td><button type="button" class="btn-icon-danger remove-sheet-row" title="ลบ">✕</button></td>
        </tr>
      `
      )
      .join("");

    el.sheetsEditorBody.querySelectorAll(".remove-sheet-row").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const row = e.target.closest("tr");
        if (row && el.sheetsEditorBody.children.length > 1) {
          row.remove();
        }
      });
    });
  }

  function collectEditedSettings() {
    const newId = window.WorkloadEngine.extractSpreadsheetId(el.sheetIdInput.value) || window.WORKLOAD_CONFIG.defaultSpreadsheetId;
    const rows = Array.from(el.sheetsEditorBody.querySelectorAll("tr"));
    const defaultByGid = {};
    window.WORKLOAD_CONFIG.defaultSheets.forEach((d) => {
      defaultByGid[d.gid] = d;
    });

    const sheets = rows
      .map((tr, idx) => {
        const name = tr.querySelector(".edit-name").value.trim();
        const gid = tr.querySelector(".edit-gid").value.trim();
        const group = tr.querySelector(".edit-group").value;
        if (!name || !gid) return null;
        const base = defaultByGid[gid] || state.settings.sheets.find((x) => x.gid === gid);
        if (base) {
          return { ...base, name, shortName: name, gid, group };
        }
        return {
          id: `custom_${gid}_${idx}`,
          gid,
          name,
          shortName: name,
          group,
          accent: "#2563EB",
          icon: "file-text",
          description: `ข้อมูลจากชีท ${name}`,
          titleCol: "งาน",
          statusCol: "สถานะ",
          ownerCol: "หน่วยงาน",
          budgetCols: [],
          primaryBudgetCol: null,
          dateCol: "วันที่",
          endDateCol: null,
          categoryCol: null,
          summaryCols: []
        };
      })
      .filter(Boolean);

    return {
      spreadsheetId: newId,
      sheets: sheets.length > 0 ? sheets : window.WORKLOAD_CONFIG.defaultSheets,
      autoRefreshMs: state.settings.autoRefreshMs,
      profileImage: (el.profileImageUrlInput ? el.profileImageUrlInput.value.trim() : "")
    };
  }

  function downloadCsv(filename, headers, matrix) {
    const escapeCell = (v) => {
      const s = String(v == null ? "" : v);
      return `"${s.replace(/"/g, '""')}"`;
    };
    const lines = [
      headers.map(escapeCell).join(","),
      ...matrix.map((row) => row.map(escapeCell).join(","))
    ];
    const bom = "\uFEFF";
    const blob = new Blob([bom + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportAllFilteredCsv(rows) {
    const headers = ["ชีท", "PA", "ลำดับ", "งาน / โครงการ", "หน่วยงาน", "สถานะ", "งบประมาณ/วงเงิน", "วันที่", "จำนวนประชุม", "หมายเหตุ"];
    const matrix = rows.map((r) => [
      r.sheetName,
      r.pa,
      r.seq,
      r.title,
      r.ownerRaw,
      r.statusRaw || r.statusLabel,
      r.budget != null ? r.budget : "",
      r.primaryDateText,
      r.meetingCount || "",
      r.remarks
    ]);
    downloadCsv(`workload_summary_${new Date().toISOString().slice(0, 10)}.csv`, headers, matrix);
  }

  function exportSheetCsv(cfg, columns, rows) {
    const headers = columns.map((c) => (c === "__meetings" ? "จำนวนประชุม" : c));
    const matrix = rows.map((r) =>
      columns.map((c) => {
        if (c === "__meetings") return r.meetingCount;
        return r.formatted[c] != null ? r.formatted[c] : "";
      })
    );
    downloadCsv(`${cfg.name}_${new Date().toISOString().slice(0, 10)}.csv`, headers, matrix);
  }

  function openMobileSidebar() {
    el.sidebar.classList.add("is-open");
    el.sidebarBackdrop.hidden = false;
  }

  function closeMobileSidebar() {
    el.sidebar.classList.remove("is-open");
    el.sidebarBackdrop.hidden = true;
  }

  function bindGlobalEvents() {
    el.menuToggle.addEventListener("click", openMobileSidebar);
    el.sidebarBackdrop.addEventListener("click", closeMobileSidebar);

    el.syncBtn.addEventListener("click", () => syncData({ silent: false }));

    el.autoRefreshSelect.addEventListener("change", () => {
      state.settings.autoRefreshMs = parseInt(el.autoRefreshSelect.value, 10) || 0;
      window.WorkloadEngine.saveSettings(state.settings);
      setupAutoRefresh();
    });

    el.statusFilterSelect.addEventListener("change", () => {
      state.filters.status = el.statusFilterSelect.value;
      recomputeAndRender();
    });

    let searchDebounce = null;
    el.searchInput.addEventListener("input", () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.filters.search = el.searchInput.value;
        recomputeAndRender();
      }, 150);
    });

    el.clearSearchBtn.addEventListener("click", () => {
      el.searchInput.value = "";
      state.filters.search = "";
      recomputeAndRender();
    });

    el.resetFiltersBtn.addEventListener("click", () => {
      state.filters = { pa: "ALL", status: "ALL", search: "" };
      el.searchInput.value = "";
      recomputeAndRender();
    });

    el.printBtn.addEventListener("click", () => window.print());

    el.detailModalClose.addEventListener("click", closeDetailModal);
    el.detailModal.addEventListener("click", (e) => {
      if (e.target === el.detailModal) closeDetailModal();
    });

    el.settingsBtn.addEventListener("click", openSettingsModal);
    el.profileAvatarBtn.addEventListener("click", openSettingsModal);
    el.settingsClose.addEventListener("click", closeSettingsModal);
    el.settingsModal.addEventListener("click", (e) => {
      if (e.target === el.settingsModal) closeSettingsModal();
    });

    el.profileImageUrlInput.addEventListener("input", () => {
      applyAvatarToElements(
        el.settingsAvatarPreview,
        el.settingsAvatarFallback,
        normalizeImageUrl(el.profileImageUrlInput.value)
      );
    });

    el.profileFileInput.addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      try {
        const dataUrl = await resizeImageFileToDataUrl(file);
        el.profileImageUrlInput.value = dataUrl;
        applyAvatarToElements(el.settingsAvatarPreview, el.settingsAvatarFallback, dataUrl);
      } catch (_) {}
      e.target.value = "";
    });

    el.clearProfileImageBtn.addEventListener("click", () => {
      el.profileImageUrlInput.value = "";
      applyAvatarToElements(el.settingsAvatarPreview, el.settingsAvatarFallback, "");
    });

    el.addSheetRowBtn.addEventListener("click", () => {
      const current = collectEditedSettings().sheets;
      current.push({
        name: "ชีทใหม่",
        gid: "",
        group: "general"
      });
      renderSheetsEditor(current);
    });

    el.resetDefaultSheetsBtn.addEventListener("click", () => {
      el.sheetIdInput.value = window.WORKLOAD_CONFIG.defaultSpreadsheetId;
      renderSheetsEditor(window.WORKLOAD_CONFIG.defaultSheets);
    });

    el.saveSettingsBtn.addEventListener("click", () => {
      state.settings = collectEditedSettings();
      window.WorkloadEngine.saveSettings(state.settings);
      renderProfileAvatar();
      closeSettingsModal();
      state.activeView = "overview";
      syncData({ silent: false });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeDetailModal();
        closeSettingsModal();
        closeMobileSidebar();
      }
    });
  }

  function init() {
    cacheDom();
    bindGlobalEvents();
    renderProfileAvatar();
    setupAutoRefresh();
    updateSyncHeader();

    // Show cached snapshot immediately if available while fetching live data
    const cached = window.WorkloadEngine.loadCache();
    if (cached) {
      state.dataset = cached;
      recomputeAndRender();
    } else {
      renderLoadingState();
    }

    syncData({ silent: Boolean(cached) });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
