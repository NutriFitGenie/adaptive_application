import { useState, ChangeEvent } from "react";

import Logo from "../../assets/Logo.svg";

interface BodyMetricsProps {
  onNext: (data: {
    weight: number;
    height: number;
    neck: number;
    waist: number;
    activityLevel: string;
    units: "metric" | "imperial";
  }) => void;
}

export default function BodyMetrics({ onNext }: BodyMetricsProps) {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [formData, setFormData] = useState({
    weight: "",
    height: "",
    neck: "",
    waist: "",
    activityLevel: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    const { weight, height, neck, waist, activityLevel } = formData;
    if (!weight || !height || !neck || !waist || !activityLevel) {
      alert("Please fill out all fields.");
      return;
    }

    if (isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      alert("Invalid weight");
      return;
    }
    if (isNaN(parseFloat(height)) || parseFloat(height) <= 0) {
      alert("Invalid height");
      return;
    }
    if (isNaN(parseFloat(neck)) || parseFloat(neck) <= 0) {
      alert("Invalid neck measurement");
      return;
    }
    if (isNaN(parseFloat(waist)) || parseFloat(waist) <= 0) {
      alert("Invalid waist measurement");
      return;
    }

    onNext({
      weight: parseFloat(weight),
      height: parseFloat(height),
      neck: parseFloat(neck),
      waist: parseFloat(waist),
      activityLevel,
      units,
    });
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
        <h1 className="titleText primaryColor1">Body Metrics</h1>
        <p className="miniText secondaryColor mt-1">
          Tell us more about your body.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <input
          type="number"
          name="weight"
          placeholder="Weight"
          className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
          value={formData.weight}
          onChange={handleChange}
        />
        <input
          type="number"
          name="height"
          placeholder="Height"
          className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
          value={formData.height}
          onChange={handleChange}
        />
        <input
          type="number"
          name="neck"
          placeholder="Neck"
          className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
          value={formData.neck}
          onChange={handleChange}
        />
        <input
          type="number"
          name="waist"
          placeholder="Waist"
          className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
          value={formData.waist}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-center mb-5">
        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
          className="secondaryOnboardingForm"
        >
          <option value="" disabled>
            Activity Level
          </option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>

      <div className="flex justify-center items-center gap-3 mb-6">
        <span className="miniText">Metric</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={units === "imperial"}
            onChange={() => setUnits(units === "metric" ? "imperial" : "metric")}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primaryColor1 relative"></div>
        </label>
        <span className="miniText">Imperial</span>
      </div>

      <div className="text-center">
        <button
          className="onboardingNextButton"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}