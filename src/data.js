// LinkScore 360° — 4 Areas, 20 Assessment Items
// Independent naming, no third-party brand references

export const WHEEL_DATA = [
  {
    id: "C", color: "#0EA5E9", colorLight: "#0EA5E918", colorMid: "#0EA5E935",
    label: { ko: "컨셉 & 전략", en: "Concept & Strategy" },
    items: [
      { code: "C1", name: { ko: "핵심 아이디어", en: "Core Idea" }, desc: { ko: "핵심 사업 아이디어와 비전은 명확한가?", en: "Is your core business idea and vision clear?" }, questions: { ko: ["사업의 핵심 가치를 한 문장으로 설명할 수 있는가?", "시장에서 해결하고자 하는 문제가 분명한가?", "3년 후 비전이 구체적인가?"], en: ["Can you describe your core value in one sentence?", "Is the problem you're solving clearly defined?", "Do you have a concrete 3-year vision?"] } },
      { code: "C2", name: { ko: "제품 & 서비스", en: "Products & Services" }, desc: { ko: "제품/서비스 구성이 체계적인가?", en: "Is your product/service portfolio well-structured?" }, questions: { ko: ["주력 제품/서비스가 명확한가?", "수익성 높은 상품과 미끼 상품이 구분되어 있는가?", "신규 서비스 개발 로드맵이 있는가?"], en: ["Is your flagship product/service clearly defined?", "Are high-margin and lead-gen products differentiated?", "Do you have a new service development roadmap?"] } },
      { code: "C3", name: { ko: "수익 구조", en: "Revenue Structure" }, desc: { ko: "수익 구조가 안정적이고 확장 가능한가?", en: "Is your revenue structure stable and scalable?" }, questions: { ko: ["반복 수익(recurring revenue)이 있는가?", "가격 정책이 시장 대비 적절한가?", "수익 다각화가 되어 있는가?"], en: ["Do you have recurring revenue streams?", "Is your pricing competitive?", "Are your revenue sources diversified?"] } },
      { code: "C4", name: { ko: "고객 구성", en: "Customer Base" }, desc: { ko: "고객 구성이 건강하고 다양한가?", en: "Is your customer base healthy and diverse?" }, questions: { ko: ["상위 고객 의존도가 너무 높지 않은가?", "이상적인 고객 프로필(ICP)이 정의되어 있는가?", "고객 생애 가치(LTV)를 측정하고 있는가?"], en: ["Is client concentration risk managed?", "Is your Ideal Customer Profile (ICP) defined?", "Are you tracking Customer Lifetime Value (LTV)?"] } },
      { code: "C5", name: { ko: "시장 포지셔닝", en: "Market Positioning" }, desc: { ko: "시장에서의 위치와 차별화가 명확한가?", en: "Is your market position and differentiation clear?" }, questions: { ko: ["경쟁사 대비 차별화 포인트가 있는가?", "타겟 시장에서 인지도가 있는가?", "시장 점유율을 파악하고 있는가?"], en: ["Do you have clear competitive advantages?", "Are you recognized in your target market?", "Do you track your market share?"] } },
    ],
  },
  {
    id: "T", color: "#8B5CF6", colorLight: "#8B5CF618", colorMid: "#8B5CF635",
    label: { ko: "팀 & 조직", en: "Team & Organization" },
    items: [
      { code: "T1", name: { ko: "거버넌스", en: "Governance" }, desc: { ko: "소유 구조와 거버넌스가 적절한가?", en: "Is your ownership structure and governance adequate?" }, questions: { ko: ["의사결정 구조가 명확한가?", "외부 어드바이저/이사회가 있는가?", "지분 구조가 성장에 적합한가?"], en: ["Is your decision-making structure clear?", "Do you have external advisors or a board?", "Is your equity structure growth-friendly?"] } },
      { code: "T2", name: { ko: "인재 관리", en: "Talent" }, desc: { ko: "인재 확보와 관리가 잘 되고 있는가?", en: "Are talent acquisition and management effective?" }, questions: { ko: ["핵심 인재가 확보되어 있는가?", "직원 만족도를 관리하고 있는가?", "채용 및 온보딩 프로세스가 있는가?"], en: ["Are key positions filled?", "Do you track employee satisfaction?", "Is there a hiring and onboarding process?"] } },
      { code: "T3", name: { ko: "파트너십", en: "Partnerships" }, desc: { ko: "전략적 파트너십이 구축되어 있는가?", en: "Are strategic partnerships established?" }, questions: { ko: ["핵심 파트너가 있는가?", "파트너십에서 상호 가치를 만들고 있는가?", "새로운 파트너 발굴을 적극적으로 하고 있는가?"], en: ["Do you have key partners?", "Are partnerships creating mutual value?", "Are you actively developing new partnerships?"] } },
      { code: "T4", name: { ko: "업무 프로세스", en: "Processes" }, desc: { ko: "업무 프로세스가 체계적인가?", en: "Are your business processes systematic?" }, questions: { ko: ["핵심 업무 SOP가 문서화되어 있는가?", "프로세스 자동화를 활용하고 있는가?", "품질 관리 체계가 있는가?"], en: ["Are core SOPs documented?", "Do you use process automation?", "Is there a quality management system?"] } },
      { code: "T5", name: { ko: "법률 & 규정", en: "Legal & Compliance" }, desc: { ko: "법적 리스크가 잘 관리되고 있는가?", en: "Are legal risks well-managed?" }, questions: { ko: ["계약서 관리가 체계적인가?", "지적재산권이 보호되고 있는가?", "컴플라이언스를 준수하고 있는가?"], en: ["Is contract management organized?", "Is your IP protected?", "Are you compliant with regulations?"] } },
    ],
  },
  {
    id: "M", color: "#F59E0B", colorLight: "#F59E0B18", colorMid: "#F59E0B35",
    label: { ko: "마케팅 & 성장", en: "Marketing & Growth" },
    items: [
      { code: "M1", name: { ko: "네트워킹", en: "Networking" }, desc: { ko: "비즈니스 네트워크가 활발한가?", en: "Is your business network active?" }, questions: { ko: ["업계 행사에 정기적으로 참여하는가?", "핵심 의사결정자와 관계가 있는가?", "추천/소개를 통한 비즈니스가 있는가?"], en: ["Do you attend industry events regularly?", "Are you connected with key decision-makers?", "Do you generate business through referrals?"] } },
      { code: "M2", name: { ko: "마케팅 전략", en: "Marketing Strategy" }, desc: { ko: "마케팅 전략과 실행이 효과적인가?", en: "Are marketing strategy and execution effective?" }, questions: { ko: ["마케팅 전략이 문서화되어 있는가?", "디지털 마케팅을 적극 활용하고 있는가?", "마케팅 ROI를 측정하고 있는가?"], en: ["Is your marketing strategy documented?", "Are you leveraging digital marketing?", "Do you measure marketing ROI?"] } },
      { code: "M3", name: { ko: "세일즈 & CS", en: "Sales & Service" }, desc: { ko: "영업과 고객 서비스가 체계적인가?", en: "Are sales and customer service systematic?" }, questions: { ko: ["세일즈 파이프라인을 관리하고 있는가?", "고객 서비스 만족도를 측정하는가?", "세일즈 프로세스가 표준화되어 있는가?"], en: ["Do you manage a sales pipeline?", "Do you measure customer satisfaction?", "Is your sales process standardized?"] } },
      { code: "M4", name: { ko: "커뮤니케이션", en: "Communications" }, desc: { ko: "대외 커뮤니케이션이 전략적인가?", en: "Is external communication strategic?" }, questions: { ko: ["브랜드 메시지가 일관성 있는가?", "미디어/PR 활동을 하고 있는가?", "위기 커뮤니케이션 계획이 있는가?"], en: ["Is your brand message consistent?", "Are you doing media/PR activities?", "Do you have a crisis communication plan?"] } },
      { code: "M5", name: { ko: "브랜딩", en: "Branding" }, desc: { ko: "브랜드 아이덴티티가 확립되어 있는가?", en: "Is your brand identity established?" }, questions: { ko: ["브랜드 가이드라인이 있는가?", "일관된 비주얼 아이덴티티를 유지하는가?", "브랜드 스토리가 명확한가?"], en: ["Do you have brand guidelines?", "Is your visual identity consistent?", "Is your brand story clear?"] } },
    ],
  },
  {
    id: "O", color: "#10B981", colorLight: "#10B98118", colorMid: "#10B98135",
    label: { ko: "운영 & 재무", en: "Operations & Finance" },
    items: [
      { code: "O1", name: { ko: "재무 관리", en: "Financial Management" }, desc: { ko: "재무 관리가 체계적인가?", en: "Is financial management systematic?" }, questions: { ko: ["월별 손익을 정확히 파악하고 있는가?", "현금 흐름 예측을 하고 있는가?", "재무 목표가 설정되어 있는가?"], en: ["Do you track monthly P&L accurately?", "Do you forecast cash flow?", "Are financial targets set?"] } },
      { code: "O2", name: { ko: "자금 전략", en: "Funding Strategy" }, desc: { ko: "자금 확보 전략이 있는가?", en: "Do you have a funding strategy?" }, questions: { ko: ["성장을 위한 자금 계획이 있는가?", "다양한 자금 조달 옵션을 검토했는가?", "투자자 관계를 관리하고 있는가?"], en: ["Do you have a growth funding plan?", "Have you explored various funding options?", "Do you manage investor relations?"] } },
      { code: "O3", name: { ko: "서비스 딜리버리", en: "Service Delivery" }, desc: { ko: "서비스 전달이 효율적인가?", en: "Is service delivery efficient?" }, questions: { ko: ["서비스 품질이 일정하게 유지되는가?", "납기/딜리버리가 적시에 이루어지는가?", "생산성 향상 노력을 하고 있는가?"], en: ["Is service quality consistent?", "Are deliveries made on time?", "Are you working on productivity improvements?"] } },
      { code: "O4", name: { ko: "기술 & 시스템", en: "Technology & Systems" }, desc: { ko: "IT 인프라가 비즈니스를 잘 지원하는가?", en: "Does technology infrastructure support your business?" }, questions: { ko: ["핵심 업무 도구/소프트웨어가 갖춰져 있는가?", "데이터 보안이 관리되고 있는가?", "자동화 도구를 활용하고 있는가?"], en: ["Are essential tools/software in place?", "Is data security managed?", "Are you utilizing automation tools?"] } },
      { code: "O5", name: { ko: "시설 & 환경", en: "Facilities" }, desc: { ko: "업무 환경과 시설이 적절한가?", en: "Are work environment and facilities adequate?" }, questions: { ko: ["사무실/작업 공간이 적절한가?", "원격근무 인프라가 갖춰져 있는가?", "장비/설비 상태가 양호한가?"], en: ["Is the office/workspace adequate?", "Is remote work infrastructure in place?", "Is equipment in good condition?"] } },
    ],
  },
];

export const ALL_ITEMS = WHEEL_DATA.flatMap((q) =>
  q.items.map((item) => ({ ...item, quadrant: q }))
);

export const APPS_SCRIPT_CODE = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  
  if (sheet.getLastRow() === 0) {
    var headers = ['Date', 'Assessor', 'Company', 'Overall',
      'C1','C2','C3','C4','C5','T1','T2','T3','T4','T5',
      'M1','M2','M3','M4','M5','O1','O2','O3','O4','O5',
      'C Avg', 'T Avg', 'M Avg', 'O Avg'];
    sheet.appendRow(headers);
  }
  
  var row = [data.date, data.assessor, data.company, data.overall];
  ['C1','C2','C3','C4','C5','T1','T2','T3','T4','T5',
   'M1','M2','M3','M4','M5','O1','O2','O3','O4','O5']
    .forEach(function(c) { row.push(data.scores[c] || ''); });
  row.push(data.quadrantAvg.C, data.quadrantAvg.T, data.quadrantAvg.M, data.quadrantAvg.O);
  
  sheet.appendRow(row);
  return ContentService.createTextOutput(
    JSON.stringify({status: 'success'})
  ).setMimeType(ContentService.MimeType.JSON);
}`;
