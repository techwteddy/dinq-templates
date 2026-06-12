#!/bin/bash
# Deal Flow — Realtime Watcher (Hetzner VPS)
# Ensures Chrome CDP is running, then starts the Supabase Realtime watcher.
# Run as systemd service — see scripts/deal-flow-watcher.service

REPO_DIR="/home/claw/jarvis/repos/deal-flow"
LOG_FILE="$REPO_DIR/scripts/logs/watcher.log"
CDP_PORT=9222
CHROME_PROFILE="/home/claw/.chrome-stealth-profile-scraper"
CHROMIUM="/snap/bin/chromium"

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/snap/bin:$PATH"

cd "$REPO_DIR" || exit 1

# Load env vars
export $(grep -v '^#' .env.local | xargs)

mkdir -p scripts/logs
echo "--- [WATCHER START] $(date) ---" >> "$LOG_FILE"

# Ensure headless Chromium CDP is running (needed for Chrome Stealth MCP)
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

# Run watcher (long-running — exec replaces shell so systemd tracks the right PID)
# Watcher handles its own logging to scripts/logs/watcher.log
# Only redirect stderr to the log file for unexpected crashes
exec /usr/bin/npx tsx scripts/scrape-watcher.ts 2>> "$LOG_FILE"
