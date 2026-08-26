#!/usr/bin/env bash
# GitHub 저장소 설정 + 브랜치 보호를 컨벤션(docs/conventions/git.md)대로 적용한다.
# 재실행해도 안전(멱등). 요구: gh CLI 로그인, 대상 저장소 admin 권한.
#
#   ./scripts/setup-github.sh [OWNER/REPO]     # 생략 시 현재 origin 사용
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
echo "대상 저장소: $REPO"

echo "▶ 머지 전략·브랜치 자동 삭제"
gh api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true \
  -F allow_merge_commit=true \
  -F allow_rebase_merge=false \
  -f squash_merge_commit_title=PR_TITLE \
  -f squash_merge_commit_message=PR_BODY \
  -f merge_commit_title=PR_TITLE \
  -f merge_commit_message=PR_BODY \
  -F delete_branch_on_merge=true \
  -F allow_auto_merge=true >/dev/null
echo "  squash(기본)·merge commit 허용 / rebase 비허용 / 머지 후 head 브랜치 삭제"

# develop 브랜치가 없으면 main에서 생성
if ! gh api "repos/$REPO/branches/develop" >/dev/null 2>&1; then
  echo "▶ develop 브랜치 생성"
  MAIN_SHA=$(gh api "repos/$REPO/git/ref/heads/main" -q .object.sha)
  gh api -X POST "repos/$REPO/git/refs" -f ref=refs/heads/develop -f sha="$MAIN_SHA" >/dev/null
fi

# 브랜치 보호 적용
#   $1=브랜치  $2=linear history 강제 여부(true/false)
protect() {
  local branch="$1" linear="$2"
  echo "▶ 보호 설정: $branch (linear=$linear)"
  gh api -X PUT "repos/$REPO/branches/$branch/protection" --input - >/dev/null <<JSON
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": { "required_approving_review_count": 0 },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_linear_history": $linear
}
JSON
}

# required_pull_request_reviews 를 두면 PR 없이는 push 불가(= PR 필수).
# 리뷰 승인 필수(count>0)·CI 통과 필수(required_status_checks)는 팀·CI 생긴 뒤 도입.
# enforce_admins=false → admin bypass 허용.
protect main false      # main: develop→main 이 merge commit 이라 linear 강제 불가
protect develop true    # develop: squash 만 들어와 선형 유지

echo "✅ 완료 — 설정 확인: gh repo view $REPO --web"
