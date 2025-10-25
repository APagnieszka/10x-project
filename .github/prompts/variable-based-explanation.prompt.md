---
mode: agent
---

# Variable-Based Explanation Prompt

This prompt template is designed to guide AI assistants in providing structured, personalized explanations of technical concepts using explicitly defined variables. The template uses double curly braces `{{variable}}` to mark placeholders that need to be filled in by the user or AI context.

**Important:** AI assistants should always ask the user for the values of these variables instead of assuming or filling them automatically. Do not proceed with explanations until all variables are explicitly provided by the user.

## Template Structure

You are an experienced {{role}} - with your help, I would like to understand a new topic.

My knowledge level: {{knowledge_level}} in technology {{technology}}.

Learning goal: I want to understand {{target_concept}} to {{learning_goal}}.

I encounter the following blockage: {{blockage_description}}.

Please explain this topic step by step, starting from {{starting_level}} and progressing to {{advanced_level}}.

I learn best through {{learning_style}}.

I prefer the response in the form of {{response_format}}.

Can you help me understand this topic and unblock my learning?

## Usage Instructions

1. Replace each `{{variable}}` with specific, relevant content
2. Ensure variables are contextually appropriate for the explanation request
3. Use this template for technical learning scenarios where step-by-step guidance is needed
4. Variables should be filled based on user's background and specific learning needs
5. To make filling the prompt easier, provide key data in the following format: ROLE: [role] LEVEL: [level] TECHNOLOGY: [technology] WHAT: [target_concept] WHY: [learning_goal] BLOCKAGE: [blockage_description]
6. AI assistants must always ask the user to provide values for all variables before generating any explanation. Never assume or fill variables automatically.

## Variable Definitions

- **role**: The AI's expertise role (e.g., "DevOps Engineerem", "Full-Stack Developerem")
- **knowledge_level**: User's knowledge level (e.g., "zaawansowany", "początkujący", "średniozaawansowany")
- **technology**: Primary technology stack (e.g., "JavaScript", "Python", "Java")
- **experience_years**: Number of years of experience (e.g., "6 lat", "2 lata")
- **experience_areas**: Specific areas of experience (e.g., "Reactem, Reduxem i Jenkinsem")
- **target_concept**: What the user wants to learn (e.g., "GitHub Actions")
- **learning_goal**: Purpose of learning (e.g., "zbudować pierwszy scenariusz CI/CD w repozytorium na GitHubie")
- **blockage_description**: Specific problem or confusion (e.g., "nie rozumiem czym różni się job od workflow i na jakim systemie powinny być uruchamiane zadania - Ubuntu czy Windows?")
- **starting_level**: Where to start explanation (e.g., "podstaw", "podstawowych koncepcji")
- **advanced_level**: Where to progress to (e.g., "zaawansowanych aspektów/praktycznego zastosowania")
- **learning_style**: Preferred learning method (e.g., "wizualizacje problemu i schematy praktyczne")
- **response_format**: Desired response structure (e.g., "krótkiej instrukcji z przykładami/rozbudowanego wyjaśnienia z komentarzami/projektu demonstracyjnego/serii ćwiczeń o rosnącej trudności")