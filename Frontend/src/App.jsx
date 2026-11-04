import { Routes, Route } from "react-router";
import Dashboard from "./pages/dashboard.jsx";
import SignInPage from './pages/sign-in.jsx'
import SignUpPage from './pages/sign-up.jsx'
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import api from "./lib/axios";
import Header from "./components/Header.jsx";
import Exercises from "./pages/exercises.jsx";
import { Toaster } from "@/components/ui/toast.jsx";

function App() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [exerciseVersion, setExerciseVersion] = useState(0);

  const handleExerciseCreated = () => {
    setExerciseVersion((current) => current + 1);
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const syncUser = async () => {
      try {
        const token = await getToken();


        const res = await api.post("/sync-users", {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(res.data);
      } catch (error) {
        console.error("Error syncing user data:", error);
      }

    };

    syncUser();
  }, [isLoaded, isSignedIn, getToken]);

  return (

    <div className="relative h-full w-full">

      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route
          path="/exercises"
          element={
            <Exercises
              exerciseVersion={exerciseVersion}
              onExerciseCreated={handleExerciseCreated}
            />
          }
        />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
