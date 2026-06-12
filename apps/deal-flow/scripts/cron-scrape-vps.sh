#!/bin/bash
# Deal Flow — Cron scrape runner for Hetzner VPS (headless Chromium + Claude CLI subscription)
# Polls for pending batches, ensures headless Chromium CDP is running, shells out to claude -p per company.
# Set up: crontab -e → */5 * * * * /home/claw/jarvis/repos/deal-flow/scripts/cron-scrape-vps.sh

REPO_DIR="/home/claw/jarvis/repos/deal-flow"
JARVIS_DIR="/home/claw/jarvis"
LOG_FILE="$REPO_DIR/scripts/cron-scrape.log"
CDP_PORT=9222
CHROME_PROFILE="/home/claw/.chrome-stealth-profile-scraper"
CHROMIUM="/snap/bin/chromium"

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/snap/bin:$PATH"

cd "$REPO_DIR" || exit 1

# Load env vars
export $(grep -v '^#' .env.local | xargs)

echo "--- $(date) ---" >> "$LOG_FILE"

# Ensure headless Chromium CDP is running (needed for Chrome Stealth MCP)
if ! curl -s --connect-timeout 2 "http://127.0.0.1:${CDP_PORT}/json/version" > /dev/null 2>&1; then
    echo "Starting headless Chromium CDP on port ${CDP_PORT}..." >> "$LOG_FILE"
    # Remove stale singleton lock if exists
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
    # Wait for CDP
    for i in {1..15}; do
        if curl -s --connect-timeout 1 "http://127.0.0.1:${CDP_PORT}/json/version" > /dev/null 2>&1; then
            echo "Chromium CDP ready" >> "$LOG_FILE"
            break
        fi
        sleep 1
    done
fi

# Run scrape engine (no args = poll for pending batches)
/usr/bin/npx tsx scripts/scrape-engine.ts >> "$LOG_FILE" 2>&1
echo "" >> "$LOG_FILE"
