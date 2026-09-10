# scripts

사람이 직접 실행하는 유틸 스크립트. **설정 대상별**로 나눈다.

```
scripts/setup/
├── bootstrap.sh      내 개발 환경 준비 (사람·환경마다 반복 실행)
└── github/           GitHub 저장소 설정 (저장소당 1회)
    ├── config.sh
    └── labels.sh
```

여기 두지 않는 것

- 앱 런타임 코드 → `apps/*`, `packages/*`
- 일상 명령(dev·build·test) → 루트 `package.json` 스크립트 / `turbo`
- CI에서 도는 것 → `.github/workflows/`

새 성격의 스크립트가 생기면 폴더를 추가하고 이 문서를 갱신한다.

## `setup/bootstrap.sh`

개발 환경을 준비한다 — 도구 확인 → Node 버전 맞춤(mise) → 의존성 설치(yarn) → 워크스페이스 연결 검증.

```bash
yarn setup                      # 또는
./scripts/setup/bootstrap.sh
```

- 멱등하다. 이미 갖춰진 환경에서 다시 돌려도 안전하다.
- **시스템 도구(mise·corepack)는 설치하지 않고 안내만 하고 멈춘다** — 사용자 시스템을 임의로 바꾸지 않는다.
- macOS·Linux용. Windows는 WSL에서 실행한다.

## `setup/github/config.sh`

저장소 머지 전략·브랜치 보호(ruleset)를 [Git 컨벤션](../docs/conventions/git.md)대로 적용한다. 멱등(재실행 안전).

```bash
./scripts/setup/github/config.sh            # origin 저장소에 적용
./scripts/setup/github/config.sh OWNER/REPO # 대상 지정
```

요구: `gh` CLI 로그인 + 해당 저장소 admin 권한.

## `setup/github/labels.sh`

이슈·PR 라벨을 커밋 타입 11종에 맞춰 초기화한다.

```bash
./scripts/setup/github/labels.sh            # origin 저장소에 적용
./scripts/setup/github/labels.sh OWNER/REPO # 대상 지정
```

이슈 템플릿(`.github/ISSUE_TEMPLATE/`)이 이 라벨명을 참조하므로, 템플릿보다 **먼저 실행**해야 라벨이 자동으로 붙는다.

> ⚠️ 기존 라벨을 모두 지우고 다시 만든다. **라벨이 삭제되면 그 라벨이 붙어 있던 이슈·PR에서도 함께 떨어진다.**
> 초기 세팅이나 라벨 체계를 바꿀 때만 실행하고, 운영 중에는 피한다(실행했다면 기존 이슈·PR에 라벨 재부착 필요).
