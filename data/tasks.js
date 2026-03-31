// ═══ 타임라인 업무 데이터 ═══
// dBase: 'R'(결산일 기준) 또는 'D'(주총일/이사회일 기준)
// dOffset: 기준일로부터의 일수 (음수=이전, 양수=이후)
// meetingType: 'agm'=정기주총만, 'gsm'=주총(정기+임시), 'bod'=이사회만, 'all'=전체

function buildTasks(pf, agendas) {
  const meetingType = pf.meetingType || 'agm';
  const isAGM = meetingType === 'agm';
  const isEGM = meetingType === 'egm';
  const isGSM = isAGM || isEGM;
  const isBOD = meetingType === 'bod';

  const isListed = pf.listing === 'kospi' || pf.listing === 'kosdaq';
  const isAudit  = pf.audit === 'yes';
  const isOver2T = pf.asset === 'over2t';
  const isConglom = pf.conglomerate === 'yes';
  const isCommittee = pf.auditorType === 'committee';

  // GSM 안건
  const hasCharter     = agendas.includes('charter');
  const hasDividend    = agendas.includes('dividend');
  const hasCapital     = agendas.includes('capital');
  const hasHqMove      = agendas.includes('hq_move');
  const hasMerger      = agendas.includes('merger');
  const hasDirector    = agendas.includes('director');
  const hasAuditorElect= agendas.includes('auditor_elect');
  const hasOutsideDir  = agendas.includes('outside_director');
  const hasTreasury    = agendas.includes('treasury');
  const hasStockOption = agendas.includes('stock_option');
  const hasNameChange  = agendas.includes('name_change');

  // BOD 안건
  const hasBodCeo      = agendas.includes('bod_ceo');
  const hasBodTreasury = agendas.includes('bod_treasury');
  const hasBodSelfDeal = agendas.includes('bod_self_deal');
  const hasBodContract = agendas.includes('bod_contract');

  const T = [];

  // ════════════════════════════════════════
  // BOD 전용 타임라인
  // ════════════════════════════════════════

  T.push({
    id:'tbod01', dBase:'D', dOffset:-7,
    title:'이사회 소집통지 발송',
    content:'각 이사 및 감사에게 이사회 소집 통지 발송',
    law:'상법 제390조 (이사회의 소집)',
    category:'이사회',
    tags:['필수'],
    detail:'이사회는 각 이사에게 회일 1주 전(7일)에 소집 통지. 방법: 서면, 전자(정관 허용 시). 의장은 대표이사(원칙). 감사도 이사회 참석 가능(상법 제391조의2).',
    filing:'',
    exception:'정관으로 소집통지 기간 단축 가능. 이사 전원 동의 시 소집절차 생략 및 즉시 개최 가능.',
    show: isBOD,
    exceptionToggle:{
      id:'ex_bod_short_notice',
      label:'소집통지 기간 단축 (정관 규정 시)',
      effect:'정관으로 7일 미만으로 단축한 경우 또는 전원동의 개최',
    }
  });

  T.push({
    id:'tbod02', dBase:'D', dOffset:-3,
    title:'이사회 안건자료 배포',
    content:'결의 안건별 검토 자료, 설명 자료를 이사에게 사전 배포',
    law:'이사회 운영규정 (내부)',
    category:'이사회',
    tags:['필수'],
    detail:'안건별 요약, 재무·법적 검토의견, 비교안 등 의사결정 참고자료 배포. 전자이사회 운영 시 전자 배포. 충실한 사전 자료 제공이 이사의 선관주의의무 이행의 근거.',
    filing:'',
    exception:'',
    show: isBOD,
  });

  T.push({
    id:'tbod_main', dBase:'D', dOffset:0,
    title:'이사회 개최',
    content:'결의 안건 심의·의결, 이사회 의사록 작성',
    law:'상법 제390조~제393조 (이사회)',
    category:'이사회',
    tags:['필수'],
    detail:'소집→개회→안건 상정→설명→질의응답→표결→폐회. 이사 과반수 출석·의결(원칙). 특별이해관계 이사는 해당 안건 의결권 배제(상법 제391조). 화상회의 가능(정관 규정 시).',
    filing: isListed ? '이사회 결의사항 수시공시 (필요한 경우, 주요경영사항)' : '',
    exception:'',
    show: isBOD,
  });

  T.push({
    id:'tbod04', dBase:'D', dOffset:3,
    title:'이사회 의사록 작성·보관',
    content:'이사회 결의 내용 의사록 작성, 10년간 본점 보관',
    law:'상법 제391조의3 (이사회 의사록)',
    category:'이사회',
    tags:['필수'],
    detail:'의사록 기재사항: 의사 경과, 그 요령, 결과, 반대의사를 표시한 이사 성명. 출석 이사·감사 기명날인 또는 서명. 주주·채권자 열람 가능(상법 제391조의3 제3항).',
    filing:'',
    exception:'',
    show: isBOD,
  });

  if (hasBodCeo) {
    T.push({
      id:'tbod_ceo_reg', dBase:'D', dOffset:14,
      title:'대표이사 변경등기 신청',
      content:'이사회 결의에 의한 대표이사 변경 등기',
      law:'상법 제317조, 상업등기법',
      category:'등기',
      tags:['필수','등기'],
      detail:'이사회 결의일로부터 2주 이내 본점 소재지 관할 등기소 신청. 첨부: 이사회 의사록, 취임승낙서, 인감증명서. 대표이사 변경 시 법인인감 신고도 필요.',
      filing:'사업자등록 정정(세무서), 금융기관 통보, 법인인감 신고',
      exception:'',
      show: true,
    });
  }

  if (hasBodTreasury && isListed) {
    T.push({
      id:'tbod_treasury_dis', dBase:'D', dOffset:1,
      title:'자기주식 취득 결정 공시',
      content:'이사회 자기주식 취득 결의 후 즉시 수시공시',
      law:'자본시장법 제161조 (주요사항보고서)',
      category:'공시',
      tags:['상장','공시'],
      detail:'상장사는 이사회의 자기주식 취득 결의 당일 또는 익일 DART 수시공시 필수. 취득 규모, 방법, 기간, 목적을 기재.',
      filing:'DART 수시공시 (자기주식 취득 결정)',
      exception:'',
      show: true,
    });
  }

  if (hasBodSelfDeal && isListed) {
    T.push({
      id:'tbod_self_deal_dis', dBase:'D', dOffset:1,
      title:'이사 자기거래 승인 공시',
      content:'이사·주요주주 이해관계 거래 이사회 승인 후 공시',
      law:'자본시장법 제161조',
      category:'공시',
      tags:['상장','공시'],
      detail:'이사·대주주와의 거래가 일정 규모 이상인 경우 수시공시 의무. 거래 조건의 공정성 검토 및 이사회 의사록 상세 기재.',
      filing:'DART 수시공시 (주요경영사항)',
      exception:'',
      show: true,
    });
  }

  // ════════════════════════════════════════
  // 결산 관련 (AGM 전용)
  // ════════════════════════════════════════

  T.push({
    id:'t01', dBase:'R', dOffset:0,
    title:'사업연도 종료 (결산일)',
    content:'사업연도 말일. 결산 절차 착수.',
    law:'상법 제447조 (재무제표의 작성)',
    category:'결산',
    tags:['필수'],
    detail:'결산일 익일부터 재무제표 작성 착수. 재고실사, 채권채무 잔액 확인, 감가상각 등 결산 조정 분개 수행.',
    filing:'',
    exception:'',
    show: isAGM,
  });

  T.push({
    id:'t02', dBase:'R', dOffset:10,
    title:'결산 마감 (장부 마감)',
    content:'재고실사, 채권채무 확인, 결산 조정분개 완료',
    law:'기업회계기준, 외감법 시행령',
    category:'결산',
    tags:['필수'],
    detail:'총계정원장 마감, 수정분개 확정. 외감 대상 기업은 감사인에 제출할 재무제표 초안 준비.',
    filing:'',
    exception:'',
    show: isAGM,
  });

  T.push({
    id:'t03', dBase:'R', dOffset:30,
    title:'재무제표(초안) 감사인 제출',
    content:'외부감사인에게 개별/연결 재무제표 초안 제출',
    law:'외감법 제6조 (재무제표의 작성 및 제출)',
    category:'결산',
    tags:['외감'],
    detail:'재무제표, 주석, 부속명세서 일체를 외부감사인에게 제출. 주석 중요 공시사항 확인 필수. 연결 대상 자회사가 있는 경우 연결재무제표도 함께 제출.',
    filing:'금감원 전자공시(DART) 제출용 재무제표 별도 준비',
    exception:'소규모 기업의 경우 감사인과 협의하여 제출 시기 조정 가능',
    show: isAGM && isAudit,
  });

  T.push({
    id:'t04', dBase:'R', dOffset:45,
    title:'외부감사 수감 (현장감사)',
    content:'외부감사인 현장 방문 감사 수행',
    law:'외감법 제8조~제10조',
    category:'결산',
    tags:['외감'],
    detail:'감사인의 현장 실사. 재고실사 입회(기말), 채권확인서 수발, 관계자 거래 검토, 내부통제 테스트 등. 기간: 통상 2~4주.',
    filing:'',
    exception:'재고실사는 결산일 전후 수일 내 수행하는 것이 일반적 (감사인과 사전 일정 조율)',
    show: isAGM && isAudit,
  });

  // ── 감사인 선임 (AGM 기준) ──
  T.push({
    id:'t05', dBase:'R', dOffset:45,
    title:'차기 사업연도 감사인 선임',
    content:'감사인선임위원회(또는 감사) 운영, 차기 감사인 선임 결의',
    law:'외감법 제10조 (감사인의 선임), 동법 시행령 제12조',
    category:'감사',
    tags:['외감','공시'],
    detail:'사업연도 개시일로부터 45일 이내 선임 원칙. 감사인선임위원회(상장사) 또는 감사가 선임. 연속 3개 사업연도 동일 감사인 선임 가능 (직권지정 제외).',
    filing:'감사인 선임 후 2주 내 증선위·한공회 보고 (외감법 제10조 제4항)',
    exception:'지정감사 대상인 경우 금감원 지정 통보에 따름 (자유선임 불가)',
    show: isAGM && isAudit && isListed,
  });

  // ── 배당기준일 관련 ──
  if (hasDividend) {
    T.push({
      id:'t06', dBase:'D', dOffset:-42,
      title:'배당기준일 관련 이사회 결의',
      content:'배당기준일 설정 및 주주명부 폐쇄/기준일 공고 결정',
      law:'상법 제354조 (주주명부의 폐쇄, 기준일), 제462조 (이익배당)',
      category:'배당',
      tags:['필수','공시'],
      detail:'2023년 상법 개정으로 배당기준일을 정관에서 유연하게 설정 가능. 기준일 2주 전까지 공고 필요. 배당금 총액, 1주당 배당금, 배당기준일을 이사회에서 결정.',
      filing: isListed ? '주요경영사항 수시공시 (배당결정)' : '',
      exception:'배당기준일을 주총일 이후로 설정하는 기업도 증가 추세 (2023 개정 이후)',
      show: isGSM,
      exceptionToggle:{
        id:'ex_dividend_after_agm',
        label:'배당기준일을 주총 후로 설정',
        effect:'배당기준일 관련 일정이 주총 이후로 이동',
      }
    });

    T.push({
      id:'t06b', dBase:'D', dOffset:-28,
      title:'배당기준일 공고',
      content:'주주명부 폐쇄 또는 기준일 2주 전 공고',
      law:'상법 제354조 제4항',
      category:'배당',
      tags:['필수'],
      detail:'일간지 또는 전자공시를 통한 공고. 정관에 전자적 방법 공고가 가능하도록 규정되어 있는 경우 전자공고 가능.',
      filing:'',
      exception:'',
      show: isGSM,
    });
  }

  // ════════════════════════════════════════
  // 주총 준비 (GSM 공통)
  // ════════════════════════════════════════

  T.push({
    id:'t10', dBase:'D', dOffset:-42,
    title:'주총 소집 결정 이사회',
    content:`${isEGM ? '임시주총' : '정기주총'} 일시, 장소, 목적사항(안건) 확정`,
    law:'상법 제362조 (이사회의 주총소집 결정)',
    category:'주총준비',
    tags:['필수'],
    detail:'이사회에서 결의할 사항: ① 주총 일시·장소, ② 의안(목적사항), ③ 전자투표 도입 여부, ④ 서면투표 도입 여부, ⑤ 의결권대리행사 권유 여부. 사외이사 후보추천위원회 운영 필요 시 이사회 전에 위원회 개최.',
    filing: isListed ? '주요경영사항 수시공시 (주주총회 소집 결의)' : '',
    exception:'',
    show: isGSM,
  });

  T.push({
    id:'t11', dBase:'D', dOffset:-21,
    title:'감사보고서 수령',
    content:'외부감사인으로부터 감사보고서(또는 검토보고서) 수령',
    law:'외감법 제23조',
    category:'감사',
    tags:['외감'],
    detail:'감사보고서 수령 후 재무제표 확정. 적정의견 외의 경우(한정, 부적정, 의견거절) 대응 방안 검토 필요.',
    filing:'',
    exception:'감사의견 지연 시 주총 일정 조정 불가피할 수 있음',
    show: isAGM && isAudit,
  });

  T.push({
    id:'t12', dBase:'D', dOffset:-28,
    title:'의결권대리행사 권유 (위임장 권유)',
    content:'상장사 의무: 의결권대리행사 권유 참고서류 제출',
    law:'자본시장법 제152조, 동법 시행령 제160조',
    category:'주총준비',
    tags:['상장','공시'],
    detail:'상장사는 주총 소집통지일까지 의결권대리행사 권유 참고서류를 DART에 제출·비치. 전자투표 도입 시 의결권대리행사 권유 의무 면제 가능.',
    filing:'DART 제출 (의결권대리행사 권유 참고서류)',
    exception:'전자투표를 도입하는 경우 의결권대리행사 권유 의무 면제 가능',
    show: isGSM && isListed,
    exceptionToggle:{
      id:'ex_evote',
      label:'전자투표 도입 (의결권대리행사 권유 면제)',
      effect:'의결권대리행사 권유 절차 생략 가능',
    }
  });

  T.push({
    id:'t13', dBase:'D', dOffset:-14,
    title:'주총 소집통지 발송',
    content:`각 주주에게 서면/전자 소집통지 발송 (${isEGM ? '임시주총' : '정기주총'})`,
    law:'상법 제363조 (소집의 통지)',
    category:'주총준비',
    tags:['필수'],
    detail:'통지 내용: 일시, 장소, 목적사항(의안 요령). 통지 방법: 등기우편(원칙), 정관에 따라 전자적 방법 병행 가능. 발행주식총수의 1% 이하 소유 주주에게는 정관 규정에 따라 통지 생략 가능(상법 제363조 제3항).',
    filing: isListed ? '소집통지 공고 (관보 또는 전자공시)' : '',
    exception:'',
    show: isGSM,
    exceptionToggle:{
      id:'ex_short_notice',
      label:'소집통지 기간 단축 (10일 전)',
      effect:'비상장사, 자본금 10억 미만: 정관에 10일로 단축 가능 (상법 제363조 제1항 단서). 후행 일정이 앞당겨집니다.',
      shortDays:4,
      condition:!isListed,
    }
  });

  T.push({
    id:'t14', dBase:'D', dOffset:-7,
    title:'사업보고서 사전 제출',
    content:'정기주총 1주 전까지 사업보고서를 DART에 제출',
    law:'자본시장법 제159조 (사업보고서 등의 제출)',
    category:'공시',
    tags:['상장','공시'],
    detail:'사업보고서에는 재무제표, 감사보고서, 경영진 분석(MD&A) 등 포함. 주총 1주 전 제출이 원칙이나, 주총 후 90일 이내 최종본 제출 의무.',
    filing:'DART 전자공시',
    exception:'주총 전 제출이 어려운 경우 주총 후 90일(사업연도 경과 후 90일) 이내 제출로 대체 가능하나 실무상 주총 전 제출 권장',
    show: isAGM && isListed,
  });

  T.push({
    id:'t15', dBase:'D', dOffset:-7,
    title:`재무제표·영업보고서·감사보고서 비치`,
    content:'주총 1주 전부터 본점에 5년간, 지점에 3년간 비치',
    law:'상법 제448조 (재무제표등의 비치·공시)',
    category:'주총준비',
    tags:['필수'],
    detail:'비치 서류: ① 재무제표(B/S, P/L, 이익잉여금처분계산서 등), ② 영업보고서, ③ 감사보고서. 주주와 채권자는 열람 가능.',
    filing:'',
    exception:'',
    show: isGSM,
  });

  T.push({
    id:'t16', dBase:'D', dOffset:-10,
    title:'전자투표 시스템 개시',
    content:'전자투표 도입 시, 주총 10일 전~전일까지 전자투표 기간 운영',
    law:'상법 제368조의4 (전자적 방법에 의한 의결권 행사)',
    category:'주총준비',
    tags:['조건부'],
    detail:'전자투표관리기관(한국예탁결제원 K-Vote) 위탁. 주총 10일 전부터 전일까지 투표 가능. 2025 전자주총법 시행에 따라 전자주총(완전 온라인) 도입 가능.',
    filing:'',
    exception:'전자주총(2025 전자주총법)을 도입하면 물리적 장소 없이 온라인으로만 개최 가능',
    show: isGSM,
  });

  // ════════════════════════════════════════
  // 주총 당일 (GSM)
  // ════════════════════════════════════════

  T.push({
    id:'t20', dBase:'D', dOffset:0,
    title: isEGM ? '임시주주총회 개최' : '정기주주총회 개최',
    content: isEGM
      ? '임시주주총회 당일. 안건 심의·의결, 의사록 작성.'
      : '정기주주총회 당일. 안건 심의·의결, 의사록 작성.',
    law:'상법 제363조~제376조',
    category:'주총',
    tags:['필수'],
    detail:`개회→의장선출→안건상정→토론→표결→폐회. 의장은 대표이사(정관 규정). 보통결의(출석 과반수+발행주식 1/4 이상), 특별결의(출석 2/3+발행주식 1/3 이상). 의사록 작성·공증 필수(상법 제373조).`,
    filing: isListed ? '주총결과 수시공시 (의안별 가결/부결, 찬성률)' : '',
    exception:'',
    show: isGSM,
  });

  // ════════════════════════════════════════
  // 주총 후속 처리 (GSM)
  // ════════════════════════════════════════

  if (isGSM && (hasDirector || hasAuditorElect || hasOutsideDir)) {
    T.push({
      id:'t30', dBase:'D', dOffset:14,
      title:'임원 변경등기 신청',
      content:'이사·감사 선임/퇴임에 따른 변경등기',
      law:'상법 제317조 (변경등기), 상업등기법',
      category:'등기',
      tags:['필수','등기'],
      detail:'주총일로부터 2주 이내 본점 소재지 관할 등기소에 신청. 첨부서류: 주총의사록, 취임승낙서, 인감증명서, 주민등록초본, 위임장(법무사 위임 시). 등록면허세·교육세 납부.',
      filing:'등기완료 후 법인등기부등본 발급·확인',
      exception:'본점 외 지점 소재지에도 등기 필요했으나, 2024년 지점등기 폐지로 본점 소재지만 등기',
      show: true,
    });
  }

  if (isGSM && (hasCharter || hasNameChange)) {
    T.push({
      id:'t31', dBase:'D', dOffset:14,
      title:'정관 변경등기 신청',
      content:'정관 변경사항에 대한 변경등기',
      law:'상법 제317조, 상업등기법',
      category:'등기',
      tags:['필수','등기'],
      detail:'목적사업 변경, 수권자본 변경, 상호 변경 등 등기사항이 변경된 경우 2주 이내 등기. 첨부서류: 변경된 정관(전문), 주총의사록, 위임장.',
      filing:'',
      exception:'',
      show: true,
    });
  }

  if (isGSM && hasHqMove) {
    T.push({
      id:'t32', dBase:'D', dOffset:14,
      title:'본점 이전등기 신청',
      content:'본점 소재지 변경에 따른 이전등기',
      law:'상법 제171조, 제317조, 상업등기법',
      category:'등기',
      tags:['필수','등기'],
      detail:'구 소재지: 2주 내 이전등기, 신 소재지: 3주 내 설정등기. 관할이 동일한 경우에는 이전등기만. 사업자등록 정정, 각종 인허가·신고 주소 변경 후속 필요.',
      filing:'사업자등록 정정(세무서), 4대보험 주소변경(공단)',
      exception:'관할 변경이 없는 경우(같은 등기소) 절차 간소화',
      show: true,
    });
  }

  if (isGSM && hasCapital) {
    T.push({
      id:'t33', dBase:'D', dOffset:14,
      title:'자본금 변경등기 신청',
      content:'증자/감자에 따른 자본금 변경등기',
      law:'상법 제416조~제443조, 상업등기법',
      category:'등기',
      tags:['필수','등기'],
      detail:'유상증자: 납입기일 후 2주 내 등기. 감자: 채권자이의절차(1개월) 완료 후 등기. 전환사채 전환 시: 전환 청구 후 등기.',
      filing: isListed ? '증권신고서 제출(유상증자 시, 자본시장법 제119조)' : '',
      exception:'소규모 주주배정 증자(발행주식 10% 이하)의 경우 증권신고서 면제 가능',
      show: true,
    });
  }

  if (isGSM && hasDividend) {
    T.push({
      id:'t35', dBase:'D', dOffset:30,
      title:'배당금 지급',
      content:'주총에서 확정된 배당금을 주주에게 지급',
      law:'상법 제464조의2 (이익배당의 지급시기)',
      category:'배당',
      tags:['필수'],
      detail:'주총 결의일로부터 1개월 이내 지급 (상법 규정). 배당소득세 원천징수(14%+주민세) 후 지급. 배당금 지급 대행(증권예탁원) 활용 가능.',
      filing:'원천징수 이행상황 신고서 (세무서)',
      exception:'정관으로 1개월을 초과하지 않는 범위에서 지급기한 단축 가능. 주주 미수령 배당금은 소멸시효(5년) 관리 필요.',
      show: true,
    });
  }

  // ════════════════════════════════════════
  // 연간 세무·공시 (AGM 주기)
  // ════════════════════════════════════════

  T.push({
    id:'t40', dBase:'R', dOffset:90,
    title:'법인세 신고·납부',
    content:'사업연도 종료 후 3개월 이내 법인세 신고·납부',
    law:'법인세법 제60조 (과세표준의 신고), 제64조 (납부)',
    category:'세무',
    tags:['필수','신고'],
    detail:'결산 확정 세무조정, 세무신고서 작성, 법인세 납부. 외감법인은 감사보고서 첨부 의무. 첨부서류: 재무제표, 세무조정계산서, 법인세 과세표준 및 세액신고서.',
    filing:'세무서 e-신고 (국세청 홈택스)',
    exception:'성실신고확인대상 법인, 연결납세법인은 4개월(D+120)까지 연장 가능',
    show: isAGM,
    exceptionToggle:{
      id:'ex_tax_extend',
      label:'법인세 신고기한 연장 (D+120)',
      effect:'성실신고확인대상 또는 연결납세법인 해당 시 1개월 연장',
      shortDays:-30,
    }
  });

  T.push({
    id:'t41', dBase:'R', dOffset:120,
    title:'법인지방소득세 신고·납부',
    content:'법인세 신고기한 경과 후 1개월 이내',
    law:'지방세법 제103조의23',
    category:'세무',
    tags:['필수','신고'],
    detail:'법인세 과세표준에 지방세율(1~2.5%) 적용. 사업장 소재지별 안분 신고. 각 지자체 위택스(Wetax) 전자신고.',
    filing:'위택스(Wetax) 전자신고',
    exception:'법인세 신고기한 연장 시 동일하게 연장됨',
    show: isAGM,
  });

  T.push({
    id:'t42', dBase:'R', dOffset:90,
    title:'사업보고서 최종 제출',
    content:'사업연도 경과 후 90일 이내 DART 제출',
    law:'자본시장법 제159조',
    category:'공시',
    tags:['상장','공시'],
    detail:'사업보고서 최종본 제출. 주총 전 사전제출한 경우에도 주총결과 반영하여 최종 갱신 필요.',
    filing:'DART 전자공시',
    exception:'제출기한 연장 사유가 있는 경우 금감원에 연장 신청 가능 (예외적)',
    show: isAGM && isListed,
  });

  T.push({
    id:'t43', dBase:'R', dOffset:120,
    title:'대규모기업집단 현황 공시',
    content:'기업집단 현황 등에 관한 공시',
    law:'공정거래법 제26조의2',
    category:'공시',
    tags:['기업집단'],
    detail:'공정위에 기업집단 현황(주식소유현황, 계열사 현황, 재무현황 등) 신고·공시. 지정일 기준으로 5월 중 제출이 일반적.',
    filing:'공정거래위원회 전자공시',
    exception:'',
    show: isAGM && isConglom,
  });

  T.push({
    id:'t44', dBase:'D', dOffset:0,
    title:'내부회계관리제도 운영실태 보고',
    content:'정기주총 시 내부회계관리제도 운영실태를 보고',
    law:'외감법 제8조 (내부회계관리제도의 운영 등)',
    category:'감사',
    tags:['외감'],
    detail:'대표이사가 이사회 및 감사(위원회)에 보고. 감사(위원회)는 내부회계관리제도 평가보고서 작성. 자산 2조 이상: 외부감사인의 감사 대상, 2조 미만: 검토 대상.',
    filing:'',
    exception:'',
    show: isAGM && isAudit,
  });

  // ════════════════════════════════════════
  // 주요 안건별 추가 업무 (GSM)
  // ════════════════════════════════════════

  if (isGSM && hasMerger) {
    T.push({
      id:'t50', dBase:'D', dOffset:-30,
      title:'합병/분할 관련 사전공시 및 채권자보호절차',
      content:'합병계약서 공시, 채권자이의제출 공고(1개월)',
      law:'상법 제522조~제530조, 자본시장법 제165조의4',
      category:'특별안건',
      tags:['필수','공시'],
      detail:'합병계약서 본점 비치, 채권자이의절차(1개월), 합병등기. 상장사: 합병보고서·신고서 DART 제출.',
      filing:'DART 수시공시, 합병등기',
      exception:'소규모합병(발행주식 10% 이하 신주): 주총 대신 이사회 결의 가능. 간이합병(90% 이상 지분 보유): 주총 생략 가능.',
      show: true,
    });
  }

  if (isGSM && hasStockOption) {
    T.push({
      id:'t51', dBase:'D', dOffset:14,
      title:'스톡옵션 부여 등기 및 공시',
      content:'주총에서 스톡옵션 부여 결의 후 등기·공시',
      law:'상법 제340조의2~340조의5',
      category:'특별안건',
      tags:['등기','공시'],
      detail:'부여 대상, 수량, 행사가액, 행사기간 등을 주총에서 결의. 주총의사록에 상세 기재. 변경등기(등기사항). 상장사: 수시공시.',
      filing: isListed ? 'DART 수시공시 + 변경등기' : '변경등기',
      exception:'',
      show: true,
    });
  }

  if (isGSM && hasTreasury) {
    T.push({
      id:'t52', dBase:'D', dOffset:14,
      title:'자기주식 소각 등기',
      content:'이익소각 결의에 따른 주식소각 등기',
      law:'상법 제343조 (주식의 소각)',
      category:'특별안건',
      tags:['등기'],
      detail:'주총 결의 후 소각 실행, 자본금 변동 시 변경등기. 발행주식총수 변경에 따른 등기. 3차 개정 상법(2026.3.6.): 보유 자기주식은 1년 내 소각 원칙.',
      filing: isListed ? 'DART 수시공시' : '',
      exception:'',
      show: true,
    });
  }

  return T.filter(t => t.show).sort((a, b) => {
    const da = calcDate(a, pf);
    const db = calcDate(b, pf);
    return da - db;
  });
}
