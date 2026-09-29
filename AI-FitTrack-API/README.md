# FitTrack AI

A backend REST API for workout tracking and AI-assisted fitness recommendations.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs password hashing
- Google Gemini AI
- Postman for API testing

## Architecture
Client -> Express Server -> Routes -> JWT Middleware -> Controllers -> Services/Models -> MongoDB or Gemini AI -> JSON Response

## Setup

1. Install Node.js and MongoDB.
2. Open this project in VS Code.
3. Open a terminal in this folder and run:

```bash
npm install
```

4. Copy `.env.example` to `.env` and update the values.
5. Start MongoDB.
6. Run:

```bash
npm run dev
```

or:

```bash
npm start
```

Server: `http://localhost:5000`

## Main API Endpoints

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile`

### Workouts
- POST `/api/workouts`
- GET `/api/workouts`
- GET `/api/workouts/:id`
- PUT `/api/workouts/:id`
- DELETE `/api/workouts/:id`
- GET `/api/workouts/search?name=running&category=cardio&date=2026-09-27`

### AI
- POST `/api/ai/recommendation`
- POST `/api/ai/insights`

Protected endpoints require:

`Authorization: Bearer <JWT_TOKEN>`

## Notes
The source case study describes two primary collections: Users and Workouts. A single user can own many workout records.

Do not commit `.env` or API keys to source control.
