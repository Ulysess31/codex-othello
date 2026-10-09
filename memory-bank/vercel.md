# Vercel 배포 작업 이력

## 목표

`vercel-othello` 브랜치를 Vercel에 배포한다. 이 브랜치는 Vercel 미리보기 배포로 사용하고, 기존 `main` 브랜치와 GitHub Pages 설정은 유지한다.

## 현재 상태

- 브랜치: `vercel-othello`
- Vite는 Vercel 빌드 환경에서 사이트 주소의 루트(`/`)를 사용하고, 그 밖의 빌드에서는 GitHub Pages의 `/codex-othello/` 경로를 사용하도록 설정했다.
- 저장소 루트 `vercel.json`에 Vite 프레임워크, `npm ci` 설치 명령, `npm run build` 빌드 명령, `dist` 출력 폴더를 지정했다.
- 원격 브랜치 `origin/vercel-othello`에 현재 앱과 설정을 push했다.
- 로그아웃 상태에서 만든 임시 배포가 준비됐고, 60분 후 만료된다. Git 저장소에 연결된 Vercel 프로젝트의 지속적인 Preview와는 다르다.
- 사용자가 Vercel에 저장소를 등록했다. GitHub의 최근 커밋에서 Vercel 배포 성공 상태를 확인했다.

## 직접 확인하고 배포하는 방법

1. GitHub에서 `Ulysess31/codex-othello` 저장소를 열고 `vercel-othello` 브랜치가 원격에 있는지 확인한다.
2. Vercel 대시보드에서 **Add New… → Project**를 선택하고 GitHub 계정을 연결한 다음 `codex-othello` 저장소를 가져온다. 기존에 프로젝트가 연결돼 있으면 새 프로젝트를 만들지 말고 기존 프로젝트의 **Settings → Git**에서 저장소 연결을 확인한다.
3. 프로젝트 설정에서 Framework Preset은 **Vite**, Install Command는 `npm ci`, Build Command는 `npm run build`, Output Directory는 `dist`로 설정한다. 저장소의 `vercel.json`이 이 값을 제공한다.
4. Git 설정의 Production Branch는 현재 서비스 운영 브랜치인 `main`으로 둔다. `vercel-othello`에 push한 변경은 Preview 배포로 만들 수 있다.
5. **Deploy**를 눌러 저장소를 연결한다. 이후 원격 `vercel-othello` 브랜치에 push할 때마다 해당 브랜치의 Preview URL이 새로 만들어진다. 빌드가 끝나면 URL을 열어 게임을 확인한다.

Vercel CLI를 사용하는 경우 프로젝트 폴더에서 `npx vercel`을 실행해 Preview 배포를 시작할 수 있다. 최초 실행 때 계정 로그인이나 프로젝트 연결이 필요할 수 있다. 운영 배포를 만들려는 목적이 아니라면 `--prod` 옵션은 붙이지 않는다.

## 작업 기록

### 2026-10-09 — GitHub push 자동 배포 확인

- 사용자의 Vercel 등록 후 `vercel-othello` 최근 커밋 `c4d6a16`의 GitHub 상태를 조회했다. `Vercel` 검사가 `success`, 설명은 `Deployment has completed`였다.
- 확인 기록을 커밋 `514254a`로 push했다. Vercel 상태가 `pending` (`Vercel is deploying your app`)에서 `success` (`Deployment has completed`)로 바뀌는 것을 확인했다. GitHub 배포 환경은 `Preview`다.
- `vercel-othello`에 push하면 Vercel Preview가 자동 배포되는 연결이 확인됐다. 운영 사이트 갱신은 Vercel에서 지정한 Production Branch에 push해야 한다.
- 문서만 변경하므로 로컬 테스트와 빌드는 실행하지 않는다. 실제 Vercel 자동 배포 결과는 GitHub 커밋 상태로 확인한다.

### 2026-10-09 — 배포 준비

- `vercel-othello` 브랜치를 만들었다. 기존 작업 중이던 파일 변경은 유지했다.
- GitHub Pages용 Vite 기준 경로 때문에 Vercel 루트 배포에서 정적 파일 주소가 깨지지 않도록 `VERCEL` 환경 변수에 따라 기준 경로를 나눴다.
- Vercel이 빌드 설정을 읽도록 `vercel.json`을 추가했다.
- Vercel CLI 63.1.0을 `npx`로 실행했다. `vercel whoami`에서 현재 CLI가 로그아웃 상태임을 확인했다.
- 작업 중인 저장소에서 임시 배포를 바로 만들 때는 `npm ci`가 Windows 파일 잠금 오류로 실패했다. `npm install`로 로컬 의존성을 복구했고, Vercel 환경 변수 `VERCEL=1`에서 `npm run build`가 성공하며 자산 경로가 `/assets/...`인지 확인했다.
- `vercel-othello`의 깨끗한 임시 worktree에서 `vercel deploy --temporary --yes --logs`를 실행했다. 설치, 빌드, 배포가 성공해 임시 URL이 준비됐다: <https://temporary-speedy-spinel-tk2ys5s.vercel.app/>.
- 임시 배포의 페이지와 JavaScript, CSS 요청은 모두 HTTP 200을 반환했다. 이 배포는 60분 후 만료되며 Vercel 계정으로 claim하면 유지할 수 있다. claim 링크는 사용자에게 직접 제공하고 공개 저장소 문서에는 기록하지 않는다.
- 계속 사용하려면 Vercel 계정에 로그인해 Preview를 claim하거나, Vercel 대시보드에서 GitHub 저장소를 가져와 `vercel-othello` 브랜치 Preview 자동 배포를 설정한다.
