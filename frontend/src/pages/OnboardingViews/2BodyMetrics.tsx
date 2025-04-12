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
  
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const ws = parseFloat(waist);
  
    if (
      isNaN(w) || isNaN(h) || isNaN(n) || isNaN(ws) ||
      w <= 0 || h <= 0 || n <= 0 || ws <= 0
    ) {
      alert("Please enter valid positive numbers.");
      return;
    }
  
    // Add unit-based validation
    if (units === "metric") {
      if (w < 30 || w > 300) return alert("Weight should be between 30–300 kg.");
      if (h < 100 || h > 250) return alert("Height should be between 100–250 cm.");
      if (n < 20 || n > 60) return alert("Neck should be between 20–60 cm.");
      if (ws < 40 || ws > 200) return alert("Waist should be between 40–200 cm.");
    } else {
      if (w < 66 || w > 660) return alert("Weight should be between 66–660 lbs.");
      if (h < 39 || h > 98) return alert("Height should be between 39–98 in.");
      if (n < 8 || n > 24) return alert("Neck should be between 8–24 in.");
      if (ws < 16 || ws > 79) return alert("Waist should be between 16–79 in.");
    }
  
    onNext({
      weight: w,
      height: h,
      neck: n,
      waist: ws,
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
          placeholder={units === "metric" ? "Weight (kg)" : "Weight (lbs)"}
          className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
          value={formData.weight}
          onChange={handleChange}
        />
        <input
          type="number"
          name="height"
          placeholder={units === "metric" ? "Height (cm)" : "Height (in)"}
          className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
          value={formData.height}
          onChange={handleChange}
        />
        <input
          type="number"
          name="neck"
          placeholder={units === "metric" ? "Neck (cm)" : "Neck (in)"}
          className="rounded-full px-4 py-3 shadow-md w-full focus:outline-none"
          value={formData.neck}
          onChange={handleChange}
        />
        <input
          type="number"
          name="waist"
          placeholder={units === "metric" ? "Waist (cm)" : "Waist (in)"}
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