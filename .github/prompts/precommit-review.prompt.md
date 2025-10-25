---
mode: agent
---

Perform a pre-commit review of the current changes in the workspace. Follow these steps to ensure code quality before committing:

1. **Check Git Status**: Review what files have been modified, added, or deleted using `git status`

2. **Code Quality Review**:
   - Verify all code follows the project's tech stack (Astro 5, TypeScript 5, React 19, Tailwind 4, Shadcn/ui)
   - Ensure proper directory structure is maintained
   - Check for clean code practices: early returns, guard clauses, error handling at function start
   - Confirm accessibility best practices (ARIA landmarks, roles, labels)
   - Validate Tailwind usage with proper responsive and state variants

3. **Frontend-Specific Checks**:
   - Use Astro components for static content, React only for interactivity
   - Verify proper React hooks usage (functional components, useCallback, useMemo where needed)
   - Check Astro guidelines: View Transitions, content collections, server endpoints with uppercase handlers
   - Ensure image optimization and hybrid rendering where appropriate

4. **Backend & Database Checks**:
   - Confirm Supabase integration follows security and performance guidelines
   - Verify Zod schemas for data validation in API routes
   - Check proper use of supabase from context.locals in Astro routes

5. **Linting and Formatting**:
   - Run `npm run lint` to check for ESLint errors
   - Run `npm run format` to ensure Prettier formatting
   - Fix any identified issues

6. **Testing**:
   - If tests exist, run them to ensure no regressions
   - For new React components, verify unit tests are written using Vitest

7. **Build Verification**:
   - Run `npm run build` to ensure the project builds successfully
   - Check for any TypeScript or build errors

8. **Commit Message Preparation**:
   - Prepare a conventional commit message (feat:, fix:, docs:, style:, refactor:, test:, chore:)
   - Ensure the message clearly describes the changes

9. **Security Review**:
   - Check for proper input validation and data sanitization
   - Ensure no sensitive data is exposed in client-side code
   - Verify authentication and authorization patterns

10. **Final Verification**:
    - Confirm all changes align with project coding standards
    - Ensure documentation is updated if needed
    - Verify no breaking changes without proper migration plans

Provide a summary of any issues found and recommendations for fixes. Only proceed with commit if all critical issues are resolved.
