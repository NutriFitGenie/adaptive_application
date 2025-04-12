// src/pages/Register.tsx
import React, { useState } from "react";
// Removed useNavigate since in-app rendering is handling navigation

const Register: React.FC<{ onViewChange: (view: "login" | "register" | "dashboard") => void }> = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    height: "",
    weight: "",
    dietaryPreferences: "", // Enter as comma separated string (e.g., "vegan, paleo")
    allergies: "",          // Enter as comma separated string (e.g., "peanuts, milk")
    fitnessGoal: "weight_loss", // Options: weight_loss, muscle_gain, maintenance
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          // Convert height & weight to numbers
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          // Convert comma-separated strings into arrays
          dietaryPreferences: formData.dietaryPreferences
            ? formData.dietaryPreferences.split(",").map((s) => s.trim())
            : [],
          allergies: formData.allergies
            ? formData.allergies.split(",").map((s) => s.trim())
            : [],
          fitnessGoal: formData.fitnessGoal,
        }),
      });
      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Registration failed");
      }
      const data = await response.json();
      console.log(data, "User registered successfully");
      
      setSuccess("User registered successfully!");
      setError("");
      // Change view to login after successful registration
      onViewChange("login");
    } catch (err: any) {
      setError(err.message || "Registration error");
      setSuccess("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Height (cm):
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Weight (kg):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Dietary Preferences (comma separated):
          <input
            type="text"
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            placeholder="e.g., vegan, paleo"
          />
        </label>
        <br />
        <label>
          Allergies (comma separated):
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="e.g., peanuts, milk"
          />
        </label>
        <br />
        <label>
          Fitness Goal:
          <select
            name="fitnessGoal"
            value={formData.fitnessGoal}
            onChange={handleChange}
          >
            <option value="weight_loss">Weight Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;