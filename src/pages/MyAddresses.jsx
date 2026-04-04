import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/context/AuthContext';
import { getUserAddresses, deleteAddress }
  from '@/lib/supabase-queries';
import { MapPin, ArrowLeft, Trash2 } from 'lucide-react';

export default function MyAddresses() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchAddresses = async () => {
      try {
        const data = await getUserAddresses(user.id);
        setAddresses(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user, authLoading]);

  const handleDelete = async (addressId) => {
    try {
      setDeleting(addressId);
      await deleteAddress(addressId);
      setAddresses(prev =>
        prev.filter(a => a.id !== addressId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

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
        <title>My Addresses - Sharma Army Store</title>
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
              My Addresses
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
          {addresses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm 
              p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full 
                flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 
                mb-2">
                No addresses saved
              </h2>
              <p className="text-gray-500">
                Your saved addresses will appear here 
                after your first order
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-white rounded-xl shadow-sm p-6"
                >
                  <div className="flex justify-between 
                    items-start">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-blue-800 
                        mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {address.full_name}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {address.address_line1}
                        </p>
                        {address.address_line2 && (
                          <p className="text-gray-600 text-sm">
                            {address.address_line2}
                          </p>
                        )}
                        <p className="text-gray-600 text-sm">
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          📞 {address.phone}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={deleting === address.id}
                      className="text-red-500 hover:text-red-700 
                        p-2 rounded-full hover:bg-red-50 
                        transition-colors disabled:opacity-50"
                    >
                      {deleting === address.id ? (
                        <div className="w-5 h-5 border-2 
                          border-red-500 border-t-transparent 
                          rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
    }
