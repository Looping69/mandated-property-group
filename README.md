<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Mandated Property Group

A premier real estate platform for elite listings, top-tier agent showcases, and AI-powered virtual tour generation.

## Project Structure

- **Frontend**: React + Vite (Root directory)
- **Backend**: Encore.dev (in `/backend`)

## Getting Started

### Frontend (UI)

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local)
3. Run the development server:
   `npm run dev`

### Backend (API)

The backend is built with [Encore.dev](https://encore.dev).

1. Install the Encore CLI:
   `npm i -g encore`
2. Navigate to the backend directory:
   `cd backend`
3. Run the backend:
   `encore run`

The backend includes:
- **Neon Database**: Automatically provisioned Postgres database for listings and agents.
- **Storage Bucket**: For storing property media and tour assets.
