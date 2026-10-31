# RepForge

RepForge is a fitness app for creating routines, logging workouts, and tracking strength progression. Planned AI features include routine generation, exercise validation, and workout reports comparing performance over the previous six weeks.

## Tech stack

- Frontend: React, Vite, JavaScript/JSX, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: Clerk
- Planned: Tailwind CSS, Upstash Redis rate limiting, Google Gemini

## Progress so far

- Express backend and MongoDB connection are working.
- React frontend includes routing, a placeholder dashboard, and Clerk sign-in and sign-up pages.
- Clerk session tokens authenticate protected backend requests.
- App-level user synchronization sends an authenticated request when Clerk is ready and the user is signed in. The backend recognizes an existing MongoDB user or creates a profile from Clerk's name, primary email, image, and user ID.
- A shared Axios instance targets the local backend during development and the same website in production.
- Express allows the local frontend through CORS during development and serves the built frontend in production.
- Mongoose models are defined for users, exercises, routines, and completed workouts.
- Routes delegate to functions in a separate controller file.
- Routine creation, listing, detail retrieval, editing, and deletion are implemented.
- Completed workouts can be saved with actual weights and reps and retrieved through workout history.
- A dashboard endpoint returns the user's name and image URL (or null), the three most recent workouts, and completed-workout history.
- All controllers include error handling, with specific responses for schema validation, invalid IDs, and duplicate exercise names where applicable.
- Routine creation checks the 10-routine limit and exercise references. Routine edits also check submitted exercise references, and completed workouts check exercise references and ownership of an optional source routine.

## Current API

Paths have no `/api` prefix. All endpoints except `GET /exercises` require Clerk authentication.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/exercises` | List the exercise library |
| POST | `/exercises` | Create an exercise |
| GET | `/dashboard` | Retrieve profile and workout data |
| GET | `/myroutines` | List the signed-in user's routines |
| POST | `/myroutines` | Create a routine |
| GET | `/myroutines/:id` | Retrieve an owned routine |
| PATCH | `/myroutines/:id` | Update an owned routine |
| DELETE | `/myroutines/:id` | Delete an owned routine |
| GET | `/workoutshistory` | List completed workouts, newest first |
| POST | `/activeworkout` | Save a completed workout when Finish is clicked |
| POST | `/sync-users` | Find or create the authenticated user's MongoDB profile |

Routines contain ordered exercise references and planned set counts. Completed workouts store exercise-name snapshots and actual sets with weights and reps. An optional `routineId` records the source routine; workouts can also be created from scratch.

## Next steps

Build the dashboard's public welcome view and signed-in view, including profile information and recent workouts. Add access to the public exercise library, then build the routine pages and active-workout interface. Statistics and personal records, six-week reports and charts, rate limiting, AI features, and deployment remain planned.

The project is in early development. Authentication and the user-profile synchronization flow are implemented; the dashboard and workout interfaces are the next focus.
