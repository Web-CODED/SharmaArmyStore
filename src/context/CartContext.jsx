import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size = null, quantity = 1) => {
    setCartItems(prevItems => {
      // Create a unique ID for the item based on product ID and size
      const existingItemIndex = prevItems.findIndex(
        item => item.id === product.id && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        
        toast({
          title: "Cart Updated",
          description: `Increased quantity for ${product.name}`,
        });
        return newItems;
      } else {
        // Add new item
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`,
        });
        return [...prevItems, { ...product, selectedSize: size, quantity }];
      }
    });
  };

  const removeFromCart = (itemId, size) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === itemId && item.selectedSize === size)));
    toast({
      title: "Item Removed",
      description: "Item removed from your cart.",
    });
  };

  const updateQuantity = (itemId, size, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.id === itemId && item.selectedSize === size) 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    if (code === 'REPUBLIC10') {
      setCoupon({ code: 'REPUBLIC10', discountType: 'percentage', value: 10 });
      toast({
        title: "Coupon Applied!",
        description: "10% discount has been applied to your cart.",
      });
      return true;
    }
    setCoupon(null);
    return false;
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "Discount code has been removed.",
    });
  };

  // Calculate totals
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    const subtotal = getCartTotal();
    if (coupon.discountType === 'percentage') {
      return (subtotal * coupon.value) / 100;
    }
    return 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      coupon,
      applyCoupon,
      removeCoupon,
      getCartTotal,
      getDiscountAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};