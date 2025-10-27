# How to Use VS Code with Context7

## Introduction

This document describes how to set up and use the Context7 extension in Visual Studio Code (VS Code) to improve access to documentation and knowledge during programming.

## Installing the Context7 Extension

1. Open VS Code.
2. Go to the Extensions tab (the square icon with four dots on the left side).
3. Search for "Context7".
4. Install the Context7 extension from the appropriate author (ensure it comes from a trusted source).
5. After installation, restart VS Code if required.

The Context7 extension integrates Model Context Protocol (MCP), allowing easier access to knowledge and documentation checking directly in the editor.

## Useful MCP (Model Context Protocol) Servers

In addition to Context7, there are other MCP servers that help with acquiring knowledge and checking documentation. Here are some examples based on available tools:

### MCP for Microsoft Docs (mcp_microsoftdocs)

- **Description**: Enables searching official Microsoft and Azure documentation, returning content snippets, titles, and URLs.
- **Use**: Ideal for quick access to Microsoft documentation, code examples, and best practices.
- **How to use**: Use tools like `microsoft_docs_search` to search for Microsoft/Azure-related topics, or `microsoft_code_sample_search` to find code examples in a selected programming language.
- **Example prompt**: "Find documentation on Azure Functions in C#".

### MCP for Upstash (mcp_upstash)

- **Description**: Allows fetching up-to-date documentation for libraries and packages.
- **Use**: Useful for checking documentation of specific libraries, such as MongoDB, Vercel Next.js, Supabase, etc.
- **How to use**: First, use `resolve-library-id` to find the correct library ID, then `get-library-docs` to retrieve the documentation. You can specify a topic to focus on specific aspects.
- **Example prompt**: "Fetch documentation for the React hooks library".

### MCP for Pylance (mcp_pylance)

- **Description**: Integrates the Python language server (Pylance) with additional tools for code analysis, refactoring, and syntax checking.
- **Use**: Helps with Python documentation and code analysis, including syntax errors, imports, and environment.
- **How to use**: Tools like `pylanceDocuments` for searching Pylance help, `pylanceSyntaxErrors` for checking syntax errors, or `pylanceRunCodeSnippet` for running Python code snippets.
- **Example prompt**: "Check the syntax of this Python code and find errors".

### MCP for Figma (mcp_figma_mcp-ser)

- **Description**: Enables access to Figma documents and generating UI code based on designs.
- **Use**: Useful for designers and developers working with Figma, for obtaining design context and generating code.
- **How to use**: Use tools like `get_design_context` to generate UI code from Figma nodes, or `get_metadata` to browse the document structure.
- **Example prompt**: "Generate React code for this component from Figma".

### MCP for Java App Mode (mcp_java_app_mode)

- **Description**: Specializes in Java application modernization, including repository analysis and deployment plan generation.
- **Use**: Helps with Java documentation and migration, requirement checking, and architecture diagram generation.
- **How to use**: Tools like `analyze-repository` for project structure analysis, or `get-plan` for creating deployment plans.
- **Example prompt**: "Analyze this Java repository and suggest a modernization plan".

## General Tips

- Always check the availability and compatibility of MCP servers with your VS Code version and Context7 extension.
- For best results, use specific prompts that describe exactly what you're looking for (e.g., programming language, library, topic).
- MCP servers may require additional configuration or API keys for full functionality – check each server's documentation.

If you have questions or need help with configuration, consult the Context7 extension documentation or the VS Code community.