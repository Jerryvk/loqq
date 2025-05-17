'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { createClient } from '@/lib/supabase';

export default function ResetPassword() {
  const router = useRouter();
  const supabase = createClient();

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/set-password`,
      });

      if (error) throw error;

      // Show success message
      alert('Check your email for the password reset link');
      router.push('/login');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600">
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