import React, { useState, useEffect } from 'react';
import supabase from '@/utils/supabase';
import { Dialog, DialogContent, DialogTrigger }
  from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2, Image } from 'lucide-react';

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    occasion: '',
    is_active: true,
    display_order: 0,
    start_date: '',
    end_date: '',
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch banners',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bannerData = {
        ...formData,
        display_order: parseInt(formData.display_order),
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingBanner) {
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingBanner.id);
        if (error) throw error;
        toast({
          title: '✅ Success',
          description: 'Banner updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);
        if (error) throw error;
        toast({
          title: '✅ Success',
          description: 'Banner created successfully',
        });
      }

      setIsDialogOpen(false);
      setEditingBanner(null);
      resetForm();
      fetchBanners();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save banner',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      image_url: banner.image_url || '',
      occasion: banner.occasion || '',
      is_active: banner.is_active ?? true,
      display_order: banner.display_order?.toString() || '0',
      start_date: banner.start_date
        ? banner.start_date.split('T')[0] : '',
      end_date: banner.end_date
        ? banner.end_date.split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (bannerId) => {
    if (!confirm(
      'Are you sure you want to delete this banner?'
    )) return;
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', bannerId);
      if (error) throw error;
      toast({
        title: '✅ Success',
        description: 'Banner deleted successfully',
      });
      fetchBanners();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      occasion: '',
      is_active: true,
      display_order: 0,
      start_date: '',
      end_date: '',
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
            <Image className="w-5 h-5 text-blue-800" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Banner Management
            </h2>
            <p className="text-sm text-gray-500">
              {banners.length} banners total
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen}
          onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button
              onClick={() => {
                setEditingBanner(null);
                resetForm();
              }}
              className="flex items-center gap-2 px-4 py-2
                bg-blue-800 hover:bg-blue-900 text-white
                rounded-md text-sm font-medium
                transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </DialogTrigger>

          {/* Dialog */}
          <DialogContent
            className="max-w-lg bg-white border
              border-gray-200 shadow-2xl rounded-xl p-0"
          >
            {/* Dialog Header */}
            <div className="bg-blue-800 px-6 py-4
              rounded-t-xl">
              <h2 className="text-xl font-bold text-white">
                {editingBanner
                  ? '✏️ Edit Banner'
                  : '➕ Add New Banner'}
              </h2>
              <p className="text-blue-200 text-sm mt-1">
                {editingBanner
                  ? 'Update banner details below'
                  : 'Fill in the details to add a new banner'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}
              className="p-6 space-y-4">

              {/* Title */}
              <div>
                <label className={labelClass}>
                  Banner Title *
                </label>
                <input
                  className={inputClass}
                  value={formData.title}
                  onChange={(e) => setFormData({
                    ...formData, title: e.target.value
                  })}
                  placeholder="e.g. Republic Day Sale"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label className={labelClass}>
                  Image URL *
                </label>
                <input
                  className={inputClass}
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({
                    ...formData, image_url: e.target.value
                  })}
                  placeholder="https://example.com/banner.jpg"
                  required
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Banner Preview"
                    className="mt-2 w-full h-24 object-cover
                      rounded-lg border border-gray-200"
                    onError={(e) =>
                      e.target.style.display = 'none'}
                  />
                )}
              </div>

              {/* Occasion */}
              <div>
                <label className={labelClass}>Occasion</label>
                <input
                  className={inputClass}
                  value={formData.occasion}
                  onChange={(e) => setFormData({
                    ...formData, occasion: e.target.value
                  })}
                  placeholder="e.g. republic_day, diwali, general"
                />
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Display Order
                  </label>
                  <input
                    className={inputClass}
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({
                      ...formData,
                      display_order: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Status</label>
                  <div className="flex items-center mt-3
                    space-x-2 bg-gray-50 rounded-md px-3 py-2
                    border border-gray-300">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({
                        ...formData,
                        is_active: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600
                        rounded border-gray-300"
                    />
                    <label htmlFor="is_active"
                      className="text-sm font-medium
                        text-gray-700 cursor-pointer">
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Start Date
                  </label>
                  <input
                    className={inputClass}
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({
                      ...formData, start_date: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Date</label>
                  <input
                    className={inputClass}
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({
                      ...formData, end_date: e.target.value
                    })}
                  />
                </div>
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
                  {editingBanner
                    ? 'Update Banner'
                    : 'Add Banner'}
                </button>
              </div>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners Table */}
      <div className="bg-white rounded-xl shadow-sm border
        border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200
          bg-gray-50">
          <h3 className="font-semibold text-gray-900">
            All Banners ({banners.length})
          </h3>
        </div>

        {banners.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-12 h-12 text-gray-300
              mx-auto mb-3" />
            <p className="text-gray-500">
              No banners yet. Add your first banner!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Preview</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Title</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Occasion</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Order</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Status</th>
                  <th className="text-left px-4 py-3
                    text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {banners.map((banner) => (
                  <tr key={banner.id}
                    className="hover:bg-gray-50
                      transition-colors">
                    <td className="px-4 py-3">
                      {banner.image_url ? (
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-16 h-10 object-cover
                            rounded border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-gray-100
                          rounded border border-gray-200
                          flex items-center justify-center">
                          <Image className="w-4 h-4
                            text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium
                      text-gray-900 text-sm">
                      {banner.title}
                    </td>
                    <td className="px-4 py-3 text-sm
                      text-gray-600">
                      {banner.occasion || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm
                      text-gray-600">
                      {banner.display_order}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full
                        text-xs font-medium ${
                        banner.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {banner.is_active
                          ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-blue-600
                            hover:bg-blue-50 rounded-lg
                            transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(banner.id)}
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

export default BannerManagement;
