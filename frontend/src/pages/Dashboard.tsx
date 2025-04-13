// Dashboard.tsx
import React, { useState, useEffect } from "react";
import Home from "./DashBoardViews/Home";
import Workouts from "./DashBoardViews/Workouts";
import Nutrition from "./DashBoardViews/Nutrition";
import Progress from "./DashBoardViews/Progress";
import Setting from "./DashBoardViews/Setting";
import History from "./DashBoardViews/History";
import dataStore from "../data/dataStore"; // Global data store object
import "../styles/dashboard.css"; // Import the CSS

// List of valid sub-view names in the Dashboard
type DashboardView = "home" | "workouts" | "nutrition" | "progress" | "history" | "setting";

interface DashboardProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  // On mount, try to get the saved view from localStorage; default to "home" if not found.
  const savedView = localStorage.getItem("dashboardView") as DashboardView || "home";
  const [view, setView] = useState<DashboardView>(savedView);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  // Retrieve userData from localStorage and parse it.
  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : null;
  // For debugging:

  // Whenever view changes, persist it in localStorage.
  useEffect(() => {
    localStorage.setItem("dashboardView", view);
  }, [view]);

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
    localStorage.clear();
    onViewChange("login");
  };

  // Toggle sidebar (primarily for mobile)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Helper function to change the view and close sidebar.
  const changeView = (newView: DashboardView) => {
    setView(newView);
    setSidebarOpen(false);
  };

  // Back button behavior: Go back to "home"
  const handleBack = () => {
    changeView("home");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="logo">NutriFitGenie</div>
          <nav className="nav-items">
            <button onClick={() => changeView("home")}>Home</button>
            <button onClick={() => changeView("workouts")}>Workouts</button>
            <button onClick={() => changeView("nutrition")}>Nutrition</button>
            <button onClick={() => changeView("progress")}>Progress</button>
            <button onClick={() => changeView("history")}>History</button>
            <button onClick={() => changeView("setting")}>Setting</button>
          </nav>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Updated Top Bar */}
        <div className="top-bar flex items-center justify-between p-4 bg-gray-100">
          {/* Left: Hamburger button (visible on mobile) */}
          <div className="flex items-center">
            <button className="hamburger-btn mr-4 md:hidden" onClick={toggleSidebar}>
              &#9776;
            </button>
            <div className="hidden md:block">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome, {parsedUserData ? parsedUserData.firstName : "User"}!
              </h2>
              <p className="text-sm text-gray-600">{fullFormattedDate}</p>
            </div>
          </div>

          {/* Center: Minimal text for mobile */}
          <div className="block md:hidden text-center flex-grow">
  <h2 className="text-lg font-bold text-black">
    Welcome, {parsedUserData ? parsedUserData.firstName : "User"}!
  </h2>
  <p className="text-xs text-black">{fullFormattedDate}</p>
</div>

          {/* Right: Back button if not on home */}
          {view !== "home" && (
            <button 
              onClick={handleBack} 
              className="back-btn flex items-center justify-center rounded-full bg-primaryColor1 w-10 h-10 text-white shadow-md"
            >
              &larr;
            </button>
          )}
        </div>

        {/* Optional Header within main content to display username dynamically */}
        
         
        

        {/* Render the view based on selection */}
        {view === "home" && (
          <Home
            planData={planData}
            previousHistory={previousHistory}
            currentDay={currentDay}
            onViewChange={changeView}
          />
        )}
        {view === "workouts" && <Workouts onViewChange={onViewChange} />}
        {view === "nutrition" && <Nutrition />}
        {view === "progress" && <Progress onViewChange={onViewChange} />}
        {view === "history" && <History onViewChange={onViewChange} />}
        {view === "setting" && <Setting />}
      </main>
    </div>
  );
};

export default Dashboard;