# saju-app

생년월일시로 사주팔자를 계산하고 풀이를 제공하는 웹 서비스.

## 구조

```
apps/
├── api/       @saju/api   — NestJS (REST)
└── web/       @saju/web   — Next.js
packages/
└── core/      @saju/core  — 사주 엔진 (순수 TypeScript)
```

`apps`는 배포 대상, `packages`는 다른 곳에서 import하는 라이브러리다. 자세한 배치 규칙은 [파일시스템 컨벤션](docs/conventions/filesystem.md)에 있다.

## 시작하기

**Windows는 WSL에서** 진행한다 (설치 스크립트가 bash 기준).

### 1. 시스템 도구 설치 (최초 1회)

아래 두 도구는 프로젝트가 설치해줄 수 없다 — Node 자체를 다루는 층이라 먼저 있어야 한다.

| 도구 | 용도 | 설치 |
|------|------|------|
| **mise** | `mise.toml`에 적힌 **Node 버전**으로 이 폴더를 자동 전환한다. Node를 관리하는 도구라 npm으로는 설치할 수 없다 | `brew install mise` 또는 `curl https://mise.run \| sh` — 설치 후 [셸 활성화](https://mise.jdx.dev/getting-started.html) 필요 |
| **corepack** | `package.json`의 `packageManager`를 읽어 **yarn 버전**을 맞춘다 | Node에 기본 포함 (없다면 `npm i -g corepack`) |

> 정리하면 **mise는 Node 버전**을, **corepack은 yarn 버전**을 고정한다. 둘의 역할이 다르다.

### 2. 환경 준비

```bash
yarn setup      # 또는 ./scripts/setup/bootstrap.sh
```

스크립트가 하는 일: 도구 확인 → `mise install`(Node 맞춤) → `corepack enable` → `yarn install` → 워크스페이스 연결 검증.
도구가 없으면 **설치하지 않고 안내만 하고 멈춘다.**

수동으로 하려면:

```bash
mise trust && mise install
corepack enable
yarn install
```

## 명령어

| 명령 | 설명 |
|------|------|
| `yarn dev` | 전체 개발 서버 실행 |
| `yarn build` | 전체 빌드 (turbo가 의존 순서대로·병렬 실행) |
| `yarn lint` | 린트 |
| `yarn test` | 테스트 |
| `yarn workspace @saju/api add <pkg>` | 특정 워크스페이스에 패키지 추가 |
| `yarn workspaces list` | 워크스페이스 목록 |

> 빌드·테스트는 [Turborepo](https://turbo.build)가 실행한다. `turbo.json`의 `dependsOn: ["^build"]` 덕분에 `@saju/core`가 먼저 빌드된 뒤 이를 의존하는 앱이 빌드된다.

## 문서

| 문서 | 내용 |
|------|------|
| [설계안](docs/plans/2026-08-06-saju-app-design.md) | 아키텍처·MVP 범위·로드맵 |
| [Git·공개 저장소 보안 컨벤션](docs/conventions/git-security.md) | 공개 저장소에서 지켜야 할 것 |
| [코드 스타일 컨벤션](docs/conventions/code-style.md) | 3원칙(KISS·YAGNI·DRY)·조건 네이밍 등 코드 작성 규칙 |
| [Git 컨벤션](docs/conventions/git.md) | 커밋·브랜치·이슈/PR·머지 전략 |
| [파일시스템 컨벤션](docs/conventions/filesystem.md) | 패키지명·폴더 배치·내부 구조 |
| [셋업 TODO](docs/setup-todo.md) | 아직 설정하지 않은 도구 |

> ⚠️ 이 저장소는 **public**이다. 커밋·이슈·PR을 올리기 전 [Git·공개 저장소 보안 컨벤션](docs/conventions/git-security.md)을 확인할 것.
