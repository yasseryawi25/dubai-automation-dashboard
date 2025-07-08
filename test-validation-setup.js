#!/usr/bin/env node

/**
 * Test script to validate the Supabase validation and diagnostic tools
 * Run with: node test-validation-setup.js
 */

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = 'https://supabase.yasta.online'
const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoiYW5vbiJ9.1qnOwvVZNzuXRwvRdsWHHMoSTuIUSKGX3yIjFBmaDXc'

console.log('🧪 Testing Supabase Validation Setup...\n')

async function testBasicConnection() {
  console.log('1. Testing basic connection...')
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const { data, error } = await supabase
      .from('client_profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Basic connection successful')
    return true
  } catch (error) {
    console.log('❌ Connection error:', error.message)
    return false
  }
}

async function testEnvironmentVariables() {
  console.log('\n2. Testing environment variables...')
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_SERVICE_KEY'
  ]
  
  let allPresent = true
  
  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`)
    } else {
      console.log(`❌ ${varName}: Not set`)
      allPresent = false
    }
  }
  
  return allPresent
}

async function testDatabaseTables() {
  console.log('\n3. Testing database tables...')
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    const criticalTables = [
      'client_profiles',
      'leads', 
      'property_listings',
      'ai_agents',
      'whatsapp_messages'
    ]
    
    let allTablesExist = true
    
    for (const table of criticalTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`)
          allTablesExist = false
        } else {
          console.log(`✅ Table ${table}: Accessible`)
        }
      } catch (error) {
        console.log(`❌ Table ${table}: ${error.message}`)
        allTablesExist = false
      }
    }
    
    return allTablesExist
  } catch (error) {
    console.log('❌ Database test error:', error.message)
    return false
  }
}

async function testAPIEndpoints() {
  console.log('\n4. Testing API endpoints...')
  
  const endpoints = [
    '/rest/v1/client_profiles',
    '/rest/v1/leads',
    '/rest/v1/property_listings'
  ]
  
  let allEndpointsWork = true
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      })
      
      if (response.status < 500) {
        console.log(`✅ ${endpoint}: HTTP ${response.status}`)
      } else {
        console.log(`❌ ${endpoint}: HTTP ${response.status}`)
        allEndpointsWork = false
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`)
      allEndpointsWork = false
    }
  }
  
  return allEndpointsWork
}

async function runAllTests() {
  console.log('🚀 Starting comprehensive validation tests...\n')
  
  const results = {
    connection: await testBasicConnection(),
    environment: await testEnvironmentVariables(),
    tables: await testDatabaseTables(),
    endpoints: await testAPIEndpoints()
  }
  
  console.log('\n📊 Test Results Summary:')
  console.log('========================')
  console.log(`Basic Connection: ${results.connection ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Environment Variables: ${results.environment ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`Database Tables: ${results.tables ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`API Endpoints: ${results.endpoints ? '✅ PASS' : '❌ FAIL'}`)
  
  const allPassed = Object.values(results).every(result => result)
  
  console.log('\n🎯 Overall Result:')
  if (allPassed) {
    console.log('✅ All tests passed! Your Supabase setup is ready for the validation tools.')
    console.log('\n📋 Next Steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Open the health check dashboard')
    console.log('3. Run comprehensive diagnostics')
    console.log('4. Monitor performance and optimize as needed')
  } else {
    console.log('❌ Some tests failed. Please fix the issues before using the validation tools.')
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check your environment variables')
    console.log('2. Verify your Supabase instance is running')
    console.log('3. Ensure all required tables exist')
    console.log('4. Check network connectivity and CORS settings')
  }
  
  return allPassed
}

// Run the tests
runAllTests().catch(error => {
  console.error('Test runner error:', error)
  process.exit(1)
}) 