#!/usr/bin/env bash
# 이슈·PR 라벨을 커밋 타입(docs/conventions/git.md) 10종에 맞춰 생성한다.
# 재실행해도 안전(멱등, --force 로 갱신). 요구: gh CLI 로그인, 저장소 write 권한.
#
#   ./scripts/setup/github-labels.sh [OWNER/REPO]   # 생략 시 현재 origin 사용
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
echo "대상 저장소: $REPO"

# 이름|색상|설명  — 이름은 "이모지 PascalCase"
LABELS=(
  "✨ Feat|1D76DB|새 기능"
  "🐞 Fix|D73A4A|버그 수정"
  "♻️ Refactor|0E8A16|동작 무관 구조·가독성 개선"
  "⚡ Perf|FBCA04|성능 개선"
  "🎨 Style|C5DEF5|포맷(동작 무관)"
  "📝 Docs|0075CA|문서"
  "🧪 Test|BFD4F2|테스트 추가·수정"
  "⚙️ Build|5319E7|빌드 설정·의존성"
  "🔧 CI|B60205|CI 설정"
  "📦 Chore|CFD3D7|그 외 잡일·설정"
)

for entry in "${LABELS[@]}"; do
  IFS='|' read -r name color desc <<< "$entry"
  gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" --force >/dev/null
  echo "  ✓ $name"
done

echo "✅ 완료 — 확인: gh label list --repo $REPO"
