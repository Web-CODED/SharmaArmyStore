import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const names = ["Raj", "Praveen", "Amit", "Nikhil", "Vikram", "Anjan", "Arjun", "Divyansh", "Rohan", "Probir", "Aditya", "Sunil"];
const products = ["Jungle Boots", "Short DMS Boot", "Tactical Gloves", "Military Patak", "Cold Survival Gloves", "Helmet"];
const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow"];
const times = ["just now", "just now", "1 minute ago", "2 minutes ago", "5 minutes ago"];

const LiveSalesCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', product: '', time: '' });

  useEffect(() => {
    let timeoutId;
    let hideTimeoutId;

    const showNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomTime = times[Math.floor(Math.random() * times.length)];

      setData({ name: randomName, city: randomCity, product: randomProduct, time: randomTime });
      setIsVisible(true);

      // Hide after 7 seconds
      hideTimeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 7000);

      // Schedule next notification (20-40 seconds after this one starts)
      const nextDelay = Math.floor(Math.random() * (40000 - 20000 + 1)) + 20000;
      timeoutId = setTimeout(showNotification, nextDelay);
    };

    // First notification after 5 seconds
    const initialDelay = setTimeout(showNotification, 5000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 md:left-4 md:translate-x-0 md:!transform-none z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-[90%] md:w-auto max-w-sm backdrop-blur-sm"
        >
           <div className="flex items-start gap-3 w-full">
            <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900 leading-snug">
                    <span className="font-bold">{data.name}</span> from {data.city} recently purchased <span className="font-bold text-blue-700">{data.product}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{data.time}</p>
            </div>
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LiveSalesCounter;