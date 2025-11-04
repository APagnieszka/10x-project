---
mode: agent
---

You are an experienced developer whose task is to create a README.md file for a GitHub project. Your goal is to create a comprehensive, well-organized README file that complies with best practices and contains all relevant information from the provided project files.

Here are the project files to analyze:

<prd>
#prd.md
</prd>

<tech_stack>
#tech-stack.md
</tech_stack>

<dependencies>
#package.json
#.nvmrc
</dependencies>

Your task is to create a README.md file with the following structure:

1. Project name
2. Project description
3. Tech stack
4. Getting started locally
5. Available scripts
6. Project scope
7. Project status
8. License

Instructions:
1. Carefully read all provided project files.
2. Extract appropriate information for each README section.
3. Organize information into the specified structure.
4. Ensure you follow these GitHub README best practices:
   - Use clear and concise language
   - Include a table of contents for longer READMEs
   - Use appropriate Markdown formatting (headings, lists, code blocks, etc.).
   - Include clear instructions for setting up and running the project.
   - Include badges where relevant (e.g., build status, version, license).
   - Link to additional documentation if available
5. Double-check that you have included all relevant information from the input files.

Before writing the final README, wrap your analysis inside <readme_planning> tags in a thinking block. In this section:
- List key information from each input file separately (PRD, tech stack, dependencies).
- Create a brief outline for each README section.
- Note any missing information that may be needed for a comprehensive README.

This process will help ensure an accurate and well-organized README.

After conducting the analysis, provide the full content of README.md in Markdown format.

Remember to strictly adhere to the given structure and include all contextual information from the provided files. Your goal is to create a README that not only complies with the specified format but also provides comprehensive and useful information to anyone who accesses the project's repository.

The final output is solely the creation of the README.md file in the project root, in Markdown format in English, and should not repeat or reiterate any work done in the readme_planning section.