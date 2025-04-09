#!/bin/bash

clear

# Exit on error
set -e

# ANSI colors
BOLD="\033[1m"
GREEN="\033[32m"
BLUE="\033[34m"
YELLOW="\033[33m"
RED="\033[31m"
RESET="\033[0m"

# Load environment variables if .env.local exists
if [ -f .env.local ]; then
  echo -e "${BOLD}Loading environment variables from .env.local${RESET}"
  export $(grep -v '^#' .env.local | xargs)
  echo -e "- NEXT_PUBLIC_LOG_LEVEL=${NEXT_PUBLIC_LOG_LEVEL:-info}"
  echo -e "- NEXT_PUBLIC_LOG_TO_FILE=${NEXT_PUBLIC_LOG_TO_FILE:-false}"
  echo
fi

# Print a header
echo -e "${BOLD}${GREEN}┌────────────────────────────────────────┐${RESET}"
echo -e "${BOLD}${GREEN}│${RESET} ${BLUE}Next.js Development Server with Logging${RESET} ${BOLD}${GREEN}│${RESET}"
echo -e "${BOLD}${GREEN}└────────────────────────────────────────┘${RESET}"
echo

# Clear logs if file logging is enabled
if [ "${NEXT_PUBLIC_LOG_TO_FILE}" = "true" ]; then
  echo -e "${BOLD}Clearing previous logs...${RESET}"
  npm run logs:clear
else
  echo -e "${YELLOW}File logging is disabled in .env.local - logs will only appear in terminal${RESET}"
fi

echo

# Start dev server with logs
echo -e "${BOLD}Starting development server...${RESET}"
npm run dev:logs

# Note: This line may not be reached because the server keeps running
echo -e "${GREEN}Development server started!${RESET}" 