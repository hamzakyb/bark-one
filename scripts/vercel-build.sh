#!/bin/bash
set -e

echo "=== Cleaning up any existing SWC installations ==="
rm -rf node_modules/.cache
rm -rf node_modules/@next/swc-*

echo "=== Installing dependencies with forced platform ==="
npm install --platform=linux --arch=x64 --no-optional=false

echo "=== Ensuring correct SWC binary is installed ==="
npm install --no-save @next/swc-linux-x64-gnu@14.2.3

echo "=== Running build ==="
npm run build
