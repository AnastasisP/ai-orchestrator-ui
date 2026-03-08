#!/bin/sh
set -eu

P1=$(git rev-parse HEAD^1)
P2=$(git rev-parse HEAD^2)
REPORT="LLM_COMMIT_CHANGESET_8dd0f8a_FIRST_PARENT.md"

{
  echo "# Commit Changeset for External LLM Validation"
  echo
  echo "## Scope"
  echo "- Branch: $(git branch --show-current)"
  echo "- Commit: $(git rev-parse HEAD)"
  echo "- Short SHA: $(git rev-parse --short HEAD)"
  echo "- Parent 1 (baseline): $P1"
  echo "- Parent 2 (merged in): $P2"
  echo "- Comparison used for real changes: Parent 1 -> HEAD"
  echo "- Author: $(git --no-pager show -s --format='%an <%ae>' HEAD)"
  echo "- Date: $(git --no-pager show -s --format='%ad' --date=iso-strict HEAD)"
  echo "- Subject: $(git --no-pager show -s --format='%s' HEAD)"
  echo
  echo "## Commit Message"
  echo '```text'
  git --no-pager show -s --format='%B' HEAD
  echo '```'
  echo
  echo "## Changed Files vs Parent 1 (Name-Status)"
  echo '```text'
  git --no-pager diff --name-status "$P1" HEAD
  echo '```'
  echo
  echo "## Diff Stat vs Parent 1"
  echo '```text'
  git --no-pager diff --stat "$P1" HEAD
  echo '```'
  echo
  echo "## Full Patch vs Parent 1"
  echo '```diff'
  git --no-pager diff --find-renames --find-copies "$P1" HEAD
  echo '```'
} > "$REPORT"

echo "Created $REPORT"
wc -l "$REPORT"
ls -lh "$REPORT"
