import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId]);

  if (!order) return <div className="p-8 text-center">Order not found</div>;

  const steps = [
     { status: 'Order Placed', icon: Clock, done: true },
     { status: 'Shipped', icon: Package, done: order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered' },
     { status: 'Out for Delivery', icon: Truck, done: order.status === 'Out for Delivery' || order.status === 'Delivered' },
     { status: 'Delivered', icon: CheckCircle, done: order.status === 'Delivered' }
  ];

  return (
    <>
      <Helmet>
         <title>Order #{orderId} - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/profile">
               <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-blue-800">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders
               </Button>
            </Link>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
               <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                     <h1 className="text-xl font-bold text-gray-900">Order #{order.id}</h1>
                     <p className="text-sm text-gray-500">Placed on {order.date}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-sm">
                     {order.status}
                  </div>
               </div>

               {/* Timeline */}
               <div className="p-8 border-b border-gray-100">
                  <div className="relative flex justify-between">
                     {/* Line background */}
                     <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                     {/* Steps */}
                     {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center bg-white px-2">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step.done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                              <step.icon className="w-5 h-5" />
                           </div>
                           <p className={`text-xs font-medium mt-2 ${step.done ? 'text-green-600' : 'text-gray-400'}`}>{step.status}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Items */}
               <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                     {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                           <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} | Size: {item.selectedSize || 'N/A'}</p>
                              <p className="text-blue-800 font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Summary */}
               <div className="bg-gray-50 p-6">
                  <div className="flex justify-between mb-2">
                     <span className="text-gray-600">Subtotal</span>
                     <span>₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  {order.discount > 0 && (
                     <div className="flex justify-between mb-2 text-green-600">
                        <span>Discount</span>
                        <span>-₹{order.discount.toLocaleString()}</span>
                     </div>
                  )}
                  <div className="flex justify-between mb-2">
                     <span className="text-gray-600">GST (18%)</span>
                     <span>₹{order.gst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                     <span className="text-gray-600">Shipping</span>
                     <span>₹{order.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-4">
                     <span>Total Paid</span>
                     <span>₹{order.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </>
  );
};

export default OrderDetail;