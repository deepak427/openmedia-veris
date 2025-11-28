# Veris Web App - Beautiful Fact-Checking Platform

## Overview
A stunning Next.js social media-style platform for viewing and submitting claims for fact-checking.

## Features

### 1. Feed Page (`/`)
- **Beautiful Card Layout**: Claims displayed in elegant cards
- **Color-Coded Status**:
  - ✅ Verified: Green
  - ❌ False: Red  
  - ⚠️ Disputed: Orange
  - ❓ Unverifiable: Gray
- **Rich Information**:
  - Claim text
  - Verification status with confidence score
  - Evidence summary
  - Source links
  - Category badges
  - Timestamp
- **Filters**: By status, category, date
- **Infinite Scroll**: Load more as you scroll

### 2. Submit Page (`/submit`)
- **Upload Options**:
  - Text input
  - Image upload
  - Video upload
- **Beautiful Upload UI**: Drag & drop with preview
- **Real-time Processing**: Shows progress
- **Result Display**: Immediate verification result

### 3. API Routes
- `/api/db` - Database queries (Neon PostgreSQL)
- `/api/claims` - Fetch claims with pagination
- `/api/submit` - Submit new claim to ADK agent

## Design System

### Colors (Psychology-Based)
- **Primary Blue**: Trust, credibility, professionalism
- **Success Green**: Truth, verified, positive
- **Danger Red**: False, warning, attention
- **Warning Orange**: Disputed, caution
- **Neutral Gray**: Unverifiable, neutral

### Typography
- **Font**: Inter (clean, professional, readable)
- **Hierarchy**: Clear heading sizes
- **Line Height**: Comfortable reading

### Components
- Cards with subtle shadows
- Smooth transitions
- Hover effects
- Loading states
- Empty states

## Installation

```bash
cd services/web-app
pnpm install
pnpm dev
```

## Environment Variables

```
NEON_PROJECT_ID=royal-glade-24471226
NEON_DATABASE_NAME=neondb
NEXT_PUBLIC_ADK_AGENT_URL=https://veris-ai-773695696004.us-central1.run.app
```

## File Structure

```
app/
├── layout.tsx          # Root layout with nav
├── page.tsx            # Feed page
├── submit/
│   └── page.tsx        # Submit claim page
├── api/
│   ├── db/route.ts     # Database API
│   ├── claims/route.ts # Claims API
│   └── submit/route.ts # Submit API
├── globals.css         # Tailwind + custom styles
components/
├── ClaimCard.tsx       # Beautiful claim card
├── StatusBadge.tsx     # Status badge component
├── UploadZone.tsx      # Drag & drop upload
└── LoadingSpinner.tsx  # Loading state
lib/
├── db.ts               # Database client
└── types.ts            # TypeScript types
```

## Next Steps

1. Install dependencies: `pnpm install`
2. Run development server: `pnpm dev`
3. Open http://localhost:3000
4. View feed of verified claims
5. Submit new claims for verification

## Features to Implement

The complete implementation requires creating:
- All component files
- API routes for database and ADK agent
- Beautiful UI with animations
- Image/video upload handling
- Real-time updates

Would you like me to continue creating the remaining files?
