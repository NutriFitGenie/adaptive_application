import { useState } from "react";

interface FitnessGoalsProps {
  onNext: (data: {
    goal: string;
    fitnessLevel: string;
    daysPerWeek: number;
  }) => void;
}

export default function FitnessGoals({ onNext }: FitnessGoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState(4);

  const fitnessGoals = [
    { label: "Fat Loss", value: "fat_loss", icon: "🔥" },
    { label: "Muscle Gain", value: "muscle_gain", icon: "💪" },
    { label: "Maintain Weight", value: "maintain_weight", icon: "⚖️" },
    { label: "Improve Endurance", value: "improve_endurance", icon: "🏃" },
  ];

  const handleNext = () => {
    if (!selectedGoal || !fitnessLevel || !daysPerWeek) {
      alert("Please complete all fields.");
      return;
    }

    onNext({
      goal: selectedGoal,
      fitnessLevel,
      daysPerWeek,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="titleText primaryColor1">Fitness Goals</h1>
        <p className="miniText secondaryColor mt-1">
          What is your primary fitness goal? We'll personalise your experience based on this.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        {fitnessGoals.map((goal) => (
          <button
            key={goal.value}
            onClick={() => setSelectedGoal(goal.value)}
            className={`rounded-2xl shadow-md px-4 py-4 text-center transition-all duration-200 ${
              selectedGoal === goal.value
                ? "primaryColor1BG textLight"
                : "textDark background"
            }`}
          >
            <div className="text-3xl mb-2">{goal.icon}</div>
            <div className="font-semibold">{goal.label}</div>
          </button>
        ))}
      </div>

      <div className="mb-5">
        <select
          className="w-full rounded-full px-4 py-3 shadow-md textDark focus:outline-none"
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

      <div className="mb-5 text-center">
        <label className="block mb-1 miniText">How many days a week?</label>
        <input
          type="number"
          min={1}
          max={7}
          className="rounded-full px-4 py-2 shadow-md w-20 text-center"
          value={daysPerWeek}
          onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
        />
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