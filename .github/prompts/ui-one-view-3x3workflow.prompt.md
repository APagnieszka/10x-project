---
mode: agent
---

ui-one-view-3x3workflow Your task is to implement the frontend view based on the provided implementation plan and implementation rules. Your goal is to create a detailed and accurate implementation that is consistent with the provided plan, correctly represents the component structure, integrates with the API and handles all specified user interactions.

First, review the implementation plan:

<implementation_plan>
@.ai/ui-plan.md
</implementation_plan>

Now review the implementation rules:

<implementation_rules>
@.github/copilot-instructions.md
</implementation_rules>

Review the defined types:

<types>
@src/types.ts
</types>

Implement the plan according to the following approach:

<implementation_approach>
Implement a maximum of 3 steps of the implementation plan, summarize briefly what you did and describe the plan for the next 3 actions - stop at this point and wait for my feedback.
</implementation_approach>

Thoroughly analyze the implementation plan and rules. Pay special attention to the component structure, API integration requirements and user interactions described in the plan.

Perform the following steps to implement the frontend view:

1. Component Structure:
   - Identify all components mentioned in the implementation plan.
   - Create a hierarchical structure of these components.
   - Ensure that the responsibilities and relationships of each component are clearly defined.

2. API Integration:
   - Identify all API endpoints mentioned in the plan.
   - Implement the necessary API calls for each endpoint.
   - Handle API responses and appropriately update component states.

3. User Interactions:
   - List all user interactions specified in the implementation plan.
   - Implement event handlers for each interaction.
   - Ensure that each interaction triggers the appropriate action or state change.

4. State Management:
   - Identify the required state for each component.
   - Implement state management using the appropriate method (local state, custom hook, shared state).
   - Ensure that state changes trigger the necessary re-rendering.

5. Styling and Layout:
   - Apply the specified styling and layout as mentioned in the implementation plan.
   - Ensure responsiveness if required by the plan.

6. Error Handling and Edge Cases:
   - Implement error handling for API calls and user interactions.
   - Consider and handle potential edge cases mentioned in the plan.

7. Performance Optimization:
   - Implement any performance optimizations specified in the plan or rules.
   - Ensure efficient rendering and minimal number of unnecessary re-renders.

8. Testing:
   - If specified in the plan, implement unit tests for components and functions.
   - Thoroughly test all user interactions and API integrations.

Throughout the entire implementation process, strictly adhere to the provided implementation rules. These rules take precedence over any general best practices that may conflict with them.

Ensure that your implementation accurately reflects the provided implementation plan and adheres to all specified rules. Pay special attention to component structure, API integration and user interaction handling.