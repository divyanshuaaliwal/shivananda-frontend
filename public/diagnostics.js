// Simple backend health check
async function checkBackendHealth() {
  try {
    // console.log('🏥 Checking backend health...');

    // Try multiple possible backend URLs
    const urls = [
      'http://localhost:5000/api/health',
      'http://127.0.0.1:5000/api/health',
      '/api/health' // This will use the same origin as the frontend
    ];

    for (const url of urls) {
      try {
        // console.log(`🔍 Trying: ${url}`);
        const response = await fetch(url, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // console.log('✅ Backend is running:', data);
          return true;
        } else {
          // console.log(`❌ ${url} returned:`, response.status, response.statusText);
        }
      } catch (error) {
        // console.log(`❌ ${url} failed:`, error.message);
      }
    }

    // console.log('❌ All backend health checks failed');
    return false;
  } catch (error) {
    console.error('❌ Health check error:', error);
    return false;
  }
}

// Test blog API endpoints
async function testBlogAPI() {
  try {
    // console.log('📡 Testing blog API endpoints...');

    const endpoints = [
      '/api/Blog',
      '/api/Blog/featured'
    ];

    for (const endpoint of endpoints) {
      try {
        // console.log(`🔍 Testing: ${endpoint}`);
        const response = await fetch(endpoint + '?_t=' + Date.now(), {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // console.log(`✅ ${endpoint} works:`, data.data?.blogs?.length || 0, 'blogs');
        } else {
          // console.log(`❌ ${endpoint} failed:`, response.status, response.statusText);
        }
      } catch (error) {
        // console.log(`❌ ${endpoint} error:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Blog API test error:', error);
  }
}

// Run diagnostics
window.runBlogDiagnostics = async function() {
  // console.log('🔧 Running Blog System Diagnostics...');

  // Check backend health
  const backendHealthy = await checkBackendHealth();

  if (backendHealthy) {
    // Test blog APIs
    await testBlogAPI();
  } else {
    // console.log('⚠️ Backend is not running. Please start the backend server first.');
    // console.log('💡 Run: cd backend && npm start');
  }

  // console.log('🎯 Diagnostics complete');
};

// Auto-run diagnostics (uncomment to run automatically)
// window.runBlogDiagnostics();
