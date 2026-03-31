// ═══ 안건 데이터 ═══
// 수정 방법: 안건을 추가/삭제/수정하려면 아래 배열의 항목을 편집하세요.
// id: 고유 식별자, title: 안건명, desc: 설명, checked: 기본 선택 여부

const AGENDA_BASIC = [
  {id:'fs',title:'재무제표 승인',desc:'대차대조표, 손익계산서, 영업보고서 등',checked:true,always:true},
  {id:'director',title:'이사 선임/재선임',desc:'임기만료 이사의 선임 또는 재선임',checked:true},
  {id:'auditor_elect',title:'감사/감사위원 선임',desc:'감사 또는 감사위원회 위원 선임',checked:false},
  {id:'director_pay',title:'이사 보수 한도 승인',desc:'이사 및 감사의 보수 한도액 결정',checked:true},
];

const AGENDA_SPECIAL = [
  {id:'charter',title:'정관 변경',desc:'목적사업, 주식, 기관구성 등 정관 조항 변경',checked:false},
  {id:'dividend',title:'배당 결의',desc:'현금배당, 주식배당, 중간배당 등',checked:false},
  {id:'capital',title:'자본금 변동',desc:'유상증자, 감자, 전환사채/신주인수권부사채 발행',checked:false},
  {id:'hq_move',title:'본점 이전',desc:'본점 소재지 변경 (정관변경+이전등기 수반)',checked:false},
  {id:'merger',title:'합병/분할',desc:'합병, 분할합병, 물적분할 등 (주총 특별결의)',checked:false},
  {id:'treasury',title:'자기주식 소각',desc:'보유 자기주식의 이익소각 등',checked:false},
  {id:'outside_director',title:'사외이사 선임',desc:'상장사 사외이사 구성 요건 충족',checked:false},
  {id:'audit_committee',title:'감사위원회 구성 변경',desc:'감사위원회 위원 교체/신규 선임',checked:false},
];

const AGENDA_OTHERS = [
  {id:'stock_option',title:'스톡옵션(주식매수선택권) 부여',desc:'임직원 대상 스톡옵션 부여 승인',checked:false},
  {id:'exec_retire',title:'퇴직금/퇴직위로금 지급',desc:'퇴임 이사 등에 대한 퇴직위로금',checked:false},
  {id:'related_party',title:'이해관계자 거래 승인',desc:'이사 등 이해관계인과의 자기거래 승인',checked:false},
  {id:'business_transfer',title:'영업양수도/중요자산 처분',desc:'주총 특별결의 사항',checked:false},
  {id:'name_change',title:'상호 변경',desc:'회사 상호(명칭) 변경 (정관변경 포함)',checked:false},
  {id:'other_custom',title:'기타 안건 (직접 입력)',desc:'위에 해당하지 않는 안건',checked:false},
];
