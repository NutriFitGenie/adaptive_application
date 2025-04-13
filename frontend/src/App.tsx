import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { IUser } from "./pages/DashBoardViews/types"; // Assuming you have a types file

// Define the union type for views
export type View = "login" | "register" | "dashboard";

const App: React.FC = () => {
  const [view, setView] = useState<View>("login");
  const [token, setToken] = useState<string>("");
  const [user, setUser] = useState<IUser | null>(null);
  const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:3001";

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setView("dashboard");
    }
  }, []);

  const handleLoginSuccess = (newToken: string, userData: IUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setView("login");
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
