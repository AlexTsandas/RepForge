import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { useState } from "react";
import WorkoutExercisePicker from "@/components/WorkoutExercisePicker.jsx";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "@clerk/react";
import api from "@/lib/axios";
import Loading from "@/components/Loading.jsx";
import { toast } from "@/components/ui/toast.jsx";
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



const ActiveWorkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const [saving, setSaving] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState(null);
  const [workout, setWorkout] = useState(() => {
    const routine = state?.routine;
    const catalog = state?.exerciseCatalog ?? [];
  
    return {
      name: routine?.name ?? "",
      routineId: routine?._id,
      sourceRoutineName: routine?.name ?? null,
      exercises: (routine?.exercises ?? []).map((savedExercise) => {
        const exercise = catalog.find(
          (item) => item._id === savedExercise.exerciseId
        );

        return {
          id: savedExercise.exerciseId,
          exerciseId: savedExercise.exerciseId,
          name: exercise?.name ?? "Unavailable exercise",
          imageUrl:
            exercise?.imageUrl ??
            "/images/Athletic Silhouette with Barbell.png",
          sets: Array.from({ length: savedExercise.sets }, () => ({
            id: crypto.randomUUID(),
            weight: "",
            reps: "",
          })),
        };
      }),
    };
  });
  const totalSets = workout.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0
  );

  const handleSetChange = (exerciseId, setId, field, value) => {
    setWorkout((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
            ...exercise,
            sets: exercise.sets.map((set) =>
              set.id === setId
                ? { ...set, [field]: value }
                : set
            ),
          }
          : exercise
      ),
    }));
  };

  const handleAddSet = (exerciseId) => {
    const newSet = {
      id: crypto.randomUUID(),
      weight: "",
      reps: "",
    };

    setWorkout((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? { ...exercise, sets: [...exercise.sets, newSet] }
          : exercise
      ),
    }));
  };

  const handleRemoveSet = (exerciseId, setId) => {
    setWorkout((current) => ({
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseId && exercise.sets.length > 1
          ? {
            ...exercise,
            sets: exercise.sets.filter((set) => set.id !== setId),
          }
          : exercise
      ),
    }));
  };

  const openExercisePicker = (exerciseId = null) => {
    setReplacingExerciseId(exerciseId);
    setPickerOpen(true);
  };

  const handleSelectExercise = (selectedExercise) => {
    const previousExercise = workout.exercises.find(
      (exercise) => exercise.id === replacingExerciseId
    );

    const newExercise = {
      id: selectedExercise._id,
      exerciseId: selectedExercise._id,
      name: selectedExercise.name,
      imageUrl:
        selectedExercise.imageUrl ??
        "/images/Athletic Silhouette with Barbell.png",
      sets: Array.from(
        { length: previousExercise?.sets.length ?? 1 },
        () => ({
          id: crypto.randomUUID(),
          weight: "",
          reps: "",
        })
      ),
    };

    setWorkout((current) => {
      if (
        current.exercises.some(
          (exercise) => exercise.exerciseId === selectedExercise._id
        )
      ) {
        return current;
      }

      return {
        ...current,
        exercises: replacingExerciseId
          ? current.exercises.map((exercise) =>
            exercise.id === replacingExerciseId ? newExercise : exercise
          )
          : [...current.exercises, newExercise],
      };
    });

    setPickerOpen(false);
    setReplacingExerciseId(null);
  };

  const handleRemoveExercise = (exerciseId) => {
    setWorkout((current) => ({
      ...current,
      exercises: current.exercises.filter(
        (exercise) => exercise.id !== exerciseId
      ),
    }));
  };

  const handleMoveExercise = (exerciseId, direction) => {
    setWorkout((current) => {
      const fromIndex = current.exercises.findIndex(
        (exercise) => exercise.id === exerciseId
      );
      const toIndex = fromIndex + direction;

      if (
        fromIndex === -1 ||
        toIndex < 0 ||
        toIndex >= current.exercises.length
      ) {
        return current;
      }

      const reordered = [...current.exercises];
      const [exercise] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, exercise);

      return { ...current, exercises: reordered };
    });
  };

  const handleFinishWorkout = async () => {
    if (saving) return;

    if (!workout.name.trim() || workout.exercises.length === 0) {
      toast.add({
        type: "error",
        title: "Workout incomplete",
        description: "Enter a workout name and add at least one exercise.",
      });
      return;
    }

    const hasInvalidSets = workout.exercises.some(
      (exercise) =>
        exercise.sets.length === 0 ||
        exercise.sets.some((set) => {
          const weight = Number(set.weight);
          const reps = Number(set.reps);

          return (
            set.weight === "" ||
            set.reps === "" ||
            !Number.isFinite(weight) ||
            weight < 0 ||
            !Number.isInteger(reps) ||
            reps < 0
          );
        })
    );

    if (hasInvalidSets) {
      toast.add({
        type: "error",
        title: "Check your sets",
        description:
          "Fill every weight and reps field, or remove unused sets. Use 0 for bodyweight with no added weight.",
      });
      return;
    }

    const payload = {
      name: workout.name.trim(),
      exercises: workout.exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        sets: exercise.sets.map((set) => ({
          weight: Number(set.weight),
          reps: Number(set.reps),
        })),
      })),
    };

    if (workout.routineId) {
      payload.routineId = workout.routineId;
    }

    setSaving(true);

    const toastId = toast.add({
      type: "loading",
      title: "Saving workout",
      description: "Your completed session is being saved.",
      timeout: 0,
    });

    try {
      const token = await getToken();

      await api.post("/activeworkout", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.update(toastId, {
        type: "success",
        title: "Workout completed",
        description: `${payload.name} has been saved to your history.`,
        timeout: 5000,
      });

      setWorkout({
        name: "",
        sourceRoutineName: null,
        exercises: [],
      });

      navigate("/workoutshistory", { replace: true });
    } catch (error) {
      console.error("Could not save workout:", error);

      toast.update(toastId, {
        type: "error",
        title: "Could not save workout",
        description:
          error.response?.data?.error ||
          "Your results are still here. Please try again.",
        timeout: 6000,
      });
    } finally {
      setSaving(false);
    }
  };
  if (!isLoaded) return <Loading />;

  if (!isSignedIn) {
    return <p className="p-6">Please sign in to start a workout.</p>;
  }
  return (
    <main className="mx-auto max-w-4xl space-y-7 px-4 pb-40 pt-8 sm:px-6 sm:pt-12" inert={saving}
      aria-busy={saving}>
      <section>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-orange-600">
            YOUR TRAINING SESSION
          </p>

          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-medium text-orange-700">
            <HugeiconsIcon
              icon={Dumbbell01Icon}
              size={16}
              aria-hidden="true"
            />
            {workout.sourceRoutineName
              ? `From ${workout.sourceRoutineName}`
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

          <Input
            id="active-workout-name"
            type="text"
            value={workout.name}
            onChange={(event) =>
              setWorkout((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
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
            {workout.exercises.length} exercises
          </span>
        </div>

        {workout.exercises.length > 0 ? (
          <>
            {workout.exercises.map((exercise, exerciseIndex) => (
              <Card
                key={exercise.id}
                className="min-w-0 gap-3 rounded-2xl py-4 shadow-sm"
              >
                <CardHeader className="gap-4 px-4 sm:px-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* TODO: Use the exercise library's actual imageUrl. */}
                    <img
                      src={exercise.imageUrl}
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
                        <DropdownMenuItem
                          onClick={() => openExercisePicker(exercise.id)}
                          className="cursor-pointer gap-2"
                        >
                          <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={17} aria-hidden="true" />
                          Replace exercise
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleMoveExercise(exercise.id, -1)}
                          disabled={exerciseIndex === 0}
                          className="cursor-pointer gap-2"
                        >
                          <HugeiconsIcon icon={ArrowUp01Icon} size={17} aria-hidden="true" />
                          Move up
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => handleMoveExercise(exercise.id, 1)}
                          disabled={exerciseIndex === workout.exercises.length - 1}
                          className="cursor-pointer gap-2"
                        >
                          <HugeiconsIcon icon={ArrowDown01Icon} size={17} aria-hidden="true" />
                          Move down
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleRemoveExercise(exercise.id)}
                          variant="destructive"
                          className="cursor-pointer gap-2"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={17} aria-hidden="true" />
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
                              value={set.weight}
                              onChange={(event) =>
                                handleSetChange(
                                  exercise.id,
                                  set.id,
                                  "weight",
                                  event.target.value
                                )
                              }
                            />
                          </td>

                          <td className="px-2 py-3">

                            <Input
                              value={set.reps}
                              onChange={(event) =>
                                handleSetChange(
                                  exercise.id,
                                  set.id,
                                  "reps",
                                  event.target.value
                                )
                              }
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

                            <Button
                              onClick={() => handleRemoveSet(exercise.id, set.id)}
                              disabled={exercise.sets.length <= 1}
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
                    onClick={() => handleAddSet(exercise.id)}
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
              onClick={() => openExercisePicker()}
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
                onClick={() => openExercisePicker()}
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
            <p className="text-sm font-semibold">
              {workout.exercises.length} exercises
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
              onClick={() => setCancelOpen(true)}
              disabled={saving}
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

            <Button
              onClick={handleFinishWorkout}
              disabled={saving}
              type="button"
              className="h-11 flex-1 cursor-pointer gap-2 rounded-lg bg-orange-600 px-4 text-sm text-white hover:bg-orange-700 sm:flex-none"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                size={18}
                aria-hidden="true"
              />
              {saving ? "Saving workout..." : "Finish workout"}
            </Button>
          </div>
        </div>
      </footer>
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Discard this workout?</DialogTitle>
            <DialogDescription>
              Your entered results will be discarded. Nothing will be saved
              to your workout history.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancelOpen(false)}
            >
              Keep training
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setCancelOpen(false);
                navigate(workout.routineId ? "/myroutines" : "/", {
                  replace: true,
                });
              }}
            >
              Discard workout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {pickerOpen && (
        <WorkoutExercisePicker
          selectedIds={workout.exercises.map((exercise) => exercise.exerciseId)}
          replacing={Boolean(replacingExerciseId)}
          onSelect={handleSelectExercise}
          onClose={() => {
            setPickerOpen(false);
            setReplacingExerciseId(null);
          }}
        />
      )}
    </main>
  );
};

export default ActiveWorkout;