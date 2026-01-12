# Nestegg Wallet

A comprehensive finance tracking application built with T3 Stack in a Turborepo monorepo. Track your accounts, balances, and spending with a beautiful, modern interface.

## About

Nestegg Wallet helps you track your finances with a comprehensive view of your accounts, balances, and spending. Built with modern web technologies in a monorepo structure for optimal code sharing and scalability.

## Features

- 📊 **Account Overview** - View all your accounts and balances in one place
- 📈 **Balance Tracking** - Track balance history over time with interactive charts
- 💰 **Spending Calendar** - Visualize daily spending patterns
- 🏷️ **Account Categorization** - Organize accounts by type (Cash, Investments, Credit Cards, Loans, etc.)
- 🌓 **Dark Mode** - Beautiful light and dark themes
- 📱 **Mobile Support** - Native mobile app via Expo
- 🔒 **Secure Authentication** - Built-in authentication with Better Auth

## Tech Stack

This project is built with:

- **Turborepo** - High-performance build system for JavaScript and TypeScript codebases
- **Next.js** - React framework for production
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript ORM for SQL databases
- **Better Auth** - Authentication library
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable components built with Radix UI and Tailwind CSS

## Quick Start

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed setup and development instructions.

```bash
# Install dependencies
pnpm i

# Configure environment variables
cp .env.example .env

# Push the database schema
pnpm db:push

# Generate auth schema
pnpm --filter @nestegg/auth generate

# Start development server
pnpm dev
```

## Project Structure

This project uses [Turborepo](https://turborepo.com) and contains:

```text
apps
  ├─ expo          # Expo/React Native mobile app
  ├─ nextjs        # Next.js web application
  └─ tanstack-start # Tanstack Start web application (alternative)
packages
  ├─ api           # tRPC router definition
  ├─ auth          # Authentication using better-auth
  ├─ db            # Database schema and client (Drizzle & Supabase)
  ├─ types         # Shared TypeScript types
  ├─ ui            # Shared UI components (shadcn/ui)
  └─ validators    # Shared Zod validation schemas
tooling
  ├─ eslint        # Shared ESLint configurations
  ├─ prettier      # Shared Prettier configuration
  ├─ tailwind      # Shared Tailwind CSS theme and configuration
  └─ typescript    # Shared TypeScript configurations
```

## Deployment

### Next.js

Deploy the Next.js application to [Vercel](https://vercel.com). The [official Turborepo guide](https://vercel.com/docs/concepts/monorepos/turborepo) provides detailed instructions.

1. Create a new project on Vercel, select the `apps/nextjs` folder as the root directory
2. Add your `POSTGRES_URL` environment variable
3. Deploy!

### Expo

Deploying your Expo application requires submitting production builds to app stores. See the [Expo distribution guide](https://docs.expo.dev/distribution/introduction) for detailed instructions.

1. Set up [EAS Build](https://docs.expo.dev/build/introduction)
2. Create a production build
3. Submit to app stores using [EAS Submit](https://docs.expo.dev/submit/introduction)

For detailed deployment instructions, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup, code quality guidelines, and contribution instructions.

## Acknowledgments

This project was initialized using [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo), which provides an excellent foundation for building T3 Stack applications in a monorepo structure.
