/**
 * Interactive SVG & HTML Chart Components
 */

window.WorkloadCharts = (function () {
  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderSheetWorkloadChart(container, bySheet, onSelectSheet) {
    if (!container) return;
    const maxTotal = Math.max(1, ...bySheet.map((s) => s.total));

    const legendHtml = `
      <div class="chart-legend-inline">
        <span><i class="dot dot-completed"></i>แล้วเสร็จ / เข้าร่วม</span>
        <span><i class="dot dot-progress"></i>กำลังดำเนินการ</span>
        <span><i class="dot dot-pending"></i>ยังไม่ดำเนินการ</span>
        <span><i class="dot dot-other"></i>ยกเลิก / ไม่ได้เข้าร่วม</span>
      </div>
    `;

    const rowsHtml = bySheet
      .map((s) => {
        const cDone = s.counts.completed || 0;
        const cProg = s.counts.in_progress || 0;
        const cPend = s.counts.not_started || 0;
        const cOther = (s.counts.cancelled || 0) + (s.counts.not_attended || 0) + (s.counts.unspecified || 0);
        const total = s.total || 0;

        const wDone = (cDone / maxTotal) * 100;
        const wProg = (cProg / maxTotal) * 100;
        const wPend = (cPend / maxTotal) * 100;
        const wOther = (cOther / maxTotal) * 100;

        const pctDone = total > 0 ? Math.round((cDone / total) * 100) : 0;

        return `
          <button type="button" class="hbar-row" data-sheet-id="${esc(s.config.id)}" title="คลิกเพื่อดูรายละเอียดชีท ${esc(s.config.name)}">
            <div class="hbar-label">
              <span class="sheet-dot" style="background:${esc(s.config.accent)}"></span>
              <span class="hbar-name">${esc(s.config.shortName || s.config.name)}</span>
            </div>
            <div class="hbar-track">
              ${cDone > 0 ? `<div class="hbar-seg seg-completed" style="width:${wDone.toFixed(2)}%" title="แล้วเสร็จ/เข้าร่วม: ${cDone}"></div>` : ""}
              ${cProg > 0 ? `<div class="hbar-seg seg-progress" style="width:${wProg.toFixed(2)}%" title="กำลังดำเนินการ: ${cProg}"></div>` : ""}
              ${cPend > 0 ? `<div class="hbar-seg seg-pending" style="width:${wPend.toFixed(2)}%" title="ยังไม่ดำเนินการ: ${cPend}"></div>` : ""}
              ${cOther > 0 ? `<div class="hbar-seg seg-other" style="width:${wOther.toFixed(2)}%" title="อื่นๆ/ยกเลิก/ไม่ได้เข้าร่วม: ${cOther}"></div>` : ""}
            </div>
            <div class="hbar-value">
              <strong>${total}</strong>
              <span class="hbar-pct">${total > 0 ? `${pctDone}%` : "-"}</span>
            </div>
          </button>
        `;
      })
      .join("");

    container.innerHTML = legendHtml + `<div class="hbar-list">${rowsHtml}</div>`;

    container.querySelectorAll(".hbar-row").forEach((btn) => {
      btn.addEventListener("click", () => {
        const sid = btn.getAttribute("data-sheet-id");
        if (onSelectSheet && sid) onSelectSheet(sid);
      });
    });
  }

  function renderPaTrendChart(container, paSeries, activePa, onSelectPa) {
    if (!container) return;
    if (!paSeries || paSeries.length === 0) {
      container.innerHTML = `<div class="empty-chart">ยังไม่มีข้อมูลปี PA</div>`;
      return;
    }

    const maxVal = Math.max(1, ...paSeries.map((d) => d.total));

    const barsHtml = paSeries
      .map((d) => {
        const hDone = (d.completed / maxVal) * 100;
        const hProg = (d.in_progress / maxVal) * 100;
        const hOther = (d.other / maxVal) * 100;
        const isSelected = activePa === d.pa;

        return `
          <button type="button" class="vbar-col ${isSelected ? "is-active" : ""}" data-pa="${esc(d.pa)}" title="คลิกเพื่อกรอง ${esc(d.pa)} (ทั้งหมด ${d.total} รายการ)">
            <div class="vbar-count">${d.total}</div>
            <div class="vbar-track">
              <div class="vbar-stack">
                ${d.other > 0 ? `<div class="vbar-seg seg-other" style="height:${hOther.toFixed(2)}%" title="อื่นๆ/ยกเลิก/ไม่ได้เข้าร่วม: ${d.other}"></div>` : ""}
                ${d.in_progress > 0 ? `<div class="vbar-seg seg-progress" style="height:${hProg.toFixed(2)}%" title="กำลังดำเนินการ: ${d.in_progress}"></div>` : ""}
                ${d.completed > 0 ? `<div class="vbar-seg seg-completed" style="height:${hDone.toFixed(2)}%" title="แล้วเสร็จ/เข้าร่วม: ${d.completed}"></div>` : ""}
              </div>
            </div>
            <div class="vbar-label">${esc(d.pa)}</div>
          </button>
        `;
      })
      .join("");

    container.innerHTML = `
      <div class="vbar-chart">${barsHtml}</div>
      <div class="chart-hint">คลิกแท่งปี PA เพื่อกรองข้อมูลทั้งหน้า (${activePa !== "ALL" ? `กำลังเลือก ${esc(activePa)} — คลิกซ้ำเพื่อแสดงทั้งหมด` : "แสดงทุกปี"})</div>
    `;

    container.querySelectorAll(".vbar-col").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pa = btn.getAttribute("data-pa");
        if (onSelectPa && pa) {
          onSelectPa(activePa === pa ? "ALL" : pa);
        }
      });
    });
  }

  function renderStatusDonut(container, statusCounts, totalTasks, activeStatus, onSelectStatus) {
    if (!container) return;

    const segments = [
      { key: "completed", label: "แล้วเสร็จ / เข้าร่วม", count: statusCounts.completed || 0, color: "#10B981" },
      { key: "in_progress", label: "กำลังดำเนินการ", count: statusCounts.in_progress || 0, color: "#F59E0B" },
      { key: "not_started", label: "ยังไม่ดำเนินการ", count: statusCounts.not_started || 0, color: "#64748B" },
      { key: "cancelled", label: "ยกเลิก / ชะลอ / หยุดงาน", count: statusCounts.cancelled || 0, color: "#EF4444" },
      { key: "not_attended", label: "ไม่ได้เข้าร่วม", count: statusCounts.not_attended || 0, color: "#94A3B8" }
    ];

    if (statusCounts.unspecified > 0) {
      segments.push({ key: "unspecified", label: "ไม่ระบุ", count: statusCounts.unspecified, color: "#CBD5E1" });
    }

    const r = 56;
    const cx = 74;
    const cy = 74;
    const circumference = 2 * Math.PI * r;
    let cumulative = 0;

    const arcsHtml = totalTasks > 0
      ? segments
          .filter((s) => s.count > 0)
          .map((s) => {
            const frac = s.count / totalTasks;
            const dash = frac * circumference;
            const offset = -cumulative * circumference;
            cumulative += frac;
            return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="transparent" stroke="${s.color}" stroke-width="18" stroke-dasharray="${dash.toFixed(2)} ${circumference.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" class="donut-arc" data-status="${esc(s.key)}"><title>${esc(s.label)}: ${s.count} (${Math.round(frac * 100)}%)</title></circle>`;
          })
          .join("")
      : `<circle cx="${cx}" cy="${cy}" r="${r}" fill="transparent" stroke="#E2E8F0" stroke-width="18"></circle>`;

    const legendHtml = segments
      .filter((s) => s.count > 0 || s.key === "completed" || s.key === "in_progress")
      .map((s) => {
        const pct = totalTasks > 0 ? Math.round((s.count / totalTasks) * 100) : 0;
        const isActive = activeStatus === s.key;
        return `
          <button type="button" class="donut-legend-item ${isActive ? "is-active" : ""}" data-status="${esc(s.key)}">
            <span class="legend-left">
              <i class="dot" style="background:${s.color}"></i>
              <span>${esc(s.label)}</span>
            </span>
            <span class="legend-right"><strong>${s.count}</strong> <em>(${pct}%)</em></span>
          </button>
        `;
      })
      .join("");

    container.innerHTML = `
      <div class="donut-wrap">
        <svg viewBox="0 0 148 148" class="donut-svg" aria-label="สัดส่วนสถานะงาน">
          <g transform="rotate(-90 ${cx} ${cy})">
            ${arcsHtml}
          </g>
          <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-center-num">${totalTasks}</text>
          <text x="${cx}" y="${cy + 14}" text-anchor="middle" class="donut-center-lbl">รายการ</text>
        </svg>
        <div class="donut-legend">${legendHtml}</div>
      </div>
    `;

    container.querySelectorAll("[data-status]").forEach((el) => {
      el.addEventListener("click", () => {
        const st = el.getAttribute("data-status");
        if (onSelectStatus && st) {
          onSelectStatus(activeStatus === st ? "ALL" : st);
        }
      });
    });
  }

  function renderHorizontalMetricBars(container, items, emptyText = "ไม่มีข้อมูล") {
    if (!container) return;
    if (!items || items.length === 0) {
      container.innerHTML = `<div class="empty-chart">${esc(emptyText)}</div>`;
      return;
    }

    const maxVal = Math.max(1, ...items.map((i) => i.count));
    const palette = ["#1E3A5F", "#2563EB", "#0D9488", "#7C3AED", "#D97706", "#EA580C", "#0891B2", "#475569"];

    container.innerHTML = `<div class="metric-bars">${items
      .map((item, idx) => {
        const w = (item.count / maxVal) * 100;
        const color = item.color || palette[idx % palette.length];
        return `
          <div class="metric-bar-row">
            <div class="metric-bar-head">
              <span class="metric-bar-name" title="${esc(item.name)}">${esc(item.name)}</span>
              <span class="metric-bar-val">${item.count} <small>${item.suffix || "รายการ"}</small></span>
            </div>
            <div class="metric-bar-track">
              <div class="metric-bar-fill" style="width:${w.toFixed(2)}%;background:${color}"></div>
            </div>
          </div>
        `;
      })
      .join("")}</div>`;
  }

  return {
    renderSheetWorkloadChart,
    renderPaTrendChart,
    renderStatusDonut,
    renderHorizontalMetricBars
  };
})();
