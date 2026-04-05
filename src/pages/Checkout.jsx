import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Truck, AlertCircle,
  CheckCircle, User, Phone, MapPin
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import supabase from '@/utils/supabase';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    getCartTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    clearCart
  } = useCart();
  const { toast } = useToast();
  const { user, profile, isAuthenticated } = useAuth();

  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingDetails, setShippingDetails] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [shippingErrors, setShippingErrors] = useState({});

  // Pre-fill from profile when it loads
  useEffect(() => {
    if (profile) {
      setShippingDetails(prev => ({
        ...prev,
        full_name: prev.full_name || profile.full_name || '',
        phone: prev.phone || profile.phone_number || ''
      }));
    }
  }, [profile]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Auth and cart check
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to proceed with checkout',
      });
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, cartItems]);

  // Price calculations
  const subtotal = getCartTotal();
  const discount = getDiscountAmount();
  const taxableAmount = subtotal - discount;
  const shippingCost = paymentMethod === 'cod' ? 100 : 0;
  const grandTotal = taxableAmount + shippingCost;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
    if (shippingErrors[name]) {
      setShippingErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateShipping = () => {
    const errors = {};
    if (!shippingDetails.full_name.trim())
      errors.full_name = 'Full name is required';
    if (!shippingDetails.phone.trim())
      errors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(
      shippingDetails.phone.replace(/\s/g, '')
    ))
      errors.phone = 'Enter valid 10-digit phone number';
    if (!shippingDetails.address_line1.trim())
      errors.address_line1 = 'Address is required';
    if (!shippingDetails.city.trim())
      errors.city = 'City is required';
    if (!shippingDetails.state.trim())
      errors.state = 'State is required';
    if (!shippingDetails.pincode.trim())
      errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(shippingDetails.pincode))
      errors.pincode = 'Enter valid 6-digit pincode';
    return errors;
  };

  const handleApplyCoupon = () => {
    const success = applyCoupon(couponInput);
    if (!success) {
      toast({
        title: 'Invalid Coupon',
        description: 'The coupon code you entered is invalid.',
        variant: 'destructive'
      });
    }
  };

  // Save order to Supabase
  const saveOrderToSupabase = async (
    paymentId = null,
    paymentStatus = 'pending'
  ) => {
    const shippingAddress =
      shippingDetails.address_line1 +
      (shippingDetails.address_line2
        ? ', ' + shippingDetails.address_line2
        : '');

    const orderData = {
      user_id: user.id,

      // Shipping details
      shipping_name: shippingDetails.full_name,
      shipping_phone: shippingDetails.phone,
      shipping_address: shippingAddress,
      shipping_city: shippingDetails.city,
      shipping_state: shippingDetails.state,
      shipping_pincode: shippingDetails.pincode,

      // Payment details
      payment_method: paymentMethod,
      payment_id: paymentId,
      payment_status: paymentStatus,

      // Amount — saving in both columns for compatibility
      total: grandTotal,
      total_amount: grandTotal,
      subtotal: subtotal,
      discount: discount,
      shipping_cost: shippingCost,

      // Status
      status: 'pending',

      // Items as JSON
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize || null,
        image: item.image || null
      })),

      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Create Razorpay order via serverless function
  const createRazorpayOrder = async () => {
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: grandTotal,
        currency: 'INR',
        receipt: `receipt_${user.id}_${Date.now()}`
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to create payment order');
    }

    return await response.json();
  };

  const handlePlaceOrder = async () => {
    // Validate shipping first
    const errors = validateShipping();
    if (Object.keys(errors).length > 0) {
      setShippingErrors(errors);
      toast({
        title: 'Missing Details',
        description: 'Please fill in all shipping details',
        variant: 'destructive'
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'online') {
        // Create Razorpay order from backend
        const razorpayOrder = await createRazorpayOrder();

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Sharma Army Store',
          description: 'Purchase of Military Gear',
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              const savedOrder = await saveOrderToSupabase(
                response.razorpay_payment_id,
                'paid'
              );
              toast({
                title: 'Payment Successful! 🎉',
                description: 'Your order has been placed successfully.',
              });
              clearCart();
              navigate(`/order-confirmation/${savedOrder.id}`);
            } catch (err) {
              console.error('Order save error:', err);
              toast({
                title: 'Order Save Failed',
                description:
                  'Payment done but order save failed. Please contact support with your payment ID: ' +
                  response.razorpay_payment_id,
                variant: 'destructive'
              });
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: shippingDetails.full_name,
            email: user?.email || '',
            contact: shippingDetails.phone,
          },
          notes: {
            shipping_address:
              `${shippingDetails.address_line1}, ` +
              `${shippingDetails.city}, ` +
              `${shippingDetails.state} - ` +
              `${shippingDetails.pincode}`
          },
          theme: {
            color: '#1e40af'
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast({
                title: 'Payment Cancelled',
                description: 'You cancelled the payment.',
                variant: 'destructive'
              });
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();

      } else {
        // Cash on Delivery
        const savedOrder = await saveOrderToSupabase(
          null,
          'pending'
        );
        toast({
          title: 'Order Placed! 🎉',
          description: 'Your COD order has been placed successfully.',
        });
        clearCart();
        navigate(`/order-confirmation/${savedOrder.id}`);
        setIsProcessing(false);
      }

    } catch (err) {
      console.error('Order error:', err);
      toast({
        title: 'Order Failed',
        description:
          err.message || 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout - Sharma Army Store</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">

              {/* Shipping Form */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900
                  mb-6 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-blue-800" />
                  Shipping Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2
                  gap-4">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium
                      text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3
                        w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="full_name"
                        value={shippingDetails.full_name}
                        onChange={handleShippingChange}
                        placeholder="Enter full name"
                        className={`w-full pl-9 pr-3 py-2 border
                          rounded-md text-sm focus:outline-none
                          focus:ring-2 focus:ring-blue-500
                          ${shippingErrors.full_name
                            ? 'border-red-400'
                            : 'border-gray-300'}`}
                      />
                    </div>
                    {shippingErrors.full_name && (
                      <p className="text-red-500 text-xs mt-1
                        flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {shippingErrors.full_name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium
                      text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3
                        w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={handleShippingChange}
                        placeholder="10-digit mobile number"
                        className={`w-full pl-9 pr-3 py-2 border
                          rounded-md text-sm focus:outline-none
                          focus:ring-2 focus:ring-blue-500
                          ${shippingErrors.phone
                            ? 'border-red-400'
                            : 'border-gray-300'}`}
                      />
                    </div>
                    {shippingErrors.phone && (
                      <p className="text-red-500 text-xs mt-1
                        flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {shippingErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Address Line 1 */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium
                      text-gray-700 mb-1">
                      Address Line 1 *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3
                        w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        name="address_line1"
                        value={shippingDetails.address_line1}
                        onChange={handleShippingChange}
                        placeholder="House/Flat No, Street, Area"
                        className={`w-full pl-9 pr-3 py-2 border
                          rounded-md text-sm focus:outline-none
                          focus:ring-2 focus:ring-blue-500
                          ${shippingErrors.address_line1
                            ? 'border-red-400'
                            : 'border-gray-300'}`}
                      />
                    </div>
                    {shippingErrors.address_line1 && (
                      <p className="text-red-500 text-xs mt-1
                        flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {shippingErrors.address_line1}
                      </p>
                    )}
                  </div>

                  {/* Address Line 2 */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium
                      text-gray-700 mb-1">
                      Address Line 2
                      <span className="text-gray-400 ml-1">
                        (Optional)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="address_line2"
                      value={shippingDetails.address_line2}
                      onChange={handleShippingChange}
                      placeholder="Landmark, nearby area"
                      className="w-full px-3 py-2 border
                        border-gray-300 rounded-md text-sm
                        focus:outline-none focus:ring-2
                        focus:ring-blue-500"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium
                      text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleShippingChange}
                      placeholder="Enter city"
                      className={`w-full px-3 py-2 border
                        rounded-md text-sm focus:outline-none
                        focus:ring-2 focus:ring-blue-500
                        ${shippingErrors.city
                          ? 'border-red-400'
                          : 'border-gray-300'}`}
                    />
                    {shippingErrors.city && (
                      <p className="text-red-500 text-xs mt-1
                        flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {shippingErrors.city}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium
                      text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleShippingChange}
                      placeholder="Enter state"
                      className={`w-full px-3 py-2 border
                        rounded-md text-sm focus:outline-none
                        focus:ring-2 focus:ring-blue-500
                        ${shippingErrors.state
                          ? 'border-red-400'
                          : 'border-gray-300'}`}
                    />
                    {shippingErrors.state && (
                      <p className="text-red-500 text-xs mt-1
                        flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {shippingErrors.state}
                      </p>
                    )}
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium
                      text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingDetails.pincode}
                      onChange={handleShippingChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={`w-full px-3 py-2 border
                        rounded-md text-sm focus:outline-none
                        focus:ring-2 focus:ring-blue-500
                        ${shippingErrors.pincode
                          ? 'border-red-400'
                          : 'border-gray-300'}`}
                    />
                    {shippingErrors.pincode && (
                      <p className="text-red-500 text-xs mt-1
                        flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {shippingErrors.pincode}
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* Payment Options */}
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold text-gray-900
                  mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2
                    text-blue-800" />
                  Payment Method
                </h2>

                <div className="space-y-4">

                  {/* Online Payment */}
                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 border rounded-xl cursor-pointer
                      transition-all
                      ${paymentMethod === 'online'
                        ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800'
                        : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium
                          text-gray-900">
                          Online Payment (UPI / Card / NetBanking)
                        </span>
                        <span className="text-xs text-green-600
                          font-medium">
                          FREE Shipping
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'online' && (
                      <div className="mt-3 ml-7 p-3 bg-white
                        rounded border border-gray-200 text-sm
                        text-gray-500">
                        You will be redirected to Razorpay secure
                        gateway to complete payment.
                      </div>
                    )}
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 border rounded-xl cursor-pointer
                      transition-all
                      ${paymentMethod === 'cod'
                        ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800'
                        : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium
                          text-gray-900">
                          Cash on Delivery
                        </span>
                        <span className="text-xs text-orange-600
                          font-medium">
                          + ₹100 Shipping Charge
                        </span>
                      </div>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="mt-3 ml-7 p-3 bg-white
                        rounded border border-gray-200 text-sm
                        text-gray-500 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2
                          text-green-500" />
                        Pay securely with cash upon delivery.
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
                        {/* Right Column — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6
                sticky top-24">
                <h2 className="text-xl font-bold text-gray-900
                  mb-6">
                  Order Breakdown
                </h2>

                {/* Items List */}
                <div className="max-h-60 overflow-y-auto mb-6
                  space-y-3 pr-2">
                  {cartItems.map(item => (
                    <div
                      key={`${item.id}-${item.selectedSize}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600 w-2/3
                        truncate">
                        {item.name}
                        <span className="text-xs text-gray-400
                          ml-1">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="text-gray-900 font-medium">
                        ₹{(item.price * item.quantity)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4
                  space-y-3 mb-6">

                  <div className="flex justify-between
                    text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Coupon */}
                  {coupon ? (
                    <div className="flex justify-between
                      text-green-600 bg-green-50 p-2 rounded">
                      <span className="flex items-center text-sm">
                        Coupon ({coupon.code})
                        <button
                          onClick={removeCoupon}
                          className="ml-2 text-xs text-red-500
                            underline"
                        >
                          Remove
                        </button>
                      </span>
                      <span>
                        -₹{discount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) =>
                          setCouponInput(e.target.value)}
                        placeholder="Coupon Code"
                        className="flex-1 border border-gray-300
                          rounded px-3 py-1 text-sm"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        variant="outline"
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                  )}

                  <div className="flex justify-between
                    text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? <span className="text-green-600">
                            FREE
                          </span>
                        : `₹${shippingCost}`}
                    </span>
                  </div>

                </div>

                <div className="border-t border-gray-200 pt-4
                  mb-6">
                  <div className="flex justify-between font-bold
                    text-xl text-blue-800">
                    <span>Grand Total</span>
                    <span>
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r
                    from-yellow-400 to-yellow-500
                    hover:from-yellow-500 hover:to-yellow-600
                    text-gray-900 font-bold py-6 text-lg
                    shadow-lg"
                >
                  {isProcessing
                    ? 'Processing...'
                    : paymentMethod === 'online'
                    ? '🔒 Pay Now'
                    : 'Place Order'}
                </Button>

                <p className="text-xs text-gray-400 text-center
                  mt-3">
                  🔒 Payments secured by Razorpay
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
