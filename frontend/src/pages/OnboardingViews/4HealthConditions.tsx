import { useState, ChangeEvent } from "react";

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
    if (other.trim()) {
      allConditions.push(other.trim());
    }

    if (allConditions.length === 0) {
      alert("Please select at least one health condition.");
      return;
    }

    onNext(allConditions);
  };

  return (
    <div className="w-full max-w-md mx-auto">
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
              className="accent-primaryColor1 w-4 h-4"
            />
            <span className="text-sm">{condition}</span>
          </label>
        ))}

        <label className="flex items-center gap-2 col-span-2">
          <input
            type="text"
            placeholder="Other"
            className="rounded-full px-4 py-2 shadow-md w-full focus:outline-none"
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