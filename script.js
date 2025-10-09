async function normalizeKenyaPhone(input) {
  input = input.trim();
  if (/^07\d{8}$/.test(input)) return '254' + input.slice(1);
  if (/^2547\d{8}$/.test(input)) return input;
  if (/^\+2547\d{8}$/.test(input)) return input.replace('+','');
  throw new Error('Invalid phone number format. Use 07XXXXXXXX or +2547XXXXXXXX.');
}

const BACKEND_URL =
  "https://afcic-donation-port-832198228605.europe-west1.run.app";
const form = document.getElementById('donationForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  resultDiv.classList.remove('hidden');
  resultDiv.style.border = '1px solid #005A9C';
  resultDiv.style.background = '#f3f9ff';
  resultDiv.textContent = 'Processing...';

  const phoneRaw = document.getElementById('phone').value;
  const amount = Number(document.getElementById('amount').value);

  try {
    const phone = normalizeKenyaPhone(phoneRaw);
    const res = await fetch('/api/donate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount })
    });
    const data = await res.json();
    if (data.success) {
      // show thank-you message per spec
      resultDiv.innerHTML = '<strong>Thank you for supporting AfCiC.</strong><br>' +
        'You will receive a B-Live bundle shortly.';
    } else {
      resultDiv.innerHTML = '<strong>Error:</strong> ' + (data.message || 'Unknown error');
    }
  } catch (err) {
    resultDiv.innerHTML = '<strong>Validation error:</strong> ' + err.message;
  }
});
