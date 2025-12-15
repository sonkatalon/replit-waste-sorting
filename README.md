# Sort It - Waste Classification App

## Overview

A web application that helps users determine how to properly dispose of items by analyzing photos. Uses Google Gemini's vision model (via Vercel AI SDK) to classify items into Recycle, Landfill, Compost, or Special categories.

## Tech Stack

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **AI**: Vercel AI SDK with Google Gemini for image classification
- **Observability**: Langfuse for AI tracing and monitoring
- **Storage**: Local storage for scan history (last 20 items)

## Project Structure

```
/
├── components/          # React components
│   ├── CategoryBadge.tsx      # Color-coded disposal category badge
│   ├── ConfidenceMeter.tsx    # Visual confidence indicator
│   ├── ImageCapture.tsx       # Camera/upload buttons
│   └── ResultCard.tsx         # Full result display
├── lib/                 # Utility libraries
│   ├── ai.ts                 # Vercel AI SDK integration with validation
│   └── storage.ts            # Local storage helpers
├── pages/               # Next.js pages
│   ├── api/
│   │   └── classify.ts       # POST /api/classify - image classification
│   ├── _app.tsx
│   ├── history.tsx           # Scan history page
│   └── index.tsx             # Main app page
└── types/               # TypeScript types
    └── index.ts
```

## Features

- **Image Capture**: Camera or file upload for waste item photos
- **AI Classification**: Identifies disposal category with confidence score
- **Prep Steps**: Shows preparation instructions (rinse, remove lid, etc.)
- **Scan History**: Last 20 scans stored locally

## API Endpoints

### POST /api/classify

Classifies a waste item image.

- Body: `{ image: string (base64) }`
- Response: `{ success: boolean, data: ClassificationResult }`
- Rate limited: 10 requests per minute per IP

## Environment Variables

- `GOOGLE_GENERATIVE_AI_API_KEY` - Required for AI classification (Google Gemini)
- `LANGFUSE_PUBLIC_KEY` - Optional, for observability
- `LANGFUSE_SECRET_KEY` - Optional, for observability
- `LANGFUSE_BASEURL` - Optional, Langfuse host URL

## Running Locally

```bash
npm run dev   # Development on port 5000
npm run build # Production build
npm start     # Production server on port 5000
```
