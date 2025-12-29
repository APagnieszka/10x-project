#!/usr/bin/env bash
set -euo pipefail

# This repo keeps git hooks under .husky/, but git won't use them unless core.hooksPath is set.
# Run this once per clone.

git config core.hooksPath .husky

# Ensure hooks are executable (mac/linux)
chmod +x .husky/pre-commit || true
chmod +x .husky/pre-push || true

echo "Installed git hooks: core.hooksPath=.husky"
