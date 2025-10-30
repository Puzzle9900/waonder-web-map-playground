#!/bin/bash

# loopPrompt.sh - Continuously call Claude Code with a prompt file
# Usage: ./loopPrompt.sh <path-to-prompt-file>

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if prompt file path is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: No prompt file provided${NC}"
    echo "Usage: $0 <path-to-prompt-file>"
    exit 1
fi

PROMPT_FILE="$1"

# Check if prompt file exists
if [ ! -f "$PROMPT_FILE" ]; then
    echo -e "${RED}Error: Prompt file not found: $PROMPT_FILE${NC}"
    exit 1
fi

# Check if claude command is available
if ! command -v claude &> /dev/null; then
    echo -e "${RED}Error: 'claude' command not found${NC}"
    echo "Please ensure Claude Code CLI is installed and in your PATH"
    exit 1
fi

echo -e "${GREEN}Starting Claude Code loop with prompt file: $PROMPT_FILE${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the loop${NC}"
echo ""

# Counter for iterations
ITERATION=1

# Main loop
while true; do
    echo -e "${GREEN}=== Iteration $ITERATION ===${NC}"
    echo -e "${YELLOW}Starting Claude Code...${NC}"

    # Call claude with the prompt file content
    if cat "$PROMPT_FILE" | claude -p --dangerously-skip-permissions; then
        echo -e "${GREEN}Claude Code completed successfully${NC}"
    else
        EXIT_CODE=$?
        echo -e "${RED}Claude Code exited with code: $EXIT_CODE${NC}"
        echo -e "${YELLOW}Continuing to next iteration...${NC}"
    fi

    echo ""
    echo -e "${YELLOW}Waiting 2 seconds before next iteration...${NC}"
    sleep 2

    ITERATION=$((ITERATION + 1))
    echo ""
done
