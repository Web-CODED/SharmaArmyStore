import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/ui/use-toast';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    
    // Check initially
    checkUser();

    // Listen for custom event 'authChange' to update state immediately
    window.addEventListener('authChange', checkUser);
    return () => window.removeEventListener('authChange', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/login');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Refund Policy', path: '/refund-policy' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative overflow-hidden w-16 h-16 md:w-15 md:h-15 transition-transform duration-300 transform group-hover:scale-105">
              <img 
                src="https://i.ibb.co/rfQs1Z4b/1769508836076-removebg-preview.png" 
                alt="Sharma Army Store Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-wider text-green-900 leading-none">
                SHARMA
              </span>
              <span className="text-sm md:text-base font-black tracking-wider text-green-500 leading-none mt-0.5">
                ARMY STORE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-blue-800'
                    : 'text-gray-700 hover:text-blue-800'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-800 to-yellow-400"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-800 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Auth */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-800">
                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                      <User className="w-4 h-4 text-blue-800" />
                   </div>
                   <span className="text-sm font-medium hidden xl:block">Hi, {user.name.split(' ')[0]}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-blue-800 px-3 py-2 rounded-md hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 shadow-md transition-all hover:shadow-lg">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700">
               <ShoppingCart className="w-6 h-6" />
               {cartItemCount > 0 && (
                 <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                   {cartItemCount}
                 </span>
               )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-200 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="border-t border-gray-100 pt-4 mt-2 px-4">
                  {user ? (
                    <div className="space-y-3">
                       <Link 
                          to="/profile" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 text-gray-700 font-medium"
                        >
                          <User className="w-5 h-5" />
                          <span>My Profile</span>
                       </Link>
                       <button 
                          onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                          className="flex items-center space-x-3 text-red-600 font-medium w-full text-left"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                       </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Link 
                        to="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2 border border-gray-300 rounded-md text-gray-700 font-medium"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full text-center py-2 bg-blue-800 text-white rounded-md font-medium"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;