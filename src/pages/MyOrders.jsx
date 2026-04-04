import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { getOrders } from '@/lib/supabase-queries';
import { Package, ArrowLeft, ChevronRight } from 'lucide-react';

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await getOrders(user.id);
        setOrders(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) return (
    <div className="min-h-screen flex items-center 
      justify-center">
      <div className="animate-spin rounded-full h-12 w-12 
        border-b-2 border-blue-800"></div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>My Orders - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-500 hover:text-gray-700 
                p-1 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              My Orders
            </h1>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 
              rounded-lg p-4 mb-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm 
              p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full 
                flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 
                mb-2">
                No orders yet
              </h2>
              <p className="text-gray-500 mb-6">
                You haven't placed any orders yet
              </p>
              <Link
                to="/products"
                className="bg-blue-800 text-white px-6 py-2 
                  rounded-md hover:bg-blue-900 inline-block"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex justify-between 
                    items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Order #{order.id?.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.created_at)
                          .toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{(order.total_amount || order.amount || 0)
                          .toLocaleString('en-IN')}
                      </p>
                      <span className={`text-xs px-3 py-1 
                        rounded-full font-medium mt-1 inline-block
                        ${order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1) || 'Processing'}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address if available */}
                  {order.shipping_address && (
                    <p className="text-sm text-gray-500 mb-3">
                      Delivering to: {order.shipping_address}
                    </p>
                  )}

                  <Link
                    to={`/order/${order.id}`}
                    className="flex items-center justify-between
                      mt-3 pt-3 border-t border-gray-100
                      text-blue-800 text-sm font-medium 
                      hover:text-blue-900"
                  >
                    <span>View Order Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
        }
