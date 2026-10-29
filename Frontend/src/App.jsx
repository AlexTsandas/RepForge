import { Routes, Route } from "react-router";
import Dashboard from "./pages/dashboard.jsx";
import SignInPage from './pages/sign-in.jsx'

function App() {
  

  return (
    
      <div className="relative h-full w-full">
      
  
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    
    </div>
  )
}

export default App
