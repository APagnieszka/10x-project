---
mode: agent
---

# Tech Stack Analysis Prompt

Perform a critical yet objective analysis of whether the proposed tech stack adequately addresses the needs outlined in the Product Requirements Document (PRD) for the Foodzilla application.

## Proposed Tech Stack

ask for PROPOSED_TECH_STACK

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