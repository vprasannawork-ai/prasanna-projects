(async () => {
  try {
    const res = await fetch('http://localhost:6000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin9486' })
    });
    console.log('status', res.status);
    const text = await res.text();
    console.log('body', text);
  } catch (err) {
    console.error('request err', err);
  }
})();
