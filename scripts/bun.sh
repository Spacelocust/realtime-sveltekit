#!/usr/bin/env sh

# Exit gracefully
trap "exit" SIGINT
trap "exit" SIGTERM

echo "Installing dependencies"

bun install

echo "Starting dev server"

supervisord -c /etc/supervisor/conf.d/supervisord.conf
