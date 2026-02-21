#!/bin/bash

################################################################################
# Emergency Rollback Script
#
# Use this script when something goes wrong during migration
#
# This script provides multiple rollback strategies:
# 1. Rollback last commit
# 2. Rollback to specific commit
# 3. Rollback entire migration (restore from backup branch)
# 4. Nuclear option (restore everything from backup)
#
# Usage:
#   ./scripts/emergency-rollback.sh [strategy]
#
# Examples:
#   ./scripts/emergency-rollback.sh last-commit
#   ./scripts/emergency-rollback.sh backup
#   ./scripts/emergency-rollback.sh nuclear
#
################################################################################

set -e
set -u

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
  echo -e "${GREEN}$1${NC}"
}

log_warn() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
  echo -e "${RED}❌ $1${NC}"
}

separator() {
  echo "════════════════════════════════════════════════════════════"
}

# ══════════════════════════════════════════════════════════════
# ROLLBACK STRATEGIES
# ══════════════════════════════════════════════════════════════

rollback_last_commit() {
  separator
  log "🔄 STRATEGY 1: Rollback Last Commit"
  separator
  echo ""

  log "Current commit:"
  git log -1 --oneline

  echo ""
  log_warn "This will undo the last commit (keeping changes as unstaged)"
  echo ""

  read -p "Continue? (y/n): " CONFIRM

  if [[ "$CONFIRM" != "y" ]]; then
    log "Aborted"
    exit 0
  fi

  git reset --soft HEAD~1

  log "✅ Last commit rolled back"
  log "Changes are now unstaged - you can review them with: git status"
  echo ""
}

rollback_last_commit_hard() {
  separator
  log "🔄 STRATEGY 2: Hard Rollback Last Commit"
  separator
  echo ""

  log "Current commit:"
  git log -1 --oneline

  echo ""
  log_warn "⚠️  WARNING: This will PERMANENTLY DELETE all changes from the last commit!"
  log_warn "This cannot be undone!"
  echo ""

  read -p "Are you ABSOLUTELY SURE? Type 'yes' to confirm: " CONFIRM

  if [[ "$CONFIRM" != "yes" ]]; then
    log "Aborted - good choice! Use 'last-commit' for safer rollback"
    exit 0
  fi

  git reset --hard HEAD~1

  log "✅ Last commit rolled back (hard reset)"
  log "All changes permanently removed"
  echo ""
}

rollback_to_backup() {
  separator
  log "🔄 STRATEGY 3: Restore from Backup Branch"
  separator
  echo ""

  # Find backup branches
  log "Available backup branches:"
  git branch -a | grep "backup/before-cleanup"

  echo ""
  read -p "Enter backup branch name (e.g., backup/before-cleanup-2026-02-21): " BACKUP_BRANCH

  # Verify branch exists
  if ! git show-ref --verify --quiet "refs/heads/$BACKUP_BRANCH"; then
    log_error "Branch $BACKUP_BRANCH not found locally"

    # Check remote
    if git ls-remote --heads origin "$BACKUP_BRANCH" | grep "$BACKUP_BRANCH" > /dev/null; then
      log "Branch exists on remote - fetching..."
      git fetch origin "$BACKUP_BRANCH:$BACKUP_BRANCH"
    else
      log_error "Branch not found on remote either"
      exit 1
    fi
  fi

  echo ""
  log "Will restore from: $BACKUP_BRANCH"
  log_warn "Current branch will be reset to match backup"
  echo ""

  read -p "Continue? (y/n): " CONFIRM

  if [[ "$CONFIRM" != "y" ]]; then
    log "Aborted"
    exit 0
  fi

  # Get current branch
  CURRENT_BRANCH=$(git branch --show-current)

  # Reset to backup
  git reset --hard "$BACKUP_BRANCH"

  log "✅ Restored from backup branch"
  log "Current branch ($CURRENT_BRANCH) now matches $BACKUP_BRANCH"
  echo ""
}

nuclear_option() {
  separator
  log "☢️  STRATEGY 4: NUCLEAR OPTION"
  separator
  echo ""

  log_warn "⚠️  WARNING: This is the nuclear option!"
  log_warn "This will:"
  log_warn "  1. Delete the migration branch"
  log_warn "  2. Checkout main"
  log_warn "  3. Reset main to backup"
  log_warn "  4. Force push to remote (if confirmed)"
  echo ""
  log_warn "Use this ONLY if everything is completely broken!"
  echo ""

  read -p "Are you ABSOLUTELY SURE? Type 'NUCLEAR' to confirm: " CONFIRM

  if [[ "$CONFIRM" != "NUCLEAR" ]]; then
    log "Aborted - probably a wise choice!"
    exit 0
  fi

  echo ""
  read -p "Enter backup branch name: " BACKUP_BRANCH

  # Verify backup exists
  if ! git show-ref --verify --quiet "refs/heads/$BACKUP_BRANCH"; then
    if git ls-remote --heads origin "$BACKUP_BRANCH" | grep "$BACKUP_BRANCH" > /dev/null; then
      log "Fetching backup from remote..."
      git fetch origin "$BACKUP_BRANCH:$BACKUP_BRANCH"
    else
      log_error "Backup branch not found!"
      exit 1
    fi
  fi

  log "Executing nuclear option..."

  # Delete migration branch if exists
  if git show-ref --verify --quiet "refs/heads/feature/src-cleanup-migration"; then
    git branch -D feature/src-cleanup-migration
    log "✅ Deleted migration branch"
  fi

  # Checkout main
  git checkout main

  # Reset to backup
  git reset --hard "$BACKUP_BRANCH"

  log "✅ Main branch reset to backup"
  echo ""

  log_warn "Local changes complete"
  echo ""
  read -p "Push to remote? (y/n): " PUSH_CONFIRM

  if [[ "$PUSH_CONFIRM" == "y" ]]; then
    log_warn "Force pushing to remote..."
    git push origin main --force

    log "✅ Remote updated"
  fi

  echo ""
  log "☢️  Nuclear option complete"
  log "Everything restored to backup state"
  echo ""
}

show_status() {
  separator
  log "📊 Current Status"
  separator
  echo ""

  log "Current branch:"
  git branch --show-current
  echo ""

  log "Last 5 commits:"
  git log --oneline -5
  echo ""

  log "Working directory status:"
  git status -s
  echo ""

  log "Available backup branches:"
  git branch -a | grep "backup/"
  echo ""
}

# ══════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════

main() {
  separator
  log "🆘 Emergency Rollback Script"
  separator
  echo ""

  STRATEGY=${1:-""}

  if [[ -z "$STRATEGY" ]]; then
    log "Available rollback strategies:"
    echo ""
    echo "  status          - Show current status"
    echo "  last-commit     - Undo last commit (soft - keeps changes)"
    echo "  last-commit-hard - Undo last commit (hard - deletes changes)"
    echo "  backup          - Restore from backup branch"
    echo "  nuclear         - Nuclear option (reset everything)"
    echo ""
    echo "Usage: $0 [strategy]"
    echo ""
    exit 0
  fi

  case $STRATEGY in
    "status")
      show_status
      ;;
    "last-commit")
      rollback_last_commit
      ;;
    "last-commit-hard")
      rollback_last_commit_hard
      ;;
    "backup")
      rollback_to_backup
      ;;
    "nuclear")
      nuclear_option
      ;;
    *)
      log_error "Unknown strategy: $STRATEGY"
      log "Run without arguments to see available strategies"
      exit 1
      ;;
  esac
}

main "$@"
