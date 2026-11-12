import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "@/components/ui/toast.jsx";
import { useAuth } from "@clerk/react";
import api from "@/lib/axios";

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

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox.jsx";

const equipmentOptions = [
  "Dumbbell",
  "Barbell",
  "Machine",
  "Bodyweight",
];

const bodyPartOptions = [
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

const FormCombobox = ({
  id,
  label,
  placeholder,
  options,
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
          className="h-10 w-full"
          showClear
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

const AddExerciseDialog = ({ onExerciseCreated }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState(null);
  const [bodyPart, setBodyPart] = useState(null);

  const canValidate = Boolean(name.trim() && equipment && bodyPart);

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setName("");
      setEquipment(null);
      setBodyPart(null);
    }
  };

  const handleValidate = async (event) => {
    event.preventDefault();

    if (!canValidate || !isLoaded) return;

    if (!isSignedIn) {
      toast.add({
        type: "error",
        title: "Sign in required",
        description: "Please sign in to add an exercise.",
      });
      return;
    }

    // Capture the values before closing and resetting the form.
    const payload = {
      name: name.trim(),
      equipment: equipment.toLowerCase(),
      bodyPart: bodyPart.toLowerCase(),
    };

    handleOpenChange(false);

    const toastId = toast.add({
      type: "loading",
      title: "Validating exercise",
      description: "Your exercise is being checked. You can continue browsing.",
      timeout: 0,
    });

    try {
      const token = await getToken();

      const response = await api.post("/exercises", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.update(toastId, {
        type: "success",
        title: "Exercise added",
        description: `${response.data.name} is now in the library.`,
        timeout: 5000,
      });

      onExerciseCreated();
    } catch (error) {
      const status = error.response?.status;

      toast.update(toastId, {
        type: "error",
        title: status === 400 ? "Invalid exercise" : "Could not add exercise",
        description:
          status === 400
            ? "Check the exercise name, equipment, and body part."
            : status === 409
              ? "This exercise is already in the library."
              : status === 401
                ? "Please sign in and try again."
                : error.response?.data?.error ||
                "The request could not be completed. Please try again.",
        timeout: 6000,
      });
    }
  };
  if (!isLoaded || !isSignedIn) return null;



  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" className="h-10 px-4 text-sm" />
        }
      >
        + Add exercise
      </DialogTrigger>

      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add exercise
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed">
            Your exercise name, equipment, and body part must be
            validated before the exercise can be added to the library.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleValidate} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="new-exercise-name"
              className="block text-sm font-medium"
            >
              Exercise name
            </label>

            <Input
              id="new-exercise-name"
              placeholder="e.g. Incline Dumbbell Bench Press"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-10"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormCombobox
              id="new-exercise-equipment"
              label="Equipment"
              placeholder="Choose equipment"
              options={equipmentOptions}
              value={equipment}
              onValueChange={setEquipment}
            />

            <FormCombobox
              id="new-exercise-body-part"
              label="Body part"
              placeholder="Choose body part"
              options={bodyPartOptions}
              value={bodyPart}
              onValueChange={setBodyPart}
            />
          </div>

          <DialogFooter className="pt-2">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 px-4 text-sm"
                />
              }
            >
              Cancel
            </DialogClose>

            <Button
              type="submit"
              disabled={!canValidate}
              className="h-10 px-4 text-sm"
            >
              Validate
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseDialog;