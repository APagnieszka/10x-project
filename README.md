# Foodzilla

A Progressive Web App (PWA) designed to help households reduce food waste by enabling quick and easy addition of food products, tracking expiration dates, and receiving notifications about approaching expiration dates. Key MVP features include barcode scanning for automatic product data retrieval, OCR recognition of expiration dates from photos, and push/email notification systems. The app supports Polish and English languages with user-selectable preferences and is built using free technologies like QuaggaJS, Tesseract.js, and Supabase to minimize operational costs.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [E2E Tests](#e2e-tests)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Tech Stack

- **[Astro](https://astro.build/)** - Modern web framework for building fast, content-focused websites
- **[React](https://react.dev/)** - UI library for building interactive components
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Accessible and customizable UI components
- **[Supabase](https://supabase.com/)** - Backend services, authentication, and database
- **[QuaggaJS](https://github.com/serratus/quaggaJS)** - Barcode scanning library
- **[Tesseract.js](https://github.com/naptha/tesseract.js)** - OCR (Optical Character Recognition) for text recognition from images
- **[Open Food Facts API](https://world.openfoodfacts.org/data)** - Product data retrieval from barcode
- **[Openrouter.ai](https://openrouter.ai/)** - AI-powered recipe generation (experimental feature)
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Code linting and formatting
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipelines
- **[DigitalOcean](https://www.digitalocean.com/)** - Hosting via Docker image

## Getting Started Locally

### Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

### Node.js Version Management

This project uses Node.js v22.14.0. Use nvm for version management:

```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload terminal configuration
source ~/.zshrc

# Install and use the correct Node.js version
nvm install 22.14.0
nvm use 22.14.0

# Verify installation
node -v  # Should show v22.14.0
npm -v   # Should show 10.9.2
```

### Troubleshooting Version Issues

If your terminal shows an incorrect Node.js or npm version:

1. **Check if you're using the right version:**

   ```bash
   node -v  # Should be v22.14.0
   npm -v   # Should show 10.9.2
   ```

2. **If versions are incorrect, try these steps:**

   ```bash
   # Make sure you're in the project directory
   cd /path/to/your/project

   # Use nvm to switch to the correct version
   nvm use

   # If that doesn't work, explicitly install and use
   nvm install 22.14.0
   nvm use 22.14.0
   ```

3. **Set as default (optional):**

   ```bash
   # Make this version your default for new terminal sessions
   nvm alias default 22.14.0
   ```

4. **Alternative: Use npx for specific npm version:**
   ```bash
   # Run npm commands with specific version without switching Node.js
   npx npm@10.9.2 install
   npx npm@10.9.2 run dev
   ```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/APagnieszka/10x-project.git
   cd 10x-project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:4321](http://localhost:4321) in your browser.

## Supabase Setup

For local development with Supabase backend services, see the [Supabase Setup Guide](docs/supabase-setup.md).

## E2E Tests

Playwright loads E2E environment variables from `.env.e2e.local` first, then falls back to `.env`.

Required:

- `PUBLIC_SUPABASE_URL` - Supabase project URL
- `PUBLIC_SUPABASE_KEY` - Supabase anon key (public)

Optional (recommended for local/CI):

- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key used only by E2E cleanup (deletes the user created in the signup test via Admin API). Keep it secret and never commit it.

How to get the key:

- Local Supabase (CLI): `npx supabase status` prints both anon and service role keys.
- Hosted Supabase: Supabase Dashboard → Project Settings → API → service_role key.

## Available Scripts

| Script             | Description                             |
| ------------------ | --------------------------------------- |
| `npm run dev`      | Start the development server            |
| `npm run build`    | Build the project for production        |
| `npm run preview`  | Preview the production build locally    |
| `npm run astro`    | Run Astro CLI commands                  |
| `npm run lint`     | Run ESLint to check code quality        |
| `npm run lint:fix` | Run ESLint and automatically fix issues |
| `npm run format`   | Format code with Prettier               |
| `npm run test`     | Run tests with Vitest                   |

## Project Scope

Foodzilla implements the following core functionalities to help households manage food inventory and reduce waste:

- **User Authentication:** Single shared account for household using email and password with Supabase auth
- **Secure Data Access:** Household data (purchase history, product status) visible only to logged-in users on the same account
- **Product Addition:**
  - Barcode scanning (QuaggaJS) for automatic data retrieval from Open Food Facts
  - Manual product entry as alternative
  - Photo upload with OCR (Tesseract.js) for automatic expiration date recognition (≥90% confidence auto-save, otherwise user confirmation)
  - Manual date entry with shortcuts (e.g., "+1 week")
- **Product Management:**
  - Marking products as "opened" with opening date tracking
  - Moving consumed products to shopping list
  - Interactive shopping list with draft mode for purchased items awaiting details
  - Easy removal of consumed products
  - Marking products as "spoiled" for waste tracking and weekly reports
- **Food Waste Reports:** Weekly summaries of spoiled products, historical access, and monthly/yearly reports on demand
- **Notifications:** Web-push notifications and daily email digest at 8:00 AM local time, with default reminders 3 days and 1 day before expiration, plus prompts for opened products over 3 days
- **Data Storage:** Permanent storage for product/barcode photos, automatic deletion of expiration date photos after 100 days
- **Privacy & Analytics:** Anonymous event tracking (opt-out available) for usage analysis
- **Multi-language Support:** Polish and English with user-selectable preference (Polish default)
- **Conflict Handling:** Last-write-wins strategy for concurrent edits

For detailed requirements, see the [Product Requirements Document](.ai/prd.md).

## Project Status

🚧 **Active Development**

Foodzilla is currently in development as part of the 10x-project course. The MVP focuses on core food waste reduction features including product tracking, expiration monitoring, and notification systems.

## License

MIT License

---

For more details, see the [Product Requirements Document](.ai/prd.md) and [additional documentation](docs/).
