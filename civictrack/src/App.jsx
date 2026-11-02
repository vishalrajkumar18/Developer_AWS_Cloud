import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import CitizenDashboard from './pages/CitizenDashboard';
import RegisterComplaint from './pages/RegisterComplaint';
import TrackComplaint from './pages/TrackComplaint';
import MyComplaints   from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentDashboard from './pages/DepartmentDashboard';

import GooglePopupPage from './pages/GooglePopupPage';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"                    element={<LandingPage />} />
      <Route path="/login"               element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <LoginPage />} />
      <Route path="/register"            element={user ? <Navigate to={`/${user.role}-dashboard`} /> : <RegisterPage />} />
      <Route path="/google-signin-popup" element={<GooglePopupPage />} />
      <Route path="/track"               element={<TrackComplaint />} />

      <Route path="/citizen-dashboard" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <CitizenDashboard />
        </ProtectedRoute>
      } />
      <Route path="/register-complaint" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <RegisterComplaint />
        </ProtectedRoute>
      } />
      <Route path="/my-complaints" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <MyComplaints />
        </ProtectedRoute>
      } />
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/department-dashboard" element={
        <ProtectedRoute allowedRoles={['department']}>
          <DepartmentDashboard />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
