import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, 
  CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrderById } from '@/lib/supabase-queries';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen flex items-center 
      justify-center">
      <div className="animate-spin rounded-full h-12 w-12 
        border-b-2 border-blue-800"></div>
    </div>
  );

  if (!order) return (
    <div className="p-8 text-center">
      <p className="text-gray-600">Order not found</p>
      <Link to="/orders"
        className="text-blue-800 hover:underline mt-2 
          inline-block">
        Back to My Orders
      </Link>
    </div>
  );

  const steps = [
    { status: 'Order Placed', icon: Clock,
      done: true },
    { status: 'Shipped', icon: Package,
      done: ['shipped', 'out_for_delivery',
        'delivered'].includes(order.status) },
    { status: 'Out for Delivery', icon: Truck,
      done: ['out_for_delivery',
        'delivered'].includes(order.status) },
    { status: 'Delivered', icon: CheckCircle,
      done: order.status === 'delivered' }
  ];

  return (
    <>
      <Helmet>
        <title>Order #{orderId} - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 
          sm:px-6 lg:px-8">
          <Link to="/orders">
            <Button variant="ghost"
              className="mb-6 pl-0 hover:bg-transparent 
                hover:text-blue-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Orders
            </Button>
          </Link>

          <div className="bg-white rounded-xl shadow-lg 
            overflow-hidden mb-8">

            {/* Header */}
            <div className="p-6 border-b border-gray-100 
              flex justify-between items-center bg-gray-50">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Order #{order.id?.slice(0, 8).toUpperCase()}
                </h1>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(order.created_at)
                    .toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 px-4 
                py-2 rounded-full font-bold text-sm capitalize">
                {order.status || 'Processing'}
              </div>
            </div>

            {/* Timeline */}
            <div className="p-8 border-b border-gray-100">
              <div className="relative flex justify-between">
                <div className="absolute top-5 left-0 w-full 
                  h-1 bg-gray-200 z-0"></div>
                {steps.map((step, index) => (
                  <div key={index}
                    className="relative z-10 flex flex-col 
                      items-center bg-white px-2">
                    <div className={`w-10 h-10 rounded-full 
                      flex items-center justify-center border-2 
                      ${step.done
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className={`text-xs font-medium mt-2 
                      text-center ${step.done
                        ? 'text-green-600'
                        : 'text-gray-400'
                      }`}>
                      {step.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            {order.shipping_address && (
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">
                  Shipping To
                </h3>
                <p className="text-gray-600">
                  {order.shipping_name}
                </p>
                <p className="text-gray-600">
                  {order.shipping_address}
                </p>
                <p className="text-gray-600">
                  {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}
                </p>
                {order.shipping_phone && (
                  <p className="text-gray-600">
                    📞 {order.shipping_phone}
                  </p>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-50 p-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-bold text-lg text-gray-900">
                  ₹{(order.total_amount || order.amount || 0)
                    .toLocaleString('en-IN')}
                </span>
              </div>
              {order.payment_id && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    Payment ID
                  </span>
                  <span className="text-sm font-mono 
                    text-gray-700">
                    {order.payment_id}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Payment Status
                </span>
                <span className={`font-medium ${
                  order.payment_status === 'paid'
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {order.payment_status?.toUpperCase() 
                    || 'PENDING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
