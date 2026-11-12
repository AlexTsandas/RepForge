import { Link } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import api from "@/lib/axios";
import Loading from "@/components/Loading.jsx";
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



const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const WorkoutHistory = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [exerciseCatalog, setExerciseCatalog] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let active = true;

    const fetchHistory = async () => {
      setLoading(true);
      setError("");

      try {
        const token = await getToken();

        const [historyResponse, catalogResponse] = await Promise.all([
          api.get("/workoutshistory", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get("/exercises").catch(() => ({ data: [] })),
        ]);

        if (active) {
          setWorkouts(historyResponse.data);
          setExerciseCatalog(catalogResponse.data);
        }
      } catch (error) {
        if (active) {
          setError(
            error.response?.data?.error ||
            "Could not load workout history. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchHistory();

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, getToken]);

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (!isLoaded) return <Loading />;

  if (!isSignedIn) {
    return <p className="p-6">Please sign in to view your history.</p>;
  }

  if (loading) return <Loading message="Loading workout history..." />;

  if (error) {
    return <p role="alert" className="p-6 text-destructive">{error}</p>;
  }
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

      {workouts.length > 0 ? (
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

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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

              <span className="text-sm text-muted-foreground">
                {filteredWorkouts.length}{" "}
                {filteredWorkouts.length === 1 ? "workout" : "workouts"}
              </span>
            </div>
            {filteredWorkouts.length === 0 && (
              <p role="status" className="py-8 text-center text-muted-foreground">
                No workouts match your search.
              </p>
            )}
            {filteredWorkouts.map((workout) => {
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

                            <img
                              src={
                                exerciseCatalog.find(
                                  (item) => item._id === exercise.exerciseId
                                )?.imageUrl ?? "/images/Athletic Silhouette with Barbell.png"
                              }
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