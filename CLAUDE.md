# 사주앱 (saju-app)

생년월일시로 사주팔자를 계산하고 풀이를 제공하는 웹 서비스. (공부하며 만드는 출시 목표 프로젝트)

> ## ⚠️ 이 저장소는 public — 보안 검증이 항상 우선
>
> 커밋·이슈·PR·스크린샷은 전부 공개되고, 올라간 것은 되돌려도 회수할 수 없다.
> **커밋하거나 이슈·PR을 올리기 전에 반드시** 키·토큰·비밀번호·인증서·접속정보·개인정보가 섞였는지 확인한다.
> 노출을 발견하면 임의로 처리하지 말고 **먼저 사용자에게 알린다.** → @docs/conventions/security.md

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
- @docs/conventions/security.md
- @docs/conventions/git.md
