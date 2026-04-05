import React, { useEffect, useState } from 'react';
import supabase from '@/utils/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger }
  from '@/components/ui/tabs';
import ProductManagement
  from '@/components/admin/ProductManagement';
import OrderManagement
  from '@/components/admin/OrderManagement';
import BannerManagement
  from '@/components/admin/BannerManagement';

const AdminPanel = () => {
  const [status, setStatus] = useState('checking');
  // checking | no_session | not_admin | ready

  useEffect(() => {
    const check = async () => {
      try {
        const { data: { session } } =
          await supabase.auth.getSession();

        if (!session) {
          setStatus('no_session');
          return;
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          setStatus('ready');
        } else {
          setStatus('not_admin');
        }
      } catch (err) {
        console.error(err);
        setStatus('not_admin');
      }
    };

    check();
  }, []);

  if (status === 'checking') {
    return (
      <div className="flex justify-center items-center
        min-h-screen">
        <div className="animate-spin rounded-full h-12
          w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (status === 'no_session') {
    return (
      <div className="container mx-auto px-4 py-8
        text-center">
        <h1 className="text-2xl font-bold mb-4">
          Access Denied
        </h1>
        <p>Please log in to access the admin panel.</p>
      </div>
    );
  }

  if (status === 'not_admin') {
    return (
      <div className="container mx-auto px-4 py-8
        text-center">
        <h1 className="text-2xl font-bold mb-4">
          Access Denied
        </h1>
        <p>You do not have admin privileges.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Admin Panel
      </h1>
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="orders">
          <OrderManagement />
        </TabsContent>
        <TabsContent value="banners">
          <BannerManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
