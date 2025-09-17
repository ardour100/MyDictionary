# Google OAuth Setup for Local Development

## Quick Setup Steps

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   ```
   http://127.0.0.1:54321/auth/v1/callback
   http://localhost:54321/auth/v1/callback
   ```
7. Copy the Client ID and Client Secret

### 2. Update Environment Variables

Edit your `.env.local` file and replace:
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

With your actual Google OAuth credentials.

### 3. Restart Supabase

After updating the config, restart Supabase to apply the changes:
```bash
npx supabase stop
npx supabase start
```

### 4. Test the Application

1. Your dictionary app should now show a "Sign in with Google" button
2. The "Supabase not configured" message should be gone
3. You can access Supabase Studio at: http://127.0.0.1:54323
4. Check email testing at: http://127.0.0.1:54324

## Current Status

✅ Local Supabase is running
✅ Database migration applied
✅ Environment variables configured
⏳ **Need Google OAuth credentials** (see steps above)

## Useful Commands

```bash
# Check Supabase status
npx supabase status

# View Supabase logs
npx supabase logs

# Reset database (keeps your migration)
npx supabase db reset

# Stop Supabase
npx supabase stop
```

## Development Workflow

1. Start Supabase: `npx supabase start`
2. Start your app: `npm run dev`
3. Access Supabase Studio: http://127.0.0.1:54323
4. View your app: http://localhost:5173