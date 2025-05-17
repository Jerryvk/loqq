'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { createClient } from '@/lib/supabase';

export default function UpdatePassword() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

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
  }, [router, supabase]);

  const handleUpdatePassword = async (_: string, password: string | undefined) => {
    if (!password) throw new Error('Password is required');

    try {
      const { error, data: { user } } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;
      if (!user) throw new Error('No user found');

      alert('Password updated successfully!');
      router.push(`/dashboard/${user.id}`);
    } catch (error) {
      console.error('Error updating password:', error);
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
          <h2 className="text-3xl font-bold text-gray-900">Update your password</h2>
          <p className="mt-2 text-sm text-gray-600">
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