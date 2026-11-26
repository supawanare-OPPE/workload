/**
 * Live Google Sheets Data Engine (JSONP + Cache + Normalizer + Analytics)
 */

window.WorkloadEngine = (function () {
  const CACHE_KEY = "supawan_workload_cache_v1";
  const SETTINGS_KEY = "supawan_workload_settings_v1";

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          spreadsheetId: parsed.spreadsheetId || window.WORKLOAD_CONFIG.defaultSpreadsheetId,
          sheets: Array.isArray(parsed.sheets) && parsed.sheets.length > 0
            ? parsed.sheets
            : window.WORKLOAD_CONFIG.defaultSheets,
          autoRefreshMs: typeof parsed.autoRefreshMs === "number" ? parsed.autoRefreshMs : 0,
          profileImage: typeof parsed.profileImage === "string" ? parsed.profileImage : ""
        };
      }
    } catch (_) {}
    return {
      spreadsheetId: window.WORKLOAD_CONFIG.defaultSpreadsheetId,
      sheets: window.WORKLOAD_CONFIG.defaultSheets,
      autoRefreshMs: 0,
      profileImage: ""
    };
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (_) {}
  }

  function extractSpreadsheetId(input) {
    if (!input) return "";
    const trimmed = input.trim();
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : trimmed;
  }

  function fetchGvizJsonp(spreadsheetId, gid, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const cbName = `__gviz_cb_${gid}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
      const script = document.createElement("script");
      let settled = false;

      const cleanup = () => {
        if (script.parentNode) script.parentNode.removeChild(script);
        try {
          delete window[cbName];
        } catch (_) {
          window[cbName] = undefined;
        }
      };

      const timer = setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error(`Timeout loading gid=${gid}`));
      }, timeoutMs);

      window[cbName] = (response) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanup();
        if (!response || response.status === "error") {
          const msg = response && response.errors && response.errors[0]
            ? response.errors[0].detailed_message || response.errors[0].message
            : "Google Sheets returned an error";
          reject(new Error(msg));
          return;
        }
        resolve(response);
      };

      script.onerror = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanup();
        reject(new Error(`Network error loading gid=${gid}`));
      };

      const cacheBust = Date.now();
      script.src = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(spreadsheetId)}/gviz/tq?tqx=out:json;responseHandler:${cbName}&headers=1&gid=${encodeURIComponent(gid)}&_t=${cacheBust}`;
      document.head.appendChild(script);
    });
  }

  function parseGvizDate(cell) {
    if (!cell) return null;
    if (typeof cell.v === "string") {
      const m = cell.v.match(/^Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/);
      if (m) {
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const d = parseInt(m[3], 10);
        return new Date(y, mo, d);
      }
    }
    if (cell.v instanceof Date) return cell.v;
    const str = (cell.f || cell.v || "").toString().trim();
    const dmy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmy) {
      let y = parseInt(dmy[3], 10);
      if (y > 2400) y -= 543;
      return new Date(y, parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10));
    }
    return null;
  }

  function formatDateDisplay(cell, parsedDate) {
    if (cell && cell.f && cell.f.toString().trim()) {
      return cell.f.toString().trim();
    }
    if (parsedDate instanceof Date && !isNaN(parsedDate)) {
      const d = parsedDate.getDate();
      const m = parsedDate.getMonth() + 1;
      const y = parsedDate.getFullYear();
      return `${d}/${m}/${y}`;
    }
    return cell && cell.v != null ? String(cell.v).trim() : "";
  }

  function parseNumber(cell) {
    if (!cell) return null;
    if (typeof cell.v === "number" && !isNaN(cell.v)) return cell.v;
    const raw = (cell.f || cell.v || "").toString().replace(/,/g, "").trim();
    if (!raw || isNaN(Number(raw))) return null;
    return Number(raw);
  }

  function normalizeStatus(rawStatus, sheetId) {
    const s = (rawStatus || "").toString().trim();
    if (!s) {
      return {
        key: "unspecified",
        label: "ไม่ระบุ",
        raw: ""
      };
    }

    if (s.includes("ไม่ได้เข้าร่วม")) {
      return { key: "not_attended", label: "ไม่ได้เข้าร่วม", raw: s };
    }
    if (s === "เข้าร่วม" || s.includes("เข้าร่วม")) {
      return { key: "completed", label: "เข้าร่วม", raw: s };
    }
    if (
      s.includes("ยกเลิก") ||
      s.includes("ชะลอ") ||
      s.includes("สั่งหยุดงาน") ||
      s.includes("หยุดงาน")
    ) {
      return { key: "cancelled", label: "ยกเลิก / ชะลอ / หยุดงาน", raw: s };
    }
    if (s.includes("กำลังดำเนินการ") || s.includes("กำลังก่อสร้าง")) {
      return { key: "in_progress", label: "กำลังดำเนินการ", raw: s };
    }
    if (s.includes("ยังไม่ดำเนินการ") || s.includes("รอดำเนินการ")) {
      return { key: "not_started", label: "ยังไม่ดำเนินการ", raw: s };
    }
    if (
      s.includes("เสร็จ") ||
      s.includes("สมบูรณ์") ||
      s.includes("ตรวจรับแล้ว")
    ) {
      return { key: "completed", label: sheetId === "public_service" ? "เข้าร่วม" : "แล้วเสร็จ", raw: s };
    }

    return { key: "in_progress", label: s, raw: s };
  }

  function normalizePa(rawPa) {
    const s = (rawPa || "").toString().trim().replace(/\s+/g, " ");
    if (!s) return "";
    const m = s.match(/PA\s*(\d{4})/i);
    return m ? `PA ${m[1]}` : s;
  }

  function parseSheetTable(sheetCfg, gvizResponse) {
    const table = gvizResponse && gvizResponse.table;
    if (!table || !Array.isArray(table.cols) || !Array.isArray(table.rows)) {
      return { columns: [], rows: [], rawRowCount: 0 };
    }

    const rawCols = table.cols.map((col, idx) => ({
      index: idx,
      id: col.id || `C${idx}`,
      label: (col.label || "").trim(),
      type: col.type || "string"
    }));

    // Determine active columns (columns with a meaningful label or actual data)
    const activeColIndices = new Set();
    rawCols.forEach((col, idx) => {
      const isGenericPlaceholder = /^(Column \d+|คอลัมน์ \d+)$/i.test(col.label);
      if (col.label && !isGenericPlaceholder) {
        activeColIndices.add(idx);
        return;
      }
      // Check if any row has non-empty content in this column
      const hasVal = table.rows.some((r) => {
        const cell = r && r.c && r.c[idx];
        if (!cell) return false;
        const txt = (cell.f != null ? cell.f : cell.v != null ? cell.v : "").toString().trim();
        return txt !== "" && txt !== "false" && txt !== "FALSE";
      });
      if (hasVal) activeColIndices.add(idx);
    });

    const columns = rawCols.filter((c) => activeColIndices.has(c.index));
    const colByLabel = {};
    columns.forEach((c) => {
      if (c.label && !(c.label in colByLabel)) {
        colByLabel[c.label] = c;
      }
    });

    const records = [];
    let lastValidPa = "";

    table.rows.forEach((rawRow, rowIdx) => {
      const cells = rawRow && rawRow.c ? rawRow.c : [];
      const values = {};
      const formatted = {};
      const dates = {};
      const numbers = {};

      columns.forEach((col) => {
        const cell = col.index < cells.length ? cells[col.index] : null;
        const key = col.label || col.id;
        if (!cell || (cell.v == null && cell.f == null)) {
          values[key] = "";
          formatted[key] = "";
          return;
        }
        if (col.type === "date" || (typeof cell.v === "string" && cell.v.startsWith("Date("))) {
          const dt = parseGvizDate(cell);
          const disp = formatDateDisplay(cell, dt);
          values[key] = disp;
          formatted[key] = disp;
          if (dt) dates[key] = dt;
        } else if (col.type === "number" || typeof cell.v === "number") {
          const num = parseNumber(cell);
          values[key] = num;
          formatted[key] = cell.f != null ? String(cell.f).trim() : (num != null ? String(num) : "");
          if (num != null) numbers[key] = num;
        } else if (col.type === "boolean" || typeof cell.v === "boolean") {
          values[key] = Boolean(cell.v);
          formatted[key] = cell.v ? "ใช่" : "ไม่";
        } else {
          const txt = (cell.f != null ? cell.f : cell.v).toString().trim();
          values[key] = txt;
          formatted[key] = txt;
        }
      });

      const titleKey = sheetCfg.titleCol in formatted
        ? sheetCfg.titleCol
        : ( "งาน" in formatted ? "งาน" : ("งาน / โครงการ" in formatted ? "งาน / โครงการ" : null) );
      const title = titleKey ? (formatted[titleKey] || "").trim() : "";

      const paRaw = formatted["PA"] || "";
      const paNorm = normalizePa(paRaw);
      if (paNorm) lastValidPa = paNorm;

      const seqRaw = (formatted["ลำดับ"] || formatted["ลำดับ PA 2569"] || "").trim();
      const statusRaw = sheetCfg.statusCol ? (formatted[sheetCfg.statusCol] || "").trim() : "";
      const ownerRaw = sheetCfg.ownerCol ? (formatted[sheetCfg.ownerCol] || "").trim() : "";
      const dateRaw = sheetCfg.dateCol ? (formatted[sheetCfg.dateCol] || "").trim() : "";

      // Filter out empty template rows, section divider rows, and summary total rows
      if (!title) return;
      if (/^PA\s*\d{4}$/i.test(seqRaw)) return;
      if (/^(รวมมูลค่า|รวมทั้งสิ้น|รวมทั้งหมด|รวมงบประมาณ)/i.test(title)) return;
      if (
        /^(คณะกรรมการ|ภาระงานที่ได้รับมอบหมาย|อนุมัติพื้นที่\s*\/)/i.test(title) &&
        !statusRaw &&
        !ownerRaw &&
        !dateRaw
      ) {
        return;
      }

      // Collect meetings if applicable
      const meetings = [];
      columns.forEach((col) => {
        if (/^ประชุมครั้งที่\s*\d+/.test(col.label)) {
          const mVal = (formatted[col.label] || "").trim();
          if (mVal) {
            meetings.push({
              label: col.label,
              dateText: mVal,
              dateObj: dates[col.label] || null
            });
          }
        }
      });

      // Primary & extra budgets
      const primaryBudget = sheetCfg.primaryBudgetCol && numbers[sheetCfg.primaryBudgetCol] != null
        ? numbers[sheetCfg.primaryBudgetCol]
        : null;
      const actualBudget = numbers["งบประมาณก่อสร้างจริง"] != null
        ? numbers["งบประมาณก่อสร้างจริง"]
        : null;

      // Primary date for sorting/timeline
      let primaryDate = null;
      if (sheetCfg.dateCol && dates[sheetCfg.dateCol]) {
        primaryDate = dates[sheetCfg.dateCol];
      } else if (meetings.length > 0 && meetings[0].dateObj) {
        primaryDate = meetings[0].dateObj;
      } else {
        const firstDateKey = Object.keys(dates)[0];
        if (firstDateKey) primaryDate = dates[firstDateKey];
      }

      const normStatus = normalizeStatus(statusRaw, sheetCfg.id);
      const effectivePa = paNorm || lastValidPa || "ไม่ระบุ PA";

      // Split multi-value owner/agency tags (e.g. "OTHER, VS")
      const owners = ownerRaw
        ? ownerRaw.split(",").map((x) => x.trim()).filter(Boolean)
        : [];

      const searchText = [
        sheetCfg.name,
        effectivePa,
        title,
        statusRaw,
        ownerRaw,
        formatted["ผู้รับจ้าง"] || "",
        formatted["ลักษณะงาน"] || "",
        formatted["ประเภท"] || "",
        formatted["ขอบเขตงานที่ดำเนินการ"] || "",
        formatted["หมายเหตุ"] || "",
        formatted["สถานะการก่อสร้าง"] || ""
      ]
        .join(" ")
        .toLowerCase();

      records.push({
        uid: `${sheetCfg.id}_${rowIdx}`,
        sheetId: sheetCfg.id,
        sheetName: sheetCfg.name,
        sheetGid: sheetCfg.gid,
        sheetAccent: sheetCfg.accent,
        rowIndex: rowIdx,
        pa: effectivePa,
        seq: seqRaw,
        title,
        statusRaw,
        statusKey: normStatus.key,
        statusLabel: normStatus.label,
        secondaryStatus: sheetCfg.secondaryStatusCol ? (formatted[sheetCfg.secondaryStatusCol] || "").trim() : "",
        ownerRaw,
        owners,
        category: sheetCfg.categoryCol ? (formatted[sheetCfg.categoryCol] || "").trim() : "",
        tags: sheetCfg.tagCol ? (formatted[sheetCfg.tagCol] || "").trim() : "",
        budget: primaryBudget,
        actualBudget,
        primaryDate,
        primaryDateText: dateRaw || (meetings[0] ? meetings[0].dateText : ""),
        endDateText: sheetCfg.endDateCol ? (formatted[sheetCfg.endDateCol] || "").trim() : "",
        meetings,
        meetingCount: meetings.length,
        remarks: (formatted["หมายเหตุ"] || "").trim(),
        formatted,
        values,
        numbers,
        dates,
        searchText
      });
    });

    return {
      columns,
      rows: records,
      rawRowCount: table.rows.length
    };
  }

  async function loadAllSheets(settings) {
    const spreadsheetId = extractSpreadsheetId(settings.spreadsheetId);
    const results = await Promise.allSettled(
      settings.sheets.map(async (sheetCfg) => {
        const resp = await fetchGvizJsonp(spreadsheetId, sheetCfg.gid);
        const parsed = parseSheetTable(sheetCfg, resp);
        return {
          config: sheetCfg,
          ...parsed,
          loadedAt: new Date().toISOString(),
          error: null
        };
      })
    );

    const sheetDatasets = {};
    const errors = [];
    let successCount = 0;

    results.forEach((res, idx) => {
      const cfg = settings.sheets[idx];
      if (res.status === "fulfilled") {
        sheetDatasets[cfg.id] = res.value;
        successCount++;
      } else {
        errors.push({ sheetId: cfg.id, sheetName: cfg.name, message: res.reason?.message || "Load failed" });
        sheetDatasets[cfg.id] = {
          config: cfg,
          columns: [],
          rows: [],
          rawRowCount: 0,
          loadedAt: null,
          error: res.reason?.message || "Load failed"
        };
      }
    });

    if (successCount > 0) {
      saveCache({
        spreadsheetId,
        savedAt: new Date().toISOString(),
        sheetDatasets
      });
    }

    return {
      spreadsheetId,
      fetchedAt: new Date(),
      fromCache: false,
      successCount,
      totalSheets: settings.sheets.length,
      errors,
      sheetDatasets
    };
  }

  function saveCache(payload) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.sheetDatasets) return null;
      // Rehydrate Date objects
      Object.values(parsed.sheetDatasets).forEach((ds) => {
        (ds.rows || []).forEach((r) => {
          if (r.primaryDate) r.primaryDate = new Date(r.primaryDate);
        });
      });
      return {
        spreadsheetId: parsed.spreadsheetId,
        fetchedAt: parsed.savedAt ? new Date(parsed.savedAt) : new Date(),
        fromCache: true,
        successCount: Object.keys(parsed.sheetDatasets).length,
        totalSheets: Object.keys(parsed.sheetDatasets).length,
        errors: [],
        sheetDatasets: parsed.sheetDatasets
      };
    } catch (_) {
      return null;
    }
  }

  function collectAllPaYears(sheetDatasets) {
    const set = new Set();
    Object.values(sheetDatasets).forEach((ds) => {
      (ds.rows || []).forEach((r) => {
        if (r.pa && r.pa !== "ไม่ระบุ PA") set.add(r.pa);
      });
    });
    return Array.from(set).sort((a, b) => {
      const na = parseInt((a.match(/\d+/) || ["0"])[0], 10);
      const nb = parseInt((b.match(/\d+/) || ["0"])[0], 10);
      return na - nb;
    });
  }

  function filterRows(rows, filters) {
    const q = (filters.search || "").trim().toLowerCase();
    return rows.filter((r) => {
      if (filters.pa !== "ALL" && r.pa !== filters.pa) return false;
      if (filters.status !== "ALL" && r.statusKey !== filters.status) return false;
      if (q && !r.searchText.includes(q)) return false;
      return true;
    });
  }

  function computeAnalytics(sheets, sheetDatasets, filters) {
    const allPaYears = collectAllPaYears(sheetDatasets);
    const bySheet = [];
    const allFilteredRows = [];

    const statusCounts = {
      completed: 0,
      in_progress: 0,
      not_started: 0,
      cancelled: 0,
      not_attended: 0,
      unspecified: 0
    };

    const paBreakdown = {};
    allPaYears.forEach((pa) => {
      paBreakdown[pa] = { pa, total: 0, completed: 0, in_progress: 0, other: 0 };
    });

    const agencyCounts = {};
    let totalDesignBudget = 0;
    let totalDesignActualBudget = 0;
    let totalSupervisionBudget = 0;
    let totalCommitteePriceBudget = 0;
    let totalMeetings = 0;

    sheets.forEach((cfg) => {
      const ds = sheetDatasets[cfg.id];
      const rawRows = ds ? ds.rows : [];
      const rows = filterRows(rawRows, filters);

      const sCounts = {
        completed: 0,
        in_progress: 0,
        not_started: 0,
        cancelled: 0,
        not_attended: 0,
        unspecified: 0
      };

      let sheetMeetings = 0;
      let sheetBudget = 0;

      rows.forEach((r) => {
        allFilteredRows.push(r);
        sCounts[r.statusKey] = (sCounts[r.statusKey] || 0) + 1;
        statusCounts[r.statusKey] = (statusCounts[r.statusKey] || 0) + 1;

        sheetMeetings += r.meetingCount || 0;
        totalMeetings += r.meetingCount || 0;

        if (r.budget != null && !isNaN(r.budget)) {
          sheetBudget += r.budget;
          if (cfg.id === "design") totalDesignBudget += r.budget;
          if (cfg.id === "supervision") totalSupervisionBudget += r.budget;
          if (cfg.id === "committee_price") totalCommitteePriceBudget += r.budget;
        }
        if (cfg.id === "design" && r.actualBudget != null && !isNaN(r.actualBudget)) {
          totalDesignActualBudget += r.actualBudget;
        }

        if (r.pa && paBreakdown[r.pa]) {
          paBreakdown[r.pa].total++;
          if (r.statusKey === "completed") paBreakdown[r.pa].completed++;
          else if (r.statusKey === "in_progress") paBreakdown[r.pa].in_progress++;
          else paBreakdown[r.pa].other++;
        }

        if (r.ownerRaw) {
          // Group primary agency tag (e.g. OP, OPPE, OTHER, or sub-unit like VS, GR)
          const tokens = r.owners.length ? r.owners : [r.ownerRaw];
          const primaryTag = tokens[0];
          agencyCounts[primaryTag] = (agencyCounts[primaryTag] || 0) + 1;
          if (tokens.length > 1) {
            const subTag = `${tokens[0]} (${tokens.slice(1).join(", ")})`;
            agencyCounts[subTag] = agencyCounts[subTag] || 0; // kept for potential drilldown
          }
        }
      });

      bySheet.push({
        config: cfg,
        rows,
        total: rows.length,
        rawTotal: rawRows.length,
        counts: sCounts,
        meetings: sheetMeetings,
        budget: sheetBudget,
        error: ds ? ds.error : null
      });
    });

    const totalTasks = allFilteredRows.length;
    const actionableTotal = totalTasks - statusCounts.not_attended - statusCounts.cancelled;
    const completionRate = actionableTotal > 0
      ? Math.round((statusCounts.completed / actionableTotal) * 100)
      : 0;

    // Active attention items (in_progress, not_started, or stopped)
    const activeItems = allFilteredRows
      .filter((r) => r.statusKey === "in_progress" || r.statusKey === "not_started" || (r.statusRaw && r.statusRaw.includes("หยุดงาน")))
      .sort((a, b) => {
        const da = a.primaryDate ? a.primaryDate.getTime() : 0;
        const db = b.primaryDate ? b.primaryDate.getTime() : 0;
        return db - da;
      });

    // Top agencies
    const topAgencies = Object.entries(agencyCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    return {
      allPaYears,
      totalTasks,
      statusCounts,
      completionRate,
      bySheet,
      paSeries: Object.values(paBreakdown),
      topAgencies,
      activeItems,
      financials: {
        designBudget: totalDesignBudget,
        designActualBudget: totalDesignActualBudget,
        supervisionBudget: totalSupervisionBudget,
        committeePriceBudget: totalCommitteePriceBudget
      },
      totalMeetings,
      allFilteredRows
    };
  }

  return {
    loadSettings,
    saveSettings,
    extractSpreadsheetId,
    loadAllSheets,
    loadCache,
    filterRows,
    computeAnalytics
  };
})();
