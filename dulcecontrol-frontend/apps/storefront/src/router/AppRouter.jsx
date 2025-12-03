import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CustomOrderPage from '@/pages/CustomOrderPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MyPurchasesPage from '@/pages/MyPurchasesPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="colecciones" element={<ProductsPage />} />
        <Route path="colecciones/:slug" element={<CategoryPage />} />
        <Route path="custom-order" element={<CustomOrderPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="mis-compras" element={<MyPurchasesPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        <Route path="sobre-nosotros" element={<AboutPage />} />
        <Route path="contactanos" element={<ContactPage />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<div className="p-10 text-center">Página no encontrada</div>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
