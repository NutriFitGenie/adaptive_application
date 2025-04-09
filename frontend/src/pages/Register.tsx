import { useState } from "react";

import LogoLarge from "../assets/LogoLarge.svg";
import "../styles/loginRegister.css";

import Registration from "./OnboardingViews/0Registration";

interface RegisterProps {
  // Function passed from parent (e.g., App) to change the view
  onViewChange: (view: "login" | "register" | "dashboard") => void;
}

const Register: React.FC<RegisterProps> = ({ onViewChange }) => {
  const [onboardingData, setOnboardingData] = useState();

  return (
    <div className="flex w-full h-full overflow-y-auto">
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-6 py-10">
        <Registration onViewChange={onViewChange} data={setOnboardingData} />
        <button onClick={() => alert(onboardingData)}>test</button>
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