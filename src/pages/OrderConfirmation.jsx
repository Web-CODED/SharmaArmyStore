import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmed - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white rounded-xl shadow-lg overflow-hidden"
           >
              <div className="bg-green-50 p-8 text-center border-b border-green-100">
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                   className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                 >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                 </motion.div>
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                 <p className="text-gray-600">Thank you for your purchase. Your order has been received.</p>
                 <p className="mt-4 font-mono text-lg font-medium text-gray-800">Order ID: {orderId}</p>
              </div>

              <div className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                       <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping To</h3>
                       <p className="font-medium">Sharma Customer</p>
                       <p className="text-gray-600">Mallaguri More, Pradhan Nagar</p>
                       <p className="text-gray-600">Siliguri, West Bengal, 734001</p>
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Order Summary</h3>
                       <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{order.date}</span>
                       </div>
                       <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Payment:</span>
                          <span className="font-medium uppercase">{order.paymentMethod}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-bold text-blue-800">₹{order.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                       </div>
                    </div>
                 </div>

                 <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/products">
                       <Button variant="outline" className="w-full sm:w-auto">
                          Continue Shopping
                       </Button>
                    </Link>
                    <Link to="/profile">
                       <Button className="w-full sm:w-auto bg-blue-800 hover:bg-blue-900">
                          View Order Status <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                    </Link>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;