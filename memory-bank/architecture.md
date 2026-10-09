# 오델로 웹 게임 아키텍처

## 목적과 기준

이 문서는 프로젝트 파일의 책임과 코드 사이의 연결 방식을 설명한다. 게임 기능과 사용자 동작은 `design-document.md`, 구현 순서와 완료 조건은 `implement.md`, 공통 개발 규칙은 저장소 루트 `AGENTS.md`를 기준으로 한다. 이 문서는 구조를 설명하며 요구사항이나 작업 상태를 대신 관리하지 않는다.

1·2단계는 완료됐다. 3·4단계 기능과 자동 검증 코드도 구현했지만 실제 브라우저 클릭·키보드·화면 크기 확인은 남아 있다. 아래에서 코드 구성과 수작업 확인 상태를 구분한다.

## 초보자를 위한 도구 안내

처음에는 도구 이름이 많아 보이지만, 각각 맡은 일이 다르다.

- **JavaScript**는 이 프로젝트의 동작을 작성하는 프로그래밍 언어다. 게임 규칙과 버튼을 눌렀을 때의 동작을 JavaScript로 만든다.
- **Node.js**는 JavaScript를 브라우저 밖에서도 실행하게 해주는 프로그램이다. 개발 서버나 테스트 도구처럼 개발할 때 필요한 프로그램을 컴퓨터에서 실행한다. Node.js 자체가 게임 규칙을 검사하는 것은 아니다.
- **npm**은 Node.js 프로젝트의 도구를 설치하고 실행하는 관리자다. `package.json`에는 설치할 도구와 짧은 실행 명령이 적혀 있고, `package-lock.json`에는 실제 설치한 버전이 기록된다.
- **`npm install`**은 `package.json`을 읽어 필요한 도구를 설치한다. 처음 내려받은 프로젝트에서 준비할 때 실행한다.
- **`npm run 이름`**은 `package.json`의 `scripts`에 등록된 명령을 실행한다. 예를 들어 `npm run dev`는 개발 서버를 켜고, `npm run build`는 배포 파일을 만든다. `npm run test`는 `test` 항목에 연결된 Vitest를 실행한다.
- **React**는 화면을 작은 단위로 만들고, 데이터가 바뀌면 화면을 다시 표시하도록 돕는 JavaScript 라이브러리다. 이 프로젝트에서는 `App`과 보드 같은 화면 단위를 구성하는 데 쓴다.
- **Vite**는 개발 중 웹 페이지를 띄우는 서버와 배포 파일을 만드는 도구다. `npm run dev`와 `npm run build`가 Vite를 실행한다.
- **Vitest**는 테스트 코드를 실행하는 도구다. `vitest run`은 테스트를 한 번 실행하고 결과를 터미널에 보여준다. 테스트는 예상한 동작을 코드로 적어두고 실제 결과가 그 예상과 맞는지 비교한다.
- **ESLint**는 코드를 실행하기 전에 문법과 작성 규칙을 검사한다. 이 프로젝트의 `npm run lint`가 ESLint를 실행한다.

현재 `npm run test`는 React 기본 화면과 오델로 규칙 테스트를 함께 실행한다. 규칙 테스트는 시작 배치, 가능한 수, 돌 뒤집기, 차례 넘김과 게임 종료가 규칙대로 계산되는지 확인한다.

터미널 명령은 프로젝트 폴더에서 실행한다. `npm run dev`를 실행하면 개발 서버가 켜지고 로컬 주소가 표시된다. 그 주소를 브라우저에서 열어 화면을 본다. 작업을 마칠 때는 서버가 실행 중인 터미널에서 `Ctrl+C`를 눌러 종료한다. `npm run test`, `npm run lint`, `npm run build`는 확인을 마치면 끝나는 명령이다.

한 줄로 흐름을 보면 다음과 같다.

```text
개발자가 JavaScript/React 코드 작성
  → Node.js가 개발 도구를 실행
  → npm이 요청한 도구를 골라 실행
  → Vite는 화면을 띄우고 빌드 / Vitest는 테스트 실행 / ESLint는 코드 검사
```

## 현재 저장소 구조

```text
AGENTS.md                  # 저장소 전체 개발 규칙
README.md                  # 설치, 실행, 확인 명령과 주요 파일 안내
index.html                 # 브라우저 문서와 React 마운트 지점
package.json               # 의존성과 개발 명령
package-lock.json          # 실제 설치된 패키지 버전 고정
vite.config.js             # Vite, React, Vitest 설정
.github/workflows/deploy.yml # main 변경 때 GitHub Pages 빌드·배포
vercel.json                # Vercel 설치·빌드·정적 출력 설정
eslint.config.js           # JavaScript와 React 훅 검사 규칙
src/
  main.jsx                 # React 앱을 브라우저에 연결하는 진입점
  App.jsx                  # 게임 상태와 화면을 연결
  setup.test.jsx           # 초기 게임 화면 렌더링 확인
  components/
    Board.jsx              # 8×8 보드, 칸 버튼과 키보드 포커스 이동
    boardNavigation.js     # 방향키 입력을 다음 보드 좌표로 바꾸는 순수 함수
    Board.test.jsx         # 방향키 이동 계산과 가장자리 처리 테스트
    GameInfo.jsx           # 차례, 점수, 안내와 새 게임
  game/
    othello.js             # 화면과 분리된 오델로 규칙 함수
    othello.test.js        # 오델로 규칙 자동 테스트
  styles/app.css           # 전역 및 기본 화면 스타일
memory-bank/
  design-document.md       # 게임 요구사항과 규칙
  implement.md             # 구현 단계와 완료 조건
  progress.md              # 현재 진행 상태와 작업 기록
  architecture.md          # 파일 책임과 구조 설명
  prompt.md                # 대화에서 사용자가 요청한 프롬프트 기록
  vercel.md                # Vercel 배포 준비와 실행 이력
```

## 파일의 책임

| 파일 | 상태 | 책임 |
| --- | --- | --- |
| `index.html` | 구성됨 | 한국어 문서 메타데이터, 페이지 제목, React가 연결될 `#root`, `src/main.jsx` 진입 스크립트를 제공한다. |
| `README.md` | 구성됨 | Node.js 준비 후 설치·실행하는 법과 npm 검증 명령을 초보자 눈높이에서 안내한다. 주요 코드·계획 문서의 역할도 찾아볼 수 있다. |
| `src/main.jsx` | 구성됨 | `App`과 전역 CSS를 불러오고 React 루트를 생성한다. 앱 시작 연결만 맡는다. |
| `src/App.jsx` | 구성됨 | 게임 상태를 보관하고 보드 입력을 규칙 함수에 전달한다. 계산된 보드, 차례, 점수, 결과를 화면 컴포넌트에 내려준다. 새 게임과 무효 수 안내도 처리한다. |
| `src/styles/app.css` | 구성됨 | 보드, 돌, 점수 카드, 작은 화면 배치와 눈에 띄는 키보드 포커스를 스타일링한다. |
| `src/setup.test.jsx` | 구성됨 | 초기 화면의 64칸, 가능한 수, 차례·점수, 새 게임 버튼, 하나의 Tab 진입점, 칸 설명을 확인한다. 실제 클릭이나 브라우저 레이아웃을 자동 시험하지는 않는다. |
| `src/components/Board.jsx` | 구성됨 | 64개 보드 버튼과 돌·합법 수 표시를 그린다. 좌표와 놓을 수 있는지 이름으로 읽어주며, Tab으로 한 번 진입하고 방향키로 포커스를 옮긴다. Enter와 Space는 버튼 기본 동작으로 착수한다. 게임 규칙은 계산하지 않는다. |
| `src/components/Board.test.jsx` | 구성됨 | 네 방향키 좌표 계산, 보드 가장자리에서 멈춤, 방향키가 아닌 입력을 자동 확인한다. 실제 브라우저의 포커스 이동을 자동 조작하지는 않는다. |
| `src/components/boardNavigation.js` | 구성됨 | 방향키 이름과 현재 좌표를 받아 다음 좌표를 계산한다. 보드 경계에서는 0~7 범위 안에 머물고, 방향키가 아닌 키에는 이동 좌표 대신 `null`을 반환한다. |
| `src/components/GameInfo.jsx` | 구성됨 | 현재 차례, 흑·백 점수, 안내·결과 메시지와 새 게임 버튼을 표시한다. |
| `src/game/othello.js` | 구성됨 | `createInitialBoard`, `getFlips`, `getLegalMoves`, `applyMove`, `getNextTurn`, `countDiscs`로 초기 보드, 합법 수, 뒤집기, 불변 보드 갱신, 차례·패스·종료와 점수를 계산한다. React나 브라우저 화면에 의존하지 않는다. |
| `src/game/othello.test.js` | 구성됨 | Vitest로 초기 배치, 여덟 방향 뒤집기, 경계·무효 수, 입력 보드 보존, 차례 변경·패스·종료와 승패를 확인한다. |
| `vite.config.js` | 구성됨 | React JSX 변환과 Vitest 실행 환경을 설정하고, Vercel 배포에서는 `/`, GitHub Pages에서는 `/codex-othello/`를 정적 파일 기준 경로로 사용한다. |
| `vercel.json` | 추가됨 | Vercel이 npm 의존성을 설치하고 Vite 빌드를 실행한 뒤 `dist/` 폴더를 정적 사이트로 게시하도록 설정한다. |
| `memory-bank/vercel.md` | 추가됨 | Vercel 배포 브랜치, 설정 과정, 수동 확인 방법과 배포 결과를 기록한다. |
| `.github/workflows/deploy.yml` | 추가됨 | `main` 브랜치에 push되거나 수동 실행을 요청하면 GitHub Actions가 Pages 설정을 확인하고 Node.js 의존성을 설치해 `dist/`를 빌드·게시한다. |
| `eslint.config.js` | 구성됨 | 브라우저 JavaScript를 검사하고 ESLint 기본 및 React 훅 규칙을 적용한다. |
| `package.json` | 구성됨 | 개발, 빌드, 미리보기, lint, 테스트 명령과 직접 의존성을 선언한다. |
| `package-lock.json` | 구성됨 | 재설치 시 같은 의존성 트리를 사용하도록 실제 버전을 고정한다. |
| `AGENTS.md` | 구성됨 | 코드 변경 시 따라야 할 기술 선택, 코딩 규칙, 접근성 및 검증 원칙을 지정한다. |
| `memory-bank/design-document.md` | 구성됨 | 사용자가 원하는 게임 기능, 규칙과 완료 기준을 정의한다. |
| `memory-bank/implement.md` | 구성됨 | 설계 요구를 코드로 옮기는 순서와 단계별 완료 조건을 정의한다. |
| `memory-bank/progress.md` | 구성됨 | 완료·진행·미완료 작업과 마지막 검증을 기록한다. |
| `memory-bank/architecture.md` | 구성됨 | 이 파일 구조와 설계 의도를 설명한다. |
| `memory-bank/prompt.md` | 구성됨 | 이 대화에서 사용자가 직접 요청한 프롬프트를 시간순으로 모아둔다. |

## 자동 테스트는 어디에 적나?

테스트의 **실행 명령**, **실제 확인 내용**, **실행 결과**는 각각 다른 곳에 기록한다.

| 위치 | 초보자용 설명 |
| --- | --- |
| `package.json`의 `"test": "vitest run"` | `npm run test`를 입력했을 때 Vitest를 실행하라는 연결 설정이다. |
| `src/game/othello.test.js` | 오델로 규칙 테스트 14개의 실제 시나리오와 기대 결과가 적혀 있다. `describe`는 관련 테스트를 묶고, `it`은 개별 상황을 정하며, `expect`는 실제 결과가 예상과 같은지 비교한다. |
| `src/setup.test.jsx` | React 기본 화면 1개를 확인한다. 64칸, 초기 합법 수와 하나의 Tab 진입점, 칸별 설명이 화면 결과에 담기는지도 검사한다. |
| `src/components/Board.test.jsx` | `boardNavigation.js`의 네 방향 좌표 계산과 보드 가장자리 처리를 검사한다. |
| `src/game/othello.js` | 테스트가 부르는 실제 게임 규칙 함수가 구현되어 있다. 테스트는 이 파일의 결과를 예상값과 비교한다. |
| `memory-bank/implement.md` | 어떤 종류의 상황을 테스트해야 하는지 계획과 완료 기준을 적는다. |
| `memory-bank/progress.md` | 테스트 명령을 실행한 날의 결과와 검증 이유를 기록한다. 테스트 조건 자체를 적는 파일은 아니다. |

현재 전체 테스트는 18개다. 이 가운데 14개는 규칙 엔진, 1개는 React 화면 표시, 3개는 방향키 좌표 계산을 확인한다. 화면 테스트는 보드의 하나의 Tab 진입점과 칸 설명도 확인하지만 실제 클릭, 실제 DOM 포커스 이동, 모바일 배치를 대신해주지 않는다. 이 부분은 브라우저에서 직접 확인해야 한다. 예를 들어 “상대 차례에 둘 수가 없으면 패스한다” 테스트는 `othello.test.js`에서 보드 상황을 만들고 `getNextTurn` 결과가 예상과 같은지 비교한다. `npm run test`가 세 테스트 파일을 자동 실행한다. 테스트를 추가하면 실제 조건은 테스트 파일에, 실행 결과와 이유는 `progress.md`에 기록한다.

## 의존 관계와 데이터 흐름

```text
index.html
  └─ src/main.jsx
       ├─ src/App.jsx
       └─ src/styles/app.css

현재 데이터 흐름:
othello.test.js → othello.js의 입력과 결과를 비교
Board.jsx → App.jsx의 칸 선택 이벤트 → othello.js 함수 호출
App.jsx → 새 게임 상태 → Board.jsx / GameInfo.jsx 화면 갱신

화면을 연결할 때는 다음 흐름을 따른다:
App.jsx → Board.jsx / GameInfo.jsx
App.jsx → game/othello.js → 새 게임 상태를 화면에 반영
```

사용자가 칸을 선택하면 `Board`가 좌표를 `App`에 전달한다. `App`은 `othello.js`의 순수 함수를 호출해 새 보드와 다음 차례를 구하고, 변경된 게임 상태를 한 번에 반영한다. `Board`와 `GameInfo`는 상태를 받아 표시한다. 이 방향을 유지하면 게임 규칙이 React 렌더링과 분리되어 규칙 테스트가 쉽고, 표시 컴포넌트가 게임 로직을 중복 구현하지 않는다.

`getNextTurn(board, player)`에서 `player`는 **방금 수를 둔 플레이어**다. 함수는 상대가 둘 수 있는지 먼저 확인하고, 상대가 못 두면 같은 플레이어가 다시 둘 수 있는지 확인한다. 둘 다 둘 수 없으면 점수를 세어 게임을 끝낸다. 반환값의 `passed`는 상대가 차례를 건너뛰었는지를, `winner`는 승자 이름 또는 무승부일 때 `null`을 나타낸다. 이 약속을 정한 이유는 화면 단계에서 차례 안내와 종료 표시를 한 가지 기준으로 연결하기 위해서다.

## 구조 선택의 이유

- **작은 단방향 구조:** 한 화면에서 두 명이 번갈아 하는 게임이므로 초기에는 `App`을 상태 소유자로 두고 props와 이벤트로 연결한다. 상태 공유 라이브러리나 별도 서비스 계층은 현재 필요하지 않다.
- **규칙을 UI에서 분리:** 오델로 규칙은 브라우저 화면 없이 입력 보드와 좌표만으로 계산할 수 있다. 순수 함수는 같은 입력에 같은 결과를 내고 입력 배열을 변경하지 않아 테스트와 버그 추적이 단순해진다.
- **점수·합법 수 파생:** 보드가 원본 데이터다. 점수와 가능한 수를 별도 상태에 복제하지 않으면 수를 둘 때 서로 다른 값으로 어긋나는 문제를 줄일 수 있다.
- **의존성 절제:** Vite는 개발 서버와 빌드를, React는 화면을, 일반 CSS는 스타일을 맡는다. 작은 게임에 추가 상태 관리나 스타일 라이브러리를 도입하면 이해하고 유지할 표면적이 커진다.
- **검증을 층별로 수행:** Vitest는 규칙 함수와 초기 렌더링을 확인하고, ESLint는 코드 규칙을, Vite 빌드는 배포 번들 생성을 확인한다. 이 도구들은 서로 다른 실패를 찾아준다.
- **접근성을 보드 설계에 포함:** 보드 칸의 이름, 포커스, 키보드 이동은 칸 인터랙션 설계와 함께 구현해야 한다. 나중에 덧붙이는 경우 마우스 중심 구조를 다시 바꿔야 할 수 있다.

## 확장 기준

- 상태 전이가 복잡해지면 `App`의 `useState`를 `useReducer`로 바꿔 상태 전이를 한 곳에 모은다.
- 화면이나 규칙 코드가 실제로 커져 역할이 흐려질 때에만 새 모듈을 분리한다.
- 성능 문제가 측정되기 전에는 `memo`, `useMemo`, `useCallback`을 기본값으로 추가하지 않는다. 64칸 계산은 우선 단순하게 유지한다.
- 온라인 대전, 저장, AI 상대가 요구될 경우 기존 로컬 규칙과 UI를 무리하게 섞지 말고 별도 요구사항과 데이터 흐름을 먼저 설계한다.

## 유지보수 규칙

- 새 파일이 추가되거나 책임이 바뀌면 파일 책임 표와 구조 그림을 갱신한다.
- 요구사항 변경은 `design-document.md`, 구현 순서 변경은 `implement.md`, 실제 완료 상태 변경은 `progress.md`에 반영한다.
- 검증 결과는 실제 실행한 명령과 결과만 `progress.md`에 기록한다.
