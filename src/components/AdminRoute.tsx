import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import { LoadingSpinner } from './LoadingSpinner';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.app);

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile?.is_admin) {
    console.log('Access denied - User:', user, 'Profile:', profile);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}