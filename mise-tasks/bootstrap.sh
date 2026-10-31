#!/usr/bin/env bash
#MISE description="Bootstrap a fresh clone"

set -euo pipefail

cd "$(dirname "$0")/.."

mise install
vp i

echo
echo "Bootstrap complete. Run 'vp run dev' to start the app."
