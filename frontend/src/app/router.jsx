import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CatalogPage from "../pages/CatalogPage";
import BouquetDetailPage from "../pages/BouquetDetailPage";
import ConstructorPage from "../pages/ConstructorPage";
import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminPage from "../pages/AdminPage";
import FavoritesPage from "../pages/FavoritesPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/bouquet/:id" element={<BouquetDetailPage />} />
      <Route path="/bouquets/:id" element={<BouquetDetailPage />} />
      <Route path="/constructor" element={<ConstructorPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default AppRouter;
