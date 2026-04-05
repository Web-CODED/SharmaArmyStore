import React, { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { ChevronDown, ChevronUp, Phone,
  MapPin, CreditCard, Package } from 'lucide-react';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch orders with customer profile data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch user profiles for each order
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('full_name, email, phone_number')
            .eq('id', order.user_id)
            .single();

          return { ...order, customer: profileData }
        })
      );

      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updateData = { status: newStatus };

      if (newStatus === 'shipped') {
        updateData.shipped_at = new Date().toISOString();
      } else if (newStatus === 'delivered') {
        updateData.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Order status updated to ${newStatus}`,
      });

      // Update local state without refetching
      setOrders(prev => prev.map(o =>
        o.id === orderId
          ? { ...o, status: newStatus }
          : o
      ));

    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid'
      ? 'bg-green-100 text-green-800'
      : 'bg-orange-100 text-orange-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8
          border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order Management</h2>
        <div className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'confirmed', 'shipped', 'delivered'].map(status => (
          <Card key={status}>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">
                {orders.filter(o => o.status === status).length}
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No orders yet
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id}
                  className="border border-gray-200 rounded-lg
                    overflow-hidden">

                  {/* Order Header */}
                  <div className="p-4 bg-gray-50 flex flex-wrap
                    justify-between items-center gap-2">

                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-semibold text-sm">
                          #{order.id?.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at)
                            .toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full
                        text-xs font-medium
                        ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full
                        text-xs font-medium
                        ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status === 'paid'
                          ? '✓ Paid'
                          : 'COD'}
                      </span>
                      <span className="font-bold text-blue-800">
                        ₹{(order.total_amount || 0)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Status Update */}
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedOrder(
                        expandedOrder === order.id ? null : order.id
                      )}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {expandedOrder === order.id
                        ? <ChevronUp className="w-4 h-4" />
                        : <ChevronDown className="w-4 h-4" />
                      }
                    </button>
                  </div>

                  {/* Expanded Order Details */}
                  {expandedOrder === order.id && (
                    <div className="p-4 border-t border-gray-200
                      grid grid-cols-1 md:grid-cols-3 gap-4">

                      {/* Customer Info */}
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm
                          text-blue-900 mb-2 flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          Customer Info
                        </h4>
                        <p className="text-sm font-medium">
                          {order.customer?.full_name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.customer?.email || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.customer?.phone_number || 'N/A'}
                        </p>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-green-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm
                          text-green-900 mb-2 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          Shipping Address
                        </h4>
                        <p className="text-sm font-medium">
                          {order.shipping_name}
                        </p>
                        <p className="text-xs text-gray-600">
                          📞 {order.shipping_phone}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.shipping_address}
                        </p>
                        <p className="text-xs text-gray-600">
                          {order.shipping_city},
                          {order.shipping_state} -
                          {order.shipping_pincode}
                        </p>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-yellow-50 rounded-lg p-3">
                        <h4 className="font-semibold text-sm
                          text-yellow-900 mb-2 flex items-center gap-1">
                          <CreditCard className="w-4 h-4" />
                          Payment Info
                        </h4>
                        <p className="text-xs text-gray-600">
                          Method: <span className="font-medium uppercase">
                            {order.payment_method}
                          </span>
                        </p>
                        <p className="text-xs text-gray-600">
                          Status: <span className={`font-medium ${
                            order.payment_status === 'paid'
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }`}>
                            {order.payment_status?.toUpperCase()}
                          </span>
                        </p>
                        {order.payment_id && (
                          <p className="text-xs text-gray-600 break-all">
                            ID: {order.payment_id}
                          </p>
                        )}
                        <p className="text-sm font-bold text-blue-800 mt-1">
                          Total: ₹{(order.total_amount || 0)
                            .toLocaleString('en-IN')}
                        </p>
                      </div>

                      {/* Ordered Items */}
                      {order.items && order.items.length > 0 && (
                        <div className="md:col-span-3 bg-gray-50
                          rounded-lg p-3">
                          <h4 className="font-semibold text-sm
                            text-gray-900 mb-2">
                            Ordered Items ({order.items.length})
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx}
                                className="flex items-center gap-3
                                  bg-white rounded p-2">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover
                                      rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm font-medium">
                                    {item.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                    {item.selectedSize &&
                                      ` | Size: ${item.selectedSize}`}
                                  </p>
                                </div>
                                <p className="text-sm font-bold
                                  text-blue-800">
                                  ₹{(item.price * item.quantity)
                                    .toLocaleString('en-IN')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;
