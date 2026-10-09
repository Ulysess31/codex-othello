# Vercel 배포 작업 이력

## 목표

`vercel-othello` 브랜치를 Vercel에 배포한다. 이 브랜치는 Vercel 미리보기 배포로 사용하고, 기존 `main` 브랜치와 GitHub Pages 설정은 유지한다.

## 현재 상태

- 브랜치: `vercel-othello`
- Vite는 Vercel 빌드 환경에서 사이트 주소의 루트(`/`)를 사용하고, 그 밖의 빌드에서는 GitHub Pages의 `/codex-othello/` 경로를 사용하도록 설정했다.
- 저장소 루트 `vercel.json`에 Vite 프레임워크, `npm ci` 설치 명령, `npm run build` 빌드 명령, `dist` 출력 폴더를 지정했다.
- Vercel 계정 연결, 원격 브랜치 push, 배포 URL과 성공 여부는 아직 확인되지 않았다.

## 직접 확인하고 배포하는 방법

1. GitHub에서 `Ulysess31/codex-othello` 저장소를 열고 `vercel-othello` 브랜치가 원격에 있는지 확인한다.
2. Vercel 대시보드에서 **Add New… → Project**를 선택하고 GitHub 계정을 연결한 다음 `codex-othello` 저장소를 가져온다. 기존에 프로젝트가 연결돼 있으면 새 프로젝트를 만들지 말고 기존 프로젝트의 **Settings → Git**에서 저장소 연결을 확인한다.
3. 프로젝트 설정에서 Framework Preset은 **Vite**, Install Command는 `npm ci`, Build Command는 `npm run build`, Output Directory는 `dist`로 설정한다. 저장소의 `vercel.json`이 이 값을 제공한다.
4. Git 설정의 Production Branch는 현재 서비스 운영 브랜치인 `main`으로 둔다. `vercel-othello`에 push한 변경은 Preview 배포로 만들 수 있다.
5. **Deploy**를 누르거나 Vercel 프로젝트의 **Deployments** 화면에서 `vercel-othello` 브랜치의 배포를 선택한다. 빌드가 끝나면 Preview URL을 열어 게임과 정적 파일이 정상 표시되는지 확인한다.

Vercel CLI를 사용하는 경우 프로젝트 폴더에서 `npx vercel`을 실행해 Preview 배포를 시작할 수 있다. 최초 실행 때 계정 로그인이나 프로젝트 연결이 필요할 수 있다. 운영 배포를 만들려는 목적이 아니라면 `--prod` 옵션은 붙이지 않는다.

## 작업 기록

### 2026-10-09 — 배포 준비

- `vercel-othello` 브랜치를 만들었다. 기존 작업 중이던 파일 변경은 유지했다.
- GitHub Pages용 Vite 기준 경로 때문에 Vercel 루트 배포에서 정적 파일 주소가 깨지지 않도록 `VERCEL` 환경 변수에 따라 기준 경로를 나눴다.
- Vercel이 빌드 설정을 읽도록 `vercel.json`을 추가했다.
- Vercel CLI는 이 환경에 설치돼 있지 않고, Vercel 로그인·프로젝트 연결 여부도 아직 확인하지 못했다.
- 아직 Vercel 배포 URL이 없으므로 배포 완료로 표시하지 않는다.
