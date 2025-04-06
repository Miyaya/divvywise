import { useEffect, useState } from "react";

export default function Header({ tripId }) {
  const [tripName, setTripName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTripName() {
      if (!tripId) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/trip', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tripId }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to fetch trip name');
        } else {
          setTripName(result.tripName);
        }
      } catch (err) {
        setError('Failed to fetch trip name');
        console.error('Error fetching trip name:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTripName();
  }, [tripId]);

  return (
    <header className="flex items-center justify-center h-24 py-4">
      <h1 className="text-xl font-bold">
        {isLoading ? "Loading..." : (error ? `Error: ${error}` : tripName)}
      </h1>
    </header>
  );
}