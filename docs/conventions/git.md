# Git 컨벤션

## 커밋 메시지

한국어, 형식 `<type>(<scope>): <설명>`. **scope 필수** (애매하면 관련 모듈 또는 `monorepo`).

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
| `ci` | CI 설정 |
| `chore` | 그 외 잡일·설정 |

**scope**: `core` · `api` · `web` · `monorepo`(루트 설정) · `skills`
- 빌드·의존성 변경도 **어느 패키지인지** scope로 표시: `build(core)` · `build(web)` · `build(monorepo)`
- 루트 전역 문서/잡일은 scope 생략 가능: `docs: 컨벤션 정립`, `chore: 설정 정리`

```
feat(core): 사주팔자 계산 엔진
fix(web): 입력폼 시각 검증 오류
build(core): dayjs 추가
build(monorepo): turbo.json 파이프라인 설정
test(core): 절기 경계 대조 테스트
```
