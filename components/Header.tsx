'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-[#0A0A0A]">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/loqq-logo-transparent-v2.png"
          alt="Loqq logo"
          className="h-24"
        />
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-4">
        <Link
          href="/login"
          className="text-white border border-white px-4 py-2 rounded hover:text-[#00F0B5] transition-colors"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="bg-white text-black px-4 py-2 rounded hover:bg-[#00F0B5] hover:text-white transition-colors"
        >
          Register
        </Link>
      </div>
    </header>
  );
} 