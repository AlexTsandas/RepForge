# RepForge

RepForge is a fitness app for creating routines, logging workouts, and tracking strength progression. Gemini validates exercise submissions, generates routines from training preferences, and selects an exercise highlight for the dashboard.

**[Try RepForge live](https://repforge-two-topaz.vercel.app/)**

The app is deployed, with a few small improvements still in progress.

## Tech stack

- Frontend: React, Vite, JavaScript/JSX, React Router, Axios, Tailwind CSS 4, shadcn/ui (Base UI)
- Charts: shadcn/ui charts and Recharts
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: Clerk
- AI: Google Gemini through the backend using `@google/genai`
- Request limits: express-rate-limit and a MongoDB-backed per-user AI quota
- Hosting: Vercel, with separate frontend and backend services in one project

## Progress so far

- Express and MongoDB foundation with models for users, exercises, routines, and completed workouts, plus separate routes and controllers.
- Clerk sign-in/sign-up, authenticated API requests, MongoDB profile initialization, and account controls.
- Branded React frontend with shared navigation, responsive layouts, reusable UI components, loading states, and global notifications.
- Public exercise library with image cards, name search, and equipment and body-part filters.
- Authenticated exercise creation with Gemini validation, name correction, alias-aware duplicate checks, and library refresh after saving.
- Routine management with manual and AI creation, a shared create/edit builder, deletion confirmation, exercise filtering and ordering, planned sets, and a 10-routine limit.
- Shared active-workout flow for routine-based and empty sessions, with exercise/set controls, actual weight and reps logging, completion notifications, and cancellation.
- Authenticated workout saving and live history with name search, catalog images, and read-only completed-session details.
- Live dashboard with weekly workout/set totals, all-time workout count, six-week activity charts, exercise progression, and recent sessions.
- Cached AI exercise highlights, graceful AI-unavailable feedback, and API/AI request limits.

A shared Axios client uses `/api` in deployment. Vercel routes API requests to Express and serves the Vite frontend separately, including direct page navigation. Controllers include validation and error handling.

Exercise catalog photos come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db). Newly validated custom exercises use a shared default image hosted with the frontend.

## Current API

All endpoints below use the `/api` prefix. Only `GET /api/exercises` is public; the remaining endpoints require Clerk authentication.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/exercises` | List the exercise library |
| POST | `/api/exercises` | Validate an exercise with Gemini, check duplicates, and save it with a default image |
| GET | `/api/dashboard` | Retrieve profile, workout statistics, six-week activity, recent sessions, and an exercise highlight |
| GET | `/api/myroutines` | List the signed-in user's routines |
| POST | `/api/myroutines` | Create a routine |
| POST | `/api/generate-routine` | Generate and save a routine from focus, volume, equipment, and description |
| GET | `/api/myroutines/:id` | Retrieve an owned routine |
| PATCH | `/api/myroutines/:id` | Update an owned routine |
| DELETE | `/api/myroutines/:id` | Delete an owned routine |
| GET | `/api/workoutshistory` | List completed workouts, newest first |
| POST | `/api/activeworkout` | Save a completed workout with actual weights and reps |
| POST | `/api/sync-users` | Find or create the authenticated user's MongoDB profile |

Routines contain ordered exercise references and planned set counts. AI generation uses the available exercise catalog and checks the returned routine before saving. Completed workouts store exercise-name snapshots and actual sets with weights and reps. An optional `routineId` records the source routine; workouts can also be created from scratch.

## Next steps

Finish the remaining small improvements and polish the deployed app. RepForge is still in development.
