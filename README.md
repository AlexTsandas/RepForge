# RepForge

RepForge is a fitness app for creating routines, logging workouts, and tracking strength progression. Planned AI features include routine generation, exercise validation, and workout reports comparing performance over the previous six weeks.

## Tech stack

- Frontend: React, Vite, JavaScript/JSX, React Router, Axios, Tailwind CSS 4, shadcn/ui (Base UI)
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Authentication: Clerk
- Planned: Upstash Redis rate limiting, Google Gemini

## Progress so far

- Express backend and MongoDB connection are working.
- React frontend includes routing, a public welcome page, and Clerk sign-in and sign-up pages. The signed-in dashboard is currently a placeholder.
- Tailwind CSS 4 and shadcn/ui are configured for JavaScript/JSX, with `@/` imports pointing to `src`.
- A shared header uses a dragon background and navigation across signed-in and signed-out views. Guests see sign-in and sign-up buttons; signed-in users get an avatar menu for Clerk profile settings and sign-out.
- Guests can open routine and workout-history previews from the header through query parameters on the home page.
- The public exercise library at `/exercises` is linked from the header and loads backend data through the shared Axios client, with a reusable orange loading spinner and an error message if loading fails.
- Case-insensitive exercise-name search combines with clearable equipment and body-part filters. Equipment groups cover bodyweight, machines, and free weights (barbells and dumbbells); nine body parts are available, with a matching-exercise count and an empty-results message.
- The responsive exercise grid shows only each exercise's image and name. Images load lazily and fit inside the cards without cropping.
- An add-exercise dialog collects a name, one of four equipment types, and one of nine body parts. It enables Validate when all fields are filled, supports Cancel, and resets when closed. Validate currently shows an informational toast that validation is unavailable; validation and saving are planned. A shared toaster is mounted at app level.
- The welcome page pairs introductory text with an uncropped manga illustration, beside the text on larger screens and below it on smaller screens. The image has a warm glow, black border, rounded corners, and offset shadow.
- The browser tab uses the RepForge title and a custom barbell favicon.
- Clerk session tokens authenticate protected backend requests.
- App-level user synchronization sends an authenticated request when Clerk is ready and the user is signed in. The backend recognizes an existing MongoDB user or creates a profile from Clerk's name, primary email, image, and user ID.
- A shared Axios instance targets the local backend during development and the same website in production.
- Express allows the local frontend through CORS during development and serves the built frontend in production.
- Mongoose models are defined for users, exercises, routines, and completed workouts. Exercises require a name, equipment, and body part, with an optional image URL.
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
| POST | `/exercises` | Direct exercise creation handler; body-part support pending |
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

Connect the signed-in dashboard to backend profile and recent-workout data, and build routine pages, the workout-history interface, and the active-workout interface. Complete exercise creation by updating backend body-part handling and connecting Gemini validation, photo matching, saving, result notifications, and library refresh. Statistics and personal records, six-week reports and charts, AI routine generation, rate limiting, and deployment remain planned.

Authentication, user-profile synchronization, the public welcome experience, and exercise browsing are implemented. Remaining work includes exercise-creation integration and the signed-in workout interfaces.
