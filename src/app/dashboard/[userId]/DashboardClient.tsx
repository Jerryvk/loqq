'use client'

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface DashboardClientProps {
  userId: string;
}

export default function DashboardClient({ userId }: DashboardClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) throw fetchError;
        setProfile(data);
      } catch (err: any) {
        console.error('Error loading profile:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!profile) return <p className="text-white">No profile found</p>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl mb-4">Profile</h2>
        <div className="space-y-2">
          <p><span className="opacity-70">Email:</span> {profile.email}</p>
          <p><span className="opacity-70">Company:</span> {profile.company_name}</p>
          <p><span className="opacity-70">Wallet:</span> {profile.wallet_address}</p>
          {profile.base_amount_unit && (
            <p><span className="opacity-70">Amount:</span> €{(profile.base_amount_unit / 1_000_000).toFixed(2)}</p>
          )}
        </div>
      </div>
    </main>
  );
} 