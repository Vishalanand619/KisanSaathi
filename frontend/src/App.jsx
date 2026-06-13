// KisanSaathi — App Router
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import FarmerLayout from './components/layout/FarmerLayout';
import AdminLayout from './components/layout/AdminLayout';
import FarmerDashboard from './pages/Farmer/Dashboard';
import FarmerSchemes from './pages/Farmer/Schemes';
import FarmerComplaints from './pages/Farmer/Complaints';
import FarmerMarket from './pages/Farmer/Market';
import FarmerProfile from './pages/Farmer/Profile';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminSchemes from './pages/Admin/Schemes';
import AdminApplications from './pages/Admin/Applications';
import AdminComplaints from './pages/Admin/Complaints';
import AdminMarket from './pages/Admin/Market';
import AdminUsers from './pages/Admin/Users';
import FarmerLearning from './pages/Farmer/Learning';
import AdminLearning from './pages/Admin/Learning';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/farmer'} replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/farmer'} replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/farmer" element={<ProtectedRoute role="farmer"><FarmerLayout /></ProtectedRoute>}>
        <Route index element={<FarmerDashboard />} />
        <Route path="schemes" element={<FarmerSchemes />} />
        <Route path="complaints" element={<FarmerComplaints />} />
        <Route path="market" element={<FarmerMarket />} />
        <Route path="profile" element={<FarmerProfile />} />
        <Route path="learning" element={<FarmerLearning />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="schemes" element={<AdminSchemes />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="market" element={<AdminMarket />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="learning" element={<AdminLearning />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
