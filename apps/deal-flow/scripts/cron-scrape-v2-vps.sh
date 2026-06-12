#!/bin/bash
# Deal Flow — Cron scrape runner V2 for Hetzner VPS
# Parallel per-source agents via scrape-engine-v2.ts
# Set up: crontab -e → */5 * * * * /home/claw/jarvis/repos/deal-flow/scripts/cron-scrape-v2-vps.sh

REPO_DIR="/home/claw/jarvis/repos/deal-flow"
JARVIS_DIR="/home/claw/jarvis"
LOG_FILE="$REPO_DIR/scripts/cron-scrape.log"
CDP_PORT=9222
CHROME_PROFILE="/home/claw/.chrome-stealth-profile-scraper"
CHROMIUM="/snap/bin/chromium"

LOCK_FILE="$REPO_DIR/scripts/.scrape-engine-v2.lock"

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/snap/bin:$PATH"

cd "$REPO_DIR" || exit 1

# Load env vars
export $(grep -v '^#' .env.local | xargs)

echo "--- $(date) [v2] ---" >> "$LOG_FILE"

# Prevent parallel engine instances
if [ -f "$LOCK_FILE" ]; then
    LOCK_PID=$(cat "$LOCK_FILE" 2>/dev/null)
    if kill -0 "$LOCK_PID" 2>/dev/null; then
        echo "V2 engine already running (PID $LOCK_PID). Skipping." >> "$LOG_FILE"
        exit 0
    else
        echo "Stale lock file (PID $LOCK_PID dead). Removing." >> "$LOG_FILE"
        rm -f "$LOCK_FILE"
    fi
fi
echo $$ > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

# Ensure headless Chromium CDP is running
if ! curl -s --connect-timeout 2 "http://127.0.0.1:${CDP_PORT}/json/version" > /dev/null 2>&1; then
    echo "Starting headless Chromium CDP on port ${CDP_PORT}..." >> "$LOG_FILE"
    rm -f /home/claw/snap/chromium/common/chromium/SingletonLock 2>/dev/null
    $CHROMIUM \
        --headless=new \
        --remote-debugging-port="${CDP_PORT}" \
        --user-data-dir="${CHROME_PROFILE}" \
        --no-first-run \
        --no-default-browser-check \
        --disable-gpu \
        --no-sandbox \
        --disable-dev-shm-usage \
        --disable-background-mode &
    for i in {1..15}; do
        if curl -s --connect-timeout 1 "http://127.0.0.1:${CDP_PORT}/json/version" > /dev/null 2>&1; then
            echo "Chromium CDP ready" >> "$LOG_FILE"
            break
        fi
        sleep 1
    done
fi

# Run V2 scrape engine (no args = poll for pending batches)
/usr/bin/npx tsx scripts/scrape-engine-v2.ts >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"
