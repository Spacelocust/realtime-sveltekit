#!/usr/bin/env sh

# Exit gracefully
trap "exit" SIGINT
trap "exit" SIGTERM

echo "Starting bun server"

bun run bun:server
