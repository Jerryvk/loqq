'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AmountPageClientProps {
  userId: string;
}

export default function AmountPageClient({ userId }: AmountPageClientProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { profile, loading, error } = useUserProfile(userId);
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(parseFloat(amount))) {
      setSaveError('Please enter a valid amount');
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          current_amount: parseFloat(amount),
          current_amount_base_units: Math.round(parseFloat(amount) * 1_000_000)
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      router.push(`/dashboard/${userId}/qr`);
    } catch (err) {
      console.error('Error saving amount:', err);
      setSaveError('Failed to save amount. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">
        <div className="text-red-400">Error: {error || 'Profile not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex flex-col items-center justify-center">
      <img
        src="/loqq-logo-transparent-v2.png"
        alt="Loqq"
        className="h-16 sm:h-20 w-auto absolute top-6 left-6 z-10"
      />
      <div className="w-full max-w-xl">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 text-center">
            Set Base Amount
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-white/70 mb-2">
                Amount (EUR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">
                  €
                </span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={profile.current_amount_base_units ? 
                    (parseInt(profile.current_amount_base_units) / 1_000_000).toString() : 
                    '0.00'
                  }
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
              {saveError && (
                <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-red-400">{saveError}</p>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => router.push(`/dashboard/${userId}`)}
                className="flex-1 border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`flex-1 bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition ${
                  saving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 