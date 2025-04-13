import { useState, ChangeEvent } from "react";

import Logo from "../../assets/Logo.svg";

interface HealthConditionsProps {
  onNext: (data: string[]) => void;
}

export default function HealthConditions({ onNext }: HealthConditionsProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [other, setOther] = useState("");

  const conditions = [
    "Diabetes",
    "Digestion Issues",
    "High Blood Pressure",
    "High Cholesterol",
    "Hormonal Imbalance",
    "Thyroid Issues",
    "Arthritis",
    "Asthma",
    "Heart Issues",
  ];

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((item) => item !== condition)
        : [...prev, condition]
    );
  };

  const handleNext = () => {
    const allConditions = [...selectedConditions];
    const trimmedOther = other.trim();

    if (trimmedOther) {
      if (/^\d+$/.test(trimmedOther)) {
        alert("Please enter a valid health condition for 'Other'.");
        return;
      }
      allConditions.push(trimmedOther);
    }

    onNext(allConditions);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-end h-16 w-full">
        <img
          src={Logo}
          alt="Logo"
          className="lg:h-0 lg:w-0 h-full w-full"
        />
      </div>
      <div className="text-center mb-6">
        <h1 className="titleText primaryColor1">Health Conditions</h1>
        <p className="miniText secondaryColor mt-1">Any health conditions?</p>
        <p className="miniText secondaryColor mt-1">Select multiple:</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 px-2">
        {conditions.map((condition) => (
          <label
            key={condition}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedConditions.includes(condition)}
              onChange={() => toggleCondition(condition)}
              className="w-4 h-4"
              style={{accentColor: "var(--primaryColor1)"}}
            />
            <span className="text-sm">{condition}</span>
          </label>
        ))}

        <label className="flex justify-center items-center gap-2 col-span-2">
          <input
            type="text"
            placeholder="Other"
            className="secondaryOnboardingForm"
            value={other}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setOther(e.target.value)
            }
          />
        </label>
      </div>

      <div className="text-center">
        <button
          onClick={handleNext}
          className="onboardingNextButton"
        >
          Next
        </button>
      </div>
    </div>
  );
}