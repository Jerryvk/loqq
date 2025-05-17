'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import supabase from '@/lib/supabaseClient';

export default function UpdatePassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        router.push('/login');
        return;
      }
      setEmail(session.user.email);
    };

    checkSession();
  }, [router]);

  const handleUpdatePassword = async (_: string, password: string | undefined) => {
    if (!password) throw new Error('Password is required');

    const { error, data: { user } } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error('No user found');
    }

    alert('Password updated successfully!');
    router.push(`/dashboard/${user.id}`);
  };

  if (!email) {
    return <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Update your password</h2>
          <p className="text-white/80 text-base sm:text-lg">
            Enter your new password below
          </p>
        </div>

        <AuthForm
          type="set-password"
          onSubmit={handleUpdatePassword}
          buttonText="Update password"
        />
      </div>
    </main>
  );
} 