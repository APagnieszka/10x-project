---
mode: agent
---

You are an experienced software architect tasked with creating a detailed implementation plan for a REST API endpoint. Your plan will guide the development team in effectively and correctly implementing this endpoint.

Before we begin, familiarize yourself with the following information:

1. Route API specification:
<route_api_specification>
{{route-api-specification}} <- copy the endpoint description from api-plan.md
</route_api_specification>

2. Related database resources:
<related_db_resources>
{{db-resources}} <- copy tables and relations from db-plan.md
</related_db_resources>

3. Type definitions:
<type_definitions>
{{types}} <- replace with references to type definitions (e.g., @types)
</type_definitions>

4. Tech stack:
<tech_stack>
{{tech-stack}} <- replace with references to @tech-stack.md
</tech_stack>

5. Implementation rules:
<implementation_rules>
{{backend-rules}} <- replace with references to Rules for AI for backend (e.g., @shared.mdc, @backend.mdc, @astro.mdc)
</implementation_rules>

Your task is to create a comprehensive implementation plan for the REST API endpoint. Before delivering the final plan, use <analysis> tags to analyze the information and outline your approach. In this analysis, ensure that:

1. Summarize the key points of the API specification.
2. List required and optional parameters from the API specification.
3. List necessary DTO and Command Models.
4. Consider how to extract logic into a service (existing or new if it doesn't exist).
5. Plan input data validation according to the API endpoint specification, database resources, and implementation rules.
6. Determine how to log errors in the errors table (if applicable).
7. Identify potential security threats based on the API specification and technology stack.
8. Outline potential error scenarios and their corresponding status codes.

After conducting the analysis, create a detailed implementation plan in markdown format. The plan should contain the following sections:

1. Endpoint Overview
2. Request Details
3. Response Details
4. Data Flow
5. Security Considerations
6. Error Handling
7. Performance
8. Implementation Steps

Throughout the plan, ensure that:
- Use correct API status codes:
  - 200 for successful read
  - 201 for successful creation
  - 400 for invalid input
  - 401 for unauthorized access
  - 404 for not found resources
  - 500 for server errors
- Adapt to the provided technology stack
- Follow the given implementation rules

The final output should be a well-organized implementation plan in markdown format. Here is an example of how the output should look:

```markdown
# API Endpoint Implementation Plan: [Endpoint Name]

## 1. Endpoint Overview
[Brief description of the endpoint's purpose and functionality]

## 2. Request Details
- HTTP Method: [GET/POST/PUT/DELETE]
- URL Structure: [URL pattern]
- Parameters:
  - Required: [List of required parameters]
  - Optional: [List of optional parameters]
- Request Body: [Request body structure, if applicable]

## 3. Used Types
[DTOs and Command Models necessary for implementation]

## 4. Response Details
[Expected response structure and status codes]

## 5. Data Flow
[Description of data flow, including interactions with external services or databases]

## 6. Security Considerations
[Details on authentication, authorization, and data validation]

## 7. Error Handling
[List of potential errors and how to handle them]

## 8. Performance Considerations
[Potential bottlenecks and optimization strategies]

## 9. Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]
...
```

The final results should consist solely of the implementation plan in markdown format and should not repeat or reiterate any work done in the analysis section.

Remember to save your implementation plan as .ai/view-implementation-plan.md. Ensure the plan is detailed, clear, and provides comprehensive guidance for the development team.