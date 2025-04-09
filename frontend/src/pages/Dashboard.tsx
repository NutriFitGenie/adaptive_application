import React, { useState, useEffect } from "react";
import Home from "./DashBoardViews/Home";
import Workouts from "./DashBoardViews/Workouts";
import Nutrition from "./DashBoardViews/Nutrition";
import Progress from "./DashBoardViews/Progress";
import Setting from "./DashBoardViews/Setting";
import dataStore from "../data/dataStore"; // Global data store object
import "../styles/dashboard.css"; // Import the CSS

type DashboardView = "home" | "workouts" | "nutrition" | "progress" | "setting";

interface DashboardProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const [view, setView] = useState<DashboardView>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Get current date in two formats:
  // fullFormattedDate: e.g., "Monday, March 23, 2025"
  // currentDay: e.g., "Monday"
  const todayDate = new Date();
  const today: string = todayDate.toISOString().split("T")[0];
  const fullFormattedDate: string = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentDay: string = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const [planData, setPlanData] = useState<any>(null);
  const [previousHistory, setPreviousHistory] = useState<{ date: string; data: any }[]>([]);

  // Load today's plan data and previous history when component mounts or today changes.
  useEffect(() => {
    const todayData = dataStore[today] || null;
    setPlanData(todayData);

    const history = Object.keys(dataStore)
      .filter((date) => date < today)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({ date, data: dataStore[date] }));
    setPreviousHistory(history);
  }, [today]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    onViewChange("login");
  };

  // Toggle sidebar (primarily for mobile)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="logo">NutriFitGenie</div>
          <div className="nav-items">
            <button onClick={() => { setView("home"); setSidebarOpen(false); }}>Home</button>
            <button onClick={() => { setView("workouts"); setSidebarOpen(false); }}>Workouts</button>
            <button onClick={() => { setView("nutrition"); setSidebarOpen(false); }}>Nutrition</button>
            <button onClick={() => { setView("progress"); setSidebarOpen(false); }}>Progress</button>
            <button onClick={() => { setView("setting"); setSidebarOpen(false); }}>Setting</button>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="top-bar">
          {/* Hamburger button visible on mobile */}
          <button className="hamburger-btn" onClick={toggleSidebar}>
            &#9776;
          </button>
          <h2>Welcome, John!</h2>
          <p>{fullFormattedDate}</p>
        </div>

        {view === "home" && (
          <Home planData={planData} previousHistory={previousHistory} currentDay={currentDay} />
        )}
        {view === "workouts" && <Workouts />}
        {view === "nutrition" && <Nutrition />}
        {view === "progress" && <Progress />}
        {view === "setting" && <Setting />}
      </main>
    </div>
  );
};

export default Dashboard;