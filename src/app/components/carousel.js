"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";

import { symbols } from "@/data/symbols";
import { getCurrencySymbol } from "@/app/utils";

export default function Carousel() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cards');

        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        setCards(data);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div className="w-full max-w-md mx-auto p-4 text-center">Loading cards...</div>;
  }

  if (error) {
    return <div className="w-full max-w-md mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  if (cards.length === 0) {
    return <div className="w-full max-w-md mx-auto p-4 text-center">No cards found.</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Swiper
        rewind={true}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        style={{
          "--swiper-theme-color": "#888",
        }}
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index} className="p-4 rounded-lg shadow-md bg-white space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-gray-800">
                <span className="bg-gray-100 px-2 py-1 rounded">{card.debtor}</span>
                {" "}has to pay{" "}
                <span className="bg-gray-100 px-2 py-1 rounded">{card.payer}</span>
              </p>
            </div>

            <div className="bg-gray-100 px-2 py-1 rounded w-full">
              {card.money.length === 0 ? (
                <span className="block text-sm text-gray-600 italic">0</span>
              ) : (
                <div className="space-y-1">
                  {card.money.map((entry, idx) => {
                    const isNegative = entry.amount < 0;
                    return (
                      <div key={idx} className="flex justify-between">
                        <span className={`text-sm ${isNegative ? 'text-red-600' : 'text-gray-800'}`}>
                          {isNegative ? '-' : ''}{getCurrencySymbol(entry.currency.toUpperCase())} {Math.abs(entry.amount).toFixed(2)}
                          {isNegative ? ' (credit)' : ' (debit)'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t pt-2">
              <p className="text-sm text-gray-600 italic">
                Net amount to pay:
                <span className="bg-gray-100 px-2 py-1 rounded ml-1 text-gray-800 font-bold">
                  {getCurrencySymbol(card.targetCurrency.toUpperCase())} {card.totalAmount}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Converted to {card.targetCurrency})
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};