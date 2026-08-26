#!/usr/bin/env bash
# GitHub 저장소 설정 + 브랜치 보호(ruleset)를 컨벤션(docs/conventions/git.md)대로 적용한다.
# 보호는 classic branch protection 대신 ruleset을 쓴다 — 규칙 중첩·bypass 지정·시범(evaluate) 모드 지원.
# 재실행해도 안전(멱등: 같은 이름의 ruleset은 갱신). 요구: gh CLI 로그인, 저장소 admin 권한.
#
#   ./scripts/setup/github-config.sh [OWNER/REPO]   # 생략 시 현재 origin 사용
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

if ! gh api "repos/$REPO/branches/develop" >/dev/null 2>&1; then
  echo "▶ develop 브랜치 생성"
  MAIN_SHA=$(gh api "repos/$REPO/git/ref/heads/main" -q .object.sha)
  gh api -X POST "repos/$REPO/git/refs" -f ref=refs/heads/develop -f sha="$MAIN_SHA" >/dev/null
fi

# ruleset 적용 — $1=브랜치, $2=linear history 강제(true/false), $3=허용 머지 방식(JSON 배열)
#   pull_request  : PR 없이 push 불가 (승인 0명 = 리뷰 필수 아님)
#                   allowed_merge_methods 로 브랜치마다 허용 방식을 제한한다.
#                   GitHub의 merge commit 은 항상 --no-ff 라서 fast-forward 가능해도 합류 커밋이 남는다.
#   non_fast_forward: force push 차단
#   deletion      : 브랜치 삭제 차단 (main·develop 상시 유지)
#   bypass_actors : RepositoryRole 5(admin)에게 우회 허용
apply_ruleset() {
  local branch="$1" linear="$2" methods="$3" name="protect-$1"
  local rules="[{\"type\":\"pull_request\",\"parameters\":{\"required_approving_review_count\":0,\"dismiss_stale_reviews_on_push\":false,\"require_code_owner_review\":false,\"require_last_push_approval\":false,\"required_review_thread_resolution\":false,\"allowed_merge_methods\":$methods}},{\"type\":\"non_fast_forward\"},{\"type\":\"deletion\"}]"
  [ "$linear" = "true" ] && rules="${rules%]},{\"type\":\"required_linear_history\"}]"

  local payload
  payload=$(cat <<JSON
{
  "name": "$name",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["refs/heads/$branch"], "exclude": [] } },
  "bypass_actors": [{ "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" }],
  "rules": $rules
}
JSON
)
  # 같은 이름의 ruleset이 있으면 갱신, 없으면 생성
  local id
  id=$(gh api "repos/$REPO/rulesets" --jq ".[] | select(.name==\"$name\") | .id" 2>/dev/null | head -1)
  if [ -n "$id" ]; then
    gh api -X PUT "repos/$REPO/rulesets/$id" --input - >/dev/null <<<"$payload"
    echo "▶ ruleset 갱신: $name (linear=$linear)"
  else
    gh api -X POST "repos/$REPO/rulesets" --input - >/dev/null <<<"$payload"
    echo "▶ ruleset 생성: $name (linear=$linear)"
  fi
}

# 리뷰 승인 필수(count>0)·CI 통과 필수(required_status_checks)는 팀·CI 생긴 뒤 도입.
# required_linear_history 는 merge commit 을 금지하는 규칙이라 main 에는 걸 수 없다.
apply_ruleset main    false '["merge"]'   # develop→main: 합류 지점을 남기려 merge commit 만
apply_ruleset develop true  '["squash"]'  # 작업→develop: 기능 단위 한 커밋으로 선형 유지

echo "✅ 완료 — 확인: gh api repos/$REPO/rulesets --jq '.[].name'"
