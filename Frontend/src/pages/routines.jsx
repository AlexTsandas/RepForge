import { Button } from "@/components/ui/button.jsx";
import GenerateRoutine from "@/components/GenerateRoutine.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card.jsx";
import AddRoutine from "@/components/AddRoutine.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.jsx";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  Delete02Icon,
  Dumbbell01Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  PlayIcon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

// Temporary design examples.
// TODO: Replace these with the authenticated user's saved routines.
// Exercise names will need to be matched from the exercise library,
// because saved routines contain exercise references and set counts.
const routinePreviews = [
  {
    id: "preview-push",
    name: "Push Day",
    exerciseCount: 3,
    totalSets: 10,
    exercises: [
      { name: "Barbell Bench Press", sets: 4 },
      { name: "Incline Dumbbell Bench Press", sets: 3 },
      { name: "Lateral Raise", sets: 3 },
    ],
  },
  {
    id: "preview-pull",
    name: "Pull Day",
    exerciseCount: 3,
    totalSets: 10,
    exercises: [
      { name: "Lat Pulldown", sets: 4 },
      { name: "Seated Cable Row", sets: 3 },
      { name: "Dumbbell Curl", sets: 3 },
    ],
  },
  {
    id: "preview-legs",
    name: "Leg Day",
    exerciseCount: 3,
    totalSets: 10,
    exercises: [
      { name: "Barbell Squat", sets: 4 },
      { name: "Romanian Deadlift", sets: 3 },
      { name: "Leg Curl", sets: 3 },
    ],
  },
];

const Routines = () => {
  /*
    TODO:
    - Wait for Clerk to load and require sign-in.
    - Fetch GET /myroutines with the Clerk session token.
    - Handle loading, request errors, and empty results.
    - Read mode=create to show AddRoutine in the main content area.
    - Reuse the builder with existing values when editing.
  */

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-6 py-10 md:py-12">
      <section>
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-orange-600">
          YOUR TRAINING BLUEPRINT
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          My Routines
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Build the sessions you want to come back to. Keep your exercises
          organized and your next training day ready.
        </p>
      </section>

      <section
        aria-label="Create a routine"
        className="grid gap-5 lg:grid-cols-2"
      >
        <Card className="flex min-w-0 flex-col rounded-2xl border-orange-200 bg-linear-to-br from-orange-50 via-amber-50/50 to-background py-6 shadow-sm">
          <CardHeader className="gap-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-orange-200 bg-background/80 text-orange-600">
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <span className="text-xs font-semibold tracking-widest text-orange-700">
                BUILT BY YOU
              </span>
            </div>

            <CardTitle className="text-2xl font-semibold tracking-tight">
              <h2>Your exercises. Your structure.</h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-6">
            <p className="text-sm leading-7 text-muted-foreground">
              Choose exercises from the library, arrange their order, and
              set your planned sets. Build a routine around the way you
              like to train.
            </p>
          </CardContent>

          <CardFooter className="mt-auto flex-col items-start gap-3 px-6">
            {/* TODO: Show AddRoutine in the page's main content area. */}
            <AddRoutine />

            <p className="text-xs leading-relaxed text-muted-foreground">
              Start from scratch and make it yours.
            </p>
          </CardFooter>
        </Card>

        <Card className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-linear-to-br from-zinc-950 via-zinc-900 to-stone-900 py-6 text-white shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-orange-500/15 blur-3xl"
          />

          <CardHeader className="relative gap-4 px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-orange-300">
                <HugeiconsIcon
                  icon={AiMagicIcon}
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <span className="text-xs font-semibold tracking-widest text-orange-300">
                YOUR AI COACH
              </span>
            </div>

            <CardTitle className="text-2xl font-semibold tracking-tight text-white">
              <h2>A little guidance. A plan for you.</h2>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative px-6">
            <p className="text-sm leading-7 text-zinc-300">
              Turn your goals, experience, available equipment, and
              training days into a suggested routine. Review the exercises
              and adjust the plan before making it your own.
            </p>
          </CardContent>

          <CardFooter className="relative mt-auto flex-col items-start gap-3 px-6">
            {/*
              TODO:
              - Open the AI routine-generation form.
              - Collect goals, experience, equipment, and training days.
              - Request suggestions through a future backend endpoint.
              - Handle generation loading and errors.
              - Show an editable preview before saving.
              - Save only after explicit confirmation.
              - Apply the same 10-routine limit as manual creation.
            */}
            <GenerateRoutine />

            <p className="text-xs leading-relaxed text-zinc-400">
              Suggested by AI. Reviewed and chosen by you.
            </p>
          </CardFooter>
        </Card>
      </section>

      {/* Saved routines */}
      <section aria-labelledby="saved-routines-heading" className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="saved-routines-heading"
              className="text-xl font-semibold tracking-tight"
            >
              Your saved routines
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Pick a session and get to work, or refine your plan.
            </p>
          </div>

          {/* TODO: Display the actual number of saved routines. */}
          <span className="rounded-full border bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground">
            {routinePreviews.length} / 10 routines
          </span>
        </div>

        {/*
          Design preview only:
          Replace routinePreviews with real data later.
          Setting the sample array to [] previews the empty layout below.
        */}
        {routinePreviews.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {routinePreviews.map((routine) => (
              <Card
                key={routine.id}
                className="flex min-w-0 flex-col rounded-2xl py-5 shadow-sm"
              >
                <CardHeader className="gap-4 px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600">
                      <HugeiconsIcon
                        icon={Dumbbell01Icon}
                        size={22}
                        aria-hidden="true"
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${routine.name}`}
                        className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <HugeiconsIcon
                          icon={MoreHorizontalIcon}
                          size={22}
                          aria-hidden="true"
                        />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-44">
                        {/* TODO: Open AddRoutine with this routine's data. */}
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <HugeiconsIcon
                            icon={Edit02Icon}
                            size={17}
                            aria-hidden="true"
                          />
                          Edit routine
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {/*
                          TODO: Ask for confirmation before deleting.
                          Send authenticated DELETE /myroutines/:id,
                          then refresh the list after success.
                        */}
                        <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={17}
                            aria-hidden="true"
                          />
                          Delete routine
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-xl font-semibold tracking-tight">
                      <h3 className="break-words">{routine.name}</h3>
                    </CardTitle>

                    {/* TODO: Derive these counts from the saved exercises. */}
                    <CardDescription className="text-sm">
                      {routine.exerciseCount} exercises
                      <span aria-hidden="true" className="mx-2">
                        ·
                      </span>
                      {routine.totalSets} planned sets
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-5">
                  {/*
                    TODO: Resolve exercise names from their exerciseIds.
                    Keep the routine's saved exercise order.
                    For long routines, show a short preview and a
                    "View routine" action for the complete list.
                  */}
                  <ol className="space-y-3">
                    {routine.exercises.map((exercise, index) => (
                      <li
                        key={exercise.name}
                        className="flex items-center gap-3"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground"
                        >
                          {index + 1}
                        </span>

                        <span className="min-w-0 flex-1 text-sm leading-6">
                          {exercise.name}
                        </span>

                        <span className="shrink-0 text-xs text-muted-foreground">
                          {exercise.sets} sets
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>

                <CardFooter className="mt-auto border-t px-5 pt-4">
                  {/*
                    TODO: Copy this routine's name, ordered exercises,
                    and planned set counts into a new active workout.
                    Open the shared active-workout page.
                    Starting a session must not modify the saved routine.
                  */}
                  <Button
                    type="button"
                    className="h-10 w-full cursor-pointer gap-2 rounded-lg bg-orange-600 px-4 text-sm text-white hover:bg-orange-700"
                  >
                    <HugeiconsIcon
                      icon={PlayIcon}
                      size={17}
                      aria-hidden="true"
                    />
                    Start workout
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
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
                Your next training day starts here
              </h3>

              <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
                Create your first routine and keep your exercises and
                planned sets ready for your next session.
              </p>

              {/* TODO: Show AddRoutine in the page's main content area. */}
              <Button
                type="button"
                className="mt-6 h-11 w-full cursor-pointer gap-2 rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 sm:w-auto"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  size={18}
                  aria-hidden="true"
                />
                Create your first routine
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
};

export default Routines;