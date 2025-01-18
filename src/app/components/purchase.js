import { participants, purchases } from "@/data/data";

export default function Purchase() {
  return (<div className={"p-4"}>
    <h2 className="text-lg font-semibold mb-4">Purchases</h2>
    <div className="space-y-3">
      {purchases.map((purchase, idx) => (
        <div
          key={idx}
          className="p-4 border rounded-lg shadow-md bg-white space-y-2"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">{purchase.item}</h2>
            <p className="text-sm font-medium text-gray-600">
              {purchase.currency} {purchase.amount.toFixed(2)}
            </p>
          </div>

          <p className="text-sm text-gray-600 italic">{purchase.note}</p>

          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-800">{purchase.payer}</span>{" "}
            paid this purchase
          </p>
          <p className="text-sm text-gray-500">
            {purchase.debtors.length === participants.length ? (
              "Split equally"
            ) : (
              <>
                <span className="font-medium text-gray-800">
                  {purchase.debtors.map((debtor, index) => {
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
      ))}
    </div>
  </div>);
}