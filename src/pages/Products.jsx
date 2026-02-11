import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, Search, SlidersHorizontal, X } from 'lucide-react';
import { categories, getProductsByCategory, products as allProducts } from '@/data/products';
import { Button } from '@/components/ui/button';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    let result = allProducts;

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }

    // Filter by Price
    result = result.filter(product => product.price >= priceRange.min && product.price <= priceRange.max);

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, priceRange]);

  const clearSearch = () => {
    setSearchQuery("");
    setPriceRange({ min: 0, max: 10000 });
    setSelectedCategory("All");
  };

  return (
    <>
      <Helmet>
        <title>Products - Sharma Army Store</title>
        <meta name="description" content="Search and browse our premium tactical equipment including boots, jackets, and gears." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
              <p className="text-xl text-blue-100">
                Premium tactical equipment for professionals and enthusiasts
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
             <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="relative flex-grow w-full md:w-auto">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                   </div>
                   <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search for boots, jackets, gears..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                   {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                         <X className="h-4 w-4" />
                      </button>
                   )}
                </div>

                {/* Price Range (Simplified) */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                   <span className="text-sm text-gray-600 whitespace-nowrap">Max Price: ₹{priceRange.max}</span>
                   <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="500"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value)})}
                      className="w-full md:w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-800"
                   />
                </div>

                {/* Clear Button */}
                {(searchQuery || selectedCategory !== "All" || priceRange.max < 10000) && (
                   <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearSearch}
                      className="whitespace-nowrap w-full md:w-auto"
                   >
                      Clear Filters
                   </Button>
                )}
             </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category Navigation */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-40">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                   <SlidersHorizontal className="w-5 h-5 mr-2" /> Categories
                </h2>
                <nav className="space-y-2">
                  <button
                      onClick={() => setSelectedCategory("All")}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        selectedCategory === "All"
                          ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      All Products
                    </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "All" ? "All Products" : selectedCategory}
                  <span className="ml-3 text-lg font-normal text-gray-600">
                    ({filteredProducts.length} results)
                  </span>
                </h2>
              </motion.div>

              {filteredProducts.length === 0 ? (
                 <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                       <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 mb-6">We couldn't find any products matching your search criteria.</p>
                    <Button onClick={clearSearch}>Clear all filters</Button>
                 </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link to={`/products/${product.id}`}>
                          <div className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
                            <div className="relative h-64 overflow-hidden flex-shrink-0">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                                <Star className="w-4 h-4 mr-1 fill-gray-900" />
                                {product.rating}
                              </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14">
                                {product.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between mt-auto">
                              <p className=" text-2xl font-bold text-blue-800 mb-4">
                                
                                  ₹{product.price.toLocaleString()}
                                </p>
                                <Button className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;