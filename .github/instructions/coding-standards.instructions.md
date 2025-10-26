---
applyTo: "**"
---

# Coding Standards for 10x Project

## Tech Stack

- Astro 5
- TypeScript 5
- React 19
- Tailwind 4
- Shadcn/ui

## Project Structure

When introducing changes to the project, always follow the directory structure below:

- `./src` - source code
- `./src/layouts` - Astro layouts
- `./src/pages` - Astro pages
- `./src/pages/api` - API endpoints
- `./src/middleware/index.ts` - Astro middleware
- `./src/db` - Supabase clients and types
- `./src/types.ts` - Shared types for backend and frontend (Entities, DTOs)
- `./src/components` - Client-side components written in Astro (static) and React (dynamic)
- `./src/components/ui` - Client-side components from Shadcn/ui
- `./src/lib` - Services and helpers
- `./src/assets` - static internal assets
- `./public` - public assets

When modifying the directory structure, always update this section.

## Language Guidelines

Communication can be in Polish, but all code, comments, and project files must always be in English to maintain consistency and accessibility.

## Coding Rules

### Using Conventional Commits

Always use conventional commits for commit messages to facilitate change tracking and automatic changelog generation. Example types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.

Example: `feat: add new user login function`

### Testing React Components

For each new React component, write unit tests using Vitest or a similar tool. Tests should cover main use cases and edge cases.

### Data Validation in API Routes

In Astro API routes, always validate input data using Zod or a similar library to prevent security errors and invalid data.

### Performance Optimization in Astro

Avoid excessive use of client-side JavaScript in Astro components. Use `client:load` only when necessary to maintain fast page loading.

## Coding practices

### Guidelines for clean code

- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Implement proper error logging and user-friendly error messages.
- Consider using custom error types or error factories for consistent error handling.
