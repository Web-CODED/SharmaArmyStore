import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle2, ThumbsUp } from 'lucide-react';
import { getProductById } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/context/CartContext';
import ProductSalesWidget from '@/components/ProductSalesWidget';

const reviewData = [
  { name: "Rajesh Kumar", rating: 5, comment: "Absolutely impressive quality. I've used many tactical products before, but this one stands out in terms of durability and comfort. Highly recommended for professionals.", time: "2 weeks ago", helpful: 45 },
  { name: "Amit Singh", rating: 4, comment: "Great product, very sturdy. The material feels premium. Shipping took a bit longer than expected, but worth the wait.", time: "1 month ago", helpful: 32 },
  { name: "Vikram Sharma", rating: 5, comment: "Exceeded my expectations! The fit is perfect and it performs exceptionally well in field conditions. Will definitely buy again.", time: "3 weeks ago", helpful: 28 },
  { name: "Anjali Desai", rating: 5, comment: "Bought this for my brother who is in the service. He loves it! Says it's the best gear he's owned.", time: "1 month ago", helpful: 19 },
  { name: "Arjun Mehta", rating: 4, comment: "Good value for money. Rugged and reliable. A must-have for outdoor enthusiasts.", time: "2 months ago", helpful: 15 },
  { name: "Suresh Patel", rating: 5, comment: "Top notch quality. Finish is excellent and feels very durable. Five stars!", time: "1 week ago", helpful: 12 },
  { name: "Rohan Gupta", rating: 3, comment: "Quality is good but size runs a bit small. Had to exchange for a larger size. Customer support was helpful though.", time: "3 months ago", helpful: 8 }
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id);
  const { addToCart } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (product) {
      const shuffled = [...reviewData].sort(() => 0.5 - Math.random());
      setReviews(shuffled.slice(0, Math.floor(Math.random() * 3) + 5)); 
      if (product.sizes) {
          setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} - Sharma Army Store</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link to="/products">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-gray-900" />
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-1 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-blue-800 shadow-lg'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-lg font-semibold text-gray-900">{product.rating}</span>
                  </div>
                  <span className="text-gray-500">({product.totalReviews || 124} reviews)</span>
                </div>
                <p className="text-4xl font-bold text-blue-800 mb-6">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>

              {/* Sales Widget */}
              <ProductSalesWidget />

              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Size Selector (for boots/pants etc) */}
              {product.sizes && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Select Size</h3>
                  <div className="flex gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-300 hover:border-blue-800 text-gray-900'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQuantity}
                    className="bg-white border-2 border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Minus className="w-5 h-5 text-gray-900" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="bg-white border-2 border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <Plus className="w-5 h-5 text-gray-900" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-lg py-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </motion.div>
          </div>

          {/* YouTube Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Video</h2>
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">Video placeholder - Add YouTube video ID to display</p>
            </div>
          </motion.div>

          {/* Customer Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-4 md:mt-0 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-bold text-gray-900">{product.rating} out of 5</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-800 font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.name}</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-700 font-medium">Verified Purchase</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.time}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{review.comment}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 border-t border-gray-200 pt-3">
                    <ThumbsUp className="w-4 h-4 mr-1.5" />
                    <span>{review.helpful} people found this helpful</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Refund and Return Policy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-2xl shadow-xl p-8"
          >
            <button
              onClick={() => setShowRefundPolicy(!showRefundPolicy)}
              className="w-full flex items-center justify-between text-left"
            >
              <h2 className="text-2xl font-bold text-gray-900">Refund & Return Policy</h2>
              <motion.div
                animate={{ rotate: showRefundPolicy ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </motion.div>
            </button>
            {showRefundPolicy && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 space-y-4 text-gray-700"
              >
                <p className="font-semibold">Returns accepted within 7 days of delivery.</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Product must be unused and in original packaging</li>
                  <li>All tags and labels must be intact</li>
                  <li>Return shipping costs are the customer's responsibility</li>
                  <li>Refund will be processed within 7-10 business days after receiving the returned item</li>
                  <li>Damaged or defective items will be replaced free of charge</li>
                </ul>
                <p className="font-semibold mt-4">For returns or exchanges, please contact our customer service:</p>
                <p>Email: sharma2022store@gmail.com</p>
                <p>Phone: +91 96413 85334</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;