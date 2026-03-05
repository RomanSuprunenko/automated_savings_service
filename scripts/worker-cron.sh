#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

source ~/.nvm/nvm.sh
nvm use 20 >/dev/null

npm run worker >> "$ROOT_DIR/worker.log" 2>&1
