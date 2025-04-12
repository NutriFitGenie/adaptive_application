import React, { useState } from 'react';

interface UserFormProps {
  apiBase: string;
}

const UserForm: React.FC<UserFormProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    dietaryPreferences: '',
    allergies: '',
    fitnessGoal: 'fat_loss',
  });
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponseMsg(`User created/updated: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResponseMsg(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>User Registration / Info</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Height (cm):
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Weight (kg):
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Dietary Preferences:
          <input
            name="dietaryPreferences"
            value={formData.dietaryPreferences}
            onChange={handleChange}
            placeholder="e.g., vegan, paleo"
          />
        </label>
        <br />
        <label>
          Allergies:
          <input
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="comma separated"
          />
        </label>
        <br />
        <label>
          Fitness Goal:
          <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange}>
            <option value="fat_loss">Fat Loss</option>
            <option value="muscle_gain">Muscle Gain</option>
            <option value="maintain">Maintain</option>
          </select>
        </label>
        <br />
        <button type="submit">Submit User Info</button>
      </form>
      {responseMsg && <pre>{responseMsg}</pre>}
    </div>
  );
};

export default UserForm;