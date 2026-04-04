import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Package, MapPin, LogOut } from 'lucide-react';

export default function ProfileDashboard() {
  const { profile, loading, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  // No profile yet
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Profile not found</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-800 text-white px-4 py-2 rounded-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-blue-200">{profile.email}</p>
              {profile.phone_number && (
                <p className="text-blue-200 text-sm">{profile.phone_number}</p>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <nav className="divide-y divide-gray-100">
            <Link
              to="/profile"
              className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <User className="w-5 h-5 text-blue-800" />
              <span className="font-medium">My Profile</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <Package className="w-5 h-5 text-blue-800" />
              <span className="font-medium">My Orders</span>
            </Link>
            <Link
              to="/addresses"
              className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-5 h-5 text-blue-800" />
              <span className="font-medium">Addresses</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </nav>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Profile Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Full Name</span>
              <span className="font-medium">{profile.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{profile.email}</span>
            </div>
            {profile.phone_number && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{profile.phone_number}</span>
              </div>
            )}
            {profile.gender && (
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium capitalize">{profile.gender}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}