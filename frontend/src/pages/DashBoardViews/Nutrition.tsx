import React, { useState, useEffect } from "react";

interface RecommendationProps {
  apiBase: string;
}

const Recommendation: React.FC<RecommendationProps> = ({ apiBase }) => {
  const [userId, setUserId] = useState<string>("");
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Set the userId from localStorage once when the component mounts.
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData.id) {
        setUserId(parsedUserData.id);
        console.log("User ID:", parsedUserData.id);
      }
    }
  }, []);

  // Fetch recommendations automatically when userId is set.
  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/food-recommender`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setRecommendations(data);
        setError("");
      } catch (err: any) {
        setError(err.message || "Error fetching recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, apiBase]);

  // Render loading, error, no-data, or recommendations
  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // If recommendations is empty or falsey, show friendly message.
  if (!recommendations || (Array.isArray(recommendations) && recommendations.length === 0)) {
    return <div>No recommendations available for nutrition.</div>;
  }

  // Otherwise, render recommendations in HTML.
  return (
    <div>
      <h4>Recommended Recipes:</h4>
      {Array.isArray(recommendations) ? (
        <ul>
          {recommendations.map((rec: any, index: number) => (
            <li key={index}>
              {rec.recipeName ? rec.recipeName : JSON.stringify(rec)}
            </li>
          ))}
        </ul>
      ) : (
        <div>{JSON.stringify(recommendations)}</div>
      )}
    </div>
  );
};

export default Recommendation;