import { useState } from "react";
import axios from "axios";

import LogoLarge from "../assets/LogoLarge.svg";
import "../styles/onboarding.css";

import Registration from "./OnboardingViews/0Registration";
import FitnessGoals from "./OnboardingViews/1FitnessGoals";
import BodyMetrics from "./OnboardingViews/2BodyMetrics";
import DietaryPreferences from "./OnboardingViews/3DietaryPreferences";
import HealthConditions from "./OnboardingViews/4HealthConditions";
import Complete from "./OnboardingViews/5Complete";

interface RegisterProps {
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

interface OnboardingData {
  firstName?: string;
  lastName?: string;
  age?: string;
  gender?: string;
  email?: string;
  password?: string;
  goal?: string;
  fitnessLevel?: string;
  daysPerWeek?: number;
  targetWeight?: number;
  weight?: number;
  height?: number;
  neck?: number;
  waist?: number;
  activityLevel?: string;
  units?: "metric" | "imperial";
  dietaryPreferences?: string[];
  healthConditions?: string[];
}

const Register: React.FC<RegisterProps> = ({ onViewChange }) => {
  const [step, setStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const handleNext = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handleFinish = async () => {
    console.log("Final onboarding data:", onboardingData);
    try {
      const response = await axios.post("http://localhost:3000/api/users/register", onboardingData);
      console.log("Registration Successful:", response.data);

      // Example response: { message: 'Login successful.', token: '...', user: {...} }

      // 1. Store JWT token in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      // 3. Navigate to the dashboard
      onViewChange("dashboard");
    } catch (error) {
      console.error("Unexpected Error:", error);
      alert("Registration failed, Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <Registration onNext={(data) => handleNext(data)} onViewChange={onViewChange} />;
      case 1:
        return <FitnessGoals onNext={(data) => handleNext(data)} />;
      case 2:
        return <BodyMetrics onNext={(data) => handleNext(data)} units={onboardingData.units || "metric"} />;
      case 3:
        return <DietaryPreferences onNext={(data) => handleNext({ dietaryPreferences: data })} />;
      case 4:
        return <HealthConditions onNext={(data) => handleNext({ healthConditions: data })} />;
      case 5:
        return <Complete onFinish={handleFinish} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex w-full h-full overflow-y-auto">
      {/* Left Side (form content) */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-10">
        {renderStep()}
      </div>

      {/* Right Side (branding/logo) */}
      <div className="flex flex-col h-full lg:w-1/2 w-0">
        <div className="flex justify-end w-full">
          <img src={LogoLarge} alt="Large Logo" />
        </div>
      </div>
    </div>
  );
};

export default Register;