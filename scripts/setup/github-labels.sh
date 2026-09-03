#!/usr/bin/env bash
# 이슈·PR 라벨을 커밋 타입(docs/conventions/git.md) 11종으로 초기화한다.
# 기존 라벨을 모두 삭제한 뒤 새로 만들어, 스크립트 내용이 곧 최종 상태가 되게 한다(멱등).
#
# ⚠️ 라벨을 지우면 그 라벨이 붙어 있던 이슈·PR에서도 함께 떨어진다.
#    초기 세팅·라벨 체계 변경 때 쓰고, 운영 중 재실행은 피할 것(재부착 필요).
# 요구: gh CLI 로그인, 저장소 write 권한.
#
#   ./scripts/setup/github-labels.sh [OWNER/REPO]   # 생략 시 현재 origin 사용
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
echo "대상 저장소: $REPO"

# 이름|색상|설명  — 이름은 "이모지 PascalCase", 색은 의미에 맞춘 파스텔 계열
LABELS=(
  "✨ Feat|8FBEE8|새로운 기능을 만들어요"          # 파랑 — 새로움
  "🐞 Fix|E88E86|잘못 동작하는 것을 고쳐요"        # 빨강 — 문제
  "♻️ Refactor|8FD4AB|구조를 개선해요"             # 초록 — 안정화
  "⚡ Perf|F5D274|성능을 개선해요"                 # 노랑 — 속도
  "🎨 Style|EFA8C4|포맷·정렬을 다듬어요"           # 분홍 — 꾸밈
  "📝 Docs|9FCDEC|문서를 쓰거나 고쳐요"            # 하늘 — 정보
  "🧪 Test|C3D68A|테스트를 추가하거나 고쳐요"      # 라임 — 검증
  "📦 Build|C4AEE8|빌드 설정·의존성을 바꿔요"      # 보라 — 조립
  "⚙️ Config|A8B5C9|개발 환경·도구 설정을 바꿔요"  # 청회색 — 설정
  "🔧 CI|8FD2C7|CI 파이프라인 설정을 바꿔요"       # 청록 — 자동화
  "🧹 Chore|BFC4CA|그 밖의 잡일을 정리해요"        # 회색 — 기타
)

echo "▶ 기존 라벨 삭제"
while IFS= read -r name; do
  [ -z "$name" ] && continue
  gh label delete "$name" --repo "$REPO" --yes >/dev/null 2>&1 && echo "  - $name"
done < <(gh label list --repo "$REPO" --limit 200 --json name -q '.[].name')

echo "▶ 라벨 생성"
for entry in "${LABELS[@]}"; do
  IFS='|' read -r name color desc <<< "$entry"
  gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" --force >/dev/null
  echo "  + $name"
done

echo "✅ 완료 — 확인: gh label list --repo $REPO"
