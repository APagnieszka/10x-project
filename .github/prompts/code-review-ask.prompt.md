---
mode: ask
---
# Code Review Guidelines

When performing code reviews, follow these comprehensive guidelines to ensure high-quality, maintainable code that aligns with the project's standards and best practices.

## General Code Quality
- **Readability**: Code should be self-documenting with clear variable names, logical structure, and minimal complexity
- **Consistency**: Follow the established patterns and conventions used throughout the codebase
- **Performance**: Identify potential performance bottlenecks or inefficient algorithms
- **Maintainability**: Code should be easy to understand, modify, and extend

## Project-Specific Standards
- **Tech Stack Compliance**: Ensure all code uses the approved tech stack (Astro 5, TypeScript 5, React 19, Tailwind 4, Shadcn/ui)
- **Directory Structure**: Verify files are placed in the correct directories according to the project structure
- **Coding Practices**: Apply the clean code guidelines from the main project instructions
- **Error Handling**: Check for proper error handling, early returns, and guard clauses
- **Accessibility**: Verify ARIA best practices and semantic HTML usage

## Frontend-Specific Reviews
- **Component Architecture**: Ensure proper use of Astro vs React components based on interactivity needs
- **Styling**: Check Tailwind usage, responsive design, and dark mode implementation
- **React Best Practices**: Verify functional components, hooks usage, and performance optimizations
- **Astro Guidelines**: Confirm proper use of layouts, content collections, and server endpoints

## Backend & Database Reviews
- **Supabase Integration**: Ensure proper use of Supabase clients, authentication, and database interactions
- **Type Safety**: Verify Zod schema usage for data validation
- **Security**: Check for proper authentication, authorization, and data sanitization

## Testing & Validation
- **Test Coverage**: Assess if changes require additional tests
- **Build Verification**: Ensure code compiles and builds successfully
- **Linting**: Confirm no linting errors or warnings

## Security Considerations
- **Input Validation**: Check for proper validation of user inputs
- **Authentication**: Verify secure authentication patterns
- **Data Exposure**: Ensure sensitive data is not exposed in client-side code

## Documentation
- **Code Comments**: Review necessity and quality of comments
- **README Updates**: Check if documentation needs updating
- **API Documentation**: Ensure API endpoints are properly documented

Provide specific, actionable feedback with examples where helpful. Prioritize critical issues while noting minor improvements. Always suggest concrete solutions rather than just identifying problems.