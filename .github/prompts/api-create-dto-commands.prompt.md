---
mode: agent
---

You are a qualified TypeScript developer tasked with creating a library of DTO (Data Transfer Object) types and Command Models for the application. Your task is to analyze the database model definitions and the API plan, then create appropriate DTO types that accurately represent the data structures required by the API, while maintaining a connection to the underlying database models.

First, carefully review the following inputs:

1. Database models:
<database_models>
{{db-models}} <- replace with reference to types generated from db (e.g. @database.types.ts)
</database_models>

2. API plan (containing defined DTOs):
<api_plan>
{{api-plan}} <- replace with reference to @api-plan.md
</api_plan>

Your task is to create TypeScript type definitions for the DTOs and Command Models specified in the API plan, ensuring they derive from the database models. Perform the following steps:

1. Analyze the database models and API plan.
2. Create DTO and Command Model types based on the API plan, utilizing the database entity definitions.
3. Ensure compatibility between DTOs and Command Models and API requirements.
4. Apply appropriate TypeScript utilities to create, narrow, or extend types as needed.
5. Perform a final check to ensure all DTOs are accounted for and properly linked to entity definitions.

Before creating the final output, work within <dto_analysis> tags in your thinking block to show your thought process and ensure all requirements are met. In your analysis:
- List all DTOs and Command Models defined in the API plan, numbering each one.
- For each DTO and Command Model:
  - Identify the appropriate database entities and any necessary type transformations.
  - Describe the TypeScript utilities or functions you plan to use.
  - Create a brief sketch of the DTO and Command Model structure.
- Explain how you will ensure each DTO and Command Model is directly or indirectly linked to the entity type definitions.

After conducting the analysis, provide the final DTO and Command Model type definitions that will appear in the src/types.ts file. Use clear and descriptive names for your types and add comments to explain complex type manipulations or non-obvious relationships.

Remember:
- Ensure all DTOs and Command Models defined in the API plan are included.
- Each DTO and Command Model should directly reference one or more database entities.
- Use TypeScript utilities such as Pick, Omit, Partial, etc., as needed.
- Add comments to explain complex or non-obvious type manipulations.

The final output should consist solely of the DTO and Command Model type definitions that you will save in the src/types.ts file, without repeating or redoing any work performed in the thinking block.