# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Router v7 application with TypeScript, using pnpm as the package manager. It's configured as a full-stack SSR application with TailwindCSS for styling, React Query for data fetching, and Zustand for state management.

## Development Commands

- **Development server**: `pnpm run dev` - Starts dev server with HMR at http://localhost:5173
- **Build**: `pnpm run build` - Creates production build
- **Type checking**: `pnpm run typecheck` - Runs React Router type generation and TypeScript compiler
- **Production server**: `pnpm run start` - Serves the built application

## Project Architecture

### Core Technologies
- **React Router v7**: Full-stack React framework with SSR enabled by default
- **TypeScript**: Configured with strict mode and ES2022 target
- **TailwindCSS**: Utility-first CSS framework
- **React Query (@tanstack/react-query)**: Server state management
- **Zustand**: Client-side state management
- **Vite**: Build tool and dev server

### Directory Structure
```
app/                    # Main application code
├── root.tsx           # Root layout component with error boundary
├── routes.ts          # Route configuration
├── routes/            # Route components
│   └── home.tsx       # Index route
├── welcome/           # Welcome page components
└── app.css           # Global styles

public/                # Static assets
react-router.config.ts # React Router configuration
```

### Key Patterns
- **Route-based code organization**: Routes defined in `app/routes.ts` with file-based routing in `app/routes/`
- **TypeScript path aliases**: `~/*` maps to `./app/*`
- **SSR by default**: Server-side rendering enabled in react-router.config.ts
- **Type-safe routes**: Uses React Router's type generation system

### Configuration Files
- **react-router.config.ts**: React Router framework configuration (SSR enabled)
- **vite.config.ts**: Vite build configuration with TailwindCSS and tsconfigPaths plugins
- **tsconfig.json**: TypeScript configuration with path mapping and React Router type generation

### State Management
- Use **Zustand** for client-side application state
- Use **React Query** for server state, caching, and data fetching
- Follow React Router's data loading patterns for route-level data

### Styling
- **TailwindCSS v4**: Pre-configured for utility-first styling
- **Global styles**: Located in `app/app.css`
- **Inter font**: Pre-loaded from Google Fonts

## Development Notes

- The project uses pnpm, so prefer `pnpm install` over npm/yarn
- Type checking includes React Router's type generation - always run `pnpm run typecheck` before committing
- SSR is enabled by default - consider client-only code when adding new features
- The app uses React 19 with the new React Router v7 patterns