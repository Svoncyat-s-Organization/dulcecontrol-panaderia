import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductDetailPage from '@/pages/ProductDetailPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        {/* Fallback for 404 */}
        <Route path="*" element={<div className="p-10 text-center">Página no encontrada</div>} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
