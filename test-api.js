const http = require('http');

// Test function
function testAPI(path, method = 'GET', headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Run tests
async function runTests() {
  console.log('Testing API endpoints...\n');

  try {
    // Test 1: Profile API without auth
    console.log('1. Testing /api/profile without authentication:');
    const test1 = await testAPI('/api/profile');
    console.log(`Status: ${test1.status}, Response:`, test1.data);
    console.log('');

    // Test 2: Profile API with auth
    console.log('2. Testing /api/profile with authentication:');
    const test2 = await testAPI('/api/profile', 'GET', { 'Authorization': 'Bearer 1' });
    console.log(`Status: ${test2.status}, Response:`, test2.data);
    console.log('');

    // Test 3: Lab tests API with staff auth
    console.log('3. Testing /api/labtests/me with staff authentication:');
    const test3 = await testAPI('/api/labtests/me', 'GET', { 'Authorization': 'Bearer 1' });
    console.log(`Status: ${test3.status}, Response:`, test3.data);
    console.log('');

    // Test 4: Lab tests API with donor auth
    console.log('4. Testing /api/labtests/me with donor authentication:');
    const test4 = await testAPI('/api/labtests/me', 'GET', { 'Authorization': 'Bearer 2' });
    console.log(`Status: ${test4.status}, Response:`, test4.data);
    console.log('');

    // Test 5: Add lab test (staff only)
    console.log('5. Testing POST /api/labtests with staff authentication:');
    const test5 = await testAPI('/api/labtests', 'POST', { 'Authorization': 'Bearer 1' });
    console.log(`Status: ${test5.status}, Response:`, test5.data);
    console.log('');

    console.log('All tests completed!');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

runTests(); 