import React, { useState } from 'react';
import { API_URL } from '@/config/api';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 min-h-[50vh] bg-[#F8F8F8] flex flex-col items-center justify-center text-center">
      <h2 className="text-[32px] md:text-[48px] font-normal text-[#141E03] mb-4 px-4">
        Set the Pace. Own the experience.
      </h2>
      <p className="text-[16px] md:text-[20px] font-medium text-[#6F706F] mb-12 px-4">
        Access the latest drops and insider exclusives.
      </p>

      <div className="flex w-[90%] md:w-full max-w-[481px] mx-auto bg-white rounded-[20px] p-2 items-center shadow-sm">
        <input
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 md:px-6 py-4 bg-transparent outline-none text-[16px] md:text-[20px] font-medium text-[#6F706F]"
        />
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`bg-[#141E03] flex-shrink-0 flex-1 w-[120px] md:w-[158px] hover:bg-[#2a3a0d] text-[#EAEFE1] px-4 md:px-8 py-2 md:py-4 h-[45px] md:h-[57px] rounded-[8px] text-[16px] md:text-[20px] font-normal transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? <Loader2
            className="animate-spin"
          /> : 'Subscribe'}
        </button>
      </div>
    </section>
  );
};
