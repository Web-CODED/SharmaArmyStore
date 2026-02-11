import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartProvider } from '@/context/CartContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AboutUs from '@/pages/AboutUs';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import ContactUs from '@/pages/ContactUs';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import ProfileDashboard from '@/pages/ProfileDashboard';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import OrderDetail from '@/pages/OrderDetail';
import RefundReturnPolicy from '@/pages/RefundReturnPolicy';
import { Toaster } from '@/components/ui/toaster';
import LiveSalesCounter from '@/components/LiveSalesCounter';
import RepublicDayPopup from '@/components/RepublicDayPopup';
import ChatBot from '@/components/ChatBot';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
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
                <Route path="/profile" element={<ProfileDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                <Route path="/order/:orderId" element={<OrderDetail />} />
                <Route path="/refund-policy" element={<RefundReturnPolicy />} />
              </Routes>
            </motion.main>
          </AnimatePresence>
          <LiveSalesCounter />
          <RepublicDayPopup />
          <ChatBot />
          <Footer />
          <Toaster />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;