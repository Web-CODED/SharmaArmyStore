import React, { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';

const ProductSalesWidget = () => {
  const [soldCount, setSoldCount] = useState(0);

  useEffect(() => {
    // Initial random number 73-78
    const getRandom = () => Math.floor(Math.random() * (78 - 73 + 1)) + 73;
    setSoldCount(getRandom());

    const interval = setInterval(() => {
      setSoldCount(getRandom());
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  if (soldCount === 0) return null;

  return (
    <div className="inline-flex items-center justify-center bg-white border border-purple-200 rounded-full px-4 py-1.5 shadow-sm mb-4">
      <Flame className="w-4 h-4 text-orange-500 mr-2 animate-pulse fill-orange-500" />
      <span className="text-sm font-medium text-gray-800">
        <span className="font-bold">{soldCount}</span> sold in last 12 hours
      </span>
    </div>
  );
};

export default ProductSalesWidget;