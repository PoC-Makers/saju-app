# scripts

사람이 직접 실행하는 유틸 스크립트. **성격별 하위 폴더**로 나눈다.

| 폴더 | 담는 것 | 예 |
|------|--------|-----|
| `setup/` | 1회성 초기 설정 (인프라·저장소·로컬 환경) | `github-config.sh` |
| `db/` | DB 관련 (시드·백업·일회성 마이그레이션) | *(예정)* |
| `dev/` | 개발 편의 도구 | *(예정)* |

여기 두지 않는 것
- 앱 런타임 코드 → `apps/*`, `packages/*`
- 일상 명령(dev·build·test) → 각 `package.json` 스크립트 / `turbo`
- CI에서 도는 것 → `.github/workflows/`

새 성격의 스크립트가 생기면 폴더를 추가하고 이 표를 갱신한다.

## setup/

### `github-config.sh`

저장소 머지 전략·브랜치 보호를 [Git 컨벤션](../docs/conventions/git.md)대로 적용한다. 멱등(재실행 안전).

```bash
./scripts/setup/github-config.sh            # origin 저장소에 적용
./scripts/setup/github-config.sh OWNER/REPO # 대상 지정
```

요구: `gh` CLI 로그인 + 해당 저장소 admin 권한.
