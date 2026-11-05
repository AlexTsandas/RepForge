import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog.jsx";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox.jsx";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

const focusOptions = [
  "Leg day",
  "Push",
  "Pull",
  "Upper body",
  "Full body",
  "Custom",
];

const volumeOptions = ["Low", "High"];

const equipmentOptions = [
  { label: "Barbells", value: "barbell" },
  { label: "Dumbbells", value: "dumbbell" },
  { label: "Machines", value: "machine" },
  { label: "Bodyweight", value: "bodyweight" },
];

const GeneratorCombobox = ({
  id,
  label,
  options,
  placeholder,
  value,
  onValueChange,
}) => {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      <Combobox
        items={options}
        value={value}
        onValueChange={onValueChange}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          showClear
          className="h-11 w-full rounded-lg"
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

const GenerateRoutine = () => {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(null);
  const navigate = useNavigate();

  const isCustom = focus === "Custom";

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setFocus(null);
      navigate("/myroutines");
    }
  };

  /*
    TODO: Add form state for volume, description, and selected equipment.
    Keep the four stored equipment values:
    barbell, dumbbell, machine, bodyweight.
  */

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type="button"
            className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-white px-5 text-sm text-zinc-950 hover:bg-orange-100 sm:w-auto"
          />
        }
      >
        <HugeiconsIcon
          icon={AiMagicIcon}
          size={18}
          aria-hidden="true"
        />
        Generate with AI Coach
      </DialogTrigger>

      <DialogContent className="max-h-[90svh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="gap-4 border-b bg-linear-to-br from-orange-50 via-amber-50/50 to-background p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-orange-200 bg-background text-orange-600">
              <HugeiconsIcon
                icon={AiMagicIcon}
                size={24}
                aria-hidden="true"
              />
            </div>

            <span className="text-xs font-semibold tracking-[0.18em] text-orange-700">
              YOUR AI COACH
            </span>
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
            Build your next routine
          </DialogTitle>

          <DialogDescription className="max-w-lg text-sm leading-7">
            Tell us what you want to train and what you have available.
            We will suggest a routine you can review and make your own.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <GeneratorCombobox
              id="ai-workout-focus"
              label="Workout focus"
              options={focusOptions}
              placeholder="Choose your focus"
              value={focus}
              onValueChange={setFocus}
            />

            <div className="space-y-2">
              {/* TODO: Store the selected volume in form state. */}
              <GeneratorCombobox
                id="ai-workout-volume"
                label="Training volume"
                options={volumeOptions}
                placeholder="Choose volume"
              />

              <p className="text-xs leading-6 text-muted-foreground">
                Choose fewer or more planned working sets.
              </p>
            </div>
          </div>

          <fieldset className="min-w-0 space-y-3">
            <legend className="text-sm font-medium">
              Available equipment
            </legend>

            <p className="text-xs leading-6 text-muted-foreground">
              Select the equipment you can use for this workout.
            </p>

            {/*
              TODO:
              - Store checked equipment values in an array.
              - Require at least one equipment choice before generating.
              - Restrict generated exercises to the selected equipment.
              - Machines includes cable and Smith machine exercises.
            */}
            <div className="grid grid-cols-2 gap-3">
              {equipmentOptions.map((equipment) => (
                <label
                  key={equipment.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background p-4 transition-colors hover:bg-muted/40"
                >
                  <Checkbox
                    name="equipment"
                    value={equipment.value}
                    className="size-4 shrink-0 data-checked:border-orange-600 data-checked:bg-orange-600 data-checked:text-white"
                  />

                  <span className="text-sm font-medium">
                    {equipment.label}
                  </span>
                </label>
              ))}
            </div>

            <p className="text-xs leading-6 text-muted-foreground">
              Mention any specific equipment restrictions in the description.
            </p>
          </fieldset>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="ai-workout-description"
                className="text-sm font-medium"
              >
                {isCustom ? "Describe your workout" : "Description"}
              </label>

              <span
                className={
                  isCustom
                    ? "text-xs font-medium text-orange-700"
                    : "text-xs text-muted-foreground"
                }
              >
                {isCustom ? "Required for Custom" : "Optional"}
              </span>
            </div>

            {/*
              TODO:
              - Store the description in form state.
              - For Custom focus, require a nonblank trimmed description
                and use it to determine the workout's focus.
              - For other focuses, treat it as optional preferences.
              - Include preferred exercises and exercises to avoid in
                the generation request.
            */}
            <Textarea
              id="ai-workout-description"
              required={isCustom}
              aria-describedby="ai-workout-description-help"
              placeholder={
                isCustom
                  ? "I want a chest and biceps session, mostly using machines and dumbbells. Avoid dips."
                  : "For example: Focus on quads. I like leg presses and leg extensions, but I want to avoid barbell squats and lunges."
              }
              className="min-h-36 resize-y rounded-xl p-3 text-sm leading-7 md:text-sm"
            />

            <p
              id="ai-workout-description-help"
              className="text-xs leading-6 text-muted-foreground"
            >
              {isCustom
                ? "Tell your AI Coach which muscles or type of session you want to train."
                : "Add exercise preferences, movements to avoid, or anything else you want considered."}
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={20}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-orange-600"
            />

            <div>
              <p className="text-sm font-medium">
                Your routine, your final say
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                Get a draft with up to 15 exercises, then review its name,
                exercise order, and planned sets before saving.
              </p>
            </div>
          </div>

          {/* TODO: Show generation errors here while preserving the
              entered preferences so the user can retry. */}

          <DialogFooter className="gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-11 w-full cursor-pointer rounded-lg px-5 text-sm sm:w-auto"
            >
              Cancel
            </Button>

            {/*
              TODO:
              - Validate focus, volume, and at least one equipment choice.
              - Require a description when focus is Custom.
              - Send these four inputs through an authenticated
                POST /generate-routine request.
              - Keep the AI guide and prompt in the backend.
              - While pending, show a spinner and "Generating routine..."
                and prevent repeat generation requests.
              - Backend should return a suggested name, real exercise IDs,
                and positive integer planned set counts.
              - Enforce the 15-exercise maximum and equipment restrictions.
              - Follow the requested focus, volume, and exclusions.
              - Return the generated draft to routines.jsx and open
                AddRoutine with the draft filled in.
              - Close this dialog during that handoff.
              - Save to MongoDB only after the user reviews the draft
                and explicitly saves through the shared routine builder.
            */}
            <Button
              type="button"
              className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-orange-600 px-5 text-sm text-white hover:bg-orange-700 sm:w-auto"
            >
              <HugeiconsIcon
                icon={AiMagicIcon}
                size={18}
                aria-hidden="true"
              />
              Generate routine
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateRoutine;