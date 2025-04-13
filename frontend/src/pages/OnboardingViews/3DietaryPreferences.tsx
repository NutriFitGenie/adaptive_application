import { useState, ChangeEvent } from "react";

import Logo from "../../assets/Logo.svg";

interface DietaryPreferencesProps {
  onNext: (data: string[]) => void;
}

export default function DietaryPreferences({ onNext }: DietaryPreferencesProps) {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [other, setOther] = useState("");

  const preferences = [
    "Balanced",
    "Lactose Intolerant",
    "Gluten Intolerant",
    "Vegetarian",
    "Vegan",
    "Kosher",
    "Keto",
    "Dairy-Free",
    "High-Protein",
  ];

  const togglePreference = (pref: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((item) => item !== pref)
        : [...prev, pref]
    );
  };

  const handleNext = () => {
    const allPreferences = [...selectedPreferences];
    const trimmedOther = other.trim();

    if (trimmedOther) {
      if (/^\d+$/.test(trimmedOther)) {
        alert("Please enter a valid dietary preference for 'Other'.");
        return;
      }
      allPreferences.push(trimmedOther);
    }

    onNext(allPreferences);
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
        <h1 className="titleText primaryColor1">Dietary Preferences</h1>
        <p className="miniText secondaryColor mt-1">What diet do you prefer?</p>
        <p className="miniText secondaryColor mt-1">Select multiple:</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 px-2">
        {preferences.map((pref) => (
          <label
            key={pref}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedPreferences.includes(pref)}
              onChange={() => togglePreference(pref)}
              className="w-4 h-4"
              style={{accentColor: "var(--primaryColor1)"}}
            />
            <span className="text-sm">{pref}</span>
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