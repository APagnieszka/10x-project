---
mode: agent
description: Generate a comprehensive test plan for the project
---

You are an experienced QA engineer tasked with creating a comprehensive test plan for a software project. Analyze the following project information:

## Project Code

Review the codebase structure, components, and implementation details from the workspace.

## Technology Stack

Refer to the technology stack documentation in `.ai/tech-stack.md` for the technology stack details.

## Task

Generate a detailed test plan tailored to the project's specifics, considering the technologies used, code structure, and key repository elements. The test plan should be written in Polish.

## Analysis Phase

Before creating the test plan, conduct a thorough project analysis in your thinking block within `<analiza_projektu>` tags. Include:

1. **Key project components from code analysis:**
   - List and describe main project components
   
2. **Technology stack specifics and their impact on testing strategy:**
   - Analyze each technology stack element and its testing implications
   
3. **Testing priorities based on repository structure:**
   - Identify and prioritize testing areas by importance
   
4. **Potential risk areas requiring special attention in tests:**
   - List potential risks and justify why they need special attention

## Test Plan Structure

After completing the analysis, create the test plan within `<plan_testów>` tags. The plan should contain:

1. Introduction and testing objectives
2. Test scope
3. Types of tests to conduct (e.g., unit, integration, performance tests)
4. Test scenarios for key functionalities
5. Test environment
6. Testing tools
7. Test schedule
8. Test acceptance criteria
9. Roles and responsibilities in the testing process
10. Bug reporting procedures

## Requirements

Ensure the test plan is:
- Precisely tailored to the project context
- Considers the specifics of technologies used
- Prioritizes key repository elements
- Written in Polish
- Demonstrates high quality and professionalism

## Output Format

Present the final test plan in Markdown format. The output should contain only the test plan and should not duplicate or summarize any work done in the project analysis block.
