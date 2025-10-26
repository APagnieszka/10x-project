---
mode: agent
---

# Check MVP Status with Inspector

Run MCP Inspector in CLI mode to check the completion status of the MVP project for 10x-project.

## Steps:

1. Use configuration from .vscode/mcp.json
2. Call the check-mvp tool with projectPath set to /Users/agnieszka.podbielska/reposSSH/AI/10x-project
3. Display analysis results according to 10xDevs certification criteria

## Requirements:

- Always include the sections returned by the check-mvp tool in the response, such as analysis results, completion status, and any certification criteria details.
- Return the exact output from the command execution, including all text returned by the MCP Inspector command.

## Command:

npx @modelcontextprotocol/inspector --cli --config .vscode/mcp.json --method tools/call --tool-name check-mvp --tool-arg projectPath=/Users/agnieszka.podbielska/reposSSH/AI/10x-project
