import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CustomOrderPage from '@/pages/CustomOrderPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import CheckoutPage from '@/pages/CheckoutPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="colecciones" element={<ProductsPage />} />
        <Route path="colecciones/:slug" element={<CategoryPage />} />
        <Route path="custom-order" element={<CustomOrderPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        <Route path="sobre-nosotros" element={<AboutPage />} />
        <Route path="contactanos" element={<ContactPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<div className="p-10 text-center">Página no encontrada</div>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
