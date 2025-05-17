'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import supabase from '@/lib/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/set-password`,
    });

    if (error) {
      throw error;
    }

    // Show success message
    alert('Check your email for the password reset link');
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Reset your password</h2>
          <p className="text-white/80 text-base sm:text-lg">
            Enter your email to receive a password reset link
          </p>
        </div>

        <AuthForm
          type="register"
          onSubmit={handleResetPassword}
          buttonText="Send reset link"
        />
      </div>
    </main>
  );
} 