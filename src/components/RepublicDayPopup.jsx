import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const RepublicDayPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const navigate = useNavigate();
  const { applyCoupon } = useCart();

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasSeenPopup = sessionStorage.getItem('republicDayPopupSeen');
    
    // Exit intent detection
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasSeenPopup) {
        setIsOpen(true);
        sessionStorage.setItem('republicDayPopupSeen', 'true');
      }
    };

    // Show after 10 seconds automatically if not exit intent
    const timer = setTimeout(() => {
       if (!hasSeenPopup) {
         setIsOpen(true);
         sessionStorage.setItem('republicDayPopupSeen', 'true');
       }
    }, 10000);

    document.addEventListener('mouseleave', handleMouseLeave);

    // Countdown Timer Logic
    const targetDate = new Date('2026-01-31T23:59:59');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGetDiscount = () => {
    applyCoupon('REPUBLIC10');
    setIsOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white rounded-full p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Section - Gradient & Main Offer */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-100 via-white to-green-100 p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
               {/* Decorative Circles */}
               <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-orange-200 rounded-full opacity-30 blur-2xl"></div>
               <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-green-200 rounded-full opacity-30 blur-2xl"></div>

               <h3 className="text-orange-600 font-bold tracking-widest uppercase mb-2 text-sm flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" /> Wait! before you leave...
               </h3>
               
               <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                 Happy Republic Day <span className="text-4xl">🎉</span>
               </h2>
               
               <p className="text-gray-600 mb-6 max-w-xs">
                 Get flat <span className="font-bold text-green-600 text-xl">10% OFF</span> on your first order!
               </p>

               <div className="border-2 border-dashed border-blue-300 bg-white/50 rounded-lg p-4 mb-6 w-full max-w-xs">
                  <p className="text-xs text-gray-500 uppercase mb-1">Use Code</p>
                  <p className="text-2xl font-mono font-bold text-blue-800 tracking-wider">REPUBLIC10</p>
               </div>

               {/* Countdown */}
               <div className="flex gap-3 mb-8">
                  {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                     <div key={unit} className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
                           {timeLeft[unit]}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 capitalize">{unit}</span>
                     </div>
                  ))}
               </div>

               <Button 
                 onClick={handleGetDiscount}
                 className="w-full max-w-xs bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white font-bold py-6 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
               >
                 Get Discount Now
               </Button>
               
               <p className="text-[10px] text-gray-400 mt-4 text-center">
                  Valid for new customers only. Offer ends 31/01/26.
               </p>
            </div>

            {/* Right Section - Flash Sales */}
            <div className="w-full md:w-1/2 bg-gray-50 p-6 hidden md:flex flex-col">
               <div className="mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center">
                     <Clock className="w-4 h-4 mr-2 text-red-500" /> Flash Deals ending soon
                  </h3>
               </div>

               <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {[
                     { name: "Tactical Combat Boots", price: 4999, oldPrice: 5500, img: "https://images.unsplash.com/photo-1599238683135-39cc826c3f3d" },
                     { name: "Military Watch Pro", price: 2499, oldPrice: 2999, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
                     { name: "Survival Backpack 40L", price: 4499, oldPrice: 5000, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" }
                  ].map((item, i) => (
                     <div key={i} className="flex items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                           <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                           <span className="absolute top-0 left-0 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br">-10%</span>
                        </div>
                        <div className="ml-3 flex-1">
                           <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                           <div className="flex items-center mt-1">
                              <span className="font-bold text-blue-800">₹{item.price}</span>
                              <span className="text-xs text-gray-400 line-through ml-2">₹{item.oldPrice}</span>
                           </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => navigate('/products')}>
                           View
                        </Button>
                     </div>
                  ))}
               </div>
               
               <div className="mt-4 bg-blue-50 p-3 rounded-lg text-xs text-blue-800 text-center">
                  🔥 15 people are viewing these offers right now
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RepublicDayPopup;