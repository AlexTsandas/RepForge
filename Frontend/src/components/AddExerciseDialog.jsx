import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { toast } from "@/components/ui/toast.jsx";

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

const AddExerciseDialog = () => {
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

  const handleValidate = (event) => {
    event.preventDefault();

    if (!canValidate) return;

    handleOpenChange(false);

    toast.add({
      type: "info",
      title: "Validation isn't available yet",
      description: "Your exercise has not been added to the library.",
    });
  };

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