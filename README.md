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

## Backend API Integration

This project now uses a dedicated FastAPI backend for authentication and data operations instead of directly connecting to Supabase from the frontend. This architecture provides better security and separation of concerns.

### Configuration

1. Configure the API backend URL in your `.env.local` file:

   ```bash
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000
   ```

2. Start your FastAPI backend server:

   ```bash
   # Navigate to your FastAPI backend directory
   cd ../your-fastapi-backend

   # Start the backend server
   python -m uvicorn main:app --reload
   # or use the appropriate command for your backend
   ```

3. Ensure that the backend is properly configured with Supabase credentials and other necessary environment variables as specified in the `BACKEND_REQUIREMENTS.md` document.

### Authentication Flow

The authentication flow now works as follows:

1. Frontend sends auth requests (login, signup, etc.) to the FastAPI backend
2. Backend communicates with Supabase and handles the authentication logic
3. Backend sets HTTP-only cookies for maintaining the session
4. Frontend uses these cookies for authenticated requests

This approach improves security by:

- Removing direct access to Supabase credentials from the frontend
- Using HTTP-only cookies instead of localStorage for storing tokens
- Centralizing authentication logic in the backend

See `BACKEND_REQUIREMENTS.md` for detailed specifications of the required backend API endpoints.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
