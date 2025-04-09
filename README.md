This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
# Standard development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev

# Development server with enhanced logging
./scripts/start_dev_server.sh
```

The `start_dev_server.sh` script provides enhanced logging features:

- Displays colorful console output
- Automatically creates and manages log files in the `./logs` directory
- Captures all server activity in `./logs/all.log` and errors in `./logs/error.log`
- Respects the logging configuration in your `.env.local` file

### Logging Configuration

To customize logging behavior, add the following variables to your `.env.local` file:

```bash
# Logging configuration
NEXT_PUBLIC_LOG_LEVEL=info   # Options: error, warn, info, http, debug
NEXT_PUBLIC_LOG_TO_FILE=true # Options: true, false
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Supabase Configuration

This project uses [Supabase](https://supabase.com) for authentication and data storage. To get started with local development:

1. Start your local Supabase backend server:

   ```bash
   # Navigate to your Supabase backend directory
   cd ../your-supabase-backend

   # Start the local Supabase server
   npm run start:dev
   # or use the appropriate command for your backend
   ```

2. Get your Supabase credentials:

   - Once your local Supabase server is running, it will output the necessary credentials in the terminal
   - Look for the `SUPABASE_URL` and `SUPABASE_ANON_KEY` values
   - Alternatively, these can be found in the backend's configuration files or admin dashboard at `http://localhost:8000/project/settings/api`

3. Copy the `.env.example` file to `.env.local` and update with your credentials:
   ```bash
   cp .env.example .env.local
   # Then edit .env.local with your credentials
   ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
