# 파일시스템 컨벤션

패키지 이름·폴더 배치·파일 네이밍의 기준. 새 파일을 어디에 만들지 고민될 때 이 문서를 따른다.

## 패키지 이름

모든 워크스페이스는 **`@saju/` 스코프로 통일**한다.

| 워크스페이스 | 이름 |
|--------------|------|
| `packages/core` | `@saju/core` |
| `apps/api` | `@saju/api` |
| `apps/web` | `@saju/web` |

- `import { ... } from "@saju/core"` — 읽는 순간 우리 패키지임이 드러난다.
- npm의 실제 패키지(`core` 등)와 이름 충돌이 없다. 배포하지 않아도(`private: true`) 스코프는 자유롭게 쓴다.
- 새 패키지도 같은 스코프로: `@saju/ui`, `@saju/config` …

## 최상위 레이아웃

```
saju-app/
├── apps/          배포되는 것 (실행 가능한 애플리케이션)
│   ├── api/       @saju/api — NestJS
│   └── web/       @saju/web — Next.js
├── packages/      다른 곳에서 import되는 것 (라이브러리)
│   └── core/      @saju/core — 사주 엔진 (순수 TS)
├── docs/          컨벤션·설계·학습기록
├── scripts/       운영 스크립트 (분류 기준은 scripts/README.md)
└── .github/       이슈·PR 템플릿, (예정) CI
```

**구분 기준**: `apps/` = **배포 대상**(스스로 실행됨) / `packages/` = **import 대상**(라이브러리). 애매하면 "이걸 다른 패키지가 import하는가?"로 판단한다.

## 파일·폴더 네이밍

| 대상 | 규칙 | 예 |
|------|------|-----|
| 폴더 | kebab-case | `five-elements/` |
| 일반 파일 | kebab-case | `calculate-pillars.ts` |
| React 컴포넌트 파일 | **PascalCase** | `SajuResult.tsx` |
| 테스트 | 대상 파일명 + `.test.ts` | `calculate-pillars.test.ts` |
| 타입 전용 파일 | kebab-case + `.types.ts` | `saju.types.ts` |
| 배럴 파일 | `index.ts` | 패키지 공개 진입점만 |

- **kebab-case 기본** — macOS(대소문자 무시)와 Linux CI(구분)의 차이로 생기는 "로컬은 되는데 CI에서 깨짐" 사고를 차단한다.
- **컴포넌트만 PascalCase** — 파일명 = 컴포넌트명이라 import가 자연스럽다.
- **배럴(`index.ts`) 남발 금지** — 패키지 진입점(`packages/core/src/index.ts`)에만 둔다. 내부 폴더마다 만들면 순환참조·불필요한 번들 포함이 생긴다.

## `packages/core` — 사주 엔진

계산 파이프라인 단계가 그대로 폴더가 된다 (Phase 0 구현 순서와 1:1).

```
packages/core/src/
├── index.ts          공개 API만 export (유일한 배럴)
├── constants/        천간·지지·60갑자 등 불변 데이터
├── calendar/         절기·음력변환·진태양시
├── pillars/          사주팔자 — 년·월·일·시주
├── analysis/         오행 분포·십성·신강약
├── interpretation/   풀이 조각 + 카테고리 조립
└── types/            공용 타입
```

### 확장 시 고려사항 (의도적으로 단순하게 시작함)

이 구조는 **사주 하나의 파이프라인**이다. 운세 전반(토정비결·띠운세·별자리 등)으로 확장할 때는 재편이 필요하며, 그때 아래를 기준으로 판단한다.

- **Rule of Three** — 두 번째 사례가 나오기 전에는 추상화하지 않는다. 경계는 머리로 미리 그으면 대개 틀리고, 두 번째 운세가 생길 때 진짜 모습이 드러난다.
- **"공통일 것 같은 것"을 의심하라** — 별자리는 간지·음력을 아예 쓰지 않고(태양 황경 기반), 띠운세는 간지의 극히 일부(년지)만 쓴다. "달력은 공통이겠지"는 부분적으로만 맞다.
- **계산은 공유되고 해석은 분리된다** — 사주의 일진과 띠운세의 띠는 같은 간지 계산에서 나오지만 해석 규칙은 완전히 다르다.
- 판단 기준: 함께 변하는가(Common Closure) · 의존 방향 · 용어의 의미 경계(Bounded Context) · 배포/소유 단위.

## `apps/api` — NestJS

NestJS 공식 권장인 **도메인 모듈** 단위. 한 도메인 = 한 폴더 = `module`·`controller`·`service` + `dto/` 세트.

```
apps/api/src/
├── main.ts                 부트스트랩 (포트·CORS·Swagger·글로벌 파이프)
├── app.module.ts           루트 모듈 — 하위 모듈 조립
├── saju/                   사주 계산·풀이 (core 호출)
│   ├── saju.module.ts · saju.controller.ts · saju.service.ts
│   └── dto/
├── profiles/               내 사주 저장 (CRUD)
├── users/                  사용자 정보 (프로필·설정·상태)
├── auth/                   인증·인가 메커니즘 — Passport 전략·JWT·가드
├── common/                 횡단 관심사 — 필터·가드·인터셉터·데코레이터·파이프
├── config/                 환경변수 스키마·검증
└── prisma/                 PrismaService (전역 모듈), schema.prisma
```

- **`users` ≠ `auth`** — auth는 "인증 메커니즘"(전략·토큰), users는 "사용자라는 도메인"(정보·설정). 변하는 이유가 다르므로 분리한다.
- 새 운세가 생기면 `saju/`의 **형제 모듈로 추가**한다 (`tojeong/` 등). API 모듈은 엔드포인트 묶음이라 도메인 경계와 잘 맞는다.
- `common/`은 어느 도메인에도 속하지 않는 것만 — 도메인 냄새가 나면 해당 모듈로.

## `apps/web` — Next.js (간략화 FSD)

**3층 구조** — 정통 FSD(6층)에서 pages는 Next의 `app/`이 대신하고, entities·widgets는 규모가 커지면 도입한다.

```
apps/web/src/
├── app/                        ① 라우팅 층 (App Router 전용)
│   ├── layout.tsx · page.tsx
│   ├── result/page.tsx
│   └── providers.tsx           전역 Provider 조립
├── features/                   ② 도메인 층 (기능별 수직 슬라이스)
│   └── saju/
│       ├── components/         도메인 조립 컴포넌트 — BirthInputForm, SajuResult
│       ├── hooks/              useSajuQuery, useBirthForm
│       ├── api/                sajuApi.ts (서버 통신)
│       ├── constants/          오행 색상, 라벨 매핑
│       ├── utils/              도메인 전용 변환·포맷
│       └── types.ts
└── shared/                     ③ 공용 층 (도메인 무관)
    ├── ui/                     Atomic 철학의 공용 컴포넌트 (Button, Input, Modal)
    ├── hooks/                  useDebounce 등 범용 훅
    ├── lib/                    apiClient 등 외부 라이브러리 설정·래퍼
    ├── utils/                  순수 유틸 함수
    ├── constants/              routes 등 범용 상수
    ├── styles/                 globals.css, 디자인 토큰
    └── types/                  공용 타입
```

### 의존 규칙 (핵심)

```
app  →  features  →  shared        (이 방향으로만 import)
```

| 층 | 담는 것 | 규칙 |
|----|---------|------|
| `app/` | 라우팅·페이지 조립 | features 컴포넌트를 **배치만** 한다. 비즈니스 로직 금지 |
| `features/` | 도메인 수직 슬라이스 | **feature 간 직접 import 금지** — 공유할 것은 shared로 내린다 |
| `shared/` | 도메인 무관 공용 | **features를 절대 import하지 않는다.** "사주"가 등장하면 여기 있으면 안 된다 |

### 상태의 배치

| 상태 | 예 | 위치 |
|------|-----|------|
| 도메인 상태 | 폼 값·검증·조회 결과 | **feature 내부 훅이 소유** — app은 존재도 모른다 |
| 전역 상태 | 로그인 유저·테마 | shared/store에 정의, **app의 providers가 공급** |
| 페이지 조립 상태 | URL 파라미터 → props | app 페이지에서 허용 (로직이 아니라 배선) |

- 판별법: 코드에 도메인 단어가 등장하거나 데이터를 가공하면 → feature. "누구를 어디에 놓을까"뿐이면 → app.

### Atomic 철학의 적용

atoms/molecules/organisms **폴더 분류는 쓰지 않는다** (분류 논쟁 방지). 대신 조합의 계층만 살린다:
`shared/ui`(원자·분자급 범용 부품) → `features/*/components`(부품을 조합한 도메인 덩어리) → `app/`(페이지).

### 배치 판별 한 줄

**"사주(도메인)를 몰라도 쓸 수 있는가?"** — Yes → `shared/`, No → `features/saju/`.

*(`store/`·`context/`·`assets/` 등은 필요해질 때 추가한다. 미리 만들지 않는다.)*
