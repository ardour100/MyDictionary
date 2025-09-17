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

## Current Features
- Direct word lookup via Dictionary API (api.dictionaryapi.dev)
- Responsive UI with gradient theme (pink-to-teal)
- Loading states with spinner animation
- Error handling and display
- Definition display with:
  - Parts of speech (noun, verb, etc.)
  - Multiple definitions per part of speech
  - Example sentences when available
- Enter key search functionality
- Search button with disabled state during loading

## Architecture Notes
- **Frontend-Only**: No backend, all data from external API
- **No Persistence**: All data is ephemeral, no storage
- **Single Component**: Main logic consolidated in App.jsx
- **External API Dependency**: Relies on dictionaryapi.dev
- **State Management**: Basic React hooks only
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