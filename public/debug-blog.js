// Debug helper - Add this to your browser console to test blog fetching
window.debugBlogSystem = async function() {
  // console.log('🔍 Debugging Blog System...');

  try {
    // Test the blog list API
    // console.log('📡 Testing /api/Blog endpoint...');
    const listResponse = await fetch('/api/Blog?_t=' + Date.now(), {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (listResponse.ok) {
      const listData = await listResponse.json();
      // console.log('✅ Blog list fetched successfully');
      // console.log('📋 Total blogs in database:', listData.data?.blogs?.length || 0);
      // console.log('📝 Blog titles:', listData.data?.blogs?.map(b => b.name) || []);

      if (listData.data?.blogs?.length > 0) {
        // console.log('📋 Sample blog data:', {
          name: listData.data.blogs[0].name,
          slug: listData.data.blogs[0].slug,
          isPublished: listData.data.blogs[0].isPublished,
          publishDate: listData.data.blogs[0].publishDate
        });
      }
    } else {
      console.error('❌ Failed to fetch blog list:', listResponse.status, listResponse.statusText);
      // console.log('Response:', await listResponse.text());
    }

    // Test a specific blog
    const testSlug = 'stone-matrix-asphalt'; // Change this to test different blogs
    // console.log(`📡 Testing /api/Blog/${testSlug} endpoint...`);
    const detailResponse = await fetch(`/api/Blog/${testSlug}?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (detailResponse.ok) {
      const detailData = await detailResponse.json();
      // console.log('✅ Blog detail fetched successfully');
      // console.log('📋 Blog title:', detailData.data?.blog?.name);
      // console.log('📋 Blog overview:', detailData.data?.blog?.overview?.substring(0, 100) + '...');
      // console.log('📋 Blog published:', detailData.data?.blog?.isPublished);
    } else {
      console.error('❌ Failed to fetch blog detail:', detailResponse.status, detailResponse.statusText);
      // console.log('Response:', await detailResponse.text());
    }

    // console.log('🎯 Debug complete. Check the console for results.');
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

// Auto-run the debug (uncomment to run automatically)
// window.debugBlogSystem();
