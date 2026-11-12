import { useState } from "react";
import { useNavigate } from "react-router";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { useAuth } from "@clerk/react";
import { toast } from "@/components/ui/toast.jsx";
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



const GenerateRoutine = ({ onRoutineCreated }) => {
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(null);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [volume, setVolume] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [description, setDescription] = useState("");
  const isCustom = focus === "Custom";

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setFocus(null);
      setVolume(null);
      setSelectedEquipment([]);
      setDescription("");
      navigate("/myroutines");
    }
  };

  const handleEquipmentChange = (value, checked) => {
    setSelectedEquipment((current) => {
      if (checked) {
        return current.includes(value) ? current : [...current, value];
      }

      return current.filter((item) => item !== value);
    });
  };

  const handleGenerateRoutine = async () => {
    if (generating) return;

    const payload = {
      focus,
      volume,
      equipment: selectedEquipment,
      description: description.trim(),
    };

    setGenerating(true);
    handleOpenChange(false);

    const toastId = toast.add({
      type: "loading",
      title: "Generating routine",
      description: "Your AI Coach is building your routine. You can continue browsing.",
      timeout: 0,
    });

    try {
      const token = await getToken();

      const response = await api.post("/generate-routine", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onRoutineCreated(response.data);

      toast.update(toastId, {
        type: "success",
        title: "Routine created",
        description: `${response.data.name} has been saved to your routines.`,
        timeout: 5000,
      });
    } catch (error) {
      console.error("Error generating routine:", error);

      toast.update(toastId, {
        type: "error",
        title: "Could not generate routine",
        description:
          error.response?.data?.error ||
          "The request could not be completed. Please try again.",
        timeout: 6000,
      });
    } finally {
      setGenerating(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        disabled={generating}
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
        {generating ? "Generating routine..." : "Generate with AI Coach"}
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
            Generate and save a routine with up to 15 exercises. You can edit its name, exercise order, and planned sets afterward.          </DialogDescription>
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
              <GeneratorCombobox
                value={volume}
                onValueChange={setVolume}
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

            <div className="grid grid-cols-2 gap-3">
              {equipmentOptions.map((equipment) => (
                <label
                  key={equipment.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border bg-background p-4 transition-colors hover:bg-muted/40"
                >
                  <Checkbox
                    checked={selectedEquipment.includes(equipment.value)}
                    onCheckedChange={(checked) =>
                      handleEquipmentChange(equipment.value, checked)
                    }
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

            <Textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
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


          <DialogFooter className="gap-3 border-t pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="h-11 w-full cursor-pointer rounded-lg px-5 text-sm sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              disabled={generating}
              onClick={handleGenerateRoutine}
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