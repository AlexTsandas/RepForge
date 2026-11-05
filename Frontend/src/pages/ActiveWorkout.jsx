import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card.jsx";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.jsx";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  ArrowReloadHorizontalIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Delete02Icon,
  Dumbbell01Icon,
  MoreHorizontalIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

// TODO: Replace this sample with the current workout draft.
// From a routine: copy its name, exercise order, and planned set counts.
// Create blank weight/reps rows from those planned counts.
// From an empty workout: start with name "", sourceRoutineName null,
// and exercises [].
const workoutPreview = {
  name: "Push Day",
  sourceRoutineName: "Push Day",
  exercises: [
    {
      id: "preview-bench",
      name: "Barbell Bench Press",
      sets: [
        { id: "bench-set-1" },
        { id: "bench-set-2" },
        { id: "bench-set-3" },
        { id: "bench-set-4" },
      ],
    },
    {
      id: "preview-incline",
      name: "Incline Dumbbell Bench Press",
      sets: [
        { id: "incline-set-1" },
        { id: "incline-set-2" },
        { id: "incline-set-3" },
      ],
    },
    {
      id: "preview-lateral",
      name: "Lateral Raise",
      sets: [
        { id: "lateral-set-1" },
        { id: "lateral-set-2" },
        { id: "lateral-set-3" },
      ],
    },
  ],
};

const ActiveWorkout = () => {
  const totalSets = workoutPreview.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  /*
    TODO:
    - Require sign-in before loading private workout data.
    - Keep the active session in React state.
    - When started from a routine, load the owned routine and resolve
      its exercise references through the exercise library.
    - Keep the source routineId when applicable.
    - Session edits must not update the reusable routine.
  */

  return (
    <main className="mx-auto max-w-4xl space-y-7 px-4 pb-40 pt-8 sm:px-6 sm:pt-12">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-orange-600">
            YOUR TRAINING SESSION
          </p>

          {/* TODO: Display the actual session source. */}
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
            <HugeiconsIcon
              icon={Dumbbell01Icon}
              size={16}
              aria-hidden="true"
            />
            {workoutPreview.sourceRoutineName
              ? `From ${workoutPreview.sourceRoutineName}`
              : "Empty workout"}
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Active workout
        </h1>

        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Record your actual weights and reps, one set at a time.
        </p>
      </section>

      <Card className="rounded-2xl border-orange-200 bg-linear-to-br from-orange-50 via-amber-50/40 to-background py-6 shadow-sm">
        <CardContent className="space-y-3 px-4 sm:px-6">
          <label
            htmlFor="active-workout-name"
            className="block text-sm font-semibold"
          >
            Workout name
          </label>

          {/* TODO: Bind this input to the workout draft's name.
              Allow changing a copied routine name for this session. */}
          <Input
            id="active-workout-name"
            type="text"
            defaultValue={workoutPreview.name}
            placeholder="Give this workout a name"
            aria-describedby="active-workout-name-help"
            className="h-12 rounded-lg bg-background px-3 text-base font-medium md:text-base"
          />

          <p
            id="active-workout-name-help"
            className="text-xs leading-6 text-muted-foreground"
          >
            This name will appear in your workout history.
          </p>
        </CardContent>
      </Card>

      <section aria-labelledby="session-exercises-heading" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="session-exercises-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Your exercises
          </h2>

          {/* TODO: Derive this count from the actual session state. */}
          <span className="text-sm text-muted-foreground">
            {workoutPreview.exercises.length} exercises
          </span>
        </div>

        {workoutPreview.exercises.length > 0 ? (
          <>
            {workoutPreview.exercises.map((exercise, exerciseIndex) => (
              <Card
                key={exercise.id}
                className="min-w-0 gap-3 rounded-2xl py-4 shadow-sm"
              >
                <CardHeader className="gap-4 px-4 sm:px-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* TODO: Use the exercise library's actual imageUrl. */}
                    <img
                      src="/images/Athletic Silhouette with Barbell.png"
                      alt=""
                      loading="lazy"
                      className="size-24 shrink-0 rounded-xl border bg-white object-contain p-1 sm:size-28"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs font-medium text-orange-600">
                        Exercise {exerciseIndex + 1}
                      </p>

                      <CardTitle className="text-base font-semibold leading-6 sm:text-lg">
                        <h3 className="break-words">{exercise.name}</h3>
                      </CardTitle>

                      <CardDescription className="mt-1 text-xs">
                        {exercise.sets.length} sets
                      </CardDescription>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${exercise.name}`}
                        className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <HugeiconsIcon
                          icon={MoreHorizontalIcon}
                          size={22}
                          aria-hidden="true"
                        />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-48">
                        {/*
                          TODO: Open the exercise picker in replacement mode.
                          Use search, equipment, and body-part filters.
                          Decide how to handle already-entered results
                          before replacing an exercise.
                        */}
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <HugeiconsIcon
                            icon={ArrowReloadHorizontalIcon}
                            size={17}
                            aria-hidden="true"
                          />
                          Replace exercise
                        </DropdownMenuItem>

                        {/* TODO: Move the whole exercise entry, including
                            its entered sets, one position up. */}
                        <DropdownMenuItem
                          disabled={exerciseIndex === 0}
                          className="cursor-pointer gap-2"
                        >
                          <HugeiconsIcon
                            icon={ArrowUp01Icon}
                            size={17}
                            aria-hidden="true"
                          />
                          Move up
                        </DropdownMenuItem>

                        {/* TODO: Move the whole exercise entry, including
                            its entered sets, one position down. */}
                        <DropdownMenuItem
                          disabled={
                            exerciseIndex ===
                            workoutPreview.exercises.length - 1
                          }
                          className="cursor-pointer gap-2"
                        >
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={17}
                            aria-hidden="true"
                          />
                          Move down
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/* TODO: Remove this exercise from the session.
                            Account for any entered results before discarding.
                            Keep the source routine and catalog unchanged. */}
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer gap-2"
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={17}
                            aria-hidden="true"
                          />
                          Remove exercise
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="px-4 sm:px-6">
                  <table className="w-full table-fixed text-sm">
                    <caption className="sr-only">
                      Weights and reps for {exercise.name}
                    </caption>

                    <colgroup>
                      <col className="w-10 sm:w-14" />
                      <col />
                      <col />
                      <col className="w-10 sm:w-12" />
                    </colgroup>

                    <thead>
                      <tr className="border-b text-xs text-muted-foreground">
                        <th
                          scope="col"
                          className="pb-3 text-left font-medium"
                        >
                          Set
                        </th>

                        {/* TODO: Agree on a consistent weight unit
                            before adding unit labels to the app. */}
                        <th
                          scope="col"
                          className="px-2 pb-3 text-center font-medium"
                        >
                          Weight
                        </th>

                        <th
                          scope="col"
                          className="px-2 pb-3 text-center font-medium"
                        >
                          Reps
                        </th>

                        <th scope="col" className="pb-3">
                          <span className="sr-only">Remove set</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {exercise.sets.map((set, setIndex) => (
                        <tr key={set.id}>
                          <td className="py-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-muted/60 text-xs font-semibold">
                              {setIndex + 1}
                            </span>
                          </td>

                          <td className="px-2 py-3">
                            {/* TODO: Bind to this set's actual weight.
                                Preserve blank inputs until the user enters
                                a value; do not silently convert blank to 0. */}
                            <Input
                              type="number"
                              min={0}
                              step="any"
                              inputMode="decimal"
                              placeholder="—"
                              aria-label={`Weight for ${exercise.name}, set ${setIndex + 1}`}
                              className="h-10 rounded-lg bg-background px-2 text-center text-sm md:text-sm"
                            />
                          </td>

                          <td className="px-2 py-3">
                            {/* TODO: Bind to this set's actual reps.
                                Validate a nonnegative whole number. */}
                            <Input
                              type="number"
                              min={0}
                              step={1}
                              inputMode="numeric"
                              placeholder="—"
                              aria-label={`Reps for ${exercise.name}, set ${setIndex + 1}`}
                              className="h-10 rounded-lg bg-background px-2 text-center text-sm md:text-sm"
                            />
                          </td>

                          <td className="py-3 text-right">
                            {/* TODO: Remove this set from the session
                                and update the displayed set numbers. */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove set ${setIndex + 1} from ${exercise.name}`}
                              className="size-9 cursor-pointer rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              <HugeiconsIcon
                                icon={Delete02Icon}
                                size={17}
                                aria-hidden="true"
                              />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>

                <CardFooter className="border-t px-4 pt-4 sm:px-6">
                  {/* TODO: Append a new set with blank weight and reps.
                      Keep existing set entries and their values intact. */}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-full cursor-pointer gap-2 rounded-lg text-sm"
                  >
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      size={17}
                      aria-hidden="true"
                    />
                    Add set
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* TODO: Open the shared exercise picker and add the chosen
                exercise to this session with blank set inputs. */}
            <Button
              type="button"
              variant="outline"
              className="h-14 w-full cursor-pointer gap-2 rounded-xl border-dashed text-sm text-orange-700 hover:border-orange-300 hover:bg-orange-50"
            >
              <HugeiconsIcon
                icon={PlusSignIcon}
                size={19}
                aria-hidden="true"
              />
              Add another exercise
            </Button>
          </>
        ) : (
          <Card className="rounded-2xl py-8 shadow-sm">
            <CardContent className="flex flex-col items-center px-6 py-8 text-center">
              <div className="mb-5 flex size-16 items-center justify-center rounded-2xl border border-orange-200 bg-orange-50 text-orange-600">
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={30}
                  aria-hidden="true"
                />
              </div>

              <h3 className="text-xl font-semibold tracking-tight">
                Make this session yours
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                Add your first exercise, create your set rows, and start
                recording your weights and reps.
              </p>

              {/* TODO: Open the exercise picker with name search,
                  equipment filters, and body-part filters. */}
              <Button
                type="button"
                className="mt-6 h-11 w-full cursor-pointer gap-2 rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 sm:w-auto"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  size={18}
                  aria-hidden="true"
                />
                Add your first exercise
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            {/* TODO: Derive these totals from the actual workout draft. */}
            <p className="text-sm font-semibold">
              {workoutPreview.exercises.length} exercises
              <span aria-hidden="true" className="mx-2 text-muted-foreground">
                ·
              </span>
              {totalSets} sets
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Finish to save this session to your history.
            </p>
          </div>

          <div className="flex w-full gap-3 sm:w-auto">
            {/* TODO: Confirm discarding entered results, clear the
                session draft, and return to the appropriate entry screen.
                Cancelling must not save a completed workout. */}
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 cursor-pointer gap-2 rounded-lg px-4 text-sm sm:flex-none"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={17}
                aria-hidden="true"
              />
              Cancel workout
            </Button>

            {/*
              TODO:
              - Require a name, at least one exercise, and at least one
                valid set per exercise before saving.
              - Validate actual weight and reps against the workout schema.
              - Decide how unfinished set rows should be handled.
              - Send authenticated POST /activeworkout only on Finish.
              - Include the workout name, real exercise IDs, exercise-name
                snapshots, and actual sets: [{ weight, reps }].
              - Include the source routineId only for routine-based sessions.
              - Omit temporary UI-only row IDs from the request.
              - Prevent repeat submissions while saving.
              - Preserve the draft if saving fails.
              - Clear the draft only after the server confirms success.
              - Navigate to Workout History after successful completion.
            */}
            <Button
              type="button"
              className="h-11 flex-1 cursor-pointer gap-2 rounded-lg bg-orange-600 px-4 text-sm text-white hover:bg-orange-700 sm:flex-none"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={18}
                aria-hidden="true"
              />
              Finish workout
            </Button>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default ActiveWorkout;