// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import Home from "./DashBoardViews/Home";
import Workouts from "./DashBoardViews/Workouts";
import Nutrition from "./DashBoardViews/Nutrition";
import Progress from "./DashBoardViews/Progress";
import History from "./DashBoardViews/History";
import Setting from "./DashBoardViews/Setting";
// Import your new FoodProgress component
import FoodProgress from "./DashBoardViews/FoodProgress";
import dataStore from "../data/dataStore"; // Global data store object
import "../styles/dashboard.css"; // Import the CSS

import Logo from "../assets/Logo.svg"; // Logo for the sidebar

import { FaHome, FaHistory } from "react-icons/fa";
import { LuDumbbell, LuWheat } from "react-icons/lu";
import { GiProgression } from "react-icons/gi";

// List of valid sub-view names in the Dashboard
type DashboardView = "home" | "workouts" | "nutrition" | "progress" | "history" | "foodProgress";

interface DashboardProps {
  apiBase: string;
  token: string;
  user: any;
  onLogout: () => void;
}

const sidebarItems = [
  {
    label: "Home",
    value: "home",
    icon: <FaHome className="text-3xl primaryColor1" />,
  },
  {
    label: "Workouts",
    value: "workouts",
    icon: <LuDumbbell className="text-3xl primaryColor1" />,
  },
  {
    label: "Nutrition",
    value: "nutrition",
    icon: <LuWheat className="text-3xl primaryColor1" />,
  },
  {
    label: "Progress",
    value: "progress",
    icon: <GiProgression className="text-3xl primaryColor1" />,
  },
  {
    label: "History",
    value: "history",
    icon: <FaHistory className="text-3xl primaryColor1" />,
  },
    {
      label: "Food Progress",
      value: "foodProgress",
      icon: <GiProgression className="text-3xl primaryColor1" />,
    }
]

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  // On mount, try to get the saved view from localStorage; default to "home" if not found.
  const savedView = localStorage.getItem("dashboardView") as DashboardView || "home";
  const [view, setView] = useState<DashboardView>(savedView);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Retrieve userData from localStorage and parse it.
  const userData = localStorage.getItem("userData");
  const parsedUserData = userData ? JSON.parse(userData) : null;

  // Persist view changes in localStorage.
  useEffect(() => {
    localStorage.setItem("dashboardView", view);
  }, [view]);

  // Get today's date and formatted strings.
  const todayDate = new Date();
  const today: string = todayDate.toISOString().split("T")[0];
  const fullFormattedDate: string = todayDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [planData, setPlanData] = useState<any>(null);
  const [previousHistory, setPreviousHistory] = useState<{ date: string; data: any }[]>([]);

  // Load today's plan data and previous history.
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
    onLogout();
  };

  // Toggle sidebar (for mobile).
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Helper function to change the view and close sidebar.
  const changeView = (newView: DashboardView) => {
    setView(newView);
    setSidebarOpen(false);
  };

  // Back button behavior: Return to "home".
  const handleBack = () => {
    changeView("home");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="flex items-center logo">
            <img
                src={Logo}
                alt="Logo"
                className="h-16 w-16"
            />
            <div className="ml-3 secondaryText">NutriFitGenie</div>
          </div>
          <nav className="flex flex-col items-center nav-items textLight">
            {sidebarItems.map((item) => {
              const isActive = view === item.value;
              return (
                <div
                  key={item.value}
                  onClick={() => changeView(item.value as DashboardView)}
                  className={`flex items-center gap-3 w-full px-4 py-2 my-2 rounded-full transition-colors ${
                    isActive ? "primaryColor2BG" : "hover:bg-[var(--primaryColor2)]"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center background">
                    {item.icon}
                  </div>
                  <span className="text-base font-medium">{item.label}</span>
                </div>
              );
            })}
          </nav>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Updated Top Bar */}
        <div className="top-bar flex items-center justify-between p-4">
          {/* Left: Hamburger button (visible on mobile) */}
          <div className="flex items-center">
            <button className="hamburger-btn mr-4 md:hidden" onClick={toggleSidebar}>
              &#9776;
            </button>
            <div className="hidden md:block">
              <div className="titleText font-bold primaryColor1">
                Welcome, {parsedUserData ? parsedUserData.firstName : "User"}!
              </div>
              <p className="text-sm secondaryColor">{fullFormattedDate}</p>
            </div>
          </div>

          <div className="block md:hidden text-center flex-grow">
            <div className="titleText font-bold primaryColor1">
              Welcome, {parsedUserData ? parsedUserData.firstName : "User"}!
            </div>
            <p className="text-xs secondaryColor">{fullFormattedDate}</p>
          </div>
        </div>

        {/* Render the selected view */}
        {view === "home" && (
          <Home
            planData={planData}
            previousHistory={previousHistory}
            onViewChange={changeView}
          />
        )}
        {view === "workouts" && <Workouts onViewChange={changeView} />}
        {view === "nutrition" && (
          <Nutrition
            apiBase="http://localhost:3000"
            token={parsedUserData ? parsedUserData.token : ""}
            userId={parsedUserData ? parsedUserData._id : ""}
          />
        )}
        {view === "progress" && <Progress onViewChange={changeView} />}
        {view === "history" && <History onViewChange={changeView} />}
        {view === "foodProgress" && <FoodProgress
            token={parsedUserData ? parsedUserData.token : ""}
            userId={parsedUserData ? parsedUserData._id : ""}   />}
      </main>
    </div>
  );
};

export default Dashboard;