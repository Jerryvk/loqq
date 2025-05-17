'use client'

import Link from 'next/link'

export default function UserIdMissing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Missing or Invalid User ID
        </h1>
        <p className="text-gray-400 mb-8">
          This page requires a valid user ID in the URL.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 