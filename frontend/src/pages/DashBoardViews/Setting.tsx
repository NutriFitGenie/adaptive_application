import React, { useState } from "react";
import PersonalInfo from "./SettingViews/PersonalInfo";
import ManageFitness from "./SettingViews/ManageFitness";
import ManageHealth from "./SettingViews/ManageHealth";

type SettingView = "personal" | "fitness" | "health";

const Setting: React.FC = () => {
  // Local state controlling which sub‑view is active
  const [settingView, setSettingView] = useState<SettingView>("personal");

  return (
    <div style={{ padding: "1rem" }}>

      {/* Menu Buttons for in‑app navigation among sections */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          style={{
            backgroundColor: "#04b9c6",
            color: "#fff",
            padding: "1rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onClick={() => setSettingView("personal")}
        >
          Personal Info
        </button>
        <button
          style={{
            backgroundColor: "#04b9c6",
            color: "#fff",
            padding: "1rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onClick={() => setSettingView("fitness")}
        >
          Manage Fitness Preferences
        </button>
        <button
          style={{
            backgroundColor: "#04b9c6",
            color: "#fff",
            padding: "1rem 1.5rem",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onClick={() => setSettingView("health")}
        >
          Manage Health Preferences
        </button>
      </div>

      {/* Render the in‑app content based on the selected view */}
      <div style={{ borderTop: "1px solid #ccc", paddingTop: "1rem" }}>
        {settingView === "personal" && <PersonalInfo />}
        {settingView === "fitness" && <ManageFitness />}
        {settingView === "health" && <ManageHealth />}
      </div>
    </div>
  );
};

export default Setting;