import { Button } from "@/components/ui/button.jsx";
import { useAuth } from "@clerk/react";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog.jsx";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox.jsx";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
  Dumbbell01Icon,
  PlusSignIcon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

const equipmentOptions = [
  "All equipment",
  "Bodyweight",
  "Machines",
  "Free weights",
];

const bodyPartOptions = [
  "All body parts",
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Core",
];

// TODO: Replace these design examples with GET /exercises data,
// including each exercise's actual _id and imageUrl.


// TODO: Replace this selected-exercise preview with local draft state.
// A new manual routine starts with an empty name and no exercises.




const RoutineFilter = ({ id, label, options, value, onValueChange, disabled = false }) => {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {/* TODO: Store the selected filter and apply it to the library. */}
      <Combobox
        items={options}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <ComboboxInput
          id={id}
          placeholder={options[0]}
          showClear
          className="h-10 w-full rounded-lg"
          disabled={disabled}
        />

        <ComboboxContent>
          <ComboboxEmpty>No options found.</ComboboxEmpty>

          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item}
                value={item}
                className="cursor-pointer"
              >
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

const AddRoutine = ({ onRoutineCreated }) => {  /*
    TODO: Reuse this builder for manual creation, editing a saved routine,
    and reviewing a generated routine by accepting initial draft values.
  */
  const [open, setOpen] = useState(false);
  const { isSignedIn, getToken } = useAuth();
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState(null);
  const [bodyPartFilter, setBodyPartFilter] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!isSignedIn || !open) return;
    const fetchExercises = async () => {
      try {
        const response = await api.get("/exercises");
        setExercises(response.data);
      } catch (error) {
        console.error(error.message);
        setError("Could not load exercises. Please try again.");
      }
    };

    fetchExercises();
  }, [isSignedIn, open]);






  const [routineName, setRoutineName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [draggedExerciseId, setDraggedExerciseId] = useState(null);
  const [exerciseDropTarget, setExerciseDropTarget] = useState(null);
  const navigate = useNavigate();

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      navigate("/myroutines");
    }
  };
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(normalizedSearch);

    const matchesEquipment =
      !equipmentFilter ||
      equipmentFilter === "All equipment" ||
      (equipmentFilter === "Bodyweight" &&
        exercise.equipment === "bodyweight") ||
      (equipmentFilter === "Machines" &&
        exercise.equipment === "machine") ||
      (equipmentFilter === "Free weights" &&
        ["barbell", "dumbbell"].includes(exercise.equipment));

    const matchesBodyPart =
      !bodyPartFilter ||
      bodyPartFilter === "All body parts" ||
      exercise.bodyPart?.toLowerCase() === bodyPartFilter.toLowerCase();

    return matchesSearch && matchesEquipment && matchesBodyPart;
  });

  const isExerciseSelected = (exerciseId) =>
    selectedExercises.some((exercise) => exercise._id === exerciseId);

  const handleExerciseClick = (exercise) => {
    setSelectedExercises((current) => {
      const alreadySelected = current.some(
        (item) => item._id === exercise._id
      );

      if (alreadySelected) {
        return current.filter((item) => item._id !== exercise._id);
      }

      if (current.length >= 15) return current;

      return [...current, { ...exercise, sets: 1 }];
    });
  };

  const handleSetsChange = (exerciseId, value) => {
    const sets = value === "" ? "" : Number(value);

    setSelectedExercises((current) =>
      current.map((exercise) =>
        exercise._id === exerciseId
          ? { ...exercise, sets }
          : exercise
      )
    );
  };

  const moveSelectedExercise = (exerciseId, toIndex) => {
    setSelectedExercises((current) => {
      const fromIndex = current.findIndex((exercise) => exercise._id === exerciseId);

      if (
        fromIndex === -1 ||
        toIndex < 0 ||
        toIndex >= current.length ||
        fromIndex === toIndex
      ) {
        return current;
      }

      const reordered = [...current];
      const [exercise] = reordered.splice(fromIndex, 1);
      reordered.splice(toIndex, 0, exercise);
      return reordered;
    });
  };

  const handleExerciseDragEnd = () => {
    setDraggedExerciseId(null);
    setExerciseDropTarget(null);
  };

  const handleExerciseDragStart = (event, exerciseId) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-repforge-exercise-id", exerciseId);

    const card = event.currentTarget.closest("li");
    if (card) {
      const bounds = card.getBoundingClientRect();
      event.dataTransfer.setDragImage(
        card,
        event.clientX - bounds.left,
        event.clientY - bounds.top
      );
    }

    setDraggedExerciseId(exerciseId);
  };

  const handleExerciseDragOver = (event, exerciseId) => {
    if (!draggedExerciseId) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (draggedExerciseId === exerciseId) {
      setExerciseDropTarget(null);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";

    setExerciseDropTarget((current) =>
      current?.exerciseId === exerciseId && current.position === position
        ? current
        : { exerciseId, position }
    );
  };

  const handleExerciseDrop = (event, exerciseId) => {
    if (!draggedExerciseId) return;

    event.preventDefault();

    const fromIndex = selectedExercises.findIndex(
      (exercise) => exercise._id === draggedExerciseId
    );
    const targetIndex = selectedExercises.findIndex(
      (exercise) => exercise._id === exerciseId
    );

    if (fromIndex !== -1 && targetIndex !== -1) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const placeAfter = event.clientY >= bounds.top + bounds.height / 2;
      let toIndex = targetIndex + (placeAfter ? 1 : 0);
      if (fromIndex < toIndex) toIndex -= 1;

      moveSelectedExercise(draggedExerciseId, toIndex);
    }

    handleExerciseDragEnd();
  };

  const handleSaveRoutine = async () => {
    if (saving) return;

    setError("");

    const name = routineName.trim();

    if (!isSignedIn) {
      setError("Please sign in to create a routine.");
      return;
    }

    if (!name) {
      setError("Please give your routine a name.");
      return;
    }

    if (selectedExercises.length < 1 || selectedExercises.length > 15) {
      setError("Choose between 1 and 15 exercises.");
      return;
    }

    const hasInvalidSets = selectedExercises.some(
      (exercise) =>
        !Number.isInteger(exercise.sets) || exercise.sets < 1
    );

    if (hasInvalidSets) {
      setError("Every exercise needs a whole-number set count of at least 1.");
      return;
    }

    const payload = {
      name,
      exercises: selectedExercises.map((exercise) => ({
        exerciseId: exercise._id,
        sets: exercise.sets,
      })),
    };

    setSaving(true);

    try {
      const token = await getToken();

      const response = await api.post("/myroutines", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onRoutineCreated?.(response.data);

      setRoutineName("");
      setSelectedExercises([]);
      setSearchTerm("");
      setEquipmentFilter(null);
      setBodyPartFilter(null);

      handleOpenChange(false);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.error ||
        "Could not save your routine. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const builderContent = (
    <section aria-labelledby="routine-builder-heading" className="space-y-6">
      <div>
        {/* TODO: Return to the saved-routines view. */}
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 mb-5 h-9 cursor-pointer gap-2 px-3 text-sm text-muted-foreground"
          onClick={() => handleOpenChange(false)}
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            size={18}
            aria-hidden="true"
          />
          Back to routines
        </Button>

        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-orange-600">
          ROUTINE BUILDER
        </p>

        <DialogTitle
          id="routine-builder-heading"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Create a routine
        </DialogTitle>

        <DialogDescription className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Name your routine, choose up to 15 exercises, and plan your
          sets. Your next training day starts here.
        </DialogDescription>
      </div>

      <Card className="rounded-2xl border-orange-200 bg-linear-to-br from-orange-50 via-amber-50/40 to-background py-6 shadow-sm">
        <CardHeader className="gap-3 px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-600 text-sm font-semibold text-white">
              1
            </span>

            <CardTitle className="text-lg font-semibold">
              <h2>Start with a name</h2>
            </CardTitle>
          </div>

          <CardDescription className="text-sm leading-relaxed">
            Give your routine a name before choosing your exercises.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 px-6">
          <label
            htmlFor="manual-routine-name"
            className="mr-3 text-sm font-medium"
          >
            Routine name
          </label>

          {/*
            TODO: Replace this sample defaultValue with controlled state.
            Start new routines with an empty name.
            Require a nonblank, trimmed name before enabling exercise
            search, filters, and selection.
          */}
          <Input
            id="manual-routine-name"
            type="text"
            value={routineName}
            onChange={(event) => setRoutineName(event.target.value)}
            placeholder="e.g. Push Day or Upper Body"
            aria-describedby="manual-routine-name-help"
            className="h-11 max-w-xl rounded-lg bg-background text-sm"
          />

          <p
            id="manual-routine-name-help"
            className="text-xs leading-relaxed text-muted-foreground"
          >
            Choose something you will recognize when it is time to train.
          </p>
        </CardContent>
      </Card>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Card className="min-w-0 rounded-2xl py-6 shadow-sm">
          <CardHeader className="gap-3 px-5 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-sm font-semibold">
                2
              </span>

              <CardTitle className="text-lg font-semibold">
                <h2>Find your exercises</h2>
              </CardTitle>
            </div>

            <CardDescription className="text-sm leading-relaxed">
              Search the library and click an exercise to add it to
              your routine.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 px-5 sm:px-6">
            <div className="space-y-2">
              <label
                htmlFor="manual-exercise-search"
                className="text-sm font-medium"
              >
                Search exercises
              </label>

              {/* TODO: Store the search text and match exercise names
                  without regard to capitalization or surrounding spaces. */}
              <div className="relative">
                <HugeiconsIcon
                  icon={Search01Icon}
                  size={19}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  id="manual-exercise-search"
                  type="search"
                  placeholder="Search by exercise name..."
                  className="h-11 rounded-lg pl-10 text-sm"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            {/*
              TODO: Reuse the Exercises page's combined filtering rules:
              - Name, equipment, and body-part filters work together.
              - Free weights includes barbell and dumbbell.
              - Machines matches machine.
              - Clearing a filter or choosing All removes that restriction.
              - Filtering does not remove exercises already in the draft.
            */}
            <div className="grid gap-4 sm:grid-cols-2">
              <RoutineFilter
                id="manual-equipment-filter"
                label="Equipment"
                options={equipmentOptions}
                value={equipmentFilter}
                onValueChange={setEquipmentFilter}
              />

              <RoutineFilter
                id="manual-body-part-filter"
                label="Body part"
                options={bodyPartOptions}
                value={bodyPartFilter}
                onValueChange={setBodyPartFilter}
              />
            </div>

            {/* TODO: Show the real filtered count and loading, error,
                and no-matching-exercises states in this library area. */}
            <p className="text-xs text-muted-foreground">
              {filteredExercises.length} of {exercises.length} exercises shown            </p>

            <div className="max-h-[580px] overflow-y-auto overscroll-contain pr-1">
              <div className="grid grid-cols-2 gap-3">
                {filteredExercises.map((exercise) => (                  /*
                    TODO: Clicking a card adds that exercise to local
                    draft state and reveals its planned-set input.
                    Keep selection indicators synchronized with the draft.
                    Enforce a maximum of 15 selected exercises.
                    At the limit, prevent further additions and explain why.
                    Selection does not save anything to MongoDB yet.
                  */
                  <button
                    key={exercise._id}
                    type="button"
                    aria-label={`${isExerciseSelected(exercise._id) ? "Selected" : "Add"} ${exercise.name}`}
                    aria-pressed={isExerciseSelected(exercise._id)}
                    className={cn(
                      "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-left transition-colors outline-none hover:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
                      isExerciseSelected(exercise._id) &&
                      "border-orange-400 bg-orange-50/40 ring-1 ring-orange-400/20"
                    )}
                    onClick={() => handleExerciseClick(exercise)}
                    disabled={
                      !isExerciseSelected(exercise._id) &&
                      selectedExercises.length >= 15
                    }
                  >
                    {/* TODO: Use this exercise's actual imageUrl. */}
                    <img
                      src={exercise.imageUrl}
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full bg-white object-contain p-3"
                    />

                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border bg-background shadow-sm",
                        isExerciseSelected(exercise._id) &&
                        "border-orange-600 bg-orange-600 text-white"
                      )}
                    >
                      <HugeiconsIcon
                        icon={isExerciseSelected(exercise._id) ? Tick02Icon : PlusSignIcon}
                        size={16}
                      />
                    </span>

                    <span className="flex flex-1 flex-col gap-2 border-t px-3 py-3">
                      <span className="text-sm font-medium leading-5">
                        {exercise.name}
                      </span>

                      <span
                        className={cn(
                          "mt-auto text-xs text-muted-foreground",
                          isExerciseSelected(exercise._id) && "font-medium text-orange-700"
                        )}
                      >
                        {isExerciseSelected(exercise._id) ? "Added to routine" : "Add exercise"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0 rounded-2xl py-6 shadow-sm lg:sticky lg:top-6">
          <CardHeader className="gap-3 px-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-sm font-semibold">
                  3
                </span>

                <CardTitle className="text-lg font-semibold">
                  <h2>Plan your sets</h2>
                </CardTitle>
              </div>

              {/* TODO: Display the actual selected-exercise count. */}
              <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                {selectedExercises.length} / 15 exercises
              </span>
              {selectedExercises.length >= 15 && (
                <p role="status" className="text-xs text-orange-700">
                  You’ve selected 15 exercises. Remove one before adding another.
                </p>
              )}
            </div>

            <CardDescription className="text-sm leading-relaxed">
              Choose your set counts and arrange your training order.
              {" "}Drag the handle or use the arrows to move an exercise.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 sm:px-6">
            {/* TODO: Render the actual selected exercises in draft order.
                After adding an exercise, bring its set input into view. */}
            {selectedExercises.length > 0 ? (
              <ol
                aria-label="Selected exercises in training order"
                className="max-h-[640px] space-y-4 overflow-y-auto overscroll-contain pr-1"
                onDragLeave={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setExerciseDropTarget(null);
                  }
                }}
              >
                {selectedExercises.map((exercise, index) => (
                  <li
                    key={exercise._id}
                    className={cn(
                      "relative rounded-xl border bg-muted/10 p-4",
                      draggedExerciseId === exercise._id && "opacity-50"
                    )}
                    onDragOver={(event) => handleExerciseDragOver(event, exercise._id)}
                    onDrop={(event) => handleExerciseDrop(event, exercise._id)}
                  >
                    {exerciseDropTarget?.exerciseId === exercise._id && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute inset-x-3 h-0.5 rounded-full bg-orange-500",
                          exerciseDropTarget.position === "before" ? "top-0" : "bottom-0"
                        )}
                      />
                    )}

                    <div className="flex items-start gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-semibold text-orange-700">
                        {index + 1}
                      </span>

                      <h3 className="min-w-0 flex-1 pt-0.5 text-sm font-semibold leading-6">
                        {exercise.name}
                      </h3>

                      <button
                        type="button"
                        draggable
                        aria-label={`Reorder ${exercise.name}. Drag or use the up and down arrow keys.`}
                        title="Drag to reorder, or use the up and down arrow keys"
                        className="flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                        onDragStart={(event) => handleExerciseDragStart(event, exercise._id)}
                        onDragEnd={handleExerciseDragEnd}
                        onKeyDown={(event) => {
                          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                            event.preventDefault();
                            moveSelectedExercise(
                              exercise._id,
                              index + (event.key === "ArrowUp" ? -1 : 1)
                            );
                          }
                        }}
                      >
                        <HugeiconsIcon
                          icon={DragDropVerticalIcon}
                          size={20}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor={`manual-sets-${exercise._id}`}
                          className="block text-xs font-medium text-muted-foreground"
                        >
                          Planned sets
                        </label>

                        {/* TODO: Store this exercise's set count in the
                            draft. Require a whole number of at least 1.
                            Do not add planned weight or reps inputs. */}
                        <Input
                          id={`manual-sets-${exercise._id}`}
                          type="number"
                          min={1}
                          step={1}
                          value={exercise.sets}
                          onChange={(event) =>
                            handleSetsChange(exercise._id, event.target.value)
                          }
                          className="h-10 w-24 rounded-lg bg-background text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveSelectedExercise(exercise._id, index - 1)}
                          aria-label={`Move ${exercise.name} up`}
                          className="size-9 cursor-pointer rounded-lg bg-background"
                        >
                          <HugeiconsIcon
                            icon={ArrowUp01Icon}
                            size={18}
                            aria-hidden="true"
                          />
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={
                            index === selectedExercises.length - 1
                          }
                          onClick={() => moveSelectedExercise(exercise._id, index + 1)}
                          aria-label={`Move ${exercise.name} down`}
                          className="size-9 cursor-pointer rounded-lg bg-background"
                        >
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={18}
                            aria-hidden="true"
                          />
                        </Button>

                        {/* TODO: Remove this entry from the draft and
                            update its library selection indicator.
                            Do not delete the catalog exercise. */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${exercise.name}`}
                          className="size-9 cursor-pointer rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() =>
                            setSelectedExercises((current) =>
                              current.filter((item) => item._id !== exercise._id)
                            )
                          }
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={18}
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-5 py-10 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border bg-background text-orange-600">
                  <HugeiconsIcon
                    icon={Dumbbell01Icon}
                    size={27}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-base font-semibold">
                  Your lineup starts here
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                  Choose an exercise from the library, then enter how
                  many sets you want to perform.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl py-5 shadow-sm">
        <CardContent className="flex flex-col gap-5 px-5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold">
              {selectedExercises.length} exercises
              <span aria-hidden="true" className="mx-2 text-muted-foreground">
                ·
              </span>
              {selectedExercises.reduce(
                (total, exercise) => total + (Number(exercise.sets) || 0),
                0
              )} planned sets
            </p>

            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Actual weights and reps are recorded when you start a workout.
            </p>
          </div>

          <div className="flex w-full gap-3 md:w-auto">
            {/* TODO: Discard the local draft and return to My Routines. */}
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1 cursor-pointer rounded-lg px-5 text-sm md:flex-none"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>

            {/*
              TODO:
              - Enable saving only with a nonblank name, 1–15 exercises,
                and a positive integer set count for every exercise.
              - Send an authenticated POST /myroutines containing:
                { name, exercises: [{ exerciseId, sets }] }.
              - Enforce the 15-exercise maximum in the backend as well.
              - Keep the existing 10-saved-routine limit.
              - Handle pending, success, and error states.
              - Keep the draft available if saving fails.
              - After success, return to and refresh the saved-routines list.
              - When editing, use PATCH /myroutines/:id instead.
            */}
            <Button
              type="button"
              onClick={handleSaveRoutine}
              disabled={saving}
              className="h-11 flex-1 cursor-pointer rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 md:flex-none"
            >
              {saving ? "Saving..." : "Save routine"}
            </Button>
          </div>
        </CardContent>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </Card>
    </section>
  );



  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!saving) handleOpenChange(nextOpen);
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 sm:w-auto"
          />
        }
      >
        <HugeiconsIcon
          icon={PlusSignIcon}
          size={18}
          aria-hidden="true"
        />
        Create a routine
      </DialogTrigger>

      <DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto p-5 sm:max-w-6xl sm:p-8">
        <fieldset disabled={saving} className="min-w-0">
          {builderContent}
        </fieldset>
      </DialogContent>
    </Dialog>
  );

}
export default AddRoutine;
