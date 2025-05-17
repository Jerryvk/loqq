'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import supabase from '@/lib/supabaseClient';

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = async (email: string) => {
    // Reset states
    setError(null);
    setIsSuccess(false);

    // STEP 1: Normalize email
    if (!email?.trim()) {
      setError('Please enter a valid email address.');
      return;
    }
    const normalizedEmail = email.trim().toLowerCase();
    console.log("Normalized email:", normalizedEmail);

    try {
      // STEP 2: Check for existing profile
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .filter('email', 'eq', normalizedEmail);

      if (profileError || !normalizedEmail) {
        console.error('Profile check error:', profileError);
        setError('Something went wrong.');
        return;
      }

      if (profiles && profiles.length > 0) {
        setError("Er is al een account met dit e-mailadres. Gebruik de 'Forgot your password' knop op de login pagina om je toegang te herstellen.");
        return;
      }

      // STEP 3: Proceed with sign up using normalized email
      console.log("No existing profile found, proceeding with signup");
      const { error: signUpError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: crypto.randomUUID(), // Temporary password that will be changed in set-password
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/set-password`,
        },
      });

      if (signUpError) {
        console.error('Sign up error:', signUpError);
        setError('Something went wrong during registration. Please try again.');
        return;
      }

      // Show success message only if signup succeeds
      setIsSuccess(true);
      console.log("Sign up successful, confirmation email sent");

    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Something went wrong. Please try again.');
    }
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Create your account</h2>
          <p className="text-white/80 text-base sm:text-lg">
            Enter your email to get started
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="text-red-400">{error}</div>
          </div>
        )}

        {isSuccess ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="text-green-400">
              We've sent you a sign-up confirmation link. Please check your email to complete your registration and set your password.
            </div>
          </div>
        ) : (
          <AuthForm
            type="register"
            onSubmit={handleRegister}
            buttonText="Sign up"
          />
        )}
      </div>
    </main>
  );
} 