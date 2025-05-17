'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AmountClientProps {
  userId: string;
}

export default function AmountClient({ userId }: AmountClientProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Convert amount to base units (6 decimals for EURC)
      const baseAmount = Math.round(parseFloat(amount) * 1_000_000);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ base_amount_unit: baseAmount })
        .eq('id', userId);

      if (updateError) throw updateError;

      router.push(`/dashboard/${userId}/qr`);
    } catch (err: any) {
      console.error('Error updating amount:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Set Payment Amount</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-2">
            Amount in EUR
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-8 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="0.00"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : 'Generate QR Code'}
        </button>
      </form>
    </main>
  );
} 