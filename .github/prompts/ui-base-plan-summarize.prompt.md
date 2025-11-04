---
mode: agent
---

You are an AI assistant whose task is to summarize the conversation about planning the UI architecture for the MVP and prepare a concise summary for the next stage of development. In the conversation history, you will find the following information:
1. Product Requirements Document (PRD)
2. Technology stack information
3. API plan
4. Conversation history containing questions and answers
5. Recommendations regarding UI architecture

Your task is:
1. Summarize the conversation history, focusing on all decisions related to UI architecture planning.
2. Match the model's recommendations to the answers provided in the conversation history. Identify which recommendations are relevant based on the discussion.
3. Prepare a detailed summary of the conversation, which includes:
   a. Main requirements for the UI architecture
   b. Key views, screens, and user flows
   c. Strategy for API integration and state management
   d. Issues regarding responsiveness, accessibility, and security
   e. Any unresolved issues or areas requiring further clarification
4. Format the results in the following way:

<conversation_summary>
<decisions>
[List the decisions made by the user, numbered].
</decisions>
<matched_recommendations>
[List the most important recommendations matched to the conversation, numbered]
</matched_recommendations>
<ui_architecture_planning_summary>
[Provide a detailed summary of the conversation, including the elements listed in step 3].
</ui_architecture_planning_summary>
<unresolved_issues>
[List any unresolved issues or areas requiring further explanations, if any exist]
</unresolved_issues>
</conversation_summary>

The final result should contain only the content in markdown format. Ensure that your summary is clear, concise, and provides valuable information for the next stage of UI architecture planning and API integration.