# 사주앱 (saju-app)

생년월일시로 사주팔자를 계산하고 풀이를 제공하는 웹 서비스. (공부하며 만드는 출시 목표 프로젝트)

## 기술 스택

| 영역 | 스택 |
|------|------|
| 모노레포 | Turborepo + yarn 4 (workspaces · `nodeLinker: node-modules`) |
| 엔진 `packages/core` | 순수 TypeScript — 사주 계산·풀이 (프레임워크 독립) |
| 백엔드 `apps/api` | NestJS · REST · Passport + JWT 인증 |
| 프론트 `apps/web` | Next.js (App Router) · Tailwind CSS |
| DB | PostgreSQL (로컬 Docker → 나중 AWS RDS) · Prisma |
| 테스트 | Vitest |
| 배포 | web: Vercel / api: 미정 |

## 컨벤션
- @docs/conventions/git.md
