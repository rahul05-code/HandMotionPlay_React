import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

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

        {/* User Routes (Can be protected later) */}
        <Route path="profile" element={<Profile />} />
        <Route path="games" element={<GameLibrary />} />
        <Route path="games/canvas" element={<CanvasGame />} />
        <Route path="games/target" element={<TargetGame />} />
        <Route path="games/trace" element={<ShapeTracing />} />
        <Route path="progress" element={<Progress />} />
        {/* Admin Routes (Nested under AdminLayout) */}
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
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
