import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, coupon, applyCoupon, removeCoupon, getDiscountAmount, clearCart } = useCart();
  const { toast } = useToast();
  
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check authentication
    const user = localStorage.getItem('currentUser');
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout",
      });
      navigate('/login');
    }

    if (cartItems.length === 0) {
       navigate('/cart');
    }
  }, [navigate, cartItems, toast]);

  const subtotal = getCartTotal();
  const discount = getDiscountAmount();
  const taxableAmount = subtotal - discount;
  const gstRate = 0.18;
  const gstAmount = taxableAmount * gstRate;
  const shippingCost = 100;
  const grandTotal = taxableAmount + gstAmount + shippingCost;

  const handleApplyCoupon = () => {
     const success = applyCoupon(couponInput);
     if (!success) {
       toast({
         title: "Invalid Coupon",
         description: "The coupon code you entered is invalid.",
         variant: "destructive"
       });
     }
  };

  const handlePlaceOrder = () => {
     setIsProcessing(true);
     
     setTimeout(() => {
       const orderId = 'ORD-' + Date.now() + Math.floor(Math.random() * 1000);
       const user = JSON.parse(localStorage.getItem('currentUser'));
       
       const newOrder = {
          id: orderId,
          userId: user.id,
          date: new Date().toLocaleDateString(),
          items: cartItems,
          subtotal,
          discount,
          gst: gstAmount,
          shipping: shippingCost,
          total: grandTotal,
          paymentMethod,
          status: 'Order Placed'
       };

       // Get existing orders
       const existingOrders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
       const updatedOrders = [...existingOrders, newOrder];
       localStorage.setItem('orders', JSON.stringify(updatedOrders));

       clearCart();
       setIsProcessing(false);
       navigate(`/order-confirmation/${orderId}`);

     }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>Checkout - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Form & Payment */}
              <div className="lg:col-span-2 space-y-8">
                 {/* Shipping Address (Mock) */}
                 <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                       <Truck className="w-5 h-5 mr-2 text-blue-800" />
                       Shipping Address
                    </h2>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                       <p className="font-bold text-gray-900">Sharma Customer</p>
                       <p className="text-gray-600">Mallaguri More, Pradhan Nagar</p>
                       <p className="text-gray-600">Siliguri, West Bengal, 734001</p>
                       <p className="text-gray-600">+91 98765 43210</p>
                    </div>
                 </div>

                 {/* Payment Options */}
                 <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                       <CreditCard className="w-5 h-5 mr-2 text-blue-800" />
                       Payment Method
                    </h2>
                    
                    <div className="space-y-4">
                       <div 
                         onClick={() => setPaymentMethod('online')}
                         className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'online' ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800' : 'border-gray-200 hover:border-blue-300'}`}
                       >
                          <div className="flex items-center">
                             <input 
                               type="radio" 
                               checked={paymentMethod === 'online'} 
                               onChange={() => setPaymentMethod('online')}
                               className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                             />
                             <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-900">Online Payment (Card/UPI/NetBanking)</span>
                             </div>
                          </div>
                          {paymentMethod === 'online' && (
                             <div className="mt-4 ml-7 p-3 bg-white rounded border border-gray-200 text-sm text-gray-500">
                                You will be redirected to Razorpay secure gateway to complete payment.
                             </div>
                          )}
                       </div>

                       <div 
                         onClick={() => setPaymentMethod('cod')}
                         className={`p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800' : 'border-gray-200 hover:border-blue-300'}`}
                       >
                          <div className="flex items-center">
                             <input 
                               type="radio" 
                               checked={paymentMethod === 'cod'} 
                               onChange={() => setPaymentMethod('cod')}
                               className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                             />
                             <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-900">Cash on Delivery</span>
                             </div>
                          </div>
                          {paymentMethod === 'cod' && (
                             <div className="mt-4 ml-7 p-3 bg-white rounded border border-gray-200 text-sm text-gray-500 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Pay securely with cash upon delivery.
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-1">
                 <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Breakdown</h2>

                    {/* Items List (Collapsed) */}
                    <div className="max-h-60 overflow-y-auto mb-6 space-y-3 pr-2 custom-scrollbar">
                       {cartItems.map(item => (
                          <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm">
                             <span className="text-gray-600 w-2/3 truncate">{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                             <span className="text-gray-900 font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                       ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-3 mb-6">
                       <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                       </div>
                       
                       {coupon ? (
                          <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded">
                             <span className="flex items-center">Coupon ({coupon.code}) <button onClick={removeCoupon} className="ml-2 text-xs text-red-500 underline">Remove</button></span>
                             <span>-₹{discount.toLocaleString()}</span>
                          </div>
                       ) : (
                          <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={couponInput}
                               onChange={(e) => setCouponInput(e.target.value)}
                               placeholder="Coupon Code"
                               className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
                             />
                             <Button onClick={handleApplyCoupon} variant="outline" size="sm">Apply</Button>
                          </div>
                       )}

                       <div className="flex justify-between text-gray-600">
                          <span>GST (18%)</span>
                          <span>₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                       </div>
                       <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>₹{shippingCost.toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                       <div className="flex justify-between font-bold text-xl text-blue-800">
                          <span>Grand Total</span>
                          <span>₹{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                       </div>
                    </div>

                    <Button 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-6 text-lg shadow-lg"
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;