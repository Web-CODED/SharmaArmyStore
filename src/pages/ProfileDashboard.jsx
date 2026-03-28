import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, LogOut, Clock, CheckCircle, Truck, ShoppingBag, ChevronRight, Mail, Phone, MapPin, Edit2, Plus, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { getOrders, getUserAddresses } from '@/lib/supabase-queries';

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading, isAuthenticated, signOut, updateProfile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    date_of_birth: ''
  });

  // Load user data when authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && profile) {
      loadUserData();
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || ''
      });
    }
  }, [user, profile, isAuthenticated, loading]);

  const loadUserData = async () => {
    try {
      setIsLoadingData(true);
      if (user) {
        // Fetch orders
        const userOrders = await getOrders(user.id);
        setOrders(userOrders || []);

        // Fetch addresses
        const userAddresses = await getUserAddresses(user.id);
        setAddresses(userAddresses || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error Loading Data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogout = async () => {
    const result = await signOut();
    if (result.success) {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      navigate('/');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully."
        });
        setEditingProfile(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-800" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-white mx-auto mb-4 flex items-center justify-center border-4 border-blue-200">
                    <User className="w-12 h-12 text-blue-800" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{profile?.full_name || user?.email?.split('@')[0]}</h2>
                  <p className="text-blue-100 text-sm">{user?.email}</p>
                  {profile?.phone_number && (
                    <p className="text-blue-100 text-sm">{profile.phone_number}</p>
                  )}
                </div>
                <div className="p-4 space-y-2">
                   <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-blue-50 text-blue-800 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                   >
                      <User className="w-5 h-5 mr-3" />
                      My Profile
                   </button>
                   <button 
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'addresses' 
                        ? 'bg-blue-50 text-blue-800 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                   >
                      <MapPin className="w-5 h-5 mr-3" />
                      Addresses
                   </button>
                   <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      activeTab === 'orders' 
                        ? 'bg-blue-50 text-blue-800 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                   >
                      <Package className="w-5 h-5 mr-3" />
                      My Orders
                   </button>
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
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <User className="w-6 h-6 mr-2 text-blue-800" />
                      My Profile
                    </h1>
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      className="flex items-center gap-2 text-blue-800 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                      {editingProfile ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {editingProfile ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
                        />
                      </div>
                      <Button type="submit" className="w-full bg-blue-800">
                        Save Changes
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Full Name</p>
                          <p className="text-lg font-semibold">{profile?.full_name || 'Not set'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <p className="text-lg font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {user?.email}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <p className="text-lg font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {profile?.phone_number || 'Not set'}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Member Since</p>
                          <p className="text-lg font-semibold">
                            {profile?.created_at 
                              ? new Date(profile.created_at).toLocaleDateString() 
                              : 'Just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                      <MapPin className="w-6 h-6 mr-2 text-blue-800" />
                      Saved Addresses
                    </h1>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-4">No addresses saved yet</p>
                      <Button onClick={() => setShowAddressForm(true)} variant="outline">
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <p className="font-semibold text-blue-800 uppercase text-sm">{address.type}</p>
                            {address.is_default && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="font-medium text-gray-900">{address.full_name}</p>
                            <p>{address.phone_number}</p>
                            <p>{address.street_address}</p>
                            <p>{address.city}, {address.state} {address.postal_code}</p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShoppingBag className="w-6 h-6 mr-2 text-blue-800" />
                    My Orders
                  </h1>

                  {isLoadingData ? (
                    <div className="flex justify-center py-12">
                      <Loader className="w-8 h-8 animate-spin text-blue-800" />
                    </div>
                  ) : orders.length === 0 ? (
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
                              <p className="text-sm text-gray-500">Order Number</p>
                              <p className="font-medium text-gray-900">#{order.order_number}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Order Placed</p>
                              <p className="font-medium text-gray-900">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="font-medium text-gray-900">₹{order.total?.toLocaleString()}</p>
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
                                <div className="flex items-center gap-2">
                                   {order.status === 'delivered' ? (
                                     <CheckCircle className="w-5 h-5 text-green-500" />
                                   ) : order.status === 'shipped' ? (
                                     <Truck className="w-5 h-5 text-blue-500" />
                                   ) : (
                                     <Clock className="w-5 h-5 text-yellow-500" />
                                   )}
                                   <span className="font-medium text-gray-900 capitalize">{order.status}</span>
                                </div>
                             </div>
                             
                             {order.items && order.items.length > 0 && (
                               <div className="text-sm text-gray-600">
                                 <p>{order.items.length} item(s)</p>
                               </div>
                             )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileDashboard;