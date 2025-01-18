export const tripName = "Ferry Trip";
export const participants = ["Alice", "Bob", "Charlie"];
export const cards = [
  {
    // TODO: add a UUID
    payer: "Alice",
    debtor: "Bob",
    money: [
      {
        "amount": 80,
        "currency": "EUR",
      },
      {
        "amount": 12,
        "currency": "GBP",
      },
      {
        "amount": 100,
        "currency": "TWD",
      },
    ],
    targetCurrency: "EUR",
    totalAmount: "120.08",
  },
  {
    payer: "Alice",
    debtor: "Bob",
    money: [],
    targetCurrency: "EUR",
    totalAmount: "220.08",
  },
  {
    payer: "Alice",
    debtor: "Bob",
    money: [
      {
        "amount": 80,
        "currency": "EUR",
      }
    ],
    targetCurrency: "EUR",
    totalAmount: "320.08",
  },
  {
    payer: "Alice",
    debtor: "Bob",
    money: [
      {
        "amount": 80,
        "currency": "EUR",
      }
    ],
    targetCurrency: "EUR",
    totalAmount: "420.08",
  }
];

export const purchases = [
  {
    payer: "Alice",
    amount: 80,
    currency: "EUR",
    item: "churros",
    note: "Tasty but the boss is not patient",
    debtors: ["Alice", "Bob"],
    timestamp: "2025-01-06T15:30:00+01:00",
  },
  {
    payer: "Bob",
    amount: 150,
    currency: "USD",
    item: "museum tickets",
    note: "Visited the National Art Museum",
    debtors: ["Bob", "Charlie"],
    timestamp: "2025-01-06T14:00:00+01:00",
  },
  {
    payer: "Charlie",
    amount: 45,
    currency: "GBP",
    item: "coffee",
    note: "Had coffee at the local café",
    debtors: ["Alice", "Charlie", "Bob"],
    timestamp: "2025-01-06T12:30:00+01:00",
  },
  {
    payer: "Alice",
    amount: 300,
    currency: "EUR",
    item: "dinner",
    note: "Dinner at the French restaurant",
    debtors: ["Alice", "Bob", "Charlie"],
    timestamp: "2025-01-05T20:00:00+01:00",
  },
  {
    payer: "Bob",
    amount: 120,
    currency: "TWD",
    item: "bubble tea",
    note: "Ordered a lot of bubble tea",
    debtors: ["Alice", "Bob"],
    timestamp: "2025-01-06T03:00:00+01:00",
  },
  {
    payer: "Alice",
    amount: 80,
    currency: "EUR",
    item: "churros",
    note: "Tasty but the boss is not patient",
    debtors: ["Alice", "Bob"],
    timestamp: "2025-01-06T15:30:00+01:00",
  },
  {
    payer: "Bob",
    amount: 150,
    currency: "USD",
    item: "museum tickets",
    note: "Visited the National Art Museum",
    debtors: ["Bob", "Charlie"],
    timestamp: "2025-01-06T14:00:00+01:00",
  },
  {
    payer: "Charlie",
    amount: 45,
    currency: "GBP",
    item: "coffee",
    note: "Had coffee at the local café",
    debtors: ["Alice", "Charlie", "Bob"],
    timestamp: "2025-01-06T12:30:00+01:00",
  },
  {
    payer: "Alice",
    amount: 300,
    currency: "EUR",
    item: "dinner",
    note: "Dinner at the French restaurant",
    debtors: ["Alice", "Bob", "Charlie"],
    timestamp: "2025-01-05T20:00:00+01:00",
  },
  {
    payer: "Bob",
    amount: 120,
    currency: "TWD",
    item: "bubble tea",
    note: "Ordered a lot of bubble tea",
    debtors: ["Alice", "Bob"],
    timestamp: "2025-01-06T03:00:00+01:00",
  },
];
