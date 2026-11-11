# RepForge

RepForge is a fitness app for creating routines, logging workouts, and tracking strength progression. Gemini validates new exercise submissions, recognizes duplicate exercise names, and generates routines from training preferences. Dashboard analytics and six-week workout performance reports are planned.

## Tech stack

- Frontend: React, Vite, JavaScript/JSX, React Router, Axios, Tailwind CSS 4, shadcn/ui (Base UI)
- Charts: shadcn/ui charts and Recharts
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: Clerk
- AI: Google Gemini through the backend using `@google/genai`
- Planned: Upstash Redis rate limiting

## Progress so far

- Express and MongoDB foundation with models for users, exercises, routines, and completed workouts, plus separate routes and controllers.
- Clerk sign-in/sign-up, authenticated API requests, MongoDB profile initialization, and account controls.
- Branded React frontend with shared navigation, responsive layouts, reusable UI components, loading states, and global notifications.
- Public exercise library with image cards, name search, and equipment and body-part filters.
- Authenticated exercise creation with Gemini validation, name correction, alias-aware duplicate checks, and library refresh after saving.
- Routine management with manual and AI creation, a shared create/edit builder, deletion confirmation, exercise filtering and ordering, planned sets, and a 10-routine limit.
- Shared active-workout flow for routine-based and empty sessions, with exercise/set controls, actual weight and reps logging, completion notifications, and cancellation.
- Authenticated workout saving and live history with name search, catalog images, and read-only completed-session details.
- Signed-in dashboard design for training statistics, weekly activity, exercise progression, and recent workouts.

A shared Axios client, development CORS, and production static serving connect the frontend and backend. Controllers include validation and error handling.

Exercise catalog photos come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db). Newly validated custom exercises use a shared default image hosted with the frontend.

## Current API

Paths have no `/api` prefix. All endpoints except `GET /exercises` require Clerk authentication.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/exercises` | List the exercise library |
| POST | `/exercises` | Validate an exercise with Gemini, check duplicates, and save it with a default image |
| GET | `/dashboard` | Retrieve profile and workout data |
| GET | `/myroutines` | List the signed-in user's routines |
| POST | `/myroutines` | Create a routine |
| POST | `/generate-routine` | Generate and save a routine from focus, volume, equipment, and description |
| GET | `/myroutines/:id` | Retrieve an owned routine |
| PATCH | `/myroutines/:id` | Update an owned routine |
| DELETE | `/myroutines/:id` | Delete an owned routine |
| GET | `/workoutshistory` | List completed workouts, newest first |
| POST | `/activeworkout` | Save a completed workout with actual weights and reps |
| POST | `/sync-users` | Find or create the authenticated user's MongoDB profile |

Routines contain ordered exercise references and planned set counts. AI generation uses the available exercise catalog and checks the returned routine before saving. Completed workouts store exercise-name snapshots and actual sets with weights and reps. An optional `routineId` records the source routine; workouts can also be created from scratch.

## Next steps

- Connect dashboard statistics, recent workouts, and six-week activity charts to real data.
- Calculate comparable exercise progress and optionally select a weekly highlight with Gemini.

Personal records, six-week workout reports, rate limiting, and deployment remain planned.
