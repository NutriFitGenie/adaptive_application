import React, { useState } from 'react';

interface WeeklyProgressFormProps {
  apiBase: string;
}

const WeeklyProgressForm: React.FC<WeeklyProgressFormProps> = ({ apiBase }) => {
  const [formData, setFormData] = useState({
    userId: '',
    weight: '',
    waist: '',
    otherMeasurements: '',
  });
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiBase}/weeklyprogress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResponseMsg(`Weekly progress saved: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      setResponseMsg(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Submit Weekly Progress</h3>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input name="userId" value={formData.userId} onChange={handleChange} required />
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
          Waist (cm):
          <input
            type="number"
            name="waist"
            value={formData.waist}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Other Measurements:
          <input
            name="otherMeasurements"
            value={formData.otherMeasurements}
            onChange={handleChange}
            placeholder="optional"
          />
        </label>
        <br />
        <button type="submit">Submit Progress</button>
      </form>
      {responseMsg && <pre>{responseMsg}</pre>}
    </div>
  );
};

export default WeeklyProgressForm;