# CompliFlow — 정기주주총회 관리 시스템

정기주총 준비를 위한 업무 타임라인, 체크리스트, 세부 프로세스 관리 웹앱입니다.
GitHub Pages에 배포하여 사용합니다.

## 파일 구조

```
compliflow/
├── index.html           ← 화면 레이아웃 (거의 수정 불요)
├── css/style.css        ← 디자인/스타일 (거의 수정 불요)
├── js/app.js            ← 앱 로직 (기능 추가 시에만 수정)
├── data/
│   ├── agendas.js       ← 주총 안건 목록 ★ 자주 수정
│   ├── process.js       ← 세부 프로세스 (서류, 절차) ★ 자주 수정
│   └── tasks.js         ← 타임라인 업무 데이터 ★ 자주 수정
└── README.md            ← 이 파일
```

## 수정 가이드

### 1. 안건 추가/수정 → `data/agendas.js`

```javascript
// 이 형식으로 항목을 추가하세요
{id:'new_item', title:'새 안건명', desc:'설명 텍스트', checked:false}
```
- `id`: 영문 고유 식별자 (중복 불가)
- `checked: true`로 하면 기본 선택됨

### 2. 타임라인 업무 추가/수정 → `data/tasks.js`

```javascript
T.push({
  id: 't99',              // 고유 ID
  dBase: 'R',             // 'R' = 결산일 기준, 'D' = 주총일 기준
  dOffset: 30,            // 기준일로부터 +30일 (음수면 이전)
  title: '업무 제목',
  content: '한줄 설명',
  law: '상법 제OO조',      // 관련 법령
  category: '결산',        // 결산/주총준비/감사/주총/등기/공시/세무/배당/특별안건
  tags: ['필수', '등기'],   // 필수/외감/상장/등기/공시/신고/조건부/기업집단
  detail: '상세 설명...',
  filing: '공시/등기/신고 사항',
  exception: '예외사항',
  show: true,             // 조건부 표시: isListed, isAudit 등 변수 활용
});
```

**기준일 코드:**
- `R` (Reference) = 결산일. 예: `dBase:'R', dOffset:90` → 결산일+90일 = R+90
- `D` (D-day) = 주총일. 예: `dBase:'D', dOffset:-14` → 주총 14일 전 = D-14

### 3. 세부 프로세스 추가/수정 → `data/process.js`

```javascript
PROCESS_DB['t99'] = {        // 태스크 ID와 매칭
  title: '프로세스 제목',
  updated: '2026.4.1.',      // 최종 수정일
  sections: [
    {
      type: 'steps',          // 절차
      title: '업무 절차',
      items: [
        { title: '1단계', desc: '설명...' },
        { title: '2단계', desc: '설명...' },
      ]
    },
    {
      type: 'docs',           // 서류 목록
      title: '필요 서류',
      items: [
        { who: 'company',    name: '서류명', note: '비고' },
        { who: 'director',   name: '서류명', note: '비고' },
        { who: 'lawfirm',   name: '서류명', note: '비고' },
      ]
    },
    {
      type: 'tips',           // 유의사항
      title: '실무 유의사항',
      items: [
        '유의사항 1번 텍스트',
        '유의사항 2번 텍스트',
      ]
    }
  ]
};
```

**서류 준비 주체 (who 값):**
| 값 | 표시 | 색상 |
|---|---|---|
| `company` | 회사 | 파란색 |
| `director` | 이사/감사 | 보라색 |
| `shareholder` | 주주 | 초록색 |
| `lawfirm` | 법무사/법무법인 | 주황색 |
| `auditor` | 감사인/회계법인 | 청록색 |

## GitHub에서 수정하는 방법

1. GitHub 저장소에서 수정할 파일 클릭 (예: `data/process.js`)
2. 연필 아이콘 (Edit this file) 클릭
3. 내용 수정
4. 하단 "Commit changes" 클릭
5. GitHub Pages가 자동으로 업데이트됨 (1~2분 소요)

## Claude에게 수정 요청하는 방법

새 대화에서:
1. 수정할 파일을 업로드 (예: `data/process.js`)
2. "이 파일에 본점이전등기 후속 신고 절차를 추가해줘" 같이 요청
3. 수정된 파일을 받아서 GitHub에 교체

## 법령 개정 반영

Step 0의 "법령 개정사항 검색" 버튼은 Claude API를 사용합니다.
- GitHub Pages 배포 시에는 API 키 없이도 기본 내장 데이터는 표시됩니다.
- API 실시간 검색은 별도 서버 환경에서만 동작합니다.
- 법령 개정 확인 후 `data/tasks.js`의 업무 데이터를 수동 업데이트하세요.

## 배포

GitHub Pages 설정:
1. 저장소 Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, / (root)
4. Save

접속: `https://[사용자명].github.io/[저장소명]/`
