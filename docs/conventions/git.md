# Git 컨벤션

## 커밋 메시지

한국어, 형식 `<type>(<scope>): <설명>`. **scope 필수**.

| 타입 | 뜻 |
|------|-----|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 동작 무관 구조·가독성 개선 |
| `perf` | 성능 개선 |
| `style` | 포맷(동작 무관) |
| `docs` | 문서 |
| `test` | 테스트 추가/수정 |
| `build` | 빌드 설정·의존성 (tsconfig·번들러·패키지) |
| `config` | 개발 환경·도구 설정 (lint·포맷·훅·에디터·환경변수) |
| `ci` | CI 설정 |
| `chore` | 그 외 잡일 |

**scope**: `core` · `api` · `web` · `root`

| scope | 범위 |
|-------|------|
| `core` · `api` · `web` | 각 패키지 |
| `root` | 모노레포 최상위 — 루트 설정·워크스페이스·`.github`·스크립트 등 특정 패키지에 속하지 않는 것 |

- 빌드·의존성 변경도 **어느 패키지인지** scope로 표시: `build(core)` · `build(web)` · `build(root)`
- 루트 전역 문서/잡일은 scope 생략 가능: `docs: 컨벤션 정립`
- **어느 scope에도 애매하면 임의로 만들지 말고 물어본다** (필요하면 scope 목록을 확장한다)

```
feat(core): 사주팔자 계산 엔진
fix(web): 입력폼 시각 검증 오류
build(core): dayjs 추가
config(root): ESLint·Prettier 설정 추가
test(core): 절기 경계 대조 테스트
```

## 브랜치

| 브랜치 | 역할 |
|--------|------|
| `main` | 운영 배포. 릴리스마다 태그 `x.x.x` + changelog |
| `develop` | 스테이징 배포. 기능이 모이는 곳 |
| `{type}/{issue}-{desc}` | 작업 브랜치. `develop`에서 분기 |

- 작업 브랜치명: 커밋 타입 + 이슈번호 + kebab 설명 — `feat/5-saju-engine`, `fix/12-timezone-bug`
- 브랜치명에 `#`을 쓰지 않는다 (셸에서 주석으로 잘림). `#N` 표기는 이슈·PR 본문에서만.
- **흐름은 단방향**: `작업 → develop → main`. `main`을 `develop`으로 역머지하지 않는다.
- `release`·`hotfix` 브랜치는 두지 않는다. 급한 수정도 작업 브랜치로 `develop`을 거친다.

## 이슈 · PR

- 분기 전 **해결할 이슈가 있는지 확인**한다. 없으면 이슈를 먼저 발행하고 그 번호로 브랜치를 만든다.
- 이슈·PR은 `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md` 템플릿을 따른다.
- PR 제목은 커밋과 같은 `type(scope): 설명`.
- PR 본문에 연관 이슈를 연결한다 — `Closes #5` (머지 시 이슈 자동 종료).

## 머지 전략

| 구간 | 방식 | 이유 |
|------|------|------|
| 작업 브랜치 → `develop` | **Squash and merge** | PR 하나 = 커밋 하나. develop 이력을 기능 단위 선형으로 |
| `develop` → `main` | **Merge commit (3-way)** | 합류 지점이 그래프에 남아, 어떤 기능들이 함께 배포됐는지 추적 |

- 브랜치마다 **허용 머지 방식을 ruleset으로 제한**하므로(`allowed_merge_methods`), PR 화면에 맞는 버튼만 나온다.
- GitHub의 merge commit은 **항상 `--no-ff`** 로 동작한다 — fast-forward가 가능한 상황(main이 develop의 조상)에서도 합류 커밋이 생긴다.

- 머지된 **작업 브랜치는 자동 삭제**한다. `main`·`develop`은 상시 유지 — 보호 설정의 "브랜치 삭제 차단"으로 자동 삭제 대상에서 제외된다.
- `main` 머지 후 **태그 `x.x.x`** 를 붙이고 changelog를 남긴다.

## 브랜치 보호

`scripts/setup/github-config.sh` 로 적용한다 (실행 기록이 스크립트로 남아 재현 가능). 보호는 **ruleset**으로 건다 — classic branch protection보다 규칙 중첩·우회 지정·시범(evaluate) 모드가 유연하다.

> 무료 플랜에서는 **public 저장소만** 보호를 걸 수 있다. private으로 전환하려면 Pro/Team 결제가 필요하다.

| 항목 | `main` | `develop` |
|------|:---:|:---:|
| PR 필수 (직접 push 금지) | ✅ | ✅ |
| force push 차단 | ✅ | ✅ |
| 브랜치 삭제 차단 | ✅ | ✅ |
| linear history 강제 | ❌ (merge commit을 금지하는 규칙이라 걸 수 없음) | ✅ |
| 허용 머지 방식 | `merge`만 | `squash`만 |
| admin bypass | ✅ | ✅ |

**아직 적용하지 않음 (도입 예정)**
- **리뷰 승인 필수** — 팀원이 생기면 (솔로는 self-approve 불가라 막힘)
- **CI 통과 필수** — CI 파이프라인 구축 후
