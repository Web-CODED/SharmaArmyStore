import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, LogOut, Clock, CheckCircle, Truck, ShoppingBag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    
    // Load orders
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      // Filter orders for current user if needed, for now assume all local are current
      setOrders(JSON.parse(storedOrders).reverse()); // Newest first
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  if (!user) return null;

  return (
    <>
      <Helmet>
        <title>My Profile - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center border-4 border-blue-200">
                    <User className="w-12 h-12 text-blue-800" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{user.name}</h2>
                  <p className="text-blue-100 text-sm">{user.email}</p>
                </div>
                <div className="p-4 space-y-2">
                   <div className="flex items-center p-3 bg-blue-50 text-blue-800 rounded-lg font-medium">
                      <Package className="w-5 h-5 mr-3" />
                      My Orders
                   </div>
                   <button 
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                   >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                   </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
                <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-2 text-blue-800" />
                  My Orders
                </h1>

                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link to="/products">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Order Placed</p>
                            <p className="font-medium text-gray-900">{order.date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-medium text-gray-900">₹{order.total.toLocaleString()}</p>
                          </div>
                          <div>
                             <p className="text-sm text-gray-500">Order ID</p>
                             <p className="font-medium text-gray-900">#{order.id}</p>
                          </div>
                          <div>
                            <Link to={`/order/${order.id}`}>
                              <Button variant="outline" size="sm" className="flex items-center">
                                Details <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                        <div className="p-6">
                           <div className="flex items-center mb-4">
                              {/* Status Logic Visualization */}
                              <div className="flex items-center gap-2">
                                 {order.status === 'Delivered' ? (
                                   <CheckCircle className="w-5 h-5 text-green-500" />
                                 ) : order.status === 'Shipped' ? (
                                   <Truck className="w-5 h-5 text-blue-500" />
                                 ) : (
                                   <Clock className="w-5 h-5 text-yellow-500" />
                                 )}
                                 <span className="font-medium text-gray-900">{order.status}</span>
                              </div>
                           </div>
                           
                           <div className="space-y-3">
                              {order.items.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                   <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                   </div>
                                   <div>
                                      <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                   </div>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-sm text-gray-500 italic">+ {order.items.length - 2} more items</p>
                              )}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDashboard;