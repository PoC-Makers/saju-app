# 셋업 TODO

프로젝트 진행 중 "나중에 설정하자"고 미뤄둔 항목. 해당 시점에 처리.

## 설정 예정 (확정)

- [ ] **mise 버전 관리** — `mise.toml`로 Node 버전 고정 (스캐폴딩 시). 층 구분: corepack=yarn 버전, mise=Node 버전.
- [ ] **시크릿 공유 도구** — Passbolt 등 팀 공용 시크릿 저장소. 대상: DB 비번, OAuth 키(카카오·구글), JWT 시크릿. → 도구는 "시크릿 관리" 컨벤션에서 확정.
- [ ] **ESLint + Prettier** — 린트·포맷. → "클린코드" 컨벤션에서 규칙 확정.
- [ ] **husky + lint-staged** — 커밋 전 자동 lint·format 훅.
  - [ ] **pre-commit 시크릿 스캔 (필수)** — 키·토큰·비밀번호·인증서 패턴이 스테이징에 섞이면 커밋 차단.
    저장소가 public이라 사람·AI의 주의에 의존하지 않고 기계적으로 막는다. → [보안 컨벤션](conventions/security.md)

## 도입 검토 (미확정)

- [ ] **knip** — 미사용 파일·의존성·export 탐지 (코드 정리). 코드앤버터도 사용.
- [ ] **commitlint** — 커밋 메시지 `type(scope)` 컨벤션 자동 검증 (→ Git 컨벤션 강제).

> 이미 스택 확정: **Prisma**(ORM) · **Vitest**(테스트).
