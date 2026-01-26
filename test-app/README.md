# Test App

A modern React application built with Vite, TypeScript, and Tailwind CSS. This application serves as a foundation for testing and development purposes.

## Features

- React 18 with hooks
- TypeScript for type safety
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Navigate to the test-app directory
cd test-app

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Testing

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Building

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
test-app/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Layout.tsx
│   ├── lib/             # Utility functions
│   │   └── utils.ts
│   ├── pages/           # Page components
│   │   ├── AboutPage.tsx
│   │   ├── HomePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── test/            # Test files
│   │   ├── App.test.tsx
│   │   └── setup.ts
│   ├── App.tsx          # Main app component
│   ├── index.css        # Global styles
│   ├── main.tsx         # Entry point
│   └── vite-env.d.ts    # Vite type declarations
├── index.html           # HTML template
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Technologies

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React Router](https://reactrouter.com/) - Routing
- [Vitest](https://vitest.dev/) - Testing
