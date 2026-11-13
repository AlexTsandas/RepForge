import { Link } from "react-router";
import { Button } from "@/components/ui/button.jsx";
import { Card, CardContent } from "@/components/ui/card.jsx";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Dumbbell01Icon,
} from "@hugeicons/core-free-icons";

const imageBase =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";

const fallbackImage = "/images/Athletic Silhouette with Barbell.png";

const sampleRoutines = [
  {
    name: "Push Day",
    focus: "Chest, shoulders & triceps",
    exercises: [
      {
        name: "Incline Dumbbell Bench Press",
        equipment: "Dumbbell",
        image: "Incline_Dumbbell_Press",
        sets: 3,
      },
      {
        name: "Cable Chest Fly",
        equipment: "Machine",
        image: "Cable_Crossover",
        sets: 3,
      },
      {
        name: "Dumbbell Shoulder Press",
        equipment: "Dumbbell",
        image: "Dumbbell_Shoulder_Press",
        sets: 3,
      },
    ],
  },
  {
    name: "Leg Day",
    focus: "Quads, hamstrings & glutes",
    exercises: [
      {
        name: "Leg Press",
        equipment: "Machine",
        image: "Leg_Press",
        sets: 3,
      },
      {
        name: "Leg Extension",
        equipment: "Machine",
        image: "Leg_Extensions",
        sets: 3,
      },
      {
        name: "Seated Leg Curl",
        equipment: "Machine",
        image: "Seated_Leg_Curl",
        sets: 3,
      },
    ],
  },
];

const sampleSets = [
  { weight: 20, reps: 12 },
  { weight: 22, reps: 10 },
  { weight: 22, reps: 9 },
];

function SampleCard({ routine, history = false, expanded = false, date }) {
  const totalSets = routine.exercises.reduce(
    (total, exercise) => total + exercise.sets,
    0
  );

  return (
    <Card className="gap-0 rounded-2xl bg-background py-0 shadow-sm">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-orange-200 bg-orange-50 text-orange-600">
            <HugeiconsIcon
              icon={history ? Calendar03Icon : Dumbbell01Icon}
              size={22}
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {routine.name}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              {history ? date : routine.focus}
            </p>
          </div>

          {history && (
            <span className="shrink-0 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-medium text-orange-700">
              Completed
            </span>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {routine.exercises.length} exercises
          {" · "}
          {totalSets} {history ? "logged sets" : "planned sets"}
        </p>

        {(!history || expanded) && (
          <div className="mt-4 divide-y border-t">
            {routine.exercises.map((exercise, index) => (
              <div key={exercise.name} className="py-3 last:pb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={`${imageBase}/${exercise.image}/0.jpg`}
                    alt=""
                    loading="lazy"
                    className="size-14 shrink-0 rounded-lg border bg-muted object-cover"
                    onError={(event) => {
                      const image = event.currentTarget;

                      if (image.dataset.fallback) return;

                      image.dataset.fallback = "true";
                      image.src = fallbackImage;
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-5">
                      {exercise.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {exercise.equipment}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs font-medium">
                    {exercise.sets} sets
                  </span>
                </div>

                {history && expanded && index === 0 && (
                  <div className="mt-4 overflow-hidden rounded-xl border">
                    <table className="w-full table-fixed text-center text-sm">
                      <caption className="sr-only">
                        Example recorded sets for {exercise.name}
                      </caption>

                      <thead className="bg-muted/40 text-xs text-muted-foreground">
                        <tr>
                          <th scope="col" className="px-3 py-2 font-medium">
                            Set
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            Weight
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            Reps
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {sampleSets.map((set, setIndex) => (
                          <tr key={setIndex}>
                            <th
                              scope="row"
                              className="px-3 py-2 font-normal text-muted-foreground"
                            >
                              {setIndex + 1}
                            </th>

                            <td className="px-3 py-2 font-medium tabular-nums">
                              {set.weight}
                            </td>

                            <td className="px-3 py-2 font-medium tabular-nums">
                              {set.reps}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function GuestFeaturePreview({ type }) {
  const isHistory = type === "history";

  const features = isHistory
    ? [
      {
        title: "Every set has a place",
        description:
          "Keep the exercises, weights, and reps from each completed workout together.",
      },
      {
        title: "Pick up where you left off",
        description:
          "Look back at previous sessions before planning your next one.",
      },
    ]
    : [
      {
        title: "Build it your way",
        description:
          "Choose your exercises, arrange their order, and set your planned sets.",
      },
      {
        title: "Let AI Coach help",
        description:
          "Generate a routine around your workout focus, volume, equipment, and preferences.",
      },
    ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-orange-700">
            <HugeiconsIcon
              icon={isHistory ? Calendar03Icon : Dumbbell01Icon}
              size={15}
              aria-hidden="true"
            />

            {isHistory ? "YOUR TRAINING STORY" : "YOUR NEXT TRAINING DAY"}
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {isHistory ? (
              <>
                Put in the work.
                <span className="mt-1 block text-orange-600">
                  Keep the record.
                </span>
              </>
            ) : (
              <>
                Your routine.
                <span className="mt-1 block text-orange-600">
                  Ready when you are.
                </span>
              </>
            )}
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            {isHistory
              ? "Your last session is your next starting point. Review completed workouts and see exactly what you lifted."
              : "Turn your favorite exercises into a plan you can use again. Build it yourself or get a starting point from AI Coach."}
          </p>

          <div className="mt-8 space-y-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border-l-2 border-orange-200 pl-4"
              >
                <h2 className="text-sm font-semibold">{feature.title}</h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              nativeButton={false}
              render={<Link to="/sign-up" />}
              className="h-12 w-full gap-2 rounded-xl bg-orange-600 px-6 text-sm font-semibold text-white hover:bg-orange-700 sm:w-auto"
            >
              {isHistory
                ? "Start tracking your workouts"
                : "Create your first routine"}

              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                aria-hidden="true"
              />
            </Button>

            <p className="mt-4 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section
          aria-label={
            isHistory ? "Workout history example" : "Saved routines example"
          }
          className="min-w-0 rounded-3xl border border-orange-100 bg-linear-to-br from-orange-50/80 via-background to-muted/40 p-4 sm:p-6"
        >
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">
              {isHistory ? "A look inside your history" : "A look inside your routines"}
            </h2>

            <span className="rounded-full border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">
              Example preview
            </span>
          </div>

          <div className="space-y-4">
            {sampleRoutines.map((routine, index) => (
              <SampleCard
                key={routine.name}
                routine={routine}
                history={isHistory}
                expanded={isHistory && index === 0}
                date={index === 0 ? "12 November 2026" : "10 November 2026"}
              />
            ))}
          </div>

          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
            Sample data. Your own{" "}
            {isHistory ? "completed workouts" : "saved routines"} will appear
            here after you sign in.
          </p>
        </section>
      </div>
    </main>
  );
}