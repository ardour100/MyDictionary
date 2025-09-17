# MyDictionary Code Structure

## Overview
Frontend-only dictionary application built with React + Vite, using external Dictionary API for word definitions.

## Tech Stack
- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.0
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React 0.523.0
- **Package Manager**: Both npm and yarn (lock files present)

## Project Structure

```
MyDictionary/
├── src/
│   ├── App.jsx              # Main dictionary component (single version)
│   ├── main.jsx            # React entry point
│   ├── index.css           # Tailwind imports + base styles
│   ├── App.css             # Component-specific styles
│   └── assets/
│       └── react.svg       # React logo asset
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS configuration
```

## Key Files & Code Pointers

### Main Application (`src/App.jsx`)
**Lines 4-158**: `DictionaryApp` component - single dictionary implementation
- **State Management** (lines 5-8):
  - `inputText`: User input
  - `results`: Search results from API
  - `loading`: Loading state
  - `error`: Error messages

- **API Integration** (lines 10-18):
  - `fetchDefinition()`: Calls `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  - Returns first definition object or null on error

- **Search Logic** (lines 20-33):
  - `handleSearch()`: Direct word lookup using `inputText.trim()`
  - Handles loading states, API calls, and error handling
  - No translation layer - searches words as entered

- **UI Components**:
  - Header (lines 47-57): App title "Dictionary Explorer" with BookOpen icon
  - Search Section (lines 60-95): Textarea input and search button with loading states
  - Error Display (lines 98-104): Error messages with AlertCircle icon
  - Results Display (lines 107-139): Definition results showing part of speech, definitions, and examples
  - Empty State (lines 142-151): Initial state with search icon

### Entry Point (`src/main.jsx`)
- Standard React 18+ setup using `createRoot`
- Renders App component in StrictMode

### Styling
- **index.css**: Tailwind imports + global styles with light/dark theme support
- **App.css**: Component-specific styles (largely unused, contains default Vite styles)
- Uses Tailwind gradient theme: pink-to-teal background, teal accent colors

## Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint
- `npm run preview`: Preview production build

## Supabase Setup

### Local Development (Recommended)
For local development with full debugging capabilities:

1. **Supabase is already configured locally**:
   - Run `npx supabase start` to start local Supabase stack
   - Database migration is automatically applied
   - Local environment variables are pre-configured

2. **Set up Google OAuth** (required for authentication):
   - Follow the guide in `SETUP_GOOGLE_AUTH.md`
   - Add your Google Client ID and Secret to `.env.local`
   - Restart Supabase: `npx supabase stop && npx supabase start`

3. **Access local services**:
   - App: http://localhost:5173
   - Supabase Studio: http://127.0.0.1:54323
   - Email testing: http://127.0.0.1:54324

### Production Setup
For hosted Supabase (optional):

1. **Create a Supabase project** at https://supabase.com
2. **Set up Google OAuth provider** in your Supabase Auth settings
3. **Run the database migration** by executing the SQL in `supabase_migration.sql` in your Supabase SQL Editor
4. **Configure environment variables** in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_production_anon_key
   ```

## Current Features
- **Word Lookup**: Direct word lookup via Dictionary API (api.dictionaryapi.dev)
- **Google Authentication**: Sign in with Google account using Supabase Auth
- **User Display**: Shows user name and Google avatar in top-right corner
- **Word Bookmarking**: Save favorite words with full definitions for later reference
- **Personal Dictionary**: View and manage bookmarked words in a dedicated interface
- **Responsive UI**: Mobile-friendly design with gradient theme (pink-to-teal)
- **Real-time Features**:
  - Loading states with spinner animation
  - Error handling and display
  - Session persistence across browser sessions
- **Definition Display**:
  - Parts of speech (noun, verb, etc.)
  - Multiple definitions per part of speech
  - Example sentences when available
- **User Interactions**:
  - Enter key search functionality
  - Search button with disabled state during loading
  - Bookmark/unbookmark toggle for authenticated users
  - User dropdown menu with profile options

## Architecture Notes
- **Full-Stack Application**: Frontend with Supabase backend integration
- **Data Persistence**: User bookmarks stored in Supabase PostgreSQL database
- **Authentication**: Google OAuth via Supabase Auth
- **Component Architecture**:
  - Main logic in App.jsx
  - Modular components for user display, bookmarking, and bookmark management
- **External Dependencies**:
  - Dictionary API (api.dictionaryapi.dev) for word definitions
  - Supabase for authentication and data storage
- **State Management**: React hooks with Supabase real-time subscriptions
- **Security**: Row Level Security (RLS) policies ensure users only access their own bookmarks
- **Responsive Design**: Mobile-friendly with Tailwind responsive classes

## API Response Structure
The app expects Dictionary API responses with:
```javascript
{
  meanings: [
    {
      partOfSpeech: "noun",
      definitions: [
        {
          definition: "...",
          example: "..." // optional
        }
      ]
    }
  ]
}
```