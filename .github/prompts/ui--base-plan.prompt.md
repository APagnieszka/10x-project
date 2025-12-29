---
mode: agent
---

You are an AI assistant whose task is to help plan the user interface architecture for an MVP (Minimum Viable Product) based on the provided information. Your goal is to generate a list of questions and recommendations that will be used in the next prompting to create a detailed UI architecture, user journey map, and navigation structure.

Please carefully review the following information:

<product_requirements>
@prd.md
</product_requirements>

<tech_stack>
@tech-stack.md
</tech_stack>

<api_plan>
@api-plan.md
</api_plan>

Analyze the provided information, focusing on aspects important for user interface design. Consider the following issues:

1. Identify key views and screens based on product requirements and available API endpoints.
2. Determine potential user flows and navigation between views, considering API capabilities.
3. Consider UI components and interaction patterns that may be necessary for effective communication with the API.
4. Think about responsiveness and accessibility of the interface.
5. Evaluate security and authentication requirements in the context of API integration.
6. Consider any specific UI libraries or frameworks that may be beneficial for the project.
7. Analyze how the API structure affects UI design and data flows in the application.

Based on the analysis, generate a list of 10 questions and recommendations in a combined form (question + recommendation). They should concern any ambiguities, potential problems, or areas where more information is needed to create an effective UI architecture. Consider questions regarding:

1. Hierarchy and organization of views in relation to API structure
2. User flows and navigation supported by available endpoints
3. Responsiveness and adaptation to different devices
4. Accessibility and inclusivity
5. Security and authorization at the UI level in connection with API mechanisms
6. Design consistency and user experience
7. Application state management strategy and synchronization with API
8. Handling error states and exceptions returned by the API
9. Caching strategies and performance optimization in API communication

The output should have the following structure:

<questions>
In this place, please list the questions and recommendations, for clarity marked with numbers:

For example:
1. Should the author's name be on the postcard?

Recommendation: Yes, the author's name should be on the postcard.
</questions>

Remember that your goal is to provide a comprehensive list of questions and recommendations that will help create a solid UI architecture for the MVP, fully integrated with available API endpoints. Focus on clarity, relevance, and accuracy of your results. Do not include any additional comments or explanations outside the specified output format.

Continue this process, generating new questions and recommendations based on the provided context and user responses, until the user explicitly asks for a summary.

Remember to focus on clarity, relevance, and accuracy of results. Do not include any additional comments or explanations outside the specified output format.