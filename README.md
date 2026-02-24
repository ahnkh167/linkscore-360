# LinkScore 360° — Business Growth Assessment
### by Linkplus LLC

비즈니스 성장을 위한 자가 진단 PWA 앱

---

## 🏗️ 프로젝트 구조

```
linkscore-pwa/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── apple-touch-icon.png
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx         ← 메인 UI
    ├── i18n.js         ← 한/영 번역
    ├── data.js         ← 20개 진단 항목
    └── utils.js        ← 저장/PDF/Sheets
```

## 📊 진단 영역 (4 Areas × 5 Items = 20)

| 영역 | ID | 항목 |
|------|-----|------|
| **C — 컨셉 & 전략** | C1~C5 | 핵심 아이디어, 제품&서비스, 수익 구조, 고객 구성, 시장 포지셔닝 |
| **T — 팀 & 조직** | T1~T5 | 거버넌스, 인재 관리, 파트너십, 업무 프로세스, 법률&규정 |
| **M — 마케팅 & 성장** | M1~M5 | 네트워킹, 마케팅 전략, 세일즈&CS, 커뮤니케이션, 브랜딩 |
| **O — 운영 & 재무** | O1~O5 | 재무 관리, 자금 전략, 서비스 딜리버리, 기술&시스템, 시설&환경 |

---

## 🚀 빠른 시작

```bash
cd linkscore-pwa
npm install
npm run dev
# → http://localhost:5173
```

## ☁️ Vercel 배포

```bash
# 방법 1: Vercel 웹사이트
# vercel.com → GitHub 연결 → Deploy

# 방법 2: CLI
npm i -g vercel
vercel --prod
```

## 🌐 Linkplus 도메인 연결

Vercel Dashboard → Settings → Domains:
```
도메인: linkscore.linkplusllc.com
DNS: CNAME → cname.vercel-dns.com
```

SSL 자동 적용 (PWA 필수 요건 충족)

## 📱 PWA 설치

- **Android**: Chrome → "앱 설치" 배너 또는 메뉴
- **iOS**: Safari → 공유 → "홈 화면에 추가"
- **Desktop**: Chrome/Edge 주소창 설치 아이콘

---

## ✅ 기능

| 기능 | 상세 |
|------|------|
| 🔄 한/영 토글 | 실시간 언어 전환 |
| 📝 20개 항목 평가 | 1~10점 스코어링 + 체크리스트 |
| 💾 자동 저장 | localStorage 기반 |
| 📤 JSON 백업 | 내보내기/불러오기 |
| 📊 Google Sheets | 시간별 데이터 추적 |
| 📄 PDF 리포트 | 인쇄/공유용 |
| 📱 PWA | 네이티브 앱 경험 |
| 🔒 오프라인 지원 | Service Worker |

---

Built with ❤️ by **Linkplus LLC** · Kansas City, MO
