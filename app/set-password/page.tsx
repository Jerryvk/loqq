'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import supabase from '@/lib/supabaseClient';

export default function SetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        router.push('/register');
        return;
      }
      setEmail(session.user.email);
    };

    checkSession();
  }, [router]);

  const handleSetPassword = async (_: string, password: string | undefined) => {
    if (!password) throw new Error('Password is required');

    const { error: updateError } = await supabase.auth.updateUser({
      password
    });

    if (updateError) {
      throw updateError;
    }

    // Get the user data
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    // Check if profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

    // Create profile if it doesn't exist
    if (!profile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString(),
            is_active: false
          }
        ]);

      if (profileError) {
        throw profileError;
      }
    }

    // Redirect to dashboard
    router.push(`/dashboard/${user.id}`);
  };

  if (!email) {
    return <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Set your password</h2>
          <p className="text-white/80 text-base sm:text-lg">
            Create a secure password for your account
          </p>
        </div>

        <AuthForm
          type="set-password"
          onSubmit={handleSetPassword}
          buttonText="Set password"
        />
      </div>
    </main>
  );
} 