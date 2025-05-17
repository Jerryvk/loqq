'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSafeUserId } from '@/hooks/useSafeUserId';
import { useUserProfile } from '@/hooks/useUserProfile';
import UserIdMissing from '@/components/UserIdMissing';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const userId = useSafeUserId();
  const { profile, loading, error, refresh } = useUserProfile(userId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    wallet_address: ''
  });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        company_name: profile.company_name || '',
        wallet_address: profile.wallet_address || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !userId || session.user.id !== userId) {
        router.push('/login');
      }
    };
    checkSession();
  }, [userId, router, supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    // Validate wallet address if provided
    if (formData.wallet_address && !isValidEthereumAddress(formData.wallet_address)) {
      setSaveError('Invalid Ethereum wallet address format');
      return;
    }

    try {
      setIsSaving(true);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_name: formData.company_name || null,
          wallet_address: formData.wallet_address || null
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Refresh profile data
      await refresh();
      setSaveSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!userId) return <UserIdMissing />;
  if (loading) return <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">Loading...</div>;
  if (error || !profile) return <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">Error: {error || 'Profile not found'}</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8">
      <img
        src="/loqq-logo-transparent-v2.png"
        alt="Loqq"
        className="h-16 sm:h-20 w-auto absolute top-6 left-6 z-10"
      />
      <div className="max-w-5xl mx-auto relative">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Logout
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-semibold">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    value={formData.wallet_address}
                    onChange={(e) => setFormData(prev => ({ ...prev, wallet_address: e.target.value.trim() }))}
                    className={`w-full px-4 py-2 bg-white/10 border rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white ${
                      formData.wallet_address && !isValidEthereumAddress(formData.wallet_address)
                        ? 'border-red-500'
                        : 'border-white/20'
                    }`}
                    placeholder="0x..."
                    maxLength={42}
                  />
                  {formData.wallet_address && !isValidEthereumAddress(formData.wallet_address) && (
                    <p className="mt-1 text-sm text-red-400">
                      Invalid Ethereum address format
                    </p>
                  )}
                </div>

                {saveError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400">{saveError}</p>
                  </div>
                )}

                {saveSuccess && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                    <p className="text-green-400">Changes saved successfully!</p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        company_name: profile.company_name || '',
                        wallet_address: profile.wallet_address || ''
                      });
                      setSaveError(null);
                    }}
                    className="flex-1 border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-white/80 text-base sm:text-lg"><span className="text-white/60">Email:</span> {profile.email}</p>
                <p className="text-white/80 text-base sm:text-lg"><span className="text-white/60">Company:</span> {profile.company_name || 'Not set'}</p>
                <p className="text-white/80 text-base sm:text-lg"><span className="text-white/60">Wallet:</span> {profile.wallet_address || 'Not set'}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                href={`/dashboard/${userId}/amount`}
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
              >
                Set Amount
              </Link>
              <Link
                href={`/dashboard/${userId}/qr`}
                className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 py-2 px-4 rounded"
              >
                View QR Code
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 