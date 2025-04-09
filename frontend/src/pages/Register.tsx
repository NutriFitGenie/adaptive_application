import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

import LogoLarge from "../assets/LogoLarge.svg";
import Logo from "../assets/Logo.svg";
import "../styles/loginRegister.css";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  email: string;
  password: string;
}

interface RegisterProps {
  // Function passed from parent (e.g., App) to change the view
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Register: React.FC<RegisterProps> = ({ onViewChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormValues>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    password: ""
  });

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegistration = async () => {
    for (const key in formData) {
      if (!formData[key as keyof typeof formData]) {
        alert("All fields are required");
        return;
      }
    }

    const ageNumber = parseInt(formData.age, 10);
    if (isNaN(ageNumber) || ageNumber <= 0 || ageNumber > 120) {
      alert("Invalid age");
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
      const response = await axios.post("http://localhost:3000/api/users/register", formData);
      console.log("Registration Successful:", response.data);

      // Example response: { message: 'Login successful.', token: '...', user: {...} }

      // 1. Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);


      // 3. Navigate to the dashboard
      onViewChange("dashboard");
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("Registration failed, Please try again.");
    }
  };

  return (
    <div className="flex w-full h-full overflow-y-auto">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-end h-16 w-full">
            <img
              src={Logo}
              alt="Logo"
              className="lg:h-0 lg:w-0 h-full w-full"
            />
          </div>
          <div className="text-center mb-8">
            <h1 className="titleText primaryColor1">Create an Account</h1>
            <p className="miniText secondaryColor mt-2">
              Welcome to NutriFitGenie! Please create an account.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
              value={formData.firstName}
              onChange={handleFormData}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
              value={formData.lastName}
              onChange={handleFormData}
            />
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-7">
            <input
              type="text"
              name="age"
              placeholder="Age"
              className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
              value={formData.age}
              onChange={handleFormData}
            />
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
              value={formData.gender}
              onChange={handleFormData}
            />
          </div>
  
          <div className="mb-7">
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
              value={formData.email}
              onChange={handleFormData}
            />
          </div>
  
          <div className="relative mb-10">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="rounded-full px-4 py-3 shadow-md w-full pr-12 focus:outline-none"
              value={formData.password}
              onChange={handleFormData}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 secondaryColor cursor-pointer" />
              ) : (
                <Eye className="w-5 h-5 secondaryColor cursor-pointer" />
              )}
            </button>
          </div>
  
          <div className="mb-6 text-center">
            <button
              className="loginRegistrationButton"
              onClick={handleRegistration}
            >
              Begin Onboarding
            </button>
          </div>
  
          <div className="text-center miniText">
            <span className="secondaryColor">Already have an account?</span>
            <button
              className="primaryColor1 ml-1 hover:underline cursor-pointer"
              onClick={() => onViewChange("login")}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
  
      {/* Right Side */}
      <div className="flex flex-col h-full lg:w-1/2 w-0">
        <div className="flex justify-end w-full">
          <img src={LogoLarge} alt="Large Logo" />
        </div>
      </div>
    </div>
  );
};

export default Register;