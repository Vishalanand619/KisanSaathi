const axios = require('axios');

async function test() {
  try {
    // 1. Get schemes
    console.log('Fetching schemes...');
    const schemesRes = await axios.get('http://localhost:5000/api/schemes');
    console.log('Schemes:', schemesRes.status);

    // 2. We need a token. Let's just login if we can, or bypass.
    // What is a valid user? Let's just create one or login with seed data if any.
    // I didn't see users in seed.js. Let's register a temporary user.
    console.log('Registering test admin...');
    const registerRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Admin',
      email: 'testadmin123@example.com',
      password: 'password123',
      role: 'admin'
    }).catch(e => e.response);

    let token = '';
    if (registerRes.status === 201) {
      token = registerRes.data.token;
    } else {
      console.log('Login test admin...');
      const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'testadmin123@example.com',
        password: 'password123'
      });
      token = loginRes.data.token;
    }

    console.log('Token acquired. Fetching admin schemes...');
    const adminSchemesRes = await axios.get('http://localhost:5000/api/schemes/admin/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Admin Schemes:', adminSchemesRes.status);

    console.log('Fetching admin complaints...');
    const adminComplaintsRes = await axios.get('http://localhost:5000/api/complaints', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Admin Complaints:', adminComplaintsRes.status);

  } catch (err) {
    console.error('ERROR:', err.response ? err.response.data : err.message);
  }
}

test();
