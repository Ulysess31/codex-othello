# 오델로 웹 게임

React와 JavaScript로 만든 간단한 2인용 오델로 연습 프로젝트입니다. 게임 기능을 크게 확장하기보다, 웹 프로젝트의 폴더 구조와 개발·검증 흐름을 이해하는 데 초점을 둡니다.

## 시작하기

먼저 컴퓨터에 Node.js가 설치되어 있어야 합니다. 프로젝트 폴더에서 아래 명령을 실행합니다.

```bash
npm install
npm run dev
```

`npm install`은 프로젝트에 필요한 개발 도구와 라이브러리를 설치합니다. `npm run dev`는 Vite 개발 서버를 실행합니다. 터미널에 나온 주소(일반적으로 `http://localhost:5173/`)를 브라우저에서 엽니다.

## 확인 명령

```bash
npm run test
npm run lint
npm run build
npm run preview
```

- `npm run test`: 오델로 규칙, 화면의 초기 표시, 방향키 이동 계산이 예상대로인지 확인합니다.
- `npm run lint`: JavaScript와 React 코드의 작성 규칙 및 흔한 실수를 검사합니다.
- `npm run build`: 브라우저에 배포할 파일을 `dist/` 폴더에 만듭니다.
- `npm run preview`: 먼저 만든 `dist/` 결과를 로컬 웹 서버에서 미리 보여줍니다. 주소는 터미널에 표시됩니다.

미리보기를 끝낼 때는 실행 중인 터미널에서 `Ctrl+C`를 누릅니다.

## 조작 방법

- 마우스나 터치로 화면에 표시된 가능한 칸을 누릅니다.
- 키보드 사용 시 Tab으로 보드에 들어온 뒤 방향키로 칸을 옮깁니다. Enter 또는 Space로 칸을 선택합니다.
- 게임 중 새 게임을 누르면 확인창이 표시됩니다.

## 폴더 안내

- `src/game/othello.js`: 화면과 분리된 오델로 규칙 계산
- `src/game/othello.test.js`: 오델로 규칙 자동 테스트
- `src/components/Board.jsx`: 보드 표시와 칸 키보드 조작
- `src/components/boardNavigation.js`: 방향키로 이동할 좌표 계산
- `src/components/GameInfo.jsx`: 차례, 점수, 안내와 결과 표시
- `src/App.jsx`: 게임 상태와 화면·규칙 연결
- `memory-bank/design-document.md`: 게임이 어떻게 동작해야 하는지 정리
- `memory-bank/implement.md`: 단계별 구현 계획과 완료 조건
- `memory-bank/progress.md`: 실제 진행 상황과 검증 결과
- `memory-bank/architecture.md`: 파일 역할과 코드 사이의 연결 설명
- `AGENTS.md`: 개발 중 지킬 기술 규칙

