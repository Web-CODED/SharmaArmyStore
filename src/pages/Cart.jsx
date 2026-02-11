import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <ShoppingBag className="w-8 h-8 mr-3 text-blue-800" />
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-12 text-center"
            >
              <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any tactical gear to your cart yet.</p>
              <Link to="/products">
                <Button className="bg-blue-800 hover:bg-blue-900 text-lg px-8 py-6">
                  Start Shopping
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.selectedSize}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-500">Size: <span className="font-medium text-gray-900">{item.selectedSize}</span></p>
                      )}
                      <p className="text-blue-800 font-bold mt-1">₹{item.price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                         className="p-1 rounded-md hover:bg-gray-100 border border-gray-200"
                         disabled={item.quantity <= 1}
                       >
                         <Minus className="w-4 h-4 text-gray-600" />
                       </button>
                       <span className="w-8 text-center font-medium">{item.quantity}</span>
                       <button 
                         onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                         className="p-1 rounded-md hover:bg-gray-100 border border-gray-200"
                       >
                         <Plus className="w-4 h-4 text-gray-600" />
                       </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                 <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                       <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>₹{total.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span>Calculated at checkout</span>
                       </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                       <div className="flex justify-between font-bold text-lg text-gray-900">
                          <span>Total</span>
                          <span>₹{total.toLocaleString()}</span>
                       </div>
                    </div>

                    <Button 
                      onClick={() => navigate('/checkout')}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold py-6 text-lg"
                    >
                      Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;