import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Award, Truck, Star } from 'lucide-react';
import { getFeaturedProducts } from '@/data/products';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const featuredProducts = getFeaturedProducts();

  const trustIndicators = [
    {
      icon: Shield,
      title: 'Authentic Military Grade',
      description: 'Certified genuine tactical equipment'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Top-tier materials and craftsmanship'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and secure shipping nationwide'
    },
    {
      icon: Star,
      title: 'Trusted by Professionals',
      description: '5000+ satisfied customers'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Sharma Army Store - Premium Tactical Excellence</title>
        <meta name="description" content="Premium military-grade tactical equipment, combat boots, tactical gear, and army supplies. Authentic quality products trusted by professionals." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full aspect-video md:aspect-auto md:min-h-[600px]  flex items-center justify-center overflow-hidden"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1668208892692-5f281c238f3d"
              alt="Military tactical equipment"
              className="w-full h-full  object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 via-green-800/70 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 text-white">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-3xl"
            >
              <h2 className="text-xl md:text-7xl font-bold mb-3 leading-tight">
                SHARMA ARMY STORE
              </h2>
              <p className="text-lg md:text-2xl font-light mb-2 text-yellow-400">
                Premium Tactical Excellence
              </p>
              <p className="text-sm md:text-xl mb-4 text-gray-200 max-w-2xl">
                Authentic military-grade equipment for professionals and enthusiasts. 
                Quality you can trust, performance you can count on.
              </p>
              <Link to="/products">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-lg px-4 py-2 rounded-lg shadow-xl transform transition-all duration-300 hover:scale-105">
                  Explore Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Products Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Handpicked premium tactical gear</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link to={`/products/${product.id}`}>
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                          Featured
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center mb-3">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-800 mb-4">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <Button className="w-full bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators Section */}
        <section className="py-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
              <p className="text-lg text-blue-200">Excellence in every aspect</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trustIndicators.map((indicator, index) => (
                <motion.div
                  key={indicator.title}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <indicator.icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{indicator.title}</h3>
                  <p className="text-blue-200">{indicator.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;