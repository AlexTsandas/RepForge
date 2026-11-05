import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card.jsx";
import { useState } from "react";
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
const exercisePreviews = [
  {
    _id: "preview-bench",
    name: "Barbell Bench Press",
    equipment: "barbell",
    bodyPart: "chest",
    added: true,
  },
  {
    _id: "preview-incline",
    name: "Incline Dumbbell Bench Press",
    equipment: "dumbbell",
    bodyPart: "chest",
    added: true,
  },
  {
    _id: "preview-lateral",
    name: "Lateral Raise",
    equipment: "dumbbell",
    bodyPart: "shoulders",
    added: false,
  },
  {
    _id: "preview-machine",
    name: "Chest Press Machine",
    equipment: "machine",
    bodyPart: "chest",
    added: false,
  },
  {
    _id: "preview-pushup",
    name: "Push-Up",
    equipment: "bodyweight",
    bodyPart: "chest",
    added: false,
  },
  {
    _id: "preview-pushdown",
    name: "Triceps Pushdown",
    equipment: "machine",
    bodyPart: "triceps",
    added: false,
  },
];

// TODO: Replace this selected-exercise preview with local draft state.
// A new manual routine starts with an empty name and no exercises.
const selectedExercisePreviews = [
  { ...exercisePreviews[0], sets: 4 },
  { ...exercisePreviews[1], sets: 3 },
];

const RoutineFilter = ({ id, label, options }) => {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {/* TODO: Store the selected filter and apply it to the library. */}
      <Combobox items={options}>
        <ComboboxInput
          id={id}
          placeholder={options[0]}
          showClear
          className="h-10 w-full rounded-lg"
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

const AddRoutine = () => {
  /*
    TODO: Reuse this builder for manual creation, editing a saved routine,
    and reviewing a generated routine by accepting initial draft values.
  */

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      navigate("/myroutines");
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
            defaultValue="Push Day"
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
              />

              <RoutineFilter
                id="manual-body-part-filter"
                label="Body part"
                options={bodyPartOptions}
              />
            </div>

            {/* TODO: Show the real filtered count and loading, error,
                and no-matching-exercises states in this library area. */}
            <p className="text-xs text-muted-foreground">
              {exercisePreviews.length} exercises shown
            </p>

            <div className="max-h-[580px] overflow-y-auto overscroll-contain pr-1">
              <div className="grid grid-cols-2 gap-3">
                {exercisePreviews.map((exercise) => (
                  /*
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
                    aria-label={`${exercise.added ? "Selected" : "Add"} ${exercise.name}`}
                    aria-pressed={exercise.added}
                    className={cn(
                      "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-left transition-colors outline-none hover:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
                      exercise.added &&
                      "border-orange-400 bg-orange-50/40 ring-1 ring-orange-400/20"
                    )}
                  >
                    {/* TODO: Use this exercise's actual imageUrl. */}
                    <img
                      src="/images/Athletic Silhouette with Barbell.png"
                      alt=""
                      loading="lazy"
                      className="aspect-[4/3] w-full bg-white object-contain p-3"
                    />

                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute right-2 top-2 flex size-7 items-center justify-center rounded-full border bg-background shadow-sm",
                        exercise.added &&
                        "border-orange-600 bg-orange-600 text-white"
                      )}
                    >
                      <HugeiconsIcon
                        icon={exercise.added ? Tick02Icon : PlusSignIcon}
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
                          exercise.added && "font-medium text-orange-700"
                        )}
                      >
                        {exercise.added ? "Added to routine" : "Add exercise"}
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
                {selectedExercisePreviews.length} / 15 exercises
              </span>
            </div>

            <CardDescription className="text-sm leading-relaxed">
              Choose your set counts and arrange your training order.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-5 sm:px-6">
            {/* TODO: Render the actual selected exercises in draft order.
                After adding an exercise, bring its set input into view. */}
            {selectedExercisePreviews.length > 0 ? (
              <ol className="max-h-[640px] space-y-4 overflow-y-auto overscroll-contain pr-1">
                {selectedExercisePreviews.map((exercise, index) => (
                  <li
                    key={exercise._id}
                    className="rounded-xl border bg-muted/10 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-semibold text-orange-700">
                        {index + 1}
                      </span>

                      <h3 className="min-w-0 flex-1 pt-0.5 text-sm font-semibold leading-6">
                        {exercise.name}
                      </h3>
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
                          defaultValue={exercise.sets}
                          className="h-10 w-24 rounded-lg bg-background text-sm"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        {/* TODO: Move the complete exercise entry,
                            including its set count, one position up. */}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={index === 0}
                          aria-label={`Move ${exercise.name} up`}
                          className="size-9 cursor-pointer rounded-lg bg-background"
                        >
                          <HugeiconsIcon
                            icon={ArrowUp01Icon}
                            size={18}
                            aria-hidden="true"
                          />
                        </Button>

                        {/* TODO: Move the complete exercise entry,
                            including its set count, one position down. */}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={
                            index === selectedExercisePreviews.length - 1
                          }
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
            {/* TODO: Derive these totals from the current draft.
                The seven planned sets below belong to the sample data. */}
            <p className="text-sm font-semibold">
              {selectedExercisePreviews.length} exercises
              <span aria-hidden="true" className="mx-2 text-muted-foreground">
                ·
              </span>
              7 planned sets
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
              onClick={() => handleOpenChange(false)}
              className="h-11 flex-1 cursor-pointer rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 md:flex-none"
            >
              Save routine
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );



  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        {builderContent}
      </DialogContent>
    </Dialog>
  );

}
export default AddRoutine;
