'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { createClient } from '@/lib/supabase';

export default function SetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

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
  }, [router, supabase]);

  const handleSetPassword = async (_: string, password: string | undefined) => {
    if (!password) throw new Error('Password is required');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password
      });

      if (updateError) throw updateError;

      // Get the user data
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      // Create profile if it doesn't exist
      if (!profile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user.id,
              email: user.email,
              created_at: new Date().toISOString(),
              is_active: false
            }
          ]);

        if (insertError) throw insertError;
      }

      // Redirect to dashboard
      router.push(`/dashboard/${user.id}`);
    } catch (error) {
      console.error('Error setting password:', error);
      throw error;
    }
  };

  if (!email) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Set your password</h2>
          <p className="mt-2 text-sm text-gray-600">
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