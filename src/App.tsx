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
      {/* Main application routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="orchestration" element={<OrchestrationPage />} />
        <Route path="profile" element={<ProfilePage />} />
        
        {/* Database testing route */}
        <Route path="database-test" element={<DatabaseConnectionTester />} />
      </Route>
      
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
