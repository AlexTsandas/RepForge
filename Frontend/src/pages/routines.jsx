import { Button } from "@/components/ui/button.jsx";
import GenerateRoutine from "@/components/GenerateRoutine.jsx";
import Loading from "@/components/Loading.jsx";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";
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
import { useAuth } from "@clerk/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  Delete02Icon,
  Dumbbell01Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import api from "@/lib/axios";


const Routines = () => {
  const [routineToEdit, setRoutineToEdit] = useState(null);
  const [routineToDelete, setRoutineToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const handleRoutineCreated = (createdRoutine) => {
    setRoutine((current) => [createdRoutine, ...current]);
  };
  const handleRoutineUpdated = (updatedRoutine) => {
    setRoutine((current) =>
      current.map((item) =>
        item._id === updatedRoutine._id ? updatedRoutine : item
      )
    );
  };
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    const fetchExercises = async () => {
      try {
        const response = await api.get("/exercises");
        setExercises(response.data);
      } catch (error) {
        console.error(error.message);
        setError("Could not load exercises. Please try again.");
      }
    };
    const fetchRoutine = async () => {
      try {
        const token = await getToken();
        const response = await api.get("/myroutines", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoutine(response.data);
      } catch (error) {
        console.error(error.message);
        setError("Could not load routine. Please try again.");
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchExercises(), fetchRoutine()]);
      setLoading(false);
    };

    fetchData();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return <p className="p-6">Please sign in to view your routines.</p>;
  }

  if (loading) {
    return <Loading message="Loading your routines..." />;
  }

  if (error) {
    return <p role="alert" className="p-6 text-red-600">{error}</p>;
  }

  const handleDeleteRoutine = async (routineId) => {
    if (!routineId || deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      const token = await getToken();

      await api.delete(`/myroutines/${routineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRoutine((current) =>
        current.filter((item) => item._id !== routineId)
      );

      setRoutineToDelete(null);
    } catch (error) {
      console.error("Could not delete routine:", error);
      setDeleteError(
        error.response?.data?.error ||
        "Could not delete the routine. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };
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

            <AddRoutine
              key={routineToEdit?._id ?? "create"}
              routineToEdit={routineToEdit}
              exerciseCatalog={exercises}
              onRoutineCreated={handleRoutineCreated}
              onRoutineUpdated={handleRoutineUpdated}
              onEditClose={() => setRoutineToEdit(null)}
            />

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

            <GenerateRoutine onRoutineCreated={handleRoutineCreated} />

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
            {routine.length} / 10 routines
          </span>
        </div>

        {/*
          Design preview only:
          Replace routinePreviews with real data later.
          Setting the sample array to [] previews the empty layout below.
        */}
        {routine.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {routine.map((routine) => (
              <Card
                key={routine._id}
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
                        <DropdownMenuItem
                          className="cursor-pointer gap-2"
                          onClick={() => setRoutineToEdit(routine)}
                        >
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
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 text-destructive"
                          onClick={() => {
                            setDeleteError("");
                            setRoutineToDelete(routine);
                          }}
                        >
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
                      {routine.exercises.length} exercises
                      <span aria-hidden="true" className="mx-2">
                        ·
                      </span>
                      {routine.exercises.reduce((total, exercise) => total + exercise.sets, 0)} planned sets
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
                        key={exercise._id}
                        className="flex items-center gap-3"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground"
                        >
                          {index + 1}
                        </span>

                        <span className="min-w-0 flex-1 text-sm leading-6">
                          {exercises.find((item) => item._id === exercise.exerciseId)?.name
                            ?? "Unavailable exercise"}
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
                    nativeButton={false}
                    render={
                      <Link
                        to="/activeworkout"
                        state={{
                          routine,
                          exerciseCatalog: exercises,
                        }}
                      />
                    }
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

              <div className="mt-6 w-full sm:w-auto">
                <AddRoutine onRoutineCreated={handleRoutineCreated} />
              </div>
            </CardContent>
          </Card>
        )}
      </section>
      <Dialog
        open={Boolean(routineToDelete)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen && !deleting) {
            setRoutineToDelete(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={!deleting}
          className="p-6 sm:max-w-md"
        >
          <DialogHeader className="gap-3">
            <DialogTitle className="text-xl font-semibold">
              Delete routine?
            </DialogTitle>

            <DialogDescription className="text-sm leading-6">
              “{routineToDelete?.name}” will be removed from your saved routines.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <p role="alert" className="text-sm text-destructive">
              {deleteError}
            </p>
          )}

          <DialogFooter className="gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setRoutineToDelete(null)}
              className="h-10 cursor-pointer rounded-lg px-4 text-sm"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={deleting || !routineToDelete}
              onClick={() => handleDeleteRoutine(routineToDelete?._id)}
              className="h-10 cursor-pointer rounded-lg px-4 text-sm"
            >
              {deleting ? "Deleting..." : "Confirm delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Routines;