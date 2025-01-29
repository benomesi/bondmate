import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './pages/LandingPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PricingPage } from './pages/PricingPage';
import { DatingLandingPage } from './pages/landing/dating/DatingLandingPage';
import { AdminRoute } from './components/AdminRoute';
import { FeaturesPage } from './pages/FeaturesPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { SubscriptionSuccess } from './components/SubscriptionSuccess';
import { useAppSelector } from './hooks/useAppSelector';

export default function App() {
  const { hasCompletedOnboarding } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-16">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dating-for-men" element={<DatingLandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FAQPage />} />
            
            {/* Auth routes */}
            <Route 
              path="/auth/sign-in" 
              element={user ? <Navigate to="/dashboard" replace /> : <SignInPage />} 
            />
            <Route 
              path="/auth/sign-up" 
              element={user ? <Navigate to="/dashboard" replace /> : <SignUpPage />}
            />
            
            {/* Subscription routes */}
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />
            
            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            
            {/* Protected routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  {hasCompletedOnboarding ? <Dashboard /> : <OnboardingWizard />}
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();


  if (!user) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }


  return <>{children}</>;
}