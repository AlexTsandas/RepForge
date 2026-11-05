# RepForge

RepForge is a fitness app for creating routines, logging workouts, and tracking strength progression. Gemini validates new exercise submissions and helps recognize duplicate exercise names. AI routine generation and workout reports comparing performance over the previous six weeks are planned.

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
- Routine API for creating, listing, viewing, editing, and deleting owned routines, with exercise-reference checks and a 10-routine limit.
- Completed-workout API storing exercise-name snapshots and actual weights and reps, with history retrieval and dashboard profile/workout data.
- Signed-in dashboard and My Routines designs, including workout actions, summary and analytics areas, and sample routine cards.
- Manual and AI routine dialogs and a shared active-workout page design. Basic dialog and page navigation is connected; routine/workout screens use sample data while their data handling and persistence remain to be implemented.

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
| GET | `/myroutines/:id` | Retrieve an owned routine |
| PATCH | `/myroutines/:id` | Update an owned routine |
| DELETE | `/myroutines/:id` | Delete an owned routine |
| GET | `/workoutshistory` | List completed workouts, newest first |
| POST | `/activeworkout` | Save a completed workout with actual weights and reps |
| POST | `/sync-users` | Find or create the authenticated user's MongoDB profile |

Routines contain ordered exercise references and planned set counts. Completed workouts store exercise-name snapshots and actual sets with weights and reps. An optional `routineId` records the source routine; workouts can also be created from scratch.

## Next steps

- Design Workout History, with session summaries and read-only workout details.
- Connect manual routine creation and management, then logging and finishing workouts on the shared active-workout page.
- Connect dashboard statistics, recent workouts, weekly activity, and exercise-progress charts.
- Implement AI routine generation and review through the shared routine builder.

Personal records, six-week workout reports, rate limiting, and deployment remain planned.
