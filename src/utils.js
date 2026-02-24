import { WHEEL_DATA, ALL_ITEMS } from './data';

const STORAGE_KEY = 'linkscore-360-data';

// ─── Score Helpers ───
export const getScoreColor = (s) =>
  s >= 8 ? '#10B981' : s >= 6 ? '#F59E0B' : s >= 4 ? '#F97316' : '#EF4444';

export const getScoreLabel = (s, t) => {
  if (s >= 8) return t.excellent;
  if (s >= 6) return t.good;
  if (s >= 4) return t.average;
  if (s >= 1) return t.needsWork;
  return '—';
};

export const getQuadrantAvg = (q, scores) => {
  const s = q.items.map((i) => scores[i.code]).filter((v) => v !== undefined);
  return s.length ? s.reduce((a, b) => a + b, 0) / s.length : 0;
};

export const getOverallAvg = (scores) => {
  const v = Object.values(scores);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
};

// ─── Local Storage ───
export const saveToLocal = (scores, meta) => {
  try {
    const data = { scores, meta, lastSaved: new Date().toISOString(), version: '1.0' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data.lastSaved;
  } catch (e) {
    return null;
  }
};

export const loadFromLocal = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const clearLocal = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
};

// ─── JSON Export/Import ───
export const exportJSON = (scores, meta) => {
  const data = { scores, meta, exportDate: new Date().toISOString(), version: '1.0' };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `growthwheel-${meta.company || 'assessment'}-${meta.date}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.scores) resolve(data);
        else reject(new Error('Invalid format'));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// ─── Google Sheets ───
export const sendToSheets = async (url, scores, meta) => {
  const payload = {
    date: meta.date,
    assessor: meta.assessor,
    company: meta.company,
    overall: getOverallAvg(scores).toFixed(1),
    scores,
    quadrantAvg: Object.fromEntries(
      WHEEL_DATA.map((q) => [q.id, getQuadrantAvg(q, scores).toFixed(1)])
    ),
  };
  await fetch(url, { method: 'POST', body: JSON.stringify(payload), mode: 'no-cors' });
};

// ─── PDF Export ───
export const exportPDF = (scores, meta, lang, t) => {
  const w = window.open('', '_blank');
  if (!w) return;

  const rows = ALL_ITEMS.map((item) => {
    const s = scores[item.code];
    const color = s !== undefined ? getScoreColor(s) : '#999';
    return `<tr>
      <td style="padding:8px;font-weight:700;color:${item.quadrant.color}">${item.code}</td>
      <td style="padding:8px">${item.name[lang]}</td>
      <td style="padding:8px;text-align:center;font-weight:700;color:${color}">${s !== undefined ? s + '/10' : '—'}</td>
      <td style="padding:8px"><div style="background:#eee;border-radius:4px;height:16px;width:100%"><div style="background:${color};height:100%;border-radius:4px;width:${((s || 0) / 10) * 100}%"></div></div></td>
    </tr>`;
  }).join('');

  const quadrantRows = WHEEL_DATA.map((q) => {
    const avg = getQuadrantAvg(q, scores);
    return `<tr>
      <td style="padding:10px;font-weight:700;color:${q.color}">${q.id}</td>
      <td style="padding:10px">${q.label[lang]}</td>
      <td style="padding:10px;text-align:center;font-weight:700;color:${avg > 0 ? getScoreColor(avg) : '#999'}">${avg > 0 ? avg.toFixed(1) : '—'}</td>
    </tr>`;
  }).join('');

  const overall = getOverallAvg(scores);

  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${t.pdfTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;800&family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
      body{font-family:'Plus Jakarta Sans','Noto Sans KR',sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a1a}
      h1{font-size:28px;margin-bottom:4px} h2{font-size:18px;margin-top:32px;border-bottom:2px solid #ddd;padding-bottom:8px}
      table{width:100%;border-collapse:collapse;margin-top:16px} th{text-align:left;padding:10px;background:#f5f5f5;font-size:13px}
      td{border-bottom:1px solid #eee;font-size:13px}
      .overall{text-align:center;padding:24px;background:#f8f9fa;border-radius:12px;margin:20px 0}
      .overall .num{font-size:48px;font-weight:900} .meta{color:#666;font-size:13px;margin-top:8px}
      @media print{body{padding:20px} .no-print{display:none}}
    </style>
  </head><body>
    <h1>${t.pdfTitle}</h1>
    <div class="meta">${meta.assessor ? t.assessor + ': ' + meta.assessor + ' | ' : ''}${meta.company ? t.company + ': ' + meta.company + ' | ' : ''}${t.date}: ${meta.date}</div>
    <div class="overall">
      <div class="num" style="color:${getScoreColor(overall)}">${overall.toFixed(1)}</div>
      <div>${t.overallAvg} — ${getScoreLabel(overall, t)}</div>
    </div>
    <h2>${t.areaSummary}</h2>
    <table><thead><tr><th>ID</th><th>${t.area}</th><th>${t.avg}</th></tr></thead><tbody>${quadrantRows}</tbody></table>
    <h2>${t.detailedScores}</h2>
    <table><thead><tr><th>ID</th><th>${t.item}</th><th>${t.score}</th><th></th></tr></thead><tbody>${rows}</tbody></table>
    <div style="margin-top:40px;text-align:center;color:#999;font-size:11px">
      GrowthWheel® 360° Self-Assessment · Linkplus LLC · ${new Date().toLocaleDateString()}
    </div>
    <script>setTimeout(()=>window.print(),600)<\/script>
  </body></html>`);
  w.document.close();
};
