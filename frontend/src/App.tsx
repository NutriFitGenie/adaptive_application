import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

// Define the union type for views
export type View = "login" | "register" | "dashboard";

const App: React.FC = () => {
  const [view, setView] = useState<View>("login");

  useEffect(() => {
    // Check localStorage on first render to see if a token exists
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally validate token on the server or decode it here
      setView("dashboard");
    }
  }, []);

  // This function is passed to child components so they can change the "view."
  const handleViewChange = (nextView: View) => {
    setView(nextView);
  };

  return (
    <div className="h-full w-full">
      {/* Render only one of these at a time based on the current 'view' */}
      {view === "login" && <Login onViewChange={handleViewChange} />}
      {view === "register" && <Register onViewChange={handleViewChange} />}
      {view === "dashboard" && <Dashboard onViewChange={handleViewChange} />}
    </div>
  );
};

export default App;
