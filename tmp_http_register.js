import http from 'http';

const data = JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'password123' });

const options = {
  hostname: 'localhost',
  port: 6000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('body', body);
  });
});

req.on('error', (err) => console.error('req err', err));
req.write(data);
req.end();
