// ═══ 안건 데이터 ═══
// resolution: 'bod'=이사회 결의, 'ordinary'=보통결의, 'special'=특별결의
// agmOnly: true → 정기주총에서만 기본 선택/필수 처리

// ── 이사회 전결 사항 ──
const AGENDA_BOD = [
  {id:'bod_ceo',       title:'대표이사 선임/교체',          desc:'이사회에서 대표이사 선임·교체, 각자/공동대표 전환 결의',             checked:false, resolution:'bod'},
  {id:'bod_remuneration', title:'이사 보수 지급기준 결정',  desc:'이사 개인별 보수 지급기준, 성과급·인센티브 기준 결정',               checked:false, resolution:'bod'},
  {id:'bod_contract',  title:'중요 계약·투자 결정',         desc:'이사회 결의가 필요한 중요 자산 취득·처분, 투자, 계약 체결',          checked:false, resolution:'bod'},
  {id:'bod_self_deal', title:'이사 등 자기거래 승인',       desc:'상법 제398조에 따른 이사·주요주주 이해관계 거래 사전 승인',          checked:false, resolution:'bod'},
  {id:'bod_treasury',  title:'자기주식 취득 결정',          desc:'이사회 결의에 의한 자기주식 취득 한도·방법·기간·목적 결정',         checked:false, resolution:'bod'},
  {id:'bod_business',  title:'신규사업 진출·중단',          desc:'신규사업 진출, 기존사업 중단, 사업부문 구조조정 등 중요 업무집행',   checked:false, resolution:'bod'},
];

// ── 주총 보통결의 사항 (정기주총·임시주총 공통) ──
const AGENDA_GSM_ORDINARY = [
  {id:'fs',           title:'재무제표 승인',            desc:'대차대조표, 손익계산서, 영업보고서 등 확정',                    checked:true,  always:true, agmOnly:true},
  {id:'director',     title:'이사 선임/재선임',         desc:'임기만료 또는 결원 이사의 선임',                                checked:false},
  {id:'auditor_elect',title:'감사/감사위원 선임',       desc:'감사 또는 감사위원회 위원 선임',                                checked:false},
  {id:'director_pay', title:'이사 보수 한도 승인',      desc:'이사 및 감사의 연간 보수 한도액 결정',                          checked:false},
  {id:'dividend',     title:'배당 결의',                desc:'현금배당·주식배당 결정, 1주당 배당금 확정',                     checked:false},
  {id:'outside_director', title:'사외이사(독립이사) 선임', desc:'상장사 사외이사 구성 요건 충족 (2026.7.23.부터 독립이사로 전환)', checked:false},
  {id:'stock_option', title:'스톡옵션(주식매수선택권) 부여', desc:'임직원 대상 스톡옵션 부여 승인',                          checked:false},
  {id:'exec_retire',  title:'퇴직금/퇴직위로금 지급',   desc:'퇴임 이사 등에 대한 퇴직위로금 지급 승인',                     checked:false},
];

// ── 주총 특별결의 사항 (정기주총·임시주총 공통) ──
const AGENDA_GSM_SPECIAL = [
  {id:'charter',          title:'정관 변경',               desc:'목적사업, 주식, 기관구성 등 정관 조항 변경 (출석 2/3 + 발행주식 1/3)',    checked:false},
  {id:'capital',          title:'자본금 변동 (감자 등)',    desc:'감자, 전환사채/신주인수권부사채 발행, 주식병합·분할 등',                   checked:false},
  {id:'hq_move',          title:'본점 이전 (정관변경 수반)',desc:'본점 소재지 변경 (정관변경+이전등기 수반)',                               checked:false},
  {id:'merger',           title:'합병/분할',                desc:'합병, 분할합병, 물적분할 등 (주총 특별결의 필요)',                         checked:false},
  {id:'business_transfer',title:'영업양수도/중요자산 처분', desc:'자산·영업의 1/5 이상 양수도 등 (주총 특별결의)',                          checked:false},
  {id:'audit_committee',  title:'감사위원회 구성 변경',     desc:'감사위원회 위원 교체/신규 선임 (합산 3%룰 2026.7.23.부터 전면 확대)',      checked:false},
  {id:'treasury',         title:'자기주식 소각',            desc:'보유 자기주식 이익소각 결의 (3차 개정 상법 — 1년 내 소각 원칙 유의)',      checked:false},
  {id:'name_change',      title:'상호 변경',                desc:'회사 상호(명칭) 변경 (정관변경 포함, 특별결의)',                           checked:false},
  {id:'related_party',    title:'이해관계자 거래 주총 승인',desc:'주총 차원의 이해관계자 거래 승인 (특수관계 대형 거래 등)',                 checked:false},
  {id:'other_custom',     title:'기타 안건 (직접 입력)',    desc:'위에 해당하지 않는 안건',                                                 checked:false},
];
