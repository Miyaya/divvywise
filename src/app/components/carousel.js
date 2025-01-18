"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { cards } from "@/data/data";
import { symbols } from "@/data/symbols";

export default function Carousel() {

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
                <span className="block text-sm text-gray-800">
                  {card.money.map((entry, idx) => {
                    const symbolNative = symbols[entry.currency]?.symbol_native || entry.currency;
                    return (
                      <span key={idx}>
                        {symbolNative} {entry.amount}
                        {idx < card.money.length - 1
                          ? idx === card.money.length - 2
                            ? ", and "
                            : ", "
                          : ""}
                      </span>
                    );
                  })}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 italic pb-4">
              In total,
              <span className="bg-gray-100 px-2 py-1 rounded ml-1 text-gray-800 font-bold">
                {symbols[card.targetCurrency]?.symbol_native || card.targetCurrency} {card.totalAmount}
              </span>
            </p>
          </SwiperSlide>

        ))}
      </Swiper>
    </div>
  );
};