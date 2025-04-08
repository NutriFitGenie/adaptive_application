import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import LogoLarge from "../assets/LogoLarge.svg";
import Logo from "../assets/Logo.svg";
import "../styles/login.css";

interface LoginFormValues {
  email: string;
  password: string;
}

// Props from parent
interface LoginProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Login: React.FC<LoginProps> = ({ onViewChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormValues>({
    email: "",
    password: "",
  });


  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }

    if(!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/users/login", formData);
      console.log("Login Successful:", response.data);

      // Example response: { message: 'Login successful.', token: '...', user: {...} }

      // 1. Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);


      // 3. Navigate to the dashboard
      onViewChange("dashboard");
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("Invalid login credentials! Please try again.");
    }
  };

  return (
      <div className="flex w-full h-full overflow-y-auto">
        <div 
          className="flex flex-col justify-center h-full lg:w-1/2 w-full"
          style={{ minHeight: "800px" }}
        >
          <div className="flex justify-end h-16 w-full">
            <img
              src={Logo}
              alt="Logo"
              className="lg:h-0 lg:w-0 h-full w-full"
            />
          </div>
          <div className="flex flex-col h-2/3">
            <div className="text-center h-1/5">
              <div className="titleText primaryColor1">
                Log In to your Account
              </div>
              <div className="miniText secondaryColor">
                Welcome back to NutriFitGenie!
              </div>
            </div>
            <div className="text-center h-1/2">
              <div className="flex justify-center items-center h-1/3">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  className="flex items-center loginRegistrationFormInput"
                  value={formData.email}
                  onChange={handleFormData}
                />
              </div>
              <div className="flex justify-center items-center h-1/3">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="loginRegistrationFormInput ms-6"
                  value={formData.password}
                  onChange={handleFormData}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="-translate-x-10"
                >
                  {showPassword ? (
                    <EyeOff className="w-6 h-6 secondaryColor" />
                  ) : (
                    <Eye className="w-6 h-6 secondaryColor" />
                  )}
                </button>
              </div>
              <div className="flex justify-center items-center h-1/3 ">
                <button className="loginRegistrationButton" onClick={handleLogin}>
                  Log In
                </button>
              </div>
            </div>
            <div className="text-center h-1/6 miniText">
              <span className="secondaryColor">Don't have an account?</span>
              <button className="primaryColor1 ml-1 hover:underline cursor-pointer" onClick={() => onViewChange("register")}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full lg:w-1/2 w-0">
          <div className="flex justify-end w-full">
            <img src={LogoLarge} alt="Large Logo" />
          </div>
        </div>
      </div>
  );
};

export default Login;