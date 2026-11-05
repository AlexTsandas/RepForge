import { useAuth } from "@clerk/react";
import { useSearchParams } from "react-router";
import showdownImage from "@/assets/RepForge vs. HEVY_ Manga Showdown.png";
import Loading from "@/components/Loading.jsx";
import { Button, buttonVariants } from "@/components/ui/button.jsx";
import AddRoutine from "@/components/AddRoutine.jsx";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card.jsx";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add,
  ArrowRight01Icon,
  Calendar03Icon,
  ChartColumnIcon,
  ChartLineData01Icon,
  Clock01Icon,
  Dumbbell01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

const guestViews = {
  overview: {
    title: "Welcome to RepForge",
    description: "Build routines, log your workouts, and follow your progress.",
  },
  routines: {
    title: "Your routines, ready to train",
    description:
      "Organize your exercises into reusable routines and start your next workout.",
  },
  history: {
    title: "Follow your workout history",
    description:
      "Review completed workouts and see the weights and reps you recorded.",
  },
};

const Dashboard = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();

  if (!isLoaded) return <Loading />;

  if (isSignedIn) {
    return (
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10 md:py-12">

        <section>
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-orange-600">
            YOUR TRAINING SPACE
          </p>

          {/* TODO: Replace "athlete" with the signed-in user's display name. */}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, athlete.
          </h1>

          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Build your routine. Put in the work. Watch your progress.
          </p>
        </section>


        <section
          aria-label="Plan your next workout"
          className="grid gap-5 lg:grid-cols-[1.35fr_1fr]"
        >
          <Card className="flex min-w-0 flex-col rounded-2xl border-orange-200 bg-linear-to-br from-orange-50 via-amber-50/50 to-background py-6 shadow-sm">
            <CardHeader className="gap-4 px-6">
              <div className="flex size-11 items-center justify-center rounded-xl border border-orange-200 bg-background/80 text-orange-600">
                <HugeiconsIcon
                  icon={Dumbbell01Icon}
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <CardTitle className="text-2xl font-semibold tracking-tight">
                Build a routine you can progress with
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-6 text-sm leading-7 text-muted-foreground">
              <p>
                Choose training days you can maintain and build routines that
                cover your major muscle groups across the week.
              </p>

              <p>
                Keep your main exercises consistent for around six weeks so
                you can compare your performance. Record your sets, reps,
                and weights, then gradually build on them while maintaining
                good technique.
              </p>

              <p className="font-medium text-foreground/80">
                Use six weeks as a review point, and adjust when an exercise
                or workload does not suit you.
              </p>
            </CardContent>

            <CardFooter className="mt-auto px-6">
              {/* TODO: Navigate to the routine-builder page. */}
              <AddRoutine />
            </CardFooter>
          </Card>

          <Card className="flex min-w-0 flex-col rounded-2xl py-6 shadow-sm">
            <CardHeader className="gap-4 px-6">
              <div className="flex size-11 items-center justify-center rounded-xl border bg-muted/50">
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  size={24}
                  aria-hidden="true"
                />
              </div>

              <CardTitle className="text-2xl font-semibold tracking-tight">
                Need a flexible session?
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-6 text-sm leading-7 text-muted-foreground">
              <p>
                Start without a saved routine and choose your exercises as
                you go. Useful when travel, limited time, or unavailable
                equipment changes your plans.
              </p>

              <p>
                Keep repeatable routines as your foundation, and use an
                empty workout when you need flexibility.
              </p>
            </CardContent>

            <CardFooter className="mt-auto px-6">
              <Link
                to="/activeworkout"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-11 w-full cursor-pointer gap-2 rounded-lg px-5 text-sm sm:w-auto"
                )}
              >
                Start an empty workout
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={18}
                  aria-hidden="true"
                />
              </Link>
            </CardFooter>
          </Card>
        </section>


        <section
          aria-label="Training summary"
          className="grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              title: "Workouts this week",
              description: "Completed sessions · current week",
              icon: Calendar03Icon,
            },
            {
              title: "Sets logged this week",
              description: "Recorded sets · current week",
              icon: Dumbbell01Icon,
            },
            {
              title: "Total workouts",
              description: "Completed sessions · all time",
              icon: Clock01Icon,
            },
          ].map((stat) => (
            <Card key={stat.title} className="rounded-2xl py-5 shadow-sm">
              <CardContent className="px-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h2>

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <HugeiconsIcon
                      icon={stat.icon}
                      size={19}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* TODO: Display the corresponding backend-calculated count. */}
                <p
                  aria-label="Not available yet"
                  className="mt-4 text-4xl font-semibold tracking-tight"
                >
                  —
                </p>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>


        <section
          aria-label="Training analytics"
          className="grid gap-5 lg:grid-cols-2"
        >
          <Card className="min-w-0 rounded-2xl py-6 shadow-sm">
            <CardHeader className="gap-2 px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">
                  Exercise progress
                </CardTitle>

                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                  Weekly highlight
                </span>
              </div>

              <CardDescription className="text-sm leading-relaxed">
                A closer look at an exercise you are progressing in.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6">
              {/*
              TODO:
              1. Backend calculates progress from comparable logged sessions.
              2. Gemini selects the most impressive progressing exercise
                 this week from those calculated summaries.
              3. Render its actual session history in a shadcn line chart.
                 Show recorded weight with associated reps in the tooltip;
                 use reps for bodyweight exercises.
              4. Keep an empty state when there is insufficient history.
            */}
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border bg-background text-orange-600 shadow-sm">
                  <HugeiconsIcon
                    icon={ChartLineData01Icon}
                    size={28}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-base font-semibold">
                  Give your progress a starting point
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  Log the same exercise across multiple workouts to see
                  how your weights and reps develop.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0 rounded-2xl py-6 shadow-sm">
            <CardHeader className="gap-2 px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-lg font-semibold">
                  Weekly training
                </CardTitle>

                <span className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Last 6 weeks
                </span>
              </div>

              <CardDescription className="text-sm leading-relaxed">
                Your completed workouts each week, across every routine.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6">
              {/*
              TODO: Group completed workouts into the last six calendar
              weeks in backend code, then render their counts in a
              shadcn bar chart. Include workouts started from scratch.
            */}
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
                <div className="mb-5 flex size-14 items-center justify-center rounded-2xl border bg-background text-orange-600 shadow-sm">
                  <HugeiconsIcon
                    icon={ChartColumnIcon}
                    size={28}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-base font-semibold">
                  Build your training rhythm
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  Your completed sessions will appear here, making your
                  weekly consistency easy to follow.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section aria-label="Recent workouts">
          <Card className="rounded-2xl py-6 shadow-sm">
            <CardHeader className="gap-2 px-6">
              <CardTitle className="text-lg font-semibold">
                Recent workouts
              </CardTitle>

              <CardDescription className="text-sm">
                Your three most recent completed sessions.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6">
              {/*
              TODO: Fetch dashboard data only after authentication and
              successful user synchronization. Handle loading and errors.

              Replace this empty state with the latest three workouts:
              workout name, completion date, exercise count, and set count.
            */}
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center sm:flex-row sm:text-left">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-background text-muted-foreground">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={24}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h3 className="text-base font-semibold">
                    Make your next session count
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Finish a workout to add it to your history. Your latest
                    sessions will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  const preview = searchParams.get("preview");
  const content =
    preview === "routines" || preview === "history"
      ? guestViews[preview]
      : guestViews.overview;

  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-12 md:flex-row md:gap-16">
      <div className="w-full min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {content.title}
        </h1>

        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
          {content.description}
        </p>
      </div>

      {content === guestViews.overview && (
        <div className="relative isolate w-full max-w-xs shrink-0 md:max-w-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-linear-to-br from-amber-200/60 via-orange-300/40 to-transparent blur-3xl"
          />

          <img
            src={showdownImage}
            alt="Manga showdown between RepForge and HEVY"
            className="block h-auto w-full rounded-lg border border-black/80 shadow-[5px_5px_0_rgba(0,0,0,0.12)]"
          />
        </div>
      )}
    </main>
  );
};

export default Dashboard;
