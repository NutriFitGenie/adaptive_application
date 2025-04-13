import { useState, ChangeEvent } from "react";
import Logo from "../../assets/Logo.svg";

interface FitnessGoalsProps {
  onNext: (data: {
    goal: string;
    fitnessLevel: string;
    daysPerWeek: number;
    targetWeight?: number;
    units?: "metric" | "imperial";
  }) => void;
}

export default function FitnessGoals({ onNext }: FitnessGoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [targetWeight, setTargetWeight] = useState("");
  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  const fitnessGoals = [
    { label: "Fat Loss", value: "fat_loss", icon: "🔥" },
    { label: "Muscle Gain", value: "muscle_gain", icon: "💪" },
  ];

  const handleNext = () => {
    if (!selectedGoal || !fitnessLevel || !daysPerWeek || !targetWeight) {
      alert("Please complete all fields.");
      return;
    }

    if (daysPerWeek < 1 || daysPerWeek > 7) {
      alert("Days per week must be between 1 and 7.");
      return;
    }

    let parsedWeight: number | undefined;
    if (targetWeight) {
      parsedWeight = parseFloat(targetWeight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        alert("Please enter a valid target weight.");
        return;
      }

      // Optional range check
      if (
        (units === "metric" && (parsedWeight < 30 || parsedWeight > 300)) ||
        (units === "imperial" && (parsedWeight < 66 || parsedWeight > 660))
      ) {
        alert(
          `Target weight should be between ${
            units === "metric" ? "30–300 kg" : "66–660 lbs"
          }.`
        );
        return;
      }
    }

    onNext({
      goal: selectedGoal,
      fitnessLevel,
      daysPerWeek,
      targetWeight: parsedWeight,
      units,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-end h-16 w-full">
        <img src={Logo} alt="Logo" className="lg:h-0 lg:w-0 h-full w-full" />
      </div>

      <div className="text-center mb-6">
        <h1 className="titleText primaryColor1">Fitness Goals</h1>
        <p className="miniText secondaryColor mt-1">
          What is your primary fitness goal? We'll personalise your experience based on this.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        {fitnessGoals.map((goal) => (
          <div
            key={goal.value}
            onClick={() => setSelectedGoal(goal.value)}
            className={`rounded-2xl shadow-md px-4 py-4 text-center transition-all duration-200 ${
              selectedGoal === goal.value
                ? "primaryColor1BG textLight"
                : "textDark background"
            }`}
          >
            <div className="text-4xl mb-2">{goal.icon}</div>
            <div className="font-semibold">{goal.label}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-5">
        <select
          className="secondaryOnboardingForm"
          value={fitnessLevel}
          onChange={(e) => setFitnessLevel(e.target.value)}
        >
          <option value="" disabled>
            Fitness Level
          </option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="flex justify-center items-center gap-12 mb-5 text-center">
        <label className="block mb-1 textDark">How many days a week?</label>
        <input
          type="number"
          min={1}
          max={7}
          className="rounded-full px-4 py-2 shadow-md w-20 text-center"
          value={daysPerWeek}
          onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
        />
      </div>

      <div className="flex justify-center mb-5">
        <input
          type="number"
          name="targetWeight"
          placeholder={units === "metric" ? "Target Weight (kg)" : "Target Weight (lbs)"}
          className="secondaryOnboardingForm"
          value={targetWeight}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTargetWeight(e.target.value)
          }
        />
      </div>

      <div className="flex justify-center items-center gap-3 mb-6">
        <span className="miniText">Metric</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={units === "imperial"}
            onChange={() =>
              setUnits(units === "metric" ? "imperial" : "metric")
            }
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryColor1 relative"></div>
        </label>
        <span className="miniText">Imperial</span>
      </div>

      <div className="text-center">
        <button onClick={handleNext} className="onboardingNextButton">
          Next
        </button>
      </div>
    </div>
  );
}