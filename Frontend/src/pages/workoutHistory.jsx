import { Link } from "react-router";

import { Button, buttonVariants } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.jsx";
import { cn } from "@/lib/utils";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Dumbbell01Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

// TODO: Replace this design example with GET /workoutshistory results.
const workoutPreviews = [
  {
    _id: "preview-push-day",
    name: "Push Day",
    completedAt: "2026-11-05T18:30:00+02:00",
    exercises: [
      {
        _id: "preview-bench",
        name: "Barbell Bench Press",
        sets: [
          { weight: 70, reps: 10 },
          { weight: 70, reps: 10 },
          { weight: 70, reps: 9 },
          { weight: 70, reps: 8 },
        ],
      },
      {
        _id: "preview-incline",
        name: "Incline Dumbbell Bench Press",
        sets: [
          { weight: 24, reps: 12 },
          { weight: 24, reps: 10 },
          { weight: 24, reps: 10 },
        ],
      },
      {
        _id: "preview-lateral",
        name: "Lateral Raise",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
      {
        _id: "preview-pullover",
        name: "Pullover",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
      {
        _id: "preview-dips",
        name: "Dips",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
      {
        _id: "preview-pushdown",
        name: "Cable Tricep Pushdown",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
      {
        _id: "preview-rows",
        name: "rows",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
      {
        _id: "preview-t bar roww",
        name: "T-Bar Row",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
      {
        _id: "preview-bicep curl",
        name: "Bicep Curl",
        sets: [
          { weight: 8, reps: 15 },
          { weight: 8, reps: 15 },
          { weight: 8, reps: 12 },
        ],
      },
    ],
  },
];

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const WorkoutHistory = () => {
  /*
    TODO:
    - Wait for Clerk to load and require sign-in.
    - Fetch GET /workoutshistory with the Clerk session token.
    - Handle loading, request errors, and an empty history.
    - Keep the API's newest-first workout order.
    - Store the search input and filter by workout name.
    - Show a separate no-results message when a search has no matches.
    - Keep completed workout details read-only.
  */

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <section>
        <p className="text-xs font-semibold tracking-[0.2em] text-orange-600">
          YOUR TRAINING LOG
        </p>

        <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Workout History
            </h1>

            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              Every session counts. Look back at your exercises, weights,
              and reps.
            </p>
          </div>

          {/* TODO: Initialize a fresh, empty workout when starting here. */}
          <Link
            to="/activeworkout"
            className={cn(
              buttonVariants(),
              "h-11 w-full gap-2 rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 sm:w-auto"
            )}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={18}
              aria-hidden="true"
            />
            Start a workout
          </Link>
        </div>
      </section>

      {workoutPreviews.length > 0 ? (
        <>
          <section aria-label="Search workout history">
            <label htmlFor="workout-history-search" className="sr-only">
              Search workouts by name
            </label>

            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={19}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              {/* TODO: Bind this input to the workout-name search state. */}
              <Input
                id="workout-history-search"
                type="search"
                placeholder="Search your workouts..."
                className="h-12 rounded-xl bg-background pl-11 pr-4 text-sm md:text-sm"
              />
            </div>
          </section>

          <section
            aria-labelledby="completed-workouts-heading"
            className="space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id="completed-workouts-heading"
                className="text-lg font-semibold tracking-tight"
              >
                Completed workouts
              </h2>

              {/* TODO: Show the appropriate total when search is connected. */}
              <span className="text-sm text-muted-foreground">
                {workoutPreviews.length}{" "}
                {workoutPreviews.length === 1 ? "workout" : "workouts"}
              </span>
            </div>

            {workoutPreviews.map((workout) => {
              const totalSets = workout.exercises.reduce(
                (total, exercise) => total + exercise.sets.length,
                0
              );

              const completedDate = dateFormatter.format(
                new Date(workout.completedAt)
              );

              return (
                <Dialog key={workout._id}>
                  <Card className="rounded-2xl py-5 shadow-sm">
                    <CardContent className="px-5 sm:px-6">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                              <HugeiconsIcon
                                icon={CheckmarkCircle02Icon}
                                size={16}
                                aria-hidden="true"
                              />
                              Completed
                            </span>

                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                              <HugeiconsIcon
                                icon={Calendar03Icon}
                                size={16}
                                aria-hidden="true"
                              />
                              <time dateTime={workout.completedAt}>
                                {completedDate}
                              </time>
                            </span>
                          </div>

                          <h3 className="mt-3 break-words text-xl font-semibold tracking-tight">
                            {workout.name}
                          </h3>

                          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <HugeiconsIcon
                              icon={Dumbbell01Icon}
                              size={17}
                              aria-hidden="true"
                            />
                            {workout.exercises.length} exercises
                            <span aria-hidden="true">·</span>
                            {totalSets} sets
                          </p>
                        </div>

                        <DialogTrigger
                          render={
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 w-full cursor-pointer gap-2 rounded-lg px-4 text-sm sm:w-auto"
                            />
                          }
                        >
                          View workout
                          <HugeiconsIcon
                            icon={ArrowRight01Icon}
                            size={17}
                            aria-hidden="true"
                          />
                        </DialogTrigger>
                      </div>

                      <p className="mt-5 border-t pt-4 text-sm leading-6 text-muted-foreground">
                        {workout.exercises
                          .map((exercise) => exercise.name)
                          .join(" · ")}
                      </p>
                    </CardContent>
                  </Card>

                  <DialogContent className="max-h-[90svh] overflow-y-auto rounded-2xl p-5 sm:max-w-2xl sm:p-6">
                    <DialogHeader className="gap-3 pr-7">
                      <p className="text-xs font-semibold tracking-[0.2em] text-orange-600">
                        COMPLETED SESSION
                      </p>

                      <DialogTitle className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                        {workout.name}
                      </DialogTitle>

                      <DialogDescription className="text-sm leading-6">
                        {completedDate} · {workout.exercises.length} exercises
                        {" · "}
                        {totalSets} sets
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <section
                          key={exercise._id}
                          aria-labelledby={`history-${exercise._id}`}
                          className="rounded-xl border p-4"
                        >
                          <div className="mb-4 flex items-center gap-4">
                            {/* TODO: Resolve images through exerciseId and the
                                exercise library. Keep the saved name snapshot
                                and a fallback image if the catalog entry is
                                unavailable. */}
                            <img
                              src="/images/Athletic Silhouette with Barbell.png"
                              alt=""
                              loading="lazy"
                              className="size-20 shrink-0 rounded-xl border bg-white object-contain p-1 sm:size-24"
                            />

                            <div className="min-w-0">
                              <p className="text-xs font-medium text-orange-600">
                                Exercise {exerciseIndex + 1}
                              </p>

                              <h3
                                id={`history-${exercise._id}`}
                                className="mt-1 break-words text-base font-semibold leading-6"
                              >
                                {exercise.name}
                              </h3>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {exercise.sets.length} completed sets
                              </p>
                            </div>
                          </div>

                          <table className="w-full table-fixed text-sm">
                            <caption className="sr-only">
                              Recorded sets for {exercise.name}
                            </caption>

                            <thead>
                              <tr className="border-b text-xs text-muted-foreground">
                                <th
                                  scope="col"
                                  className="w-1/3 pb-3 text-left font-medium"
                                >
                                  Set
                                </th>

                                {/* TODO: Display the agreed weight unit
                                    consistently with ActiveWorkout. */}
                                <th
                                  scope="col"
                                  className="pb-3 text-center font-medium"
                                >
                                  Weight
                                </th>

                                <th
                                  scope="col"
                                  className="pb-3 text-center font-medium"
                                >
                                  Reps
                                </th>
                              </tr>
                            </thead>

                            <tbody className="divide-y">
                              {exercise.sets.map((set, setIndex) => (
                                <tr key={setIndex}>
                                  <th
                                    scope="row"
                                    className="py-3 text-left font-normal"
                                  >
                                    <span className="inline-flex size-8 items-center justify-center rounded-lg bg-muted/60 text-xs font-semibold">
                                      {setIndex + 1}
                                    </span>
                                  </th>

                                  <td className="py-3 text-center font-medium tabular-nums">
                                    {set.weight}
                                  </td>

                                  <td className="py-3 text-center font-medium tabular-nums">
                                    {set.reps}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </section>
                      ))}
                    </div>

                    <DialogFooter className="border-t pt-4">
                      <DialogClose
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 cursor-pointer rounded-lg px-5 text-sm"
                          />
                        }
                      >
                        Close
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              );
            })}
          </section>
        </>
      ) : (
        <Card className="rounded-2xl py-8 shadow-sm">
          <CardContent className="flex flex-col items-center px-6 py-6 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600">
              <HugeiconsIcon
                icon={Dumbbell01Icon}
                size={30}
                aria-hidden="true"
              />
            </div>

            <h2 className="text-xl font-semibold tracking-tight">
              Your first session starts the story
            </h2>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              Finish a workout and it will appear here, with every exercise,
              weight, and rep you recorded.
            </p>

            {/* TODO: Initialize a fresh, empty workout before navigation. */}
            <Link
              to="/activeworkout"
              className={cn(
                buttonVariants(),
                "mt-6 h-11 w-full gap-2 rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 sm:w-auto"
              )}
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={18}
                aria-hidden="true"
              />
              Start your first workout
            </Link>
          </CardContent>
        </Card>
      )}
    </main>
  );
};

export default WorkoutHistory;