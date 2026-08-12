---
date: 2026-08-06
author: s.woo
topic: "사주 앱 — 초기 설계안 (아키텍처 · 기술스택 · MVP)"
status: approved
---

# 사주 앱 설계안 (v1)

## 1. 개요 & 목적

생년월일시로 사주팔자를 계산하고 풀이를 제공하는 웹 서비스.

- **목적**: 실제 출시 가능한 제품. 동시에 **공부하며 한 단계씩** 만드는 학습 프로젝트.
- **진행 방식**: 매 단계 개념을 설명하며 함께 실습 (특히 모노레포·NestJS는 처음이므로 학습 병행).
- **개발 전략**: **수직 슬라이스(vertical slice)** — 기능은 얇은 한 줄기만 남기되, 그 줄기가 프론트 → 백엔드 → DB → 인증 전 계층을 관통하게 만들어 전체 구조를 일찍 체득한다.

## 2. 아키텍처

Turborepo 모노레포. 사주 엔진을 `packages/core`로 분리해 web·api(그리고 나중의 mobile)가 공유한다.

```
saju-app/                    (Turborepo 모노레포, yarn workspaces)
├── packages/
│   └── core/                ← 사주 엔진 (순수 TS): 계산 + 풀이 조립. 프레임워크 독립
├── apps/
│   ├── api/                 ← NestJS 백엔드 (계산·풀이·인증·DB). REST
│   └── web/                 ← Next.js 프론트 (api 호출)
└── (나중) apps/mobile/       ← Expo, packages/core 재사용 (UI만 새로)
```

- **엔진(core)은 백엔드(api)가 소유**해서 REST 엔드포인트로 노출하고, **web은 api를 호출**해 결과만 받아 렌더링한다.
- 모노레포 개념: **집 구조**(여러 앱·패키지를 한 저장소에서, 코드 공유 쉬움). **Turborepo**: 그 안에서 build/lint/test를 순서·캐싱·병렬로 굴려주는 **작업 매니저**. 배선은 yarn workspaces가 담당.

## 3. 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| 모노레포 | Turborepo + **yarn** workspaces | |
| 엔진 | `packages/core` (순수 TS) | web·api 공유. DB·프레임워크 독립 |
| 백엔드 | `apps/api` — **NestJS**, **REST** | GraphQL·Apollo는 나중 학습 |
| 인증 | **Passport + JWT** (카카오/구글) | NestJS 가드·전략 실습 |
| 프론트 | `apps/web` — **Next.js (App Router)** + TS | SEO·공유 유리 |
| 스타일 | Tailwind CSS | |
| DB | **PostgreSQL** — 로컬 **Docker Compose** → (나중) **AWS RDS** | `DATABASE_URL`만 교체, 코드 무변경 |
| ORM | **Prisma** | 타입세이프 |
| 테스트 | **Vitest** | 엔진 정확도 검증이 핵심 |
| 배포 | web=**Vercel** / api=Node 호스트(나중) | |

- **언어 통일**: 엔진·프론트·백엔드·DB접근 전부 TypeScript(JS 상위집합).
- **로컬 DB**: `docker compose up -d`로 켜고 `down`으로 끔. 데이터는 볼륨에 보존.
- **클라우드 이전**: 로컬이든 AWS RDS든 같은 PostgreSQL. `DATABASE_URL` 환경변수만 바꾸면 이전 완료. Prisma 마이그레이션은 양쪽 동일 적용.

## 4. 데이터 모델 (MVP)

계산 결과(팔자·오행·십성)는 순수함수라 **저장하지 않고 매번 계산**한다(stale 방지). DB에는 입력값만 저장.

- **User**: `id, email, name, provider(kakao|google), providerId, createdAt`
- **SajuProfile**: `id, userId(FK), nickname(별명), gender, calendar(solar|lunar), birthDate, birthTime?(모름 가능), isTimeUnknown, isLeapMonth?, longitude?(진태양시 보정), createdAt`
  - 본인 + 지인(가족/친구/연인) 여러 개 저장 가능.
- **풀이 조각 텍스트**: DB가 아니라 코드/JSON 콘텐츠로 관리(나중 CMS화 가능).

## 5. 사주 엔진 (`packages/core`)

### 확보 방식
**직접 구현(A).** 간지·규칙은 직접 짜고, 절기 절입시각·음력변환 등 천문 부분만 검증된 데이터/라이브러리 활용. `lunar-javascript`(6tail)는 **정답지(검증용)**로만 두고 Vitest로 대조 테스트. 막히면 그때 B(라이브러리 통짜)로 전환.

### 입출력
```ts
// 입력
{ calendar, birthDate, birthTime?, gender, isLeapMonth?, longitude? }
// 출력 (구조화 — 지금은 정적 조각 조립에, 나중엔 그대로 LLM에 투입)
{
  pillars: { year, month, day, hour? },  // 팔자 8글자 (천간+지지)
  dayMaster,                              // 일간 = 나 자신
  fiveElements,                           // 오행 분포 (목화토금수)
  tenGods,                                // 십성
  strength,                               // 신강/신약
}
```

### 계산 정확도 단계 (한 층씩, 각 단계 대조 테스트 먼저)
1. 순수 간지 산수 (60갑자 순환, 일주)
2. 시주 — **진태양시 보정**(한국 표준시 135° vs 실제 경도 ~127°, +균시차), 자시 경계
3. 절기 기반 **월주**, **입춘 기준 년주**(사주의 해는 1/1이 아니라 입춘)
4. **음력 입력** 지원 (양↔음 변환)
5. (나중) 대운/세운

## 6. 풀이 시스템 (정적 조각 조립 → 나중 AI)

전체 차트를 통으로 해석하면 경우의 수가 폭발(4기둥만 60⁴≈1,290만)하므로, **유한한 분석 축으로 분해해 조각을 조립**한다.

### 분석 축 (경우의 수가 작음)
- **일간** 10개 (성격의 뿌리)
- **십성** 10개 (재물·관계·직업 성향)
- **오행 분포** 5행 × (과다/적정/부족)
- **신강/신약** 몇 개

→ 조각 텍스트 약 50~100개면 MVP 커버. 표준 명리 교과서 수준으로 초안 작성.

### 카테고리별 표시 (각 카테고리가 관련 축을 조립)
- **성격** ← 일간 + 신강약 + 오행균형
- **재물** ← 재성(편재/정재) + 오행
- **애정** ← 관성/재성 + 일지
- **직업** ← 식상 + 관성

조각을 완결된 문단으로 쓰고 연결어(다만/한편/그리고) 템플릿 + 중요도 순서(일간→오행→십성)로 조립.

### 확장 경로 (b → c)
core가 **구조화된 데이터**를 내놓으므로: 지금은 그 데이터로 정적 조각 선택(b), 나중엔 **같은 데이터를 LLM에 태워** 자연스러운 종합 풀이 생성(c). (b)를 제대로 만들면 (c)로 가는 길이 저절로 깔린다.

## 7. MVP 범위 & 구현 순서 (Phase 0)

**MVP = 수직 슬라이스**: 입력 → 원국+풀이 조회 → 로그인 → 내 사주 저장.

```
0. 모노레포 뼈대 (yarn+Turborepo: web + api(NestJS) + core)
1. core: 계산엔진(간지→시주 진태양시→절기 월주/입춘 년주) + Vitest 대조 테스트
2. core: 오행분포 + 십성 + 신강약
3. core: 풀이 조각 + 카테고리 조립기
4. api(NestJS): 계산·풀이 엔드포인트(REST) — core 호출        ← NestJS 첫 실습
5. web: 입력폼 → api 호출 → 결과 표시(팔자+오행 시각화+카테고리 풀이). 비로그인 체험 가능
6. Docker Postgres + Prisma + Passport(JWT) 인증: 로그인·내 사주 저장  ← NestJS 심화
= MVP 완성
```

구현은 **엔진(순수 TS) 먼저 → 그 위에 풀스택 슬라이스** 순. 인증이 맨 뒤라 초반 복잡도가 낮다.

## 8. 로드맵 (같은 인프라 위에 확장)

대운/세운 → 오늘의 운세(데일리, +푸시·앱) → 궁합 → **AI 사주 상담(c)** → 결제/유료 리포트.
모바일 앱은 Expo로 `packages/core` 재사용, UI만 새로.

## 9. 배포 / 클라우드 이전

- 로컬: Docker Postgres, web(`:3000`)·api(별도 포트) 동시 실행(`turbo dev`).
- 배포: web=Vercel, api=Node 호스트(Railway/Render/AWS 등, 나중 결정). DB=AWS RDS 등. `DATABASE_URL`만 교체.

## 10. 미결정 / 나중 결정

- GraphQL·Apollo 전환 시점(프로젝트 손에 익은 뒤)
- 인증 세부(리프레시 토큰 전략, 소셜 콜백 플로우)
- 출생지 경도 입력 UX(진태양시 보정용)
- 대운/세운, 궁합, 데일리 푸시(앱), 결제
- AI 풀이(c) 프롬프트 설계

## 11. 한계 / 고지

- 정적 조각 조립 풀이는 **표준·참고용**이며 유파마다 해석이 다르다. 진짜 정밀 상담(용신·글자 상호작용·대운 종합)과는 다름.
- 서비스에는 **"재미/참고용"** 고지를 둔다. 조각은 모듈형이라 나중에 전문가 감수·AI로 독립 개선 가능.
