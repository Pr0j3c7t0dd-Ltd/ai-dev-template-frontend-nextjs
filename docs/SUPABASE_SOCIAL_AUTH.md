# Setting Up Social Logins with Supabase

This guide will help you configure social authentication providers in your Supabase project.

## Prerequisites

- A Supabase project
- Access to the Supabase Dashboard

## General Configuration Steps

1. Go to your Supabase dashboard: [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** in the sidebar
4. Click on **Providers**
5. For each provider you want to enable:
   - Toggle the provider to "Enabled"
   - Enter the required credentials (Client ID/Key and Secret)
   - Save your changes

## Provider-Specific Instructions

### Google

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Set the application type to "Web application"
6. Add authorized redirect URIs:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/api/auth/callback` (for local development)
7. Copy the Client ID and Client Secret to Supabase

### Facebook

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add the "Facebook Login" product
4. In Settings > Basic, copy the App ID and App Secret to Supabase
5. In Facebook Login settings, add the following OAuth Redirect URI:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`

### Apple

1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to "Certificates, IDs & Profiles"
3. Register a new App ID with "Sign In with Apple" capability
4. Create a Services ID and configure it for Sign In with Apple
5. Generate a key with Sign In with Apple enabled
6. Configure your domain and redirect URL in the Sign In with Apple settings:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
7. Add the Services ID, Team ID, Key ID, and Private Key to Supabase

### Microsoft (Azure)

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to "App registrations"
3. Register a new application
4. Add redirect URIs:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Under "Certificates & secrets", create a new client secret
6. Copy the Application (client) ID and client secret to Supabase

### Twitter

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new project and app
3. Set up User Authentication settings
4. Add the callback URL:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Get your API Key and API Key Secret
6. Copy these to Supabase as Client ID and Client Secret

### GitHub

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add the callback URL:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to Supabase

### Slack

1. Go to [Slack API](https://api.slack.com/apps)
2. Create a new app
3. Under "OAuth & Permissions", add the redirect URL:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Under "Basic Information", find your Client ID and Client Secret
5. Copy these to Supabase

### Discord

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to "OAuth2" settings
4. Add the redirect URL:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
5. Copy the Client ID and Client Secret to Supabase

### Twitch

1. Go to [Twitch Developer Console](https://dev.twitch.tv/console)
2. Create a new application
3. Add the OAuth Redirect URL:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to Supabase

## Additional Configuration

### Environment Variables

Ensure your `.env.local` file has the required Supabase variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Redirect URLs for Production

When deploying to production, make sure to:

1. Update the redirect URLs in each provider's developer console to include your production URL:
   - `https://your-domain.com/api/auth/callback`
2. Update the `redirectTo` option in your app's code when calling `signInWithOAuth`:

```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider,
  options: {
    redirectTo: `${window.location.origin}/api/auth/callback`,
  },
});
```

## Testing

After configuration, test each social login provider to ensure they work correctly. Verify that:

1. The authentication flow starts properly
2. Users can log in successfully
3. User information is correctly populated in your Supabase Auth tables
4. Users are redirected back to your application properly

## Troubleshooting

- **Redirect URI Mismatch**: Ensure the redirect URIs match exactly between Supabase and the provider configuration
- **CORS Issues**: Check that your domain is properly configured in Supabase's allowed domains
- **Scopes**: Some providers require specific scopes to access user information

For more details, refer to the [Supabase Authentication documentation](https://supabase.com/docs/guides/auth).
