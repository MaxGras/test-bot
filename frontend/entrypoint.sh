#!/bin/bash
set -e

PORT=${PORT:-5173}
exec npm run dev -- --host 0.0.0.0 --port "$PORT"
