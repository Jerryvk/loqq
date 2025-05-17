'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import { createClient } from '@/lib/supabase';

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (email: string, password: string | undefined) => {
    if (!password) throw new Error('Password is required');

    try {
      const { error, data: { user } } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!user) throw new Error('No user found');

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('No profile found');

      // Redirect to dashboard
      router.push(`/dashboard/${user.id}`);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <AuthForm
          type="login"
          onSubmit={handleLogin}
          buttonText="Sign in"
        />

        <div className="text-center mt-4">
          <Link
            href="/reset-password"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </main>
  );
} 