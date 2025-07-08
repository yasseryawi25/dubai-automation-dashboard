import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/modules/home/HomePage';
import LeadsPage from './components/modules/leads/LeadsPage';
import AdminPage from './components/modules/admin/AdminPage';
import AnalyticsPage from './components/modules/analytics/AnalyticsPage';
import MarketingPage from './components/modules/marketing/MarketingPage';
import OrchestrationPage from './components/modules/orchestration/OrchestrationPage';
import ProfilePage from './components/modules/profile/ProfilePage';
import ErrorBoundary from './components/common/ErrorBoundary';
import { LoginPage, RegisterPage, ForgotPasswordPage, AuthGuard } from './components/auth';

// TEMPORARY: Set to true to bypass authentication for testing
const BYPASS_AUTH = false; // Set to true if you want to skip auth temporarily

const App: React.FC = () => (
  <ErrorBoundary>
    <Router>
      <Routes>
        {/* Public Routes (No Authentication Required) */}
        <Route 
          path="/login" 
          element={
            <AuthGuard requireAuth={false}>
              <LoginPage />
            </AuthGuard>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthGuard requireAuth={false}>
              <RegisterPage />
            </AuthGuard>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <AuthGuard requireAuth={false}>
              <ForgotPasswordPage />
            </AuthGuard>
          } 
        />

        {/* Protected Routes (Authentication Required) */}
        <Route 
          path="/*" 
          element={
            BYPASS_AUTH ? (
              // Temporary bypass for testing dashboard
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/leads/*" element={<LeadsPage />} />
                  <Route path="/admin/*" element={<AdminPage />} />
                  <Route path="/analytics/*" element={<AnalyticsPage />} />
                  <Route path="/marketing/*" element={<MarketingPage />} />
                  <Route path="/orchestration/*" element={<OrchestrationPage />} />
                  <Route path="/profile/*" element={<ProfilePage />} />
                </Routes>
              </Layout>
            ) : (
              // Normal auth-protected routes
              <AuthGuard requireAuth={true}>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/leads/*" element={<LeadsPage />} />
                    <Route path="/admin/*" element={<AdminPage />} />
                    <Route path="/analytics/*" element={<AnalyticsPage />} />
                    <Route path="/marketing/*" element={<MarketingPage />} />
                    <Route path="/orchestration/*" element={<OrchestrationPage />} />
                    <Route path="/profile/*" element={<ProfilePage />} />
                  </Routes>
                </Layout>
              </AuthGuard>
            )
          } 
        />
      </Routes>
    </Router>
  </ErrorBoundary>
);

export default App;