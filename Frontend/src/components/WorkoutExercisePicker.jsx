import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  "All equipment",
  "Bodyweight",
  "Machines",
  "Free weights",
];

const bodyPartOptions = [
  "All body parts", "Chest", "Back", "Shoulders", "Biceps",
  "Triceps", "Quads", "Hamstrings", "Glutes", "Calves", "Core",
];

function PickerFilter({ id, label, options, value, onValueChange }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <Combobox
        items={options}
        value={value}
        onValueChange={onValueChange}
      >
        <ComboboxInput id={id} placeholder={options[0]} showClear />
        <ComboboxContent>
          <ComboboxEmpty>No options found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export default function WorkoutExercisePicker({
  selectedIds,
  replacing,
  onSelect,
  onClose,
}) {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState("");
  const [equipment, setEquipment] = useState(null);
  const [bodyPart, setBodyPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchExercises = async () => {
      try {
        const response = await api.get("/exercises");
        if (active) setExercises(response.data);
      } catch {
        if (active) {
          setError("Could not load exercises. Close and reopen to try again.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchExercises();
    return () => {
      active = false;
    };
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesEquipment =
      !equipment ||
      equipment === "All equipment" ||
      (equipment === "Bodyweight" && exercise.equipment === "bodyweight") ||
      (equipment === "Machines" && exercise.equipment === "machine") ||
      (equipment === "Free weights" &&
        ["barbell", "dumbbell"].includes(exercise.equipment));

    const matchesBodyPart =
      !bodyPart ||
      bodyPart === "All body parts" ||
      exercise.bodyPart === bodyPart.toLowerCase();

    return matchesSearch && matchesEquipment && matchesBodyPart;
  });

  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose();
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto p-6 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {replacing ? "Replace exercise" : "Add an exercise"}
          </DialogTitle>
          <DialogDescription>
            {replacing
              ? "Choose a replacement. The set count stays the same; weights and reps will be cleared."
              : "Search the library and choose an exercise for this workout."}
          </DialogDescription>
        </DialogHeader>

        <Input
          aria-label="Search exercises"
          placeholder="Search exercises..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-11"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PickerFilter
            id="workout-equipment"
            label="Equipment"
            options={equipmentOptions}
            value={equipment}
            onValueChange={setEquipment}
          />
          <PickerFilter
            id="workout-body-part"
            label="Body part"
            options={bodyPartOptions}
            value={bodyPart}
            onValueChange={setBodyPart}
          />
        </div>

        <div className="max-h-[45svh] space-y-2 overflow-y-auto">
          {loading ? (
            <p className="py-6 text-center">Loading exercises...</p>
          ) : error ? (
            <p role="alert" className="text-sm text-destructive">{error}</p>
          ) : filteredExercises.length === 0 ? (
            <p className="py-6 text-center">No exercises found.</p>
          ) : (
            filteredExercises.map((exercise) => (
              <Button
                key={exercise._id}
                type="button"
                variant="outline"
                disabled={selectedIds.includes(exercise._id)}
                onClick={() => onSelect(exercise)}
                className="h-auto w-full justify-start gap-4 rounded-xl p-3 text-left whitespace-normal"
              >
                <img
                  src={
                    exercise.imageUrl ??
                    "/images/Athletic Silhouette with Barbell.png"
                  }
                  alt=""
                  loading="lazy"
                  className="size-16 shrink-0 rounded-lg bg-white object-contain"
                />
                <span className="min-w-0">
                  <span className="block font-medium">{exercise.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {selectedIds.includes(exercise._id)
                      ? "Already in your workout"
                      : `${exercise.equipment} · ${exercise.bodyPart}`}
                  </span>
                </span>
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}