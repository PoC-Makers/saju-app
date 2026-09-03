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

## AI 작업 규칙

- 커밋은 단계별로 자유롭게 남기되, **PR 생성 전에는 제목·본문을 보여주고 승인**받는다.
- **PR 병합은 사용자가 명시적으로 지시했을 때만** 한다. 자동 병합 금지. (리뷰·CI 게이트 부재를 규율로 보완)

## 컨벤션 (필요할 때 선택해 읽기)

전부 미리 읽지 않는다. 작업 성격에 맞는 문서만 그때 읽는다.

| 문서 | 내용 | 읽는 시점 |
|------|------|----------|
| `docs/conventions/security.md` | 절대 올리면 안 되는 것, 커밋 전 검증 절차, 노출 시 대응(먼저 보고→폐기 판단) | 커밋·이슈·PR 등 **공개되는 것을 올리기 전** |
| `docs/conventions/git.md` | 커밋 타입 11종·scope, 브랜치 전략(main/develop), 이슈·PR 규칙, 머지 전략, 브랜치 보호 | 커밋·브랜치·이슈·PR 작업 시 |
| `docs/conventions/filesystem.md` | 패키지명(@saju/*)·폴더 배치·파일 네이밍, core/api/web 내부 구조와 의존 규칙 | 파일·폴더를 만들거나 옮길 때 |
