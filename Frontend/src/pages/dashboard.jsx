import { useAuth } from "@clerk/react";
import { useSearchParams } from "react-router";
import showdownImage from "@/assets/RepForge vs. HEVY_ Manga Showdown.png";

const guestViews = {
  overview: {
    title: "Welcome to RepForge",
    description: "Build routines, log your workouts, and follow your progress.",
  },
  routines: {
    title: "Your routines, ready to train",
    description:
      "Organize your exercises into reusable routines and start your next workout.",
  },
  history: {
    title: "Follow your workout history",
    description:
      "Review completed workouts and see the weights and reps you recorded.",
  },
};

const Dashboard = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [searchParams] = useSearchParams();

  if (!isLoaded) return <p>Loading...</p>;

  if (isSignedIn) {
    return <div>Personal dashboard</div>;
  }

  const preview = searchParams.get("preview");
  const content =
    preview === "routines" || preview === "history"
      ? guestViews[preview]
      : guestViews.overview;

  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-12 md:flex-row md:gap-16">
      <div className="w-full min-w-0 flex-1">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {content.title}
        </h1>

        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
          {content.description}
        </p>
      </div>

      {content === guestViews.overview && (
        <div className="relative isolate w-full max-w-xs shrink-0 md:max-w-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-linear-to-br from-amber-200/60 via-orange-300/40 to-transparent blur-3xl"
          />

          <img
            src={showdownImage}
            alt="Manga showdown between RepForge and HEVY"
            className="block h-auto w-full rounded-lg border border-black/80 shadow-[5px_5px_0_rgba(0,0,0,0.12)]"
          />
        </div>
      )}
    </main>
  );
};

export default Dashboard;