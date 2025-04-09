import React, { useState } from 'react';

interface RecommendationProps {
  apiBase: string;
}

const Recommendation: React.FC<RecommendationProps> = ({ apiBase }) => {
  const [userId, setUserId] = useState('');
  const [recommendations, setRecommendations] = useState<any>(null);

  const handleGetRecommendations = async () => {
    if (!userId) {
      alert('Please enter a user ID.');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/food-recommender`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setRecommendations(data);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h3>Get Recipe Recommendations</h3>
      <label>
        User ID:
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID from registration"
        />
      </label>
      <br />
      <button onClick={handleGetRecommendations}>Fetch Recommendations</button>
      {recommendations && (
        <div>
          <h4>Recommended Recipes:</h4>
          <pre>{JSON.stringify(recommendations, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Recommendation;