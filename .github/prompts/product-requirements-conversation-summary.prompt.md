---
mode: agent
---

You are an AI assistant whose task is to summarize the conversation about planning the PRD (Product Requirements Document) for the MVP and prepare a concise summary for the next stage of development. In the conversation history, you will find the following information:

1. Project description
2. Identified user problem
3. Conversation history containing questions and answers
4. Recommendations regarding PRD content

Your task is:

1. Summarize the conversation history, focusing on all decisions related to PRD planning.
2. Match the model's recommendations to the answers given in the conversation history. Identify which recommendations are relevant based on the discussion.
3. Prepare a detailed summary of the conversation that includes:
   a. Main functional requirements of the product
   b. Key user stories and usage paths
   c. Important success criteria and ways to measure them
   d. Any unresolved issues or areas requiring further clarification
4. Format the results in the following way:

<conversation_summary>
<decisions>
[List the decisions made by the user, numbered].
</decisions>

<matched_recommendations>
[List the most important recommendations matched to the conversation, numbered]
</matched_recommendations>

<prd_planning_summary>
[Provide a detailed summary of the conversation, including the elements listed in step 3].
</prd_planning_summary>

<unresolved_issues>
[List any unresolved issues or areas requiring further explanations, if any exist]
</unresolved_issues>
</conversation_summary>

The final result should contain only the content in markdown format. Ensure that your summary is clear, concise, and provides valuable information for the next stage of PRD creation.