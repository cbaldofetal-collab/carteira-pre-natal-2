#!/usr/bin/env bash
set -euo pipefail

pushd "$(dirname "$0")/.." >/dev/null

flutter pub get
flutter analyze
flutter build web

echo "Build concluído em build/web"

popd >/dev/null
