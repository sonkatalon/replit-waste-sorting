# Sort It - Waste Classification App

## Overview
A web application that helps users determine how to properly dispose of items by analyzing photos. Uses OpenAI's vision model to classify items into Recycle, Landfill, Compost, or Special categories.

## Tech Stack
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **AI**: OpenAI GPT-5 Vision API for image classification
- **Storage**: Local storage for scan history (last 20 items), file-based server storage for feedback

## Project Structure
```
/
├── components/          # React components
│   ├── CategoryBadge.tsx      # Color-coded disposal category badge
│   ├── ConfidenceMeter.tsx    # Visual confidence indicator
│   ├── ImageCapture.tsx       # Camera/upload buttons
│   ├── RegionSelector.tsx     # Location selector dropdown
│   └── ResultCard.tsx         # Full result display with feedback
├── lib/                 # Utility libraries
│   ├── openai.ts             # OpenAI API integration with validation
│   └── storage.ts            # Local storage helpers
├── pages/               # Next.js pages
│   ├── api/
│   │   ├── classify.ts       # POST /api/classify - image classification
│   │   └── feedback.ts       # POST /api/feedback - user corrections
│   ├── _app.tsx
│   ├── history.tsx           # Scan history page
│   └── index.tsx             # Main app page
├── types/               # TypeScript types
│   └── index.ts
└── data/                # Server-side data (created at runtime)
    └── feedback.json         # User feedback records
```

## Features
- **Image Capture**: Camera or file upload for waste item photos
- **AI Classification**: Identifies disposal category with confidence score
- **Prep Steps**: Shows preparation instructions (rinse, remove lid, etc.)
- **Regional Context**: Adjusts recommendations based on selected location
- **Scan History**: Last 20 scans stored locally
- **Feedback System**: Users can report incorrect classifications

## API Endpoints

### POST /api/classify
Classifies a waste item image.
- Body: `{ image: string (base64), region: string }`
- Response: `{ success: boolean, data: ClassificationResult }`
- Rate limited: 10 requests per minute per IP

### POST /api/feedback
Records user feedback on classification accuracy.
- Body: `{ scanId: string, isCorrect: boolean, correctCategory?: string }`
- Response: `{ success: boolean, data: { message: string } }`

## Environment Variables
- `OPENAI_API_KEY` - Required for AI classification

## Running Locally
```bash
npm run dev   # Development on port 5000
npm run build # Production build
npm start     # Production server on port 5000
```
