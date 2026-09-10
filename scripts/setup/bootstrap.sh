#!/usr/bin/env bash
# 개발 환경을 준비한다 — 도구 확인 → Node 버전 맞춤 → 의존성 설치 → 검증.
# 시스템에 없는 도구는 설치하지 않고 안내만 한다(사용자 시스템을 임의로 바꾸지 않는다).
#
#   ./scripts/setup/bootstrap.sh        진행 상황만 표시
#   ./scripts/setup/bootstrap.sh -v     실행 로그까지 전부 표시
#   yarn setup [-v]
#
# 실패하면 감춰둔 로그를 그대로 출력한다.
# macOS·Linux용. Windows는 WSL에서 실행할 것.
set -uo pipefail
cd "$(dirname "$0")/../.."   # 저장소 루트로

VERBOSE=0
for arg in "$@"; do
  case "$arg" in
    -v|--verbose) VERBOSE=1 ;;
    -h|--help) sed -n '2,11p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) printf "알 수 없는 옵션: %s (-h 로 사용법 확인)\n" "$arg" >&2; exit 2 ;;
  esac
done

BOLD=$'\033[1m'; DIM=$'\033[2m'; RED=$'\033[31m'; GREEN=$'\033[32m'
YELLOW=$'\033[33m'; CYAN=$'\033[36m'; RESET=$'\033[0m'

step() { printf "\n%s▶ %s%s\n" "$BOLD" "$1" "$RESET"; }
ok()   { printf "  %s✓%s %s\n" "$GREEN" "$RESET" "$1"; }
warn() { printf "  %s!%s %s\n" "$YELLOW" "$RESET" "$1"; }
err()  { printf "  %s✗%s %s\n" "$RED" "$RESET" "$1"; }
hint() { printf "    %s%s%s\n" "$DIM" "$1" "$RESET"; }

LOG=$(mktemp)
trap 'rm -f "$LOG"' EXIT

# run <실패 시 표시할 설명> <명령...>
# 성공하면 조용히 넘어가고, 실패하면 감춰둔 로그를 그대로 보여준다.
run() {
  local label="$1"; shift
  local code=0

  if [ "$VERBOSE" -eq 1 ]; then
    "$@" >"$LOG" 2>&1 || code=$?
    sed "s/^/    ${DIM}/;s/\$/${RESET}/" "$LOG"
  else
    "$@" >"$LOG" 2>&1 || code=$?
  fi

  # 일부 도구는 에러를 내고도 0을 반환한다(예: mise install) — 로그로 한 번 더 판정한다.
  if [ "$code" -eq 0 ] && grep -qiE '^[a-z]* ?ERROR|\bERROR\b|fatal:' "$LOG"; then
    code=1
  fi
  [ "$code" -eq 0 ] && return 0

  err "$label 실패 (exit $code)"
  if [ "$VERBOSE" -eq 0 ]; then
    printf "\n%s─── 실행 로그 ───%s\n" "$DIM" "$RESET"
    cat "$LOG"
    printf "%s────────────────%s\n\n" "$DIM" "$RESET"
    hint "위 메시지로 검색하거나, -v 옵션으로 다시 실행해 전체 로그를 확인하세요."
  fi
  return 1
}

# ─────────────────────────────────────────────
step "1/4 시스템 도구 확인"

MISSING=0

# mise: mise.toml에 적힌 Node 버전으로 이 폴더를 자동 전환한다.
#       Node 자체를 관리하는 도구라 npm/yarn으로는 설치할 수 없다(부트스트랩 문제).
if command -v mise >/dev/null 2>&1; then
  ok "mise $(mise --version 2>/dev/null | awk '{print $1}')"
else
  err "mise 없음 — Node 버전을 mise.toml에 맞춰 고정하는 도구"
  hint "설치: brew install mise   (또는  curl https://mise.run | sh)"
  hint "설치 후 셸 활성화 필요 → https://mise.jdx.dev/getting-started.html"
  MISSING=1
fi

# corepack: package.json의 packageManager(yarn@x.y.z)를 읽어 그 버전으로 yarn을 실행한다.
#           Node에 기본 포함되어 있다.
if command -v corepack >/dev/null 2>&1; then
  ok "corepack $(corepack --version 2>/dev/null)"
else
  err "corepack 없음 — packageManager 버전으로 yarn을 맞추는 도구 (Node 내장)"
  hint "Node를 다시 설치하거나:  npm i -g corepack"
  MISSING=1
fi

if [ "$MISSING" -eq 1 ]; then
  printf "\n%s위 도구를 설치한 뒤 다시 실행하세요.%s\n" "$RED" "$RESET"
  exit 1
fi

# ─────────────────────────────────────────────
step "2/4 Node 버전 맞추기"

TARGET_NODE=$(grep -E '^\s*node\s*=' mise.toml 2>/dev/null | head -1 | sed 's/.*=\s*//; s/"//g')

run "mise trust" mise trust || exit 1
run "mise install" mise install || exit 1
ok "Node $(node -v 2>/dev/null)${TARGET_NODE:+  (mise.toml: $TARGET_NODE)}"

# ─────────────────────────────────────────────
step "3/4 의존성 설치"

run "corepack enable" corepack enable || exit 1
run "yarn install" yarn install || exit 1
ok "yarn $(yarn -v 2>/dev/null) · 패키지 설치 완료"

# ─────────────────────────────────────────────
step "4/4 검증"

WS_COUNT=$(yarn workspaces list --json 2>/dev/null | grep -c '"name"')
if [ "${WS_COUNT:-0}" -gt 0 ]; then
  ok "워크스페이스 ${WS_COUNT}개 인식"
  if [ "$VERBOSE" -eq 1 ]; then
    yarn workspaces list --json 2>/dev/null \
      | sed 's/.*"location":"\([^"]*\)".*"name":"\([^"]*\)".*/    \2  (\1)/'
  fi
else
  err "워크스페이스를 인식하지 못했습니다 — 루트 package.json의 workspaces 설정을 확인하세요"
  exit 1
fi

if [ -L node_modules/@saju/core ]; then
  ok "@saju/core 연결 확인 (→ $(readlink node_modules/@saju/core))"
else
  err "@saju/core 심링크가 없습니다 — apps/*/package.json의 \"@saju/core\": \"workspace:*\" 를 확인하세요"
  exit 1
fi

printf "\n%s준비 완료.%s  개발 서버: %syarn dev%s\n" "$BOLD" "$RESET" "$CYAN" "$RESET"
