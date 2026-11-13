import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import AppLayout from './layouts/AppLayout';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
    <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
    <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
    <Route path="/dashboard" element={<Protected><AppLayout><Dashboard /></AppLayout></Protected>} />
    <Route path="/transactions" element={<Protected><AppLayout><Transactions /></AppLayout></Protected>} />
    <Route path="/budgets" element={<Protected><AppLayout><Budgets /></AppLayout></Protected>} />
    <Route path="/goals" element={<Protected><AppLayout><Goals /></AppLayout></Protected>} />
    <Route path="/analytics" element={<Protected><AppLayout><Analytics /></AppLayout></Protected>} />
    <Route path="/settings" element={<Protected><AppLayout><Settings /></AppLayout></Protected>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}