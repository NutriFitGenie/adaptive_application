import React, { useState } from "react";
import Home from "./DashBoardViews/Home";
import Workouts from "./DashBoardViews/Workouts";
import Nutrition from "./DashBoardViews/Nutrition";
import Progress from "./DashBoardViews/Progress";
import Setting from "./DashBoardViews/Setting";

// List of valid sub-view names in the Dashboard
type DashboardView = "home" | "workouts" | "nutrition" | "progress" | "setting";

interface DashboardProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  // Local state to track which sub-view is displayed
  const [view, setView] = useState<DashboardView>("home");

  const handleLogout = () => {
    // Remove token from sessionStorage
    localStorage.removeItem("token");

    // Navigate back to "login"
    onViewChange("login");
  };

  return (
    <div>
      {/* Navigation (buttons or a sidebar, etc.) */}
      <nav style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("home")}>Home</button>
        <button onClick={() => setView("workouts")}>Workouts</button>
        <button onClick={() => setView("nutrition")}>Nutrition</button>
        <button onClick={() => setView("progress")}>Progress</button>
        <button onClick={() => setView("setting")}>Setting</button>
        {/* Logout button */}
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      </nav>

      {/* Render the corresponding component based on 'view' */}
      {view === "home" && <Home />}
      {view === "workouts" && <Workouts />}
      {view === "nutrition" && <Nutrition />}
      {view === "progress" && <Progress />}
      {view === "setting" && <Setting />}
    </div>
  );
};

export default Dashboard;