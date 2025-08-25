# Chaldea Foundation

A Turborepo monorepo project with TypeScript, Prettier, ESLint, and Strapi CMS.

## Project Structure

```
.
├── apps/
│   └── chaldea-foundation-center/  # Strapi CMS application
├── packages/
│   ├── eslint-config/              # Shared ESLint configurations
│   └── typescript-config/           # Shared TypeScript configurations
└── turbo.json                       # Turborepo configuration
```

## Prerequisites

- Node.js (>= 18.0.0, <= 22.x.x)
- npm (>= 6.0.0)
- MySQL server running on localhost:3306

## Database Setup

Make sure you have MySQL running locally with:

- Host: localhost
- Port: 3306
- Database: chaldea_foundation
- Username: root
- Password: (empty)

You can create the database with:

```sql
CREATE DATABASE IF NOT EXISTS chaldea_foundation;
```

## Installation

```bash
npm install
```

## Development

To run all apps in development mode:

```bash
npm run dev
```

### Build

To build all apps and packages, run the following command:

```bash
npm run build
```

## Linting & Formatting

```bash
# Run ESLint
npm run lint

# Run Prettier
npm run format
```

## Git Hooks

This project uses Husky for git hooks:

- **pre-commit**: Runs ESLint and Prettier on staged files
- **pre-push**: Runs build check and tests (if available)

## Configuration

### Prettier

The project uses Prettier with the following configuration:

- Tab width: 4 spaces
- Semicolons: true
- Single quotes: false
- Trailing comma: ES5

### ESLint

ESLint is configured with:

- TypeScript support
- Prettier integration
- Turbo plugin for monorepo support

## Apps

### Chaldea Foundation Center (Strapi CMS)

The Chaldea Foundation Center application is configured with:

- TypeScript support
- MySQL database
- Default port: 1337

To run the Chaldea Foundation Center individually:

```bash
cd apps/chaldea-foundation-center
npm run develop
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure linting and formatting pass
4. Commit your changes (hooks will run automatically)
5. Push your branch (build check will run)
6. Create a pull request

## Remote Repository

This project is configured to push to:
https://github.com/TheMrCorvy/chaldea-foundation.git

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

## License

MIT
