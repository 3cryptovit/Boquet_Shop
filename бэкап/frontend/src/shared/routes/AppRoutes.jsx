import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { RequireAdmin } from '../../features/auth/components/guards/RequireAdmin';
import { AppInitializer } from '../components/AppInitializer';
import { NotFound } from '../components/NotFound';
import Layout from '../components/Layout';

// Импорт страниц
import { HomePage } from '../../features/home/pages/HomePage';
import { CatalogPage } from '../../features/catalog/pages/CatalogPage';
import { BouquetDetailsPage } from '../../features/catalog/pages/BouquetDetailsPage';
import { CartPage } from '../../features/cart/pages/CartPage';
import { CheckoutPage } from '../../features/checkout/pages/CheckoutPage';
import { LoginPage } from '../../features/auth/pages/LoginPage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { ProfilePage } from '../../features/user/pages/ProfilePage';

// Импорт админских страниц
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage';
import { AdminOrdersPage } from '../../features/admin/pages/AdminOrdersPage';
import { AdminBouquetsPage } from '../../features/admin/pages/AdminBouquetsPage';
import { AdminCategoriesPage } from '../../features/admin/pages/AdminCategoriesPage';
import { AdminFlowersPage } from '../../features/admin/pages/AdminFlowersPage';
import { AdminMaterialsPage } from '../../features/admin/pages/AdminMaterialsPage';
import { AdminSettingsPage } from '../../features/admin/pages/AdminSettingsPage';

export const AppRoutes = () => {
  return (
    <AppInitializer>
      <Layout>
        <Routes>
          {/* Публичные маршруты */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CATALOG} element={<CatalogPage />} />
          <Route path={ROUTES.BOUQUET_DETAILS} element={<BouquetDetailsPage />} />
          <Route path={ROUTES.CART} element={<CartPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />

          {/* Административные маршруты */}
          <Route path={ROUTES.ADMIN.ROOT} element={<RequireAdmin />}>
            <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
            <Route path={ROUTES.ADMIN.ORDERS} element={<AdminOrdersPage />} />
            <Route path={ROUTES.ADMIN.BOUQUETS} element={<AdminBouquetsPage />} />
            <Route path={ROUTES.ADMIN.CATEGORIES} element={<AdminCategoriesPage />} />
            <Route path={ROUTES.ADMIN.FLOWERS} element={<AdminFlowersPage />} />
            <Route path={ROUTES.ADMIN.MATERIALS} element={<AdminMaterialsPage />} />
            <Route path={ROUTES.ADMIN.SETTINGS} element={<AdminSettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AppInitializer>
  );
}; 