import http from 'http';

function post(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 6000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let out = '';
        res.on('data', (c) => (out += c));
        res.on('end', () => {
          resolve({ status: res.statusCode, body: out });
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  const email = `user+${Date.now()}@example.com`;
  const password = 'password123';

  console.log('Registering:', email);
  const reg = await post('/api/auth/register', { name: 'Test', email, password });
  console.log('Register:', reg.status, reg.body);

  console.log('Logging in:', email);
  const login = await post('/api/auth/login', { email, password });
  console.log('Login:', login.status, login.body);
})();
