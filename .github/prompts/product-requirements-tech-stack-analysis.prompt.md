---
mode: agent
---

# Tech Stack Analysis Prompt

Perform a critical yet objective analysis of whether the proposed tech stack adequately addresses the needs outlined in the Product Requirements Document (PRD) for the Foodzilla application.

## Proposed Tech Stack

Frontend - Astro with React for interactive components:
- Astro 5 enables creating fast, efficient pages and applications with minimal JavaScript
- React 19 provides interactivity where needed
- TypeScript 5 for static typing of code and better IDE support
- Tailwind 4 allows for convenient application styling
- Shadcn/ui provides a library of accessible React components on which we will base the UI

Backend - Supabase as a comprehensive backend solution:
- Provides PostgreSQL database
- Provides SDKs in multiple languages that will serve as Backend-as-a-Service
- Is an open source solution that can be hosted locally or on your own server
- Has built-in user authentication

AI - Communication with models through Openrouter.ai service:
- Access to a wide range of models (OpenAI, Anthropic, Google and many others), which will allow us to find a solution ensuring high efficiency and low costs
- Allows setting financial limits on API keys

CI/CD and Hosting:
- Github Actions for creating CI/CD pipelines
- DigitalOcean for hosting the application via Docker image

## Analysis Questions

Consider the following questions in your analysis:

1. Will the technology allow us to quickly deliver the MVP?
2. Will the solution be scalable as the project grows?
3. Will the cost of maintenance and development be acceptable?
4. Do we need such a complex solution?
5. Is there a simpler approach that will meet our requirements?
6. Will the technologies allow us to ensure appropriate security?

## Requirements from PRD

Reference the PRD document (@prd.md) for the full list of functional and non-functional requirements, including:
- PWA functionality with offline capabilities
- Barcode scanning and OCR processing
- Real-time notifications (push and email)
- User authentication and data security
- Scalability for up to 5,000 products per household account
- Performance requirements (response times, OCR accuracy)
- Accessibility (WCAG 2.1 AA compliance)
- Multi-language support (Polish and English)

Provide a balanced analysis with specific references to PRD requirements and potential gaps or strengths of the proposed stack.