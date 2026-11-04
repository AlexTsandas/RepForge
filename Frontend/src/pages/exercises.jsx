import { useState, useEffect } from "react";
import api from "../lib/axios";
import Loading from "@/components/Loading.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import AddExerciseDialog from "@/components/AddExerciseDialog.jsx";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox.jsx";

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

const FilterCombobox = ({ id, label, options, value, onValueChange }) => {
  return (
    <div className="min-w-0 space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <Combobox
        items={options}
        value={value}
        onValueChange={onValueChange}
      >
        <ComboboxInput
          id={id}
          placeholder={options[0]}
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

const Exercises = ({ exerciseVersion, onExerciseCreated }) => {
  const [exercises, setExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState(null);
  const [bodyPartFilter, setBodyPartFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get("/exercises");
        setExercises(response.data);
      } catch (error) {
        console.error(error.message);
        setError("Could not load exercises. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [exerciseVersion]);

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

  if (loading) return <Loading message="Loading exercises..." />;

  if (error) {
    return (
      <p role="alert" className="p-6 text-destructive">
        {error}
      </p>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Exercises
        </h1>

        <AddExerciseDialog onExerciseCreated={onExerciseCreated} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="min-w-0 space-y-2">
          <label
            htmlFor="exercise-search"
            className="text-sm font-medium"
          >
            Search exercises
          </label>

          <Input
            id="exercise-search"
            type="search"
            placeholder="Search by exercise name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-10"
          />
        </div>

        <FilterCombobox
          id="equipment-filter"
          label="Equipment"
          options={equipmentOptions}
          value={equipmentFilter}
          onValueChange={setEquipmentFilter}
        />

        <FilterCombobox
          id="body-part-filter"
          label="Body part"
          options={bodyPartOptions}
          value={bodyPartFilter}
          onValueChange={setBodyPartFilter}
        />
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {filteredExercises.length} of {exercises.length} exercises match
      </p>
      {filteredExercises.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No exercises match your filters.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredExercises.map((exercise) => (
            <article
              key={exercise._id}
              className="overflow-hidden rounded-xl border bg-card shadow-sm"
            >
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                loading="lazy"
                className="aspect-[4/3] w-full bg-white object-contain p-4"
              />

              <h2 className="border-t px-4 py-4 text-center text-base font-semibold leading-snug">
                {exercise.name}
              </h2>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default Exercises;