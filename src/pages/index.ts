import { useState } from 'react';
import axios from 'axios';
import { NextPage } from 'next';

interface PaymentData {
  amount: number;
  email: string;
}

interface ResponseData {
  paymentUrl: string;
}

const Home: NextPage = () => {
  const [amount, setAmount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (Number(amount) <= 0) {
      setError('Amount must be a positive number');
      setLoading(false);
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError('Invalid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/create-payment', { amount, email });
      if (response && response.data) {
        const { paymentUrl } = response.data as ResponseData;
        window.location.href = paymentUrl;
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Make a Payment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Home;