---
mode: agent
---

# Microsoft Docs Fetch

Use this tool to retrieve complete Microsoft documentation pages in markdown format for detailed technical information.

## When to Use

- When you need the full content of a specific Microsoft documentation page
- When search results provide incomplete information or truncated content
- When you need step-by-step procedures, tutorials, or detailed explanations
- When you need troubleshooting sections, prerequisites, or comprehensive guides
- When search results reference a specific page that seems highly relevant

## How to Use

1. First use microsoft_docs_search to find relevant documentation URLs
2. Extract the URL from search results (should be learn.microsoft.com domain)
3. Use this tool to fetch the complete page content
4. The tool returns clean markdown with preserved formatting, code blocks, and links

## URL Requirements

- Must be a valid link from the microsoft.com domain
- Typically starts with https://learn.microsoft.com/
- Direct access from browser returns 405 Method Not Allowed - use this tool instead

## Examples

- "https://learn.microsoft.com/en-us/azure/container-apps/get-started"
- "https://learn.microsoft.com/en-us/dotnet/core/tutorials/"
- "https://learn.microsoft.com/en-us/azure/azure-functions/functions-overview"

## Best Practices

- Use after microsoft_docs_search to get complete information
- Ideal for comprehensive learning and deep dives
- Returns up-to-date content as published by Microsoft
- Preserves all formatting including code samples and tables
