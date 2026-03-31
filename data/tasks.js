// ═══ 타임라인 업무 데이터 ═══
// 수정 방법: buildTasks() 함수 내부의 T.push({...}) 항목을 편집합니다.
// dBase: 'R'(결산일 기준) 또는 'D'(주총일 기준)
// dOffset: 기준일로부터의 일수 (음수=이전, 양수=이후)
// tags: ['필수','외감','상장','등기','공시','신고','조건부','기업집단']

// ═══════════════════════════════════════════════

function buildTasks(pf, agendas) {
  const isListed = pf.listing==='kospi'||pf.listing==='kosdaq';
  const isAudit = pf.audit==='yes';
  const isOver2T = pf.asset==='over2t';
  const isConglom = pf.conglomerate==='yes';
  const isCommittee = pf.auditorType==='committee';
  const hasCharter = agendas.includes('charter');
  const hasDividend = agendas.includes('dividend');
  const hasCapital = agendas.includes('capital');
  const hasHqMove = agendas.includes('hq_move');
  const hasMerger = agendas.includes('merger');
  const hasDirector = agendas.includes('director');
  const hasAuditorElect = agendas.includes('auditor_elect');
  const hasOutsideDir = agendas.includes('outside_director');
  const hasTreasury = agendas.includes('treasury');
  const hasStockOption = agendas.includes('stock_option');
  const hasNameChange = agendas.includes('name_change');

  // d=offset from FY end (D), a=offset from AGM date
  // positive = after, negative = before
  const T = [];

  // ── PRE-AGM: 결산 관련 ──
  T.push({
    id:'t01',dBase:'R',dOffset:0,
    title:'사업연도 종료 (결산일)',
    content:'사업연도 말일. 결산 절차 착수.',
    law:'상법 제447조 (재무제표의 작성)',
    category:'결산',
    tags:['필수'],
    detail:'결산일 익일부터 재무제표 작성 작업 착수. 재고실사, 채권채무 잔액 확인, 감가상각 등 결산 조정 분개 수행.',
    filing:'',
    exception:'',
    show:true,
  });
  T.push({
    id:'t02',dBase:'R',dOffset:10,
    title:'결산 마감 (장부 마감)',
    content:'재고실사, 채권채무 확인, 결산 조정분개 완료',
    law:'기업회계기준, 외감법 시행령',
    category:'결산',
    tags:['필수'],
    detail:'총계정원장 마감, 수정분개 확정. 외감 대상 기업은 감사인에 제출할 재무제표 초안 준비.',
    filing:'',
    exception:'',
    show:true,
  });
  T.push({
    id:'t03',dBase:'R',dOffset:30,
    title:'재무제표(초안) 감사인 제출',
    content:'외부감사인에게 개별/연결 재무제표 초안 제출',
    law:'외감법 제6조 (재무제표의 작성 및 제출)',
    category:'결산',
    tags:['외감'],
    detail:'재무제표, 주석, 부속명세서 일체를 외부감사인에게 제출. 주석 중요 공시사항 확인 필수. 연결 대상 자회사가 있는 경우 연결재무제표도 함께 제출.',
    filing:'금감원 전자공시(DART) 제출용 재무제표 별도 준비',
    exception:'소규모 기업의 경우 감사인과 협의하여 제출 시기 조정 가능',
    show:isAudit,
  });
  T.push({
    id:'t04',dBase:'R',dOffset:45,
    title:'외부감사 수감 (현장감사)',
    content:'외부감사인 현장 방문 감사 수행',
    law:'외감법 제8조~제10조',
    category:'결산',
    tags:['외감'],
    detail:'감사인의 현장 실사. 재고실사 입회(기말), 채권확인서 수발, 관계자 거래 검토, 내부통제 테스트 등. 기간: 통상 2~4주.',
    filing:'',
    exception:'재고실사는 결산일 전후 수일 내 수행하는 것이 일반적 (감사인과 사전 일정 조율)',
    show:isAudit,
  });

  // ── 감사인 선임 ──
  T.push({
    id:'t05',dBase:'R',dOffset:45,
    title:'차기 사업연도 감사인 선임',
    content:'감사인선임위원회(또는 감사) 운영, 차기 감사인 선임 결의',
    law:'외감법 제10조 (감사인의 선임), 동법 시행령 제12조',
    category:'감사',
    tags:['외감','공시'],
    detail:'사업연도 개시일로부터 45일 이내 선임 원칙 (전 사업연도 감사보고서를 제출받기 전에 선임). 감사인선임위원회(상장사) 또는 감사가 선임. 연속 3개 사업연도 동일 감사인 선임 가능 (직권지정 제외).',
    filing:'감사인 선임 후 2주 내 증선위·한공회 보고 (외감법 제10조 제4항)',
    exception:'지정감사 대상인 경우 금감원 지정 통보에 따름 (자유선임 불가)',
    show:isAudit&&isListed,
  });

  // ── 배당기준일 관련 (2023 개정 반영) ──
  if(hasDividend){
    T.push({
      id:'t06',dBase:'D',dOffset:-42,
      title:'배당기준일 관련 이사회 결의',
      content:'배당기준일 설정 및 주주명부 폐쇄/기준일 공고 결정',
      law:'상법 제354조 (주주명부의 폐쇄, 기준일), 제462조 (이익배당)',
      category:'배당',
      tags:['필수','공시'],
      detail:'2023년 상법 개정으로 배당기준일을 정관에서 유연하게 설정 가능. 기준일 2주 전까지 공고 필요. 배당금 총액, 1주당 배당금, 배당기준일을 이사회에서 결정.',
      filing:isListed?'주요경영사항 수시공시 (배당결정)':'',
      exception:'배당기준일을 주총일 이후로 설정하는 기업도 증가 추세 (2023 개정 이후)',
      show:true,
      exceptionToggle:{
        id:'ex_dividend_after_agm',
        label:'배당기준일을 주총 후로 설정',
        effect:'배당기준일 관련 일정이 주총 이후로 이동',
      }
    });
    T.push({
      id:'t06b',dBase:'D',dOffset:-28,
      title:'배당기준일 공고',
      content:'주주명부 폐쇄 또는 기준일 2주 전 공고',
      law:'상법 제354조 제4항',
      category:'배당',
      tags:['필수'],
      detail:'일간지 또는 전자공시를 통한 공고. 정관에 전자적 방법 공고가 가능하도록 규정되어 있는 경우 전자공고 가능.',
      filing:'',
      exception:'',
      show:true,
    });
  }

  // ── 주총 소집 결정 (이사회) ──
  T.push({
    id:'t10',dBase:'D',dOffset:-42,
    title:'주총 소집 결정 이사회',
    content:'정기주총 일시, 장소, 목적사항(안건) 확정',
    law:'상법 제362조 (이사회의 주총소집 결정)',
    category:'주총준비',
    tags:['필수'],
    detail:'이사회에서 결의할 사항: ① 주총 일시·장소, ② 의안(목적사항), ③ 전자투표 도입 여부, ④ 서면투표 도입 여부, ⑤ 의결권대리행사 권유 여부. 사외이사 후보추천위원회 운영 필요 시 이사회 전에 위원회 개최.',
    filing:isListed?'주요경영사항 수시공시 (주주총회 소집 결의)':'',
    exception:'',
    show:true,
  });

  // ── 감사보고서 수령 ──
  T.push({
    id:'t11',dBase:'D',dOffset:-21,
    title:'감사보고서 수령',
    content:'외부감사인으로부터 감사보고서(또는 검토보고서) 수령',
    law:'외감법 제23조',
    category:'감사',
    tags:['외감'],
