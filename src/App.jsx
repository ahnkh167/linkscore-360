import { useState, useEffect, useCallback, useRef } from 'react';
import { T } from './i18n';
import { WHEEL_DATA, ALL_ITEMS, APPS_SCRIPT_CODE } from './data';
import {
  getScoreColor, getScoreLabel, getQuadrantAvg, getOverallAvg,
  saveToLocal, loadFromLocal, clearLocal,
  exportJSON, importJSON, sendToSheets, exportPDF,
} from './utils';

// ─── Reusable button style ───
const btnStyle = (bg, color, extra = {}) => ({
  background: bg, color, border: 'none', borderRadius: '10px',
  padding: '10px 16px', fontSize: '13px', fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.2s', ...extra,
});

export default function App() {
  const [lang, setLang] = useState('ko');
  const [scores, setScores] = useState({});
  const [meta, setMeta] = useState({ assessor: '', company: '', date: new Date().toISOString().split('T')[0] });
  const [activeQuadrant, setActiveQuadrant] = useState(null);
  const [assessmentItem, setAssessmentItem] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [toast, setToast] = useState(null);
  const [showSheets, setShowSheets] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const fileInputRef = useRef(null);
  const t = T[lang];

  // Load saved data on mount
  useEffect(() => {
    const saved = loadFromLocal();
    if (saved) {
      if (saved.scores) setScores(saved.scores);
      if (saved.meta) setMeta(saved.meta);
      if (saved.lastSaved) setLastSaved(saved.lastSaved);
    }
  }, []);

  // Auto-save on change
  useEffect(() => {
    if (Object.keys(scores).length === 0) return;
    const timer = setTimeout(() => {
      const ts = saveToLocal(scores, meta);
      if (ts) setLastSaved(ts);
    }, 500);
    return () => clearTimeout(timer);
  }, [scores, meta]);

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); setShowInstallBanner(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const setScore = useCallback((code, value) => {
    setScores((prev) => ({ ...prev, [code]: value }));
  }, []);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importJSON(file);
      setScores(data.scores);
      if (data.meta) setMeta(data.meta);
      showToast(t.loaded);
    } catch { showToast('❌ Invalid file'); }
    e.target.value = '';
  };

  const handleSendSheets = async () => {
    if (!sheetsUrl) return;
    try {
      await sendToSheets(sheetsUrl, scores, meta);
      showToast(t.sheetsSent);
    } catch { showToast('❌ Failed'); }
  };

  const completedCount = Object.keys(scores).length;
  const progress = (completedCount / 20) * 100;
  const overall = getOverallAvg(scores);

  // ─── SVG Wheel helpers ───
  const cx = 250, cy = 250, outerR = 230, innerR = 70, midR = 145;
  const angles = [
    { start: -Math.PI, end: -Math.PI / 2 },
    { start: -Math.PI / 2, end: 0 },
    { start: 0, end: Math.PI / 2 },
    { start: Math.PI / 2, end: Math.PI },
  ];
  const polar = (r, a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  const slicePath = (ir, or, sa, ea) => {
    const os = polar(or, sa), oe = polar(or, ea), is_ = polar(ir, sa), ie = polar(ir, ea);
    const la = ea - sa > Math.PI ? 1 : 0;
    return `M${os.x},${os.y} A${or},${or} 0 ${la} 1 ${oe.x},${oe.y} L${ie.x},${ie.y} A${ir},${ir} 0 ${la} 0 ${is_.x},${is_.y} Z`;
  };
  const scoreSlice = (ir, or, sa, ea, score) => slicePath(ir, ir + ((or - ir) * (score || 0)) / 10, sa, ea);

  return (
    <div style={{ minHeight: '100vh', minHeight: '100dvh', background: 'linear-gradient(160deg, #0C1117 0%, #151D2B 40%, #0C1117 100%)', padding: '20px 16px', paddingBottom: showInstallBanner ? '80px' : '20px' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#1F2937', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 24px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, zIndex: 999, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        {/* Language toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
          {['ko', 'en'].map((l) => (
            <button key={l} onClick={() => setLang(l)} style={{
              ...btnStyle(lang === l ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', lang === l ? '#fff' : '#6B7280'),
              padding: '6px 16px', fontSize: '12px', border: `1px solid ${lang === l ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              {l === 'ko' ? '🇰🇷 한국어' : '🇺🇸 English'}
            </button>
          ))}
        </div>

        <h1 style={{ fontSize: '34px', fontWeight: 900, margin: 0, background: 'linear-gradient(135deg, #0EA5E9, #8B5CF6, #F59E0B, #10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {t.title}
        </h1>
        <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px', letterSpacing: '3px' }}>{t.subtitle}</p>

        {/* Meta fields */}
        <div style={{ display: 'flex', gap: '8px', maxWidth: '500px', margin: '12px auto 0', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[['assessor', t.assessorName], ['company', t.companyName], ['date', t.date]].map(([key, ph]) => (
            <input key={key} type={key === 'date' ? 'date' : 'text'} value={meta[key]}
              onChange={(e) => setMeta((p) => ({ ...p, [key]: e.target.value }))} placeholder={ph}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', color: '#D1D5DB', fontSize: '12px', flex: key === 'date' ? '0 0 140px' : '1 1 120px', outline: 'none' }} />
          ))}
        </div>

        {/* Progress */}
        <div style={{ maxWidth: '400px', margin: '12px auto 0', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', borderRadius: '10px', background: progress === 100 ? 'linear-gradient(90deg,#10B981,#34D399)' : 'linear-gradient(90deg,#0EA5E9,#8B5CF6)', transition: 'width 0.5s' }} />
        </div>
        <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
          {t.progress(completedCount, 20)} {progress === 100 && t.done}
          {lastSaved && <span style={{ marginLeft: '8px', color: '#4B5563' }}>· {t.autoSaved}</span>}
        </p>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
          {[
            { label: t.save, onClick: () => { exportJSON(scores, meta); showToast(t.saved); } },
            { label: t.load, onClick: () => fileInputRef.current?.click() },
            { label: t.exportPdf, onClick: () => exportPDF(scores, meta, lang, t) },
            { label: t.exportSheets, onClick: () => setShowSheets(true) },
          ].map((b) => (
            <button key={b.label} onClick={b.onClick} style={{
              ...btnStyle('rgba(255,255,255,0.05)', '#9CA3AF'),
              fontSize: '11px', padding: '6px 11px', border: '1px solid rgba(255,255,255,0.08)',
            }}>{b.label}</button>
          ))}
          <button onClick={() => { if (window.confirm(t.confirmReset)) { setScores({}); setMeta({ assessor: '', company: '', date: new Date().toISOString().split('T')[0] }); clearLocal(); } }} style={{
            ...btnStyle('rgba(239,68,68,0.1)', '#EF4444'),
            fontSize: '11px', padding: '6px 11px', border: '1px solid rgba(239,68,68,0.2)',
          }}>{t.resetAll}</button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </div>
      </div>

      {/* Google Sheets Modal */}
      {showSheets && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowSheets(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: '#1a2332', borderRadius: '20px', padding: '24px', maxWidth: '500px', width: '100%', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '17px', fontWeight: 800 }}>{t.sheetsGuide}</h3>
            <div style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.8, marginBottom: '14px' }}>
              <p>{t.sheetsStep1}</p><p>{t.sheetsStep2}</p><p>{t.sheetsStep3}</p><p>{t.sheetsStep4}</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '14px', marginBottom: '14px', position: 'relative' }}>
              <pre style={{ fontSize: '9px', color: '#8B9DC3', overflow: 'auto', maxHeight: '180px', margin: 0, whiteSpace: 'pre-wrap' }}>{APPS_SCRIPT_CODE}</pre>
              <button onClick={() => { navigator.clipboard?.writeText(APPS_SCRIPT_CODE); showToast(t.copied); }}
                style={btnStyle('rgba(255,255,255,0.1)', '#fff', { position: 'absolute', top: 8, right: 8, fontSize: '10px', padding: '4px 10px' })}>
                {t.copyCode}
              </button>
            </div>
            <input type="text" placeholder={t.sheetsUrl} value={sheetsUrl} onChange={(e) => setSheetsUrl(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleSendSheets} disabled={!sheetsUrl} style={btnStyle(sheetsUrl ? 'linear-gradient(135deg,#3D6B5E,#1E3A5F)' : 'rgba(255,255,255,0.05)', sheetsUrl ? '#fff' : '#4B5563', { flex: 1 })}>{t.sheetsSend}</button>
              <button onClick={() => setShowSheets(false)} style={btnStyle('rgba(255,255,255,0.06)', '#9CA3AF')}>{t.sheetsClose}</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div style={{ display: 'flex', gap: '20px', maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start' }}>
        {/* SVG Wheel */}
        <div style={{ flexShrink: 0, maxWidth: '100%' }}>
          <svg width="500" height="500" viewBox="0 0 500 500" style={{ maxWidth: '100%', height: 'auto' }}>
            {WHEEL_DATA.map((q, qi) => {
              const { start, end } = angles[qi];
              const gap = 0.025;
              const isAct = activeQuadrant === q.id;

              return (
                <g key={q.id}>
                  <path d={slicePath(innerR, outerR, start + gap, end - gap)} fill={isAct ? q.colorMid : q.colorLight} stroke={q.color} strokeWidth={isAct ? 2 : 0.8} strokeOpacity={isAct ? 1 : 0.4} style={{ cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setActiveQuadrant(isAct ? null : q.id)} />

                  {q.items.map((item, j) => {
                    const span = (end - start - gap * 2) / q.items.length;
                    const iS = start + gap + j * span + 0.005, iE = iS + span - 0.01;
                    const score = scores[item.code], isH = hoveredSlice === item.code;

                    return (
                      <g key={item.code}>
                        {score !== undefined && <path d={scoreSlice(innerR + 1, outerR - 1, iS, iE, score)} fill={`${getScoreColor(score)}45`} style={{ pointerEvents: 'none', transition: 'all 0.5s' }} />}
                        <path d={slicePath(midR - 10, outerR, iS, iE)} fill={isH ? `${q.color}50` : 'transparent'} stroke={isAct ? `${q.color}50` : 'transparent'} strokeWidth={0.5} style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseEnter={() => { setHoveredSlice(item.code); setActiveQuadrant(q.id); }} onMouseLeave={() => setHoveredSlice(null)}
                          onClick={() => setAssessmentItem(item.code)} />
                        {isAct && (() => {
                          const mA = (iS + iE) / 2, p = polar((midR + outerR) / 2 + 8, mA);
                          return (<g>
                            <text x={p.x} y={p.y - 6} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '9px', fill: isH ? '#fff' : q.color, fontWeight: 700, pointerEvents: 'none' }}>{item.code}</text>
                            <text x={p.x} y={p.y + 6} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '7.5px', fill: '#9CA3AF', pointerEvents: 'none' }}>{item.name[lang]}</text>
                            {score !== undefined && <text x={p.x} y={p.y + 18} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '10px', fill: getScoreColor(score), fontWeight: 800, pointerEvents: 'none' }}>{score}</text>}
                          </g>);
                        })()}
                      </g>
                    );
                  })}

                  {/* Quadrant label */}
                  {(() => {
                    const mA = (start + end) / 2, p = polar((innerR + midR) / 2 - 5, mA), avg = getQuadrantAvg(q, scores);
                    return (<g style={{ cursor: 'pointer' }} onClick={() => setActiveQuadrant(isAct ? null : q.id)}>
                      <text x={p.x} y={p.y - 8} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: isAct ? '12px' : '10.5px', fill: isAct ? '#fff' : '#ccc', fontWeight: 800, pointerEvents: 'none', transition: 'all 0.3s' }}>{q.label[lang]}</text>
                      <text x={p.x} y={p.y + 6} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '7.5px', fill: '#6B7280', pointerEvents: 'none' }}>{q.label[lang === 'ko' ? 'en' : 'ko']}</text>
                      {avg > 0 && <text x={p.x} y={p.y + 20} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '11px', fill: getScoreColor(avg), fontWeight: 800, pointerEvents: 'none' }}>{avg.toFixed(1)}</text>}
                    </g>);
                  })()}
                </g>
              );
            })}

            {/* Center */}
            <circle cx={cx} cy={cy} r={innerR} fill="#151D2B" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
            {overall > 0 ? (
              <g>
                <text x={cx} y={cy - 12} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '9px', fill: '#6B7280', letterSpacing: '2px' }}>OVERALL</text>
                <text x={cx} y={cy + 8} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '24px', fill: getScoreColor(overall), fontWeight: 900 }}>{overall.toFixed(1)}</text>
                <text x={cx} y={cy + 24} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '9px', fill: getScoreColor(overall), fontWeight: 600 }}>{getScoreLabel(overall, t)}</text>
              </g>
            ) : (
              <g>
                <text x={cx} y={cy - 6} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '13px', fill: '#fff', fontWeight: 800, letterSpacing: '1px' }}>LINKSCORE</text>
                <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '9px', fill: '#6B7280', letterSpacing: '3px' }}>360°</text>
              </g>
            )}

            {/* Dividers */}
            {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((a, i) => {
              const p1 = polar(innerR, a), p2 = polar(outerR, a);
              return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
            })}
          </svg>
        </div>

        {/* Right Panel */}
        <div style={{ width: '360px', maxWidth: '100%', minHeight: '400px' }}>
          {assessmentItem ? (() => {
            const found = ALL_ITEMS.find((i) => i.code === assessmentItem);
            if (!found) return null;
            const cs = scores[found.code];

            return (
              <div className="fade-in" style={{ background: 'rgba(17,24,39,0.9)', borderRadius: '20px', padding: '22px', border: `1px solid ${found.quadrant.color}40`, backdropFilter: 'blur(10px)' }}>
                <button onClick={() => setAssessmentItem(null)} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', fontSize: '12px', padding: 0, marginBottom: '12px' }}>{t.backToList}</button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ background: found.quadrant.color, color: '#fff', fontWeight: 800, fontSize: '13px', padding: '5px 11px', borderRadius: '8px' }}>{found.code}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{found.name[lang]}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#6B7280' }}>{found.name[lang === 'ko' ? 'en' : 'ko']}</p>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.6, marginBottom: '14px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>{found.desc[lang]}</p>

                <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px', letterSpacing: '1px' }}>{t.checklist}</p>
                {found.questions[lang].map((q, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '5px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                    <span style={{ color: found.quadrant.color, fontSize: '12px', flexShrink: 0 }}>▸</span>
                    <span style={{ fontSize: '12px', color: '#D1D5DB', lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}

                <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '14px', marginBottom: '8px', letterSpacing: '1px' }}>{t.scoreLabel}</p>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button key={n} onClick={() => setScore(found.code, n)} style={{
                      width: '38px', height: '38px', borderRadius: '9px',
                      border: cs === n ? `2px solid ${getScoreColor(n)}` : '1px solid rgba(255,255,255,0.1)',
                      background: cs === n ? `${getScoreColor(n)}20` : 'rgba(255,255,255,0.03)',
                      color: cs === n ? getScoreColor(n) : '#9CA3AF',
                      fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    }}>{n}</button>
                  ))}
                </div>
                {cs && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '10px', background: `${getScoreColor(cs)}12`, border: `1px solid ${getScoreColor(cs)}25`, fontSize: '13px', fontWeight: 700, color: getScoreColor(cs) }}>
                    {cs}/10 — {getScoreLabel(cs, t)}
                  </div>
                )}

                {/* Prev/Next */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                  {(() => {
                    const idx = ALL_ITEMS.findIndex((i) => i.code === assessmentItem);
                    const prev = idx > 0 ? ALL_ITEMS[idx - 1] : null;
                    const next = idx < ALL_ITEMS.length - 1 ? ALL_ITEMS[idx + 1] : null;
                    return (<>
                      {prev && <button onClick={() => setAssessmentItem(prev.code)} style={btnStyle('rgba(255,255,255,0.04)', '#9CA3AF', { flex: 1, fontSize: '11px', border: '1px solid rgba(255,255,255,0.08)' })}>← {prev.code}</button>}
                      {next && <button onClick={() => setAssessmentItem(next.code)} style={btnStyle('rgba(255,255,255,0.04)', '#9CA3AF', { flex: 1, fontSize: '11px', border: '1px solid rgba(255,255,255,0.08)' })}>{next.code} →</button>}
                    </>);
                  })()}
                </div>
              </div>
            );
          })() : (
            <div>
              {/* Quadrant accordion list */}
              {WHEEL_DATA.map((q) => {
                const isExp = activeQuadrant === q.id, avg = getQuadrantAvg(q, scores);
                return (
                  <div key={q.id} style={{ marginBottom: '6px' }}>
                    <button onClick={() => setActiveQuadrant(isExp ? null : q.id)} style={{
                      width: '100%', padding: '11px 14px', borderRadius: '12px',
                      background: isExp ? `${q.color}18` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isExp ? q.color + '40' : 'rgba(255,255,255,0.06)'}`,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.3s', textAlign: 'left',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ background: q.color, color: '#fff', fontWeight: 800, fontSize: '10px', padding: '3px 7px', borderRadius: '5px' }}>{q.id}</span>
                        <span style={{ fontSize: '13px', fontWeight: 700 }}>{q.label[lang]}</span>
                        <span style={{ fontSize: '10px', color: '#6B7280' }}>{q.label[lang === 'ko' ? 'en' : 'ko']}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {avg > 0 && <span style={{ fontSize: '12px', fontWeight: 800, color: getScoreColor(avg) }}>{avg.toFixed(1)}</span>}
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>{isExp ? '▾' : '▸'}</span>
                      </div>
                    </button>

                    {isExp && (
                      <div style={{ padding: '4px 0 4px 6px' }}>
                        {q.items.map((item) => {
                          const s = scores[item.code];
                          return (
                            <button key={item.code} onClick={() => setAssessmentItem(item.code)} style={{
                              width: '100%', padding: '9px 11px', marginTop: '3px', borderRadius: '9px',
                              border: '1px solid rgba(255,255,255,0.05)',
                              background: s !== undefined ? `${getScoreColor(s)}06` : 'rgba(255,255,255,0.02)',
                              color: '#D1D5DB', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              textAlign: 'left', transition: 'all 0.2s',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: q.color, width: '24px' }}>{item.code}</span>
                                <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.name[lang]}</span>
                              </div>
                              {s !== undefined ? (
                                <span style={{ fontSize: '11px', fontWeight: 800, color: getScoreColor(s), background: `${getScoreColor(s)}12`, padding: '2px 8px', borderRadius: '6px' }}>{s}/10</span>
                              ) : (
                                <span style={{ fontSize: '10px', color: '#4B5563' }}>{t.evaluate}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Results */}
              {completedCount > 0 && (
                <button onClick={() => setShowResults(!showResults)} style={{
                  width: '100%', marginTop: '12px', padding: '12px', borderRadius: '12px',
                  background: completedCount === 20 ? 'linear-gradient(135deg,#10B981,#059669)' : 'linear-gradient(135deg,#0EA5E9,#8B5CF6)',
                  border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700,
                }}>
                  {showResults ? t.hideResults : t.viewResults(completedCount, 20)}
                </button>
              )}

              {showResults && (
                <div className="fade-in" style={{ marginTop: '10px', padding: '16px', borderRadius: '16px', background: 'rgba(17,24,39,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <h3 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800 }}>{t.resultSummary}</h3>

                  <div style={{ textAlign: 'center', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', marginBottom: '14px' }}>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: getScoreColor(overall) }}>{overall.toFixed(1)}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>{t.overallAvg} — {getScoreLabel(overall, t)}</div>
                  </div>

                  {WHEEL_DATA.map((q) => {
                    const avg = getQuadrantAvg(q, scores);
                    return (
                      <div key={q.id} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: q.color }}>{q.id} · {q.label[lang]}</span>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: avg > 0 ? getScoreColor(avg) : '#4B5563' }}>{avg > 0 ? `${avg.toFixed(1)} ${getScoreLabel(avg, t)}` : t.notEvaluated}</span>
                        </div>
                        <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ width: `${(avg / 10) * 100}%`, height: '100%', borderRadius: '3px', background: avg > 0 ? getScoreColor(avg) : 'transparent', transition: 'width 0.5s' }} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginTop: '4px' }}>
                          {q.items.map((item) => {
                            const s = scores[item.code];
                            return (
                              <span key={item.code} style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: s !== undefined ? `${getScoreColor(s)}12` : 'rgba(255,255,255,0.03)', color: s !== undefined ? getScoreColor(s) : '#4B5563', fontWeight: 600 }}>
                                {item.code}:{s ?? '—'}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Strengths/Weaknesses */}
                  {completedCount >= 5 && (() => {
                    const sorted = ALL_ITEMS.filter((i) => scores[i.code] !== undefined).sort((a, b) => scores[b.code] - scores[a.code]);
                    return (
                      <div style={{ marginTop: '14px' }}>
                        <div style={{ padding: '10px', borderRadius: '10px', marginBottom: '6px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                          <p style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', margin: '0 0 6px' }}>{t.strengths}</p>
                          {sorted.slice(0, 3).map((item) => (
                            <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                              <span style={{ color: '#D1D5DB' }}>{item.code} {item.name[lang]}</span>
                              <span style={{ fontWeight: 800, color: '#10B981' }}>{scores[item.code]}/10</span>
                            </div>
                          ))}
                        </div>
                        <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                          <p style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', margin: '0 0 6px' }}>{t.improvements}</p>
                          {sorted.slice(-3).reverse().map((item) => (
                            <div key={item.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                              <span style={{ color: '#D1D5DB' }}>{item.code} {item.name[lang]}</span>
                              <span style={{ fontWeight: 800, color: '#EF4444' }}>{scores[item.code]}/10</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap', fontSize: '10px', color: '#6B7280' }}>
        {[{ l: t.legend[0], c: '#EF4444' }, { l: t.legend[1], c: '#F97316' }, { l: t.legend[2], c: '#F59E0B' }, { l: t.legend[3], c: '#10B981' }].map(({ l, c }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} /><span>{l}</span>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'center', color: '#1F2937', fontSize: '9px', marginTop: '16px', letterSpacing: '2px' }}>LINKSCORE 360° — LINKPLUS LLC</p>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="pwa-install-banner">
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>{t.installApp}</p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>{t.installDesc}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowInstallBanner(false)} style={btnStyle('transparent', '#6B7280', { padding: '8px 14px', fontSize: '12px' })}>{t.dismiss}</button>
            <button onClick={handleInstall} style={btnStyle('linear-gradient(135deg,#0EA5E9,#8B5CF6)', '#fff', { padding: '8px 18px', fontSize: '12px' })}>{t.install}</button>
          </div>
        </div>
      )}
    </div>
  );
}
