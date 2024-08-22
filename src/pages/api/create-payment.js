// pages/api/create-payment.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount, email } = req.body;

    try {
      const response = await axios.post('https://api.intasend.com/v1/payments', {
        amount,
        email,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.INTASEND_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }); // <--- Added closing parenthesis

      const { paymentUrl } = response.data;
      res.status(200).json({ paymentUrl });
    } catch (error) {
      res.status(500).json({ error: 'Payment creation failed' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}