import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import AdminLogin from "../pages/public/AdminLogin";
import AdminRegister from "../pages/public/AdminRegister";

// User Pages
import Profile from "../pages/user/Profile";
import GameLibrary from "../pages/user/GameLibrary";
import CanvasGame from "../pages/user/CanvasGame";
import TargetGame from "../pages/user/TargetGame";
import Progress from "../pages/user/Progress";
import ShapeTracing from "../pages/user/ShapeTracing";

import Dashboard from "../pages/admin/Dashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageGames from "../pages/admin/ManageGames";
import Analytics from "../pages/admin/Analytics";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/register" element={<AdminRegister />} />

        {/* User Routes (Now Protected) */}
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="games" element={<ProtectedRoute><GameLibrary /></ProtectedRoute>} />
        <Route path="games/canvas" element={<ProtectedRoute><CanvasGame /></ProtectedRoute>} />
        <Route path="games/target" element={<ProtectedRoute><TargetGame /></ProtectedRoute>} />
        <Route path="games/trace" element={<ProtectedRoute><ShapeTracing /></ProtectedRoute>} />
        <Route path="progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
        {/* Admin Routes (Nested under AdminLayout) */}
      </Route>

      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="games" element={<ManageGames />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
