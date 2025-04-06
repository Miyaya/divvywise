import { useEffect, useState } from "react";
import { getCurrencySymbol } from "@/app/utils";

export default function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [purchasesRes, participantsRes] = await Promise.all([
          fetch('/api/purchases'),
          fetch('/api/participants')
        ]);

        if (!purchasesRes.ok || !participantsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const purchasesData = await purchasesRes.json();
        const participantsData = await participantsRes.json();

        setPurchases(purchasesData);
        setParticipants(participantsData.map(p => p.name));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    setPurchases([]);
  }, []);

  if (loading) {
    return (<div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 px-4">Purchases</h2>
      <div className="p-4">Loading purchases...</div>
    </div>);
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 px-4">Purchases</h2>
      <div className="space-y-3 px-4">
        {purchases.length === 0 ? (
          <div className="p-6 border rounded-lg shadow-md bg-white text-center">
            <p className="text-gray-500">No purchases found.</p>
            <p className="text-sm text-gray-400 mt-2">Add a purchase to get started!</p>
          </div>
        ) : (
          purchases.map((purchase, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg shadow-md bg-white space-y-2 w-full"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">{purchase.item}</h2>
                <p className="text-sm font-medium text-gray-600">
                  {getCurrencySymbol(purchase.currency)} {purchase.amount}
                </p>
              </div>

              <p className="text-sm text-gray-600 italic">{purchase.note}</p>

              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-800">{purchase.payer}</span>{" "}
                paid this purchase
              </p>
              <p className="text-sm text-gray-500">
                {purchase.debtors && purchase.debtors.length === participants.length ? (
                  "Split equally"
                ) : (
                  <>
                    <span className="font-medium text-gray-800">
                      {purchase.debtors && purchase.debtors.map((debtor, index) => {
                        if (index === purchase.debtors.length - 1 && index !== 0) {
                          return `, and ${debtor}`;
                        } else if (index > 0) {
                          return `, ${debtor}`;
                        }
                        return debtor;
                      })}
                    </span>{" "}
                    has to pay
                  </>
                )}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}