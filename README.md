# OUTCST Drop

OUTCST DJ Collective - DROP_001 limited edition merchandise drop.

## Project Overview

A single-page web application for OUTCST's first merchandise drop featuring:
- 3D interactive T-shirt viewer
- Pre-order flow with customer details collection
- Admin dashboard for managing orders
- Supabase backend for data persistence

## Technologies

This project is built with:

- **Vite** - Fast build tool and dev server
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn-ui** - Component primitives
- **Framer Motion** - Animations
- **Supabase** - Backend and database
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 16+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase account and project

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd outcst-drop

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with:
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

- `/src/pages` - Route pages (Store, Info, Dashboard, Success)
- `/src/components` - Reusable components
- `/src/integrations/supabase` - Supabase client and types
- `/supabase` - Database migrations and config

## Deployment

Build the project and deploy the `dist` folder to any static hosting service:

```sh
npm run build
```

Ensure environment variables are configured in your hosting platform.

## License

© 2024 OUTCST. All rights reserved.
