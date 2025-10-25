# 10x Astro Starter

A modern, opinionated starter template for building fast, accessible, and AI-friendly web applications.

## Tech Stack

- [Astro](https://astro.build/) v5.5.5 - Modern web framework for building fast, content-focused websites
- [React](https://react.dev/) v19.0.0 - UI library for building interactive components
- [TypeScript](https://www.typescriptlang.org/) v5 - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17 - Utility-first CSS framework

## Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

## Node.js Version Management

This project uses a specific Node.js version (v22.14.0) which includes npm 10.9.2. The version is specified in the `.nvmrc` file.

### Using nvm (Recommended)

If you have [nvm](https://github.com/nvm-sh/nvm) installed:

```bash
# Use the Node.js version specified in .nvmrc
nvm use

# Install the version if you don't have it
nvm install

# Verify the versions
node -v  # Should show v22.14.0
npm -v   # Should show 10.9.2
```

### Installing nvm

If you don't have nvm installed:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload your terminal configuration
source ~/.zshrc  # or ~/.bashrc for bash users

# Install and use the correct Node.js version
nvm install 22.14.0
nvm use 22.14.0
```

### Troubleshooting Version Issues

If your terminal shows an incorrect Node.js or npm version:

1. **Check if you're using the right version:**

   ```bash
   node -v  # Should be v22.14.0
   npm -v   # Should be 10.9.2
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

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/przeprogramowani/10x-astro-starter.git
cd 10x-astro-starter
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```md
.
├── src/
│ ├── layouts/ # Astro layouts
│ ├── pages/ # Astro pages
│ │ └── api/ # API endpoints
│ ├── components/ # UI components (Astro & React)
│ └── assets/ # Static assets
├── public/ # Public assets
```

## AI Development Support

This project is configured with AI development tools to enhance the development experience, providing guidelines for:

- Project structure
- Coding practices
- Frontend development
- Styling with Tailwind
- Accessibility best practices
- Astro and React guidelines

### Cursor IDE

The project includes AI rules in `.cursor/rules/` directory that help Cursor IDE understand the project structure and provide better code suggestions.

### GitHub Copilot

AI instructions for GitHub Copilot are available in `.github/copilot-instructions.md`

### Windsurf

The `.windsurfrules` file contains AI configuration for Windsurf.

## Contributing

Please follow the AI guidelines and coding practices defined in the AI configuration files when contributing to this project.

## License

MIT
