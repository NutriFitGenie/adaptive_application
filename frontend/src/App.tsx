import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { IUser } from "./pages/DashBoardViews/types"; // Assuming you have a types file

type View = "login" | "register" | "dashboard";

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
    <div>
      {view === "login" && (
        <Login
          apiBase={apiBase}
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={() => setView("register")}
        />
      )}

      {view === "register" && (
        <Register
          apiBase={apiBase}
          onRegisterSuccess={handleLoginSuccess}
          onLoginClick={() => setView("login")}
        />
      )}

      {view === "dashboard" && user && (
        <Dashboard
          apiBase={apiBase}
          token={token}
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;