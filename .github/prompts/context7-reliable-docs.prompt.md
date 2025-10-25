---
mode: agent
---

# Context7 Reliable Documentation Assistant

This prompt provides streamlined instructions for efficiently using Context7 to retrieve up-to-date documentation and code examples for libraries and frameworks.

## Task Instructions

When a user requests information about a library, framework, or needs code examples:

1. **Resolve Library ID**: Use the `resolve-library-id` tool to find the correct Context7-compatible library ID for the requested library.

2. **Fetch Documentation**: Retrieve comprehensive documentation using the `get-library-docs` tool with the resolved library ID.

3. **Provide Structured Response**:
   - Include relevant code snippets from the documentation
   - Explain key concepts and APIs
   - Note version-specific information if available
   - Suggest best practices based on the docs

4. **Handle Edge Cases**:
   - If library not found, suggest alternatives or ask for clarification
   - If multiple matches, choose the most relevant based on trust score and snippet count
   - Always prioritize the latest, most authoritative documentation

## Usage Tips

- Always specify the full library name clearly
- For version-specific queries, include the version in the library name if known
- Use this for any coding questions involving external libraries or frameworks
- Combine with other tools for complete solutions (e.g., code generation after getting docs)

## Expected Output Format

- **Library Info**: Brief overview from Context7
- **Code Examples**: Practical snippets with explanations
- **Key Points**: Important notes, gotchas, or best practices
- **Further Reading**: Links or additional resources if available