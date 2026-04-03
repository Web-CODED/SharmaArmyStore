import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import HomePage from '@/pages/HomePage';
import AboutUs from '@/pages/AboutUs';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import ContactUs from '@/pages/ContactUs';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import AuthCallback from '@/pages/AuthCallback';
import ProfileDashboard from '@/pages/ProfileDashboard';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import OrderDetail from '@/pages/OrderDetail';
import RefundReturnPolicy from '@/pages/RefundReturnPolicy';
import PrivacyPolicy from '@/components/PrivacyPolicy';
import TermsAndConditions from '@/components/TermsAndConditions';
import AdminPanel from '@/pages/AdminPanel';
import LiveSalesCounter from '@/components/LiveSalesCounter';
import ChatBot from '@/components/ChatBot';
import NotFound from '@/components/NotFound';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <ScrollToTop />
            <Navigation />
            <AnimatePresence mode="wait">
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-grow"
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/profile" element={<ProfileDashboard />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/order/:orderId" element={<OrderDetail />} />
                  <Route path="/refund-policy" element={<RefundReturnPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-conditions" element={<TermsAndConditions />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.main>
            </AnimatePresence>
            <LiveSalesCounter />
            {/* <RepublicDayPopup /> */}
            <ChatBot />
            <Footer />
            <Toaster />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;