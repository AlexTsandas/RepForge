# RepForge

RepForge is a fitness app for creating routines, logging workouts, and tracking strength progression. Planned AI features include routine generation, exercise validation, and workout reports comparing performance over the previous six weeks.

## Tech stack

- Frontend: React, Vite, JavaScript/JSX, React Router
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: Clerk
- Planned: Tailwind CSS, Axios, Upstash Redis rate limiting, Google Gemini

## Progress so far

- Express backend and MongoDB connection are working.
- React frontend is scaffolded with routing, a placeholder dashboard, and a working Clerk sign-in page.
- Clerk session tokens authenticate protected backend requests.
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

Routines contain ordered exercise references and planned set counts. Completed workouts store exercise-name snapshots and actual sets with weights and reps. An optional `routineId` records the source routine; workouts can also be created from scratch.

## Validation so far

Manual Postman checks confirmed authenticated routine CRUD, saving a completed workout from scratch, and retrieving workout history. Follow-up checks covered exercise creation and duplicate/missing-field errors, routine retrieval with invalid or missing IDs, rejecting a null exercise list during routine editing, and rejecting fractional workout reps. Controller syntax, imports, and all ten route mappings were checked after extraction.

These are targeted manual checks, not a comprehensive automated test suite. The routine limit uses a count-before-save check; simultaneous creation requests are not protected atomically. Additional malformed-input handling in routine creation remains to be completed.

## Next steps

Connect the dashboard UI to the backend, then build the routine pages and active-workout interface. Clerk-to-MongoDB profile synchronization, statistics and personal records, six-week reports and charts, rate limiting, AI features, and deployment remain planned.

The project is in early development. The frontend currently supports sign-in and a placeholder dashboard; the full workout workflow is not yet available through the UI.
