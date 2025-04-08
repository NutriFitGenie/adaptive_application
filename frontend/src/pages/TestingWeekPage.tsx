// TestingWeekPage.tsx
import React, { useState, useEffect } from 'react';
import '../../App.css';

const userId = "67e1627cebe27e5f8285ec21";

interface TestingPlanDay {
  Day: number;
  Exercises: {
    Exercise_id: string;
    name: string;
    description: string;
    category: string;
  }[];
}

const TestingWeekPage: React.FC = () => {
  const [testingPlan, setTestingPlan] = useState<TestingPlanDay[]>([]);
  const [testingInputs, setTestingInputs] = useState<{ [key: string]: string }>({});
  const [testingCompleted, setTestingCompleted] = useState<boolean>(false);

  // Fetch testing plan.
  const fetchTestingPlan = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/generateTestingPlan?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch testing plan");
      const planData = await response.json();
      setTestingPlan(planData);
    } catch (error) {
      console.error("Error fetching testing plan:", error);
    }
  };

  // Fetch testing status.
  const fetchTestStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workout/testStatus?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch test status");
      const statusData = await response.json();
      // Assuming the API returns { testingCompleted: boolean }
      setTestingCompleted(statusData.testingCompleted);
    } catch (error) {
      console.error("Error fetching test status:", error);
    }
  };

  useEffect(() => {
    fetchTestStatus();
    fetchTestingPlan();
  }, []);

  const handleTestingInputChange = (dayIndex: number, exerciseIndex: number, value: string) => {
    const key = `${dayIndex}_${exerciseIndex}`;
    setTestingInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitTesting = async () => {
    let hasInvalidInput = false;
    testingPlan.forEach((day, dIndex) => {
      day.Exercises.forEach((ex, eIndex) => {
        const key = `${dIndex}_${eIndex}`;
        const value = testingInputs[key];
        if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
          hasInvalidInput = true;
        }
      });
    });
    if (hasInvalidInput) {
      alert("Please enter a valid positive 1RM value for all exercises.");
      return;
    }

    // Build updated testing plan.
    const updatedPlan = testingPlan.map((day, dIndex) => ({
      Day: day.Day,
      Exercises: day.Exercises.map((ex, eIndex) => {
        const key = `${dIndex}_${eIndex}`;
        return {
          Exercise_id: ex.Exercise_id,
          Exercise: ex.name,
          description: ex.description,
          body_part: ex.category,
          oneRepMax: parseFloat(testingInputs[key]),
        };
      }),
    }));

    try {
      const response = await fetch('http://localhost:3000/api/workout/updateTestingPlan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updatedPlan }),
      });
      if (!response.ok) throw new Error('Failed to update testing plan');
      const result = await response.json();
      console.log('Updated testing plan result:', result);
      setTestingCompleted(true);
    } catch (error) {
      console.error('Error updating testing plan:', error);
    }
  };

  if (testingCompleted) {
    return (
      <div className="App">
        <h2>Testing Complete</h2>
        <p>You have completed the testing week!</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Skeleton Testing Workout Plan</h2>
        <p>Please enter your One Rep Max (1RM) values for each exercise.</p>
      </header>
      <div className="testing-plan">
        {testingPlan.map((day, dIndex) => (
          <div key={dIndex} className="day-plan">
            <h3>Day {day.Day}</h3>
            {day.Exercises.map((ex, eIndex) => {
              const key = `${dIndex}_${eIndex}`;
              return (
                <div key={key} className="exercise-testing">
                  <h4>{ex.name}</h4>
                  <p>{ex.description}</p>
                  <p>Body Part: {ex.category}</p>
                  <label>
                    1RM:{" "}
                    <input
                      type="number"
                      min={0}
                      value={testingInputs[key] || ""}
                      onChange={(e) => handleTestingInputChange(dIndex, eIndex, e.target.value)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button onClick={handleSubmitTesting}>Submit Testing Week</button>
    </div>
  );
};

export default TestingWeekPage;
