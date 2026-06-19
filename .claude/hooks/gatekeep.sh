#!/usr/bin/env bash
# Gatekeeps two actions so they require explicit confirmation in Claude Code:
#   1. `git commit` while on the `main` branch
#   2. deploying the live site (`npm run deploy` / `gh-pages`)
#
# Runs as a PreToolUse hook on Bash. It emits an "ask" permission decision ONLY
# for those two cases, prompting the user to confirm. For every other command it
# stays silent and exits 0, so normal permission handling is untouched.
set -euo pipefail

input=$(cat)
cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // ""')

ask() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# Deploy gate — publishing to the gh-pages branch goes live immediately.
if printf '%s' "$cmd" | grep -Eq '(npm run deploy|gh-pages)'; then
  ask "This deploys to production (gh-pages → https://ucencode.github.io). Confirm you want to publish the live site."
fi

# Commit-on-main gate — only fires when the current branch is main.
if printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+commit'; then
  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
  if [ "$branch" = "main" ]; then
    ask "You are on 'main'. Confirm you want to commit directly to main instead of creating a feature branch."
  fi
fi

exit 0
