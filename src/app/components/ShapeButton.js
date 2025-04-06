"use client";

import { useState } from "react";

export default function ShapeButton() {
  const [buttonState, setButtonState] = useState(0); // 0: 圓形, 1: 方形, 2: 三角形

  // 按鈕顏色列表
  const buttonColors = [
    { bg: 'bg-blue-500', hover: 'hover:bg-blue-600' },
    { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
    { bg: 'bg-purple-500', hover: 'hover:bg-purple-600' },
    { bg: 'bg-red-500', hover: 'hover:bg-red-600' },
    { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' }
  ];

  // 按鈕形狀樣式
  const buttonShapes = [
    'rounded-full', // 圓形
    'rounded-md',   // 方形
    'rounded-none'  // 三角形
  ];

  // 處理按鈕點擊
  const handleButtonClick = () => {
    setButtonState((prevState) => (prevState + 1) % buttonShapes.length);
  };

  // 獲取當前按鈕顏色
  const currentColor = buttonColors[buttonState % buttonColors.length];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleButtonClick}
        className={`${currentColor.bg} ${currentColor.hover} ${buttonShapes[buttonState]} text-white font-bold py-2 px-4 transition-all duration-300 transform hover:scale-110 shadow-lg`}
        style={{
          width: buttonState === 0 ? '60px' : buttonState === 1 ? '120px' : '0',
          height: buttonState === 0 ? '60px' : buttonState === 1 ? '60px' : '0',
          clipPath: buttonState === 2 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
          padding: buttonState === 2 ? '0' : '0.5rem 1rem'
        }}
      >
        {buttonState === 0 ? '圓' : buttonState === 1 ? '方形' : '三角'}
      </button>
    </div>
  );
} 