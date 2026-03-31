// ═══ 세부 프로세스 데이터 (PROCESS_DB) ═══
// 수정 방법: 각 태스크ID(t30, t31 등)별로 세부 절차를 편집합니다.
// 새 프로세스 추가: PROCESS_DB['태스크ID'] = { title:..., sections:[...] }
// type: 'steps'(절차), 'docs'(서류), 'lawfirm'(법무사협업), 'tips'(유의사항)
// who: 'company'(회사), 'director'(이사), 'shareholder'(주주), 'lawfirm'(법무사), 'auditor'(감사인)

const PROCESS_DB = {

  // ── 감사인 선임 ──
  't05': {
    title: '감사인 선임 세부 프로세스',
    updated: '2026.3.31.',
    sections: [
      {
        type: 'steps',
        title: '업무 절차',
        items: [
          { title: '감사인선임위원회 구성 확인', desc: '자산총액 1천억 이상 상장사는 감사인선임위원회 필수 설치. 미설치 회사는 감사(감사위원회)가 감사인 선임 권한 보유.' },
          { title: '감사인 후보 선정 및 평가', desc: '복수의 회계법인으로부터 감사제안서(Proposal) 수령. 감사보수, 투입인력, 전문성, 독립성 등을 종합 평가.' },
          { title: '감사인선임위원회(또는 감사) 결의', desc: '감사인선임위원회(또는 감사)가 감사인 선임을 결의. 의사록 작성 및 보관.' },
          { title: '감사계약 체결', desc: '선임된 감사인과 감사계약서 체결. 감사범위, 보수, 일정, 비감사서비스 제한 등 주요 조건 확정.' },
          { title: '감사인 선임 보고·공시', desc: '이사회에 감사인 선임 결과 보고. 상장사는 주총 후 DART를 통해 감사인선임보고서 제출 (사업연도 개시일로부터 45일 이내).' },
          { title: '증권선물위원회 보고', desc: '감사인 선임 후 2주 이내 증권선물위원회에 선임 보고 (외부감사법 제10조 제4항). 한국공인회계사회 전자시스템 이용.' },
        ]
      },
      {
        type: 'docs',
        title: '필요 서류 목록',
        items: [
          { who: 'company', name: '감사인선임위원회 의사록', note: '감사인 선임 결의 내용, 평가 기준 및 결과 기재. 감사위원회가 선임하는 경우 감사위원회 의사록' },
          { who: 'company', name: '감사계약서', note: '회사와 감사인 간 체결. 감사범위, 보수, 감사기간, 비감사서비스 제한 조항 포함' },
          { who: 'auditor', name: '감사제안서 (Proposal)', note: '후보 회계법인이 제출. 감사팀 구성, 투입시간, 보수 견적, 전문성 등 기재' },
          { who: 'auditor', name: '독립성 확인서', note: '감사인의 독립성 충족 여부 확인 문서 (외부감사법 제21조)' },
          { who: 'company', name: '감사인선임보고서 (DART 제출용)', note: '상장사 필수. 사업연도 개시일 후 45일 이내 전자공시' },
          { who: 'company', name: '증권선물위원회 선임 보고서', note: '선임 후 2주 이내. 한국공인회계사회 전자시스템으로 제출' },
        ]
      },
      {
        type: 'tips',
        title: '실무 유의사항',
        items: [
          '감사인 선임 기한: 사업연도 개시일로부터 45일 이내 (12월 결산법인: 2월 14일까지). 기한 도과 시 증선위가 감사인을 지정할 수 있음.',
          '주기적 지정제: 6년 자유선임 후 3년 지정 (상장사). 지정 대상 연도인지 사전 확인 필수.',
          '감사인 연속선임 제한: 동일 감사인 연속 6개 사업연도 초과 선임 불가 (외부감사법 제11조 제1항).',
          '비감사서비스 동시 제공 제한: 감사인이 회사에 세무·컨설팅 등 비감사서비스를 일정 규모 이상 제공 시 독립성 위반 (외부감사법 제21조).',
          '감사보수 적정성 주의: 표준감사시간 대비 현저히 낮은 보수는 감사품질 저하 우려로 증선위 모니터링 대상.',
          '전기 감사인 해임·불재선임 시 정당한 사유가 필요하며, 증선위에 사유 보고 의무 (외부감사법 제10조 제5항).',
        ]
      }
    ]
  },

  // ── 임원 변경등기 ──
  't30': {
    title: '임원 변경등기 세부 프로세스',
    updated: '2026.3.24.',
    sections: [
      {
        type: 'steps',
        title: '업무 절차',
        items: [
          { title: '주총 의사록 작성 및 공증', desc: '주총 종료 즉시 의사록 작성. 공증인 사무소에서 공증 (의사록 인증). 법원에 제출할 공증 의사록 원본 1부 + 사본 확보.' },
          { title: '취임 이사로부터 서류 수령', desc: '취임승낙서, 인감증명서(또는 본인서명사실확인서), 주민등록초본을 취임 이사로부터 수령. 외국인 이사의 경우 여권 사본 + 국내거소신고증 또는 공증된 서명.' },
          { title: '법무사에게 등기 위임', desc: '법무사에게 위임장 발급 및 구비서류 일체 전달. 등록면허세·교육세 납부 대행 요청.' },
          { title: '등기 신청 (관할 등기소)', desc: '주총일로부터 2주 이내 본점 소재지 관할 등기소에 변경등기 신청. 2024년 지점등기 폐지로 본점만 신청.' },
          { title: '등기완료 확인', desc: '등기 접수 후 통상 3~5영업일 소요. 법인등기부등본 발급하여 반영 내용 확인. 임원 명단, 취임일, 주민번호 뒷자리 확인.' },
          { title: '후속 조치', desc: '사업자등록 정정(대표이사 변경 시), 인감신고(법인인감 변경 시), 금융기관 통보, 상장사의 경우 DART 수시공시 (임원변동).' },
        ]
      },
      {
        type: 'docs',
        title: '필요 서류 목록',
        items: [
          { who: 'company', name: '주주총회 의사록 (공증)', note: '공증인 인증 원본. 정관 변경 수반 시 변경 정관 전문도 첨부' },
          { who: 'company', name: '위임장 (법무사 위임용)', note: '대표이사 명의, 법인인감 날인' },
          { who: 'company', name: '법인인감증명서', note: '발행일 3개월 이내' },
          { who: 'company', name: '등록면허세·교육세 납부 영수증', note: '등기 신청 전 납부. 법무사 대행 가능' },
          { who: 'director', name: '취임승낙서', note: '취임 이사 자필 서명(또는 인감 날인). 대표이사 취임 시 법인인감 날인' },
          { who: 'director', name: '인감증명서 (또는 본인서명사실확인서)', note: '발행일 3개월 이내. 대표이사는 반드시 인감증명서' },
          { who: 'director', name: '주민등록초본', note: '발행일 3개월 이내. 외국인: 여권 사본 + 거소신고증' },
          { who: 'lawfirm', name: '등기신청서', note: '법무사가 작성·제출' },
          { who: 'lawfirm', name: '등기소 수수료 납부 영수증', note: '법무사 대행' },
        ]
      },
      {
        type: 'lawfirm',
        title: '법무사 업무 협업 절차',
        items: [
          { title: '사전 협의 (주총 1~2주 전)', desc: '주총 안건 확정 후 법무사에 등기 예고. 선임/퇴임 이사 명단, 예상 주총일, 특이사항(대표이사 변경, 외국인 이사 등) 공유.' },
          { title: '서류 전달 (주총 당일~익일)', desc: '공증 완료된 의사록, 취임승낙서, 인감증명서 등 원본 일체를 법무사에 전달. 스캔본 선행 전달 후 원본 우송 가능.' },
          { title: '세금 납부 확인 (등기 1~2일 전)', desc: '등록면허세·교육세 금액 확인 및 납부. 법무사가 대납 후 정산하는 것이 일반적.' },
          { title: '등기 접수 및 완료 확인', desc: '법무사가 등기 접수 → 접수증 수령 → 등기완료 시 등기부등본 발급·전달.' },
        ]
      },
      {
        type: 'tips',
        title: '실무 유의사항',
        items: [
          '등기 기한(2주)은 과태료 부과 기준이므로 엄수. 기한 도과 시 대표이사에게 과태료 부과 (상업등기법 제19조).',
          '사외이사(독립이사) 취임 시 독립성 요건 충족 여부를 등기 전에 재확인 (2026.7.23. 개정 상법 적용 대비).',
          '감사위원을 이사와 분리선출한 경우, 의사록에 분리선출 사실을 명기해야 등기 시 문제없음.',
          '대표이사 변경 시에는 법원에 인감신고도 별도 진행 필요 (등기와 동시 처리 가능).',
        ]
      }
    ]
  },

  // ── 정관 변경등기 ──
  't31': {
    title: '정관 변경등기 세부 프로세스',
    updated: '2026.3.24.',
    sections: [
      {
        type: 'steps',
        title: '업무 절차',
        items: [
          { title: '정관 변경안 작성', desc: '변경 전/후 대조표 작성. 법무팀 또는 외부 법무법인 검토. 등기사항(목적, 상호, 수권자본 등) 해당 여부 확인.' },
          { title: '이사회 결의 → 주총 안건 상정', desc: '이사회에서 정관변경안 승인 후 주총 안건으로 상정. 주총 소집통지에 정관 변경 요지 기재.' },
          { title: '주총 특별결의', desc: '출석 주주 의결권의 2/3 + 발행주식총수의 1/3 이상 찬성 (상법 제434조).' },
          { title: '등기 신청', desc: '등기사항이 변경된 경우 2주 내 변경등기. 목적사업, 상호, 수권주식수, 1주 금액 등.' },
          { title: '후속 조치', desc: '정관 전문 최종본 보관, 사업자등록 정정(목적사업·상호 변경 시), 상장사 공시.' },
        ]
      },
      {
        type: 'docs',
        title: '필요 서류 목록',
        items: [
          { who: 'company', name: '변경된 정관 전문', note: '정관 전체 텍스트. 부분 발췌 불가, 전문 제출 필요' },
          { who: 'company', name: '주주총회 의사록 (공증)', note: '정관변경 특별결의 내용 포함' },
          { who: 'company', name: '정관 변경 전/후 대조표', note: '등기소 심사용 참고자료' },
          { who: 'lawfirm', name: '등기신청서 + 위임장', note: '법무사 작성·제출' },
        ]
      },
      {
        type: 'tips',
        title: '실무 유의사항',
        items: [
          '2026년 정기주총에서 정관 변경이 필요한 주요 사항: 자기주식 관련 조항(3차 개정 상법), 독립이사 관련 조항(1차 개정 상법 2026.7.23. 시행 대비).',
          '목적사업 추가/변경 시 사업자등록 정정까지 연계하여 일괄 처리하는 것이 효율적.',
          '정관에 전자주주총회 관련 조항을 미리 추가해두면 향후 시행 시 별도 정관변경 불요.',
        ]
      }
    ]
  },

  // ── 본점 이전등기 ──
  't32': {
    title: '본점 이전등기 세부 프로세스',
    updated: '2026.3.24.',
    sections: [
      {
        type: 'steps',
        title: '업무 절차',
        items: [
          { title: '이사회/주총 결의', desc: '본점 소재지 변경이 정관 변경 수반 시 주총 특별결의 필요. 같은 최소행정구역 내 이전은 이사회 결의로 가능.' },
          { title: '관할 등기소 확인', desc: '구 소재지와 신 소재지 관할이 같은지 확인. 관할 다를 시: 구 소재지 이전등기 + 신 소재지 설정등기 각각 필요.' },
          { title: '등기 신청', desc: '구 소재지: 2주 내 이전등기. 신 소재지: 3주 내 설정등기 (관할 상이 시).' },
          { title: '후속 신고', desc: '사업자등록 정정(세무서), 4대보험 주소변경, 인허가 주소변경, 금융기관 통보, 우편물 전환 등.' },
        ]
      },
      {
        type: 'docs',
        title: '필요 서류 목록',
        items: [
          { who: 'company', name: '이사회 의사록 또는 주총 의사록 (공증)', note: '정관 변경 수반 시 주총 의사록' },
          { who: 'company', name: '변경된 정관 (정관 변경 시)', note: '본점 소재지 기재 조항이 변경된 정관 전문' },
          { who: 'company', name: '임대차계약서 사본', note: '신 소재지 사용권원 증빙' },
          { who: 'lawfirm', name: '등기신청서 + 위임장', note: '구/신 소재지 각각 별도 신청 (관할 상이 시)' },
        ]
      },
      {
        type: 'tips',
        title: '실무 유의사항',
        items: [
          '본점 이전 후 사업자등록 정정은 이전일로부터 20일 이내 (부가가치세법 시행령 제14조).',
          '관할 세무서가 변경되면 다음 부가세 신고부터 새 관할에 신고.',
          '2024년 지점등기 폐지로 지점 소재지 변경등기는 불요. 본점 등기만 처리.',
        ]
      }
    ]
  },

  // ── 주총 소집통지 ──
  't13': {
    title: '주총 소집통지 세부 프로세스',
    updated: '2026.3.24.',
    sections: [
      {
        type: 'steps',
        title: '업무 절차',
        items: [
          { title: '통지 대상 주주 명부 확정', desc: '주주명부 폐쇄일(또는 기준일) 기준 주주 명단 확정. 명의개서대리인(상장사: 예탁결제원)에 주주명부 요청.' },
          { title: '소집통지서 작성', desc: '필수 기재사항: ① 일시, ② 장소, ③ 목적사항(의안 요령). 전자투표 안내, 의결권대리행사 안내 포함.' },
          { title: '통지 발송', desc: '등기우편 발송 (원칙). 정관에 전자적 방법 허용 시 이메일 병행 가능. 발행주식 1% 이하 소주주는 정관에 따라 공고로 대체 가능.' },
          { title: '발송 증빙 보관', desc: '등기우편 접수증, 이메일 발송 기록 등 보관. 소집통지 하자 시 결의취소 사유가 되므로 증빙 필수.' },
        ]
      },
      {
        type: 'docs',
        title: '필요 서류',
        items: [
          { who: 'company', name: '주주총회 소집통지서', note: '대표이사 명의 발송. 의안별 요지 기재' },
          { who: 'company', name: '주주명부', note: '기준일 현재 주주 명단. 명의개서대리인 제공' },
          { who: 'shareholder', name: '위임장 양식 (동봉)', note: '의결권대리행사용. 수임인란 공란으로 동봉' },
          { who: 'company', name: '전자투표 안내문 (해당 시)', note: 'K-Vote 시스템 안내, 투표 기간·방법 기재' },
        ]
      },
      {
        type: 'tips',
        title: '실무 유의사항',
        items: [
          '소집통지 기한: 주총 2주 전 (비상장 자본금 10억 미만은 정관으로 10일로 단축 가능).',
          '상장사: 소집통지와 별개로 DART 공시(주주총회 소집공고)도 필요.',
          '전자투표 도입 시 의결권대리행사 권유 의무 면제 가능 (자본시장법 제152조 제2항).',
          '통지서에 기재되지 않은 안건은 주총에서 결의할 수 없음 (상법 제363조 제2항). 추가 안건 필요 시 소집통지 재발송.',
        ]
      }
    ]
  },

  // ── 정기주총 당일 ──
  't20': {
    title: '정기주주총회 당일 운영 프로세스',
    updated: '2026.3.24.',
    sections: [
      {
        type: 'steps',
        title: '주총 당일 순서',
        items: [
          { title: '접수 및 주주 확인 (개회 30분~1시간 전)', desc: '참석 주주 본인 확인, 위임장 수령·확인, 출석부 작성. 전자투표 사전행사 결과 확인 (K-Vote).' },
          { title: '개회 선언 및 의장 선출', desc: '대표이사(또는 정관상 의장)가 개회 선언. 정족수 충족 확인 보고.' },
          { title: '감사 보고', desc: '감사(또는 감사위원장)가 감사보고서 요지 보고. 영업보고서 내용 보고.' },
          { title: '안건 심의·의결', desc: '의안별 순서대로 상정 → 설명 → 질의응답 → 표결. 보통결의/특별결의 구분 확인.' },
          { title: '폐회 및 의사록 작성', desc: '전 안건 처리 후 폐회 선언. 의사록 즉시 작성 (출석 이사·감사 기명날인). 공증인 인증.' },
        ]
      },
      {
        type: 'docs',
        title: '당일 준비 서류',
        items: [
          { who: 'company', name: '주주명부 및 출석부', note: '출석 주주 확인, 의결권 수 집계용' },
          { who: 'company', name: '각 의안별 설명 자료', note: '재무제표, 정관변경안 대조표, 이사후보 약력 등' },
          { who: 'company', name: '의사록 초안', note: '사전 작성 후 당일 확정. 결의결과 기재' },
          { who: 'company', name: '전자투표 결과 집계표', note: 'K-Vote 시스템에서 출력' },
          { who: 'shareholder', name: '신분증 / 위임장', note: '참석 주주 본인확인 및 대리인 권한 확인' },
        ]
      },
      {
        type: 'tips',
        title: '실무 유의사항',
        items: [
          '특별결의 안건(정관변경, 합병 등)과 보통결의 안건의 정족수를 혼동하지 않도록 주의.',
          '이해관계 있는 주주의 의결권 제한 여부 사전 확인 (감사위원 선임 시 3%룰 등).',
          '주총 결의취소의 소는 결의일로부터 2개월 내 제기 가능 (상법 제376조). 절차적 하자 방지가 핵심.',
          '상장사: 주총 종료 즉시 DART 수시공시 (주총결과 보고서). 의안별 찬반 비율 기재.',
        ]
      }
    ]
  },

  // ── 법인세 신고 ──
  't40': {
    title: '법인세 신고·납부 세부 프로세스',
    updated: '2026.3.24.',
    sections: [
      {
        type: 'steps',
        title: '업무 절차',
        items: [
          { title: '세무조정 착수', desc: '결산 확정 재무제표 기준 세무조정. 손금불산입, 익금산입 항목 정리. 세무사/회계사와 협업.' },
          { title: '법인세 과세표준 산정', desc: '각 사업연도 소득 → 이월결손금 공제 → 과세표준 확정 → 세율 적용 → 산출세액 → 세액공제·감면 → 납부세액 확정.' },
          { title: '신고서 작성 및 전자신고', desc: '국세청 홈택스 전자신고. 첨부서류: 재무제표, 세무조정계산서, 부속서류.' },
          { title: '납부', desc: '납부세액 신고기한 내 납부. 분납: 납부세액 1천만원 초과 시 2개월 내 분납 가능.' },
        ]
      },
      {
        type: 'docs',
        title: '첨부 서류',
        items: [
          { who: 'company', name: '재무제표 (확정)', note: '외감법인은 감사보고서 첨부 의무' },
          { who: 'company', name: '세무조정계산서', note: '소득금액조정합계표, 조정항목 명세서 등' },
          { who: 'auditor', name: '감사보고서 (외감법인)', note: '외부감사인 감사의견이 포함된 보고서' },
          { who: 'company', name: '법인세 과세표준 및 세액신고서', note: '홈택스 전자서식' },
        ]
      },
      {
        type: 'tips',
        title: '실무 유의사항',
        items: [
          '신고기한: 사업연도 종료 후 3개월 (12월 결산법인: 3월 31일).',
          '성실신고확인대상 법인, 연결납세법인은 4개월(4월 30일)까지 연장 가능.',
          '외감법인이 감사보고서 미수령 시에도 일단 추정치로 신고 후 수정신고 가능하나, 가산세 리스크 존재.',
        ]
      }
    ]
  },

};

// ═══════════════════════════════════════════════
// MODAL RENDERING
// ═══════════════════════════════════════════════

function openProcessModal(taskId) {
  const proc = PROCESS_DB[taskId];
  if (!proc) {
    alert('이 업무의 세부 프로세스는 아직 준비 중입니다.');
    return;
  }

  document.getElementById('modal-title').textContent = proc.title;
  const body = document.getElementById('modal-body');
  let html = '';

  if (proc.updated) {
    html += `<div style="font-size:11px;color:var(--text3);margin-bottom:16px">최종 업데이트: ${proc.updated}</div>`;
  }

  proc.sections.forEach(sec => {
    html += `<div class="proc-section">`;
    html += `<div class="proc-section-title">${sec.title}</div>`;

    if (sec.type === 'steps') {
      sec.items.forEach((item, i) => {
        html += `
          <div class="proc-step">
            <div class="proc-step-num">${i+1}</div>
            <div class="proc-step-content">
              <div class="proc-step-title">${item.title}</div>
              <div class="proc-step-desc">${item.desc}</div>
            </div>
          </div>`;
      });
    }

    else if (sec.type === 'docs') {
      html += '<div class="proc-docs">';
      sec.items.forEach(doc => {
        const whoMap = {
          company: { label: '회사', cls: 'who-company' },
          director: { label: '이사/감사', cls: 'who-director' },
          shareholder: { label: '주주', cls: 'who-shareholder' },
          lawfirm: { label: '법무사/법무법인', cls: 'who-lawfirm' },
          auditor: { label: '감사인/회계법인', cls: 'who-auditor' },
        };
        const w = whoMap[doc.who] || { label: doc.who, cls: 'who-company' };
        html += `
          <div class="proc-doc-card">
            <span class="proc-doc-who ${w.cls}">${w.label}</span>
            <div class="proc-doc-name">${doc.name}</div>
            ${doc.note ? `<div class="proc-doc-note">${doc.note}</div>` : ''}
          </div>`;
      });
      html += '</div>';
    }

    else if (sec.type === 'lawfirm') {
      sec.items.forEach((item, i) => {
        html += `
          <div class="proc-step">
            <div class="proc-step-num" style="background:var(--amber)">${i+1}</div>
            <div class="proc-step-content">
              <div class="proc-step-title">${item.title}</div>
              <div class="proc-step-desc">${item.desc}</div>
            </div>
          </div>`;
      });
    }

    else if (sec.type === 'tips') {
      sec.items.forEach(tip => {
        html += `<div class="proc-tip">${tip}</div>`;
      });
    }

    html += '</div>';
  });

  body.innerHTML = html;
  document.getElementById('proc-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('proc-modal').classList.remove('open');
  document.body.style.overflow = '';
}

