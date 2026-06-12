#!/bin/bash
# Deal Flow — Cron scrape runner (Claude-powered)
# Polls for pending batches, ensures Chrome CDP is running, shells out to claude -p per company.
# Set up: crontab -e → */5 * * * * /path/to/cron-scrape.sh

REPO_DIR="/path/to/jarvis/repos/deal-flow"
JARVIS_DIR="/path/to/jarvis"
LOG_FILE="$REPO_DIR/scripts/cron-scrape.log"
CDP_PORT=9222
CHROME_PROFILE="$HOME/.chrome-debug-profile-jarvis"

LOCK_FILE="$REPO_DIR/scripts/.scrape-engine.lock"

export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

cd "$REPO_DIR" || exit 1

# Load env vars
export $(grep -v '^#' .env.local | xargs)

echo "--- $(date) ---" >> "$LOG_FILE"

# Prevent parallel engine instances
if [ -f "$LOCK_FILE" ]; then
    LOCK_PID=$(cat "$LOCK_FILE" 2>/dev/null)
    if kill -0 "$LOCK_PID" 2>/dev/null; then
        echo "Engine already running (PID $LOCK_PID). Skipping." >> "$LOG_FILE"
        exit 0
    else
        echo "Stale lock file (PID $LOCK_PID dead). Removing." >> "$LOG_FILE"
        rm -f "$LOCK_FILE"
    fi
fi
echo $$ > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

# Ensure Chrome CDP is running (needed for LinkedIn stealth scraping)
if ! curl -s --connect-timeout 2 "http://127.0.0.1:${CDP_PORT}/json/version" > /dev/null 2>&1; then
    echo "Starting Chrome CDP on port ${CDP_PORT}..." >> "$LOG_FILE"
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
        --remote-debugging-port="${CDP_PORT}" \
        --user-data-dir="${CHROME_PROFILE}" \
        --disable-background-mode &
    # Wait for CDP
    for i in {1..15}; do
        if curl -s --connect-timeout 1 "http://127.0.0.1:${CDP_PORT}/json/version" > /dev/null 2>&1; then
            echo "Chrome CDP ready" >> "$LOG_FILE"
            break
        fi
        sleep 1
    done
fi

# Run scrape engine (no args = poll for pending batches)
/opt/homebrew/bin/npx tsx scripts/scrape-engine.ts >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"
