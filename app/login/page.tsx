'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';
import supabase from '@/lib/supabaseClient';

export default function Login() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string | undefined) => {
    if (!password) throw new Error('Password is required');

    const { error, data: { user } } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!user) {
      throw new Error('No user found');
    }

    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select()
      .eq('id', user.id)
      .single();

    if (!profile) {
      throw new Error('No profile found');
    }

    // Redirect to dashboard
    router.push(`/dashboard/${user.id}`);
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8">
      <img
        src="/loqq-logo-transparent-v2.png"
        alt="Loqq"
        className="h-16 sm:h-20 w-auto absolute top-6 left-6 z-10"
      />
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Welcome back</h2>
          <p className="text-white/80 text-base sm:text-lg">
            Sign in to your account
          </p>
        </div>

        <AuthForm
          type="login"
          onSubmit={handleLogin}
          buttonText="Sign in"
        />

        <div className="text-center">
          <Link
            href="/reset-password"
            className="text-white/80 text-base hover:text-white transition"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </main>
  );
} 