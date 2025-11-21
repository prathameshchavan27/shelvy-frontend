import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import React from "react";
import PrivateRoute from "./routes/PrivateRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import InventoryPage from "./pages/InventoryPage";
import ProductPage from "./pages/ProductPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes with Navbar */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout title="Inventory">
              <InventoryPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <DashboardLayout title="Products">
              <ProductPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/products/:id"
        element={
          <PrivateRoute>
            <DashboardLayout title="Product Details">
              <ProductDetailsPage />
            </DashboardLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default App;
