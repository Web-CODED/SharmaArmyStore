import React, { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { Card, CardContent, CardHeader, CardTitle }
  from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogTrigger }
  from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    subcategory: '',
    image: '',
    images: [],
    sizes: [],
    colors: [],
    rating: '0',
    total_reviews: '0',
    stock_quantity: 0,
    is_active: true,
    featured: false,
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price
          ? parseFloat(formData.original_price) : null,
        rating: parseFloat(formData.rating) || 0,
        total_reviews: parseInt(formData.total_reviews) || 0,
        stock_quantity: parseInt(formData.stock_quantity),
        images: formData.images.length > 0
          ? formData.images : null,
        sizes: formData.sizes.length > 0
          ? formData.sizes : null,
        colors: formData.colors.length > 0
          ? formData.colors : null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        toast({
          title: '✅ Success',
          description: 'Product updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        if (error) throw error;
        toast({
          title: '✅ Success',
          description: 'Product created successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      original_price: product.original_price?.toString() || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      image: product.image || '',
      images: product.images || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      rating: product.rating?.toString() || '0',
      total_reviews: product.total_reviews?.toString() || '0',
      stock_quantity: product.stock_quantity?.toString() || '0',
      is_active: product.is_active ?? true,
      featured: product.featured ?? false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm(
      'Are you sure you want to delete this product?'
    )) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      if (error) throw error;
      toast({
        title: '✅ Success',
        description: 'Product deleted successfully',
      });
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      subcategory: '',
      image: '',
      images: [],
      sizes: [],
      colors: [],
      rating: '0',
      total_reviews: '0',
      stock_quantity: 0,
      is_active: true,
      featured: false,
    });
  };

  const inputClass = `w-full px-3 py-2 border border-gray-300
    rounded-md bg-white text-gray-900 text-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500
    focus:border-blue-500 placeholder-gray-400`;

  const labelClass = `block text-sm font-semibold
    text-gray-700 mb-1`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8
          border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center
        bg-white rounded-xl p-4 shadow-sm border
        border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg
            flex items-center justify-center">
            <Package className="w-5 h-5 text-blue-800" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Product Management
            </h2>
            <p className="text-sm text-gray-500">
              {products.length} products total
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen}
          onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProduct(null);
                resetForm();
              }}
              className="bg-blue-800 hover:bg-blue-900
                text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>

          {/* Dialog */}
          <DialogContent
            className="max-w-2xl max-h-[85vh]
              overflow-y-auto bg-white border border-gray-200
              shadow-2xl rounded-xl p-0"
          >
            {/* Dialog Header */}
            <div className="bg-blue-800 px-6 py-4 rounded-t-xl">
              <h2 className="text-xl font-bold text-white">
                {editingProduct
                  ? '✏️ Edit Product'
                  : '➕ Add New Product'}
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                {editingProduct
                  ? 'Update product details below'
                  : 'Fill in the details to add a new product'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}
              className="p-6 space-y-5">

              {/* Name */}
              <div>
                <label className={labelClass}>
                  Product Name *
                </label>
                <input
                  className={inputClass}
                  value={formData.name}
                  onChange={(e) => setFormData({
                    ...formData, name: e.target.value
                  })}
                  placeholder="e.g. Military Combat Boots"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>
                  Description
                </label>
                <textarea
                  className={`${inputClass} min-h-[80px]
                    resize-none`}
                  value={formData.description}
                  onChange={(e) => setFormData({
                    ...formData, description: e.target.value
                  })}
                  placeholder="Product description..."
                />
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Selling Price (₹) *
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({
                      ...formData, price: e.target.value
                    })}
                    placeholder="1500"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Original Price (₹)
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({
                      ...formData,
                      original_price: e.target.value
                    })}
                    placeholder="2000"
                  />
                </div>
              </div>

              {/* Category Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Category</label>
                  <input
                    className={inputClass}
                    value={formData.category}
                    onChange={(e) => setFormData({
                      ...formData, category: e.target.value
                    })}
                    placeholder="e.g. BOOTS"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Subcategory
                  </label>
                  <input
                    className={inputClass}
                    value={formData.subcategory}
                    onChange={(e) => setFormData({
                      ...formData, subcategory: e.target.value
                    })}
                    placeholder="e.g. JUNGLE BOOTS"
                  />
                </div>
              </div>

              {/* Main Image */}
              <div>
                <label className={labelClass}>
                  Main Product Image URL
                </label>
                <input
                  className={inputClass}
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({
                    ...formData, image: e.target.value
                  })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="mt-2 w-20 h-20 object-cover
                      rounded-lg border border-gray-200"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>

              {/* Additional Images */}
              <div>
                <label className={labelClass}>
                  Additional Images
                  <span className="text-gray-400 font-normal
                    ml-1">(comma-separated URLs)</span>
                </label>
                <input
                  className={inputClass}
                  value={formData.images.join(', ')}
                  onChange={(e) => {
                    const images = e.target.value
                      .split(',')
                      .map(u => u.trim())
                      .filter(u => u);
                    setFormData({ ...formData, images });
                  }}
                  placeholder="url1.jpg, url2.jpg"
                />
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Sizes
                    <span className="text-gray-400 font-normal
                      ml-1">(comma-separated)</span>
                  </label>
                  <input
                    className={inputClass}
                    value={formData.sizes.join(', ')}
                    onChange={(e) => {
                      const sizes = e.target.value
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => s);
                      setFormData({ ...formData, sizes });
                    }}
                    placeholder="S, M, L, XL"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Colors
                    <span className="text-gray-400 font-normal
                      ml-1">(comma-separated)</span>
                  </label>
                  <input
                    className={inputClass}
                    value={formData.colors.join(', ')}
                    onChange={(e) => {
                      const colors = e.target.value
                        .split(',')
                        .map(c => c.trim())
                        .filter(c => c);
                      setFormData({ ...formData, colors });
                    }}
                    placeholder="Black, Green, Brown"
                  />
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Rating (0-5)
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({
                      ...formData, rating: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Total Reviews
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    value={formData.total_reviews}
                    onChange={(e) => setFormData({
                      ...formData,
                      total_reviews: e.target.value
                    })}
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className={labelClass}>
                  Stock Quantity
                </label>
                <input
                  className={inputClass}
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({
                    ...formData,
                    stock_quantity: e.target.value
                  })}
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center space-x-6
                bg-gray-50 rounded-lg p-4">
                <label className="flex items-center
                  cursor-pointer space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({
                      ...formData,
                      is_active: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600
                      rounded border-gray-300"
                  />
                  <span className="text-sm font-medium
                    text-gray-700">Active</span>
                </label>
                <label className="flex items-center
                  cursor-pointer space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({
                      ...formData,
                      featured: e.target.checked
                    })}
                    className="w-4 h-4 text-blue-600
                      rounded border-gray-300"
                  />
                  <span className="text-sm font-medium
                    text-gray-700">Featured</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3
                pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-5 py-2 border border-gray-300
                    rounded-md text-gray-700 text-sm
                    font-medium hover:bg-gray-50
                    transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-800
                    hover:bg-blue-900 text-white rounded-md
                    text-sm font-medium transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border
        border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200
          bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            All Products ({products.length})
          </h3>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300
              mx-auto mb-3" />
            <p className="text-gray-500">
              No products yet. Add your first product!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Product</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Category</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Price</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Stock</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Status</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id}
                    className="hover:bg-gray-50
                      transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center
                        space-x-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 object-cover
                              rounded-lg border border-gray-200"
                          />
                        )}
                        <span className="font-medium
                          text-gray-900 text-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm
                      text-gray-600">
                      {product.category || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm
                      font-semibold text-blue-800">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm
                      text-gray-600">
                      {product.stock_quantity}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full
                        text-xs font-medium ${
                        product.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {product.is_active
                          ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600
                            hover:bg-blue-50 rounded-lg
                            transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(product.id)}
                          className="p-2 text-red-500
                            hover:bg-red-50 rounded-lg
                            transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
