import fetch from 'node-fetch';

const text = `A message going viral claims that all ATM machines will be permanently shut down from next month as part of a new digital policy. The message says people should withdraw all their money immediately and switch to online payments.`;

(async () => {
  try {
    const res = await fetch('http://localhost:6000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    console.log('status', res.status);
    const body = await res.text();
    console.log('body', body);
  } catch (err) {
    console.error('request error', err);
  }
})();
