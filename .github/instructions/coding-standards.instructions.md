---
applyTo: "**"
---

# Coding Standards for 10x Project

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
