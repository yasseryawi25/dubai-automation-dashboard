import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './components/modules/home/HomePage'
import LeadsPage from './components/modules/leads/LeadsPage'
import AdminPage from './components/modules/admin/AdminPage'
import AnalyticsPage from './components/modules/analytics/AnalyticsPage'
import MarketingPage from './components/modules/marketing/MarketingPage'
import OrchestrationPage from './components/modules/orchestration/OrchestrationPage'
import ProfilePage from './components/modules/profile/ProfilePage'
import DatabaseConnectionTester from './components/common/DatabaseConnectionTester'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Main application routes with Layout wrapper */}
      <Route path="/" element={<Layout children={<HomePage />} />} />
      <Route path="/leads" element={<Layout children={<LeadsPage />} />} />
      <Route path="/admin" element={<Layout children={<AdminPage />} />} />
      <Route path="/analytics" element={<Layout children={<AnalyticsPage />} />} />
      <Route path="/marketing" element={<Layout children={<MarketingPage />} />} />
      <Route path="/orchestration" element={<Layout children={<OrchestrationPage />} />} />
      <Route path="/profile" element={<Layout children={<ProfilePage />} />} />
      
      {/* Database testing route */}
      <Route path="/database-test" element={<Layout children={<DatabaseConnectionTester />} />} />
      
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
