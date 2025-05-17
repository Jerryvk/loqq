'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Web3Modal } from '@web3modal/standalone';
import { SignClient } from '@walletconnect/sign-client';
import { encodeFunctionData } from 'viem';
import { erc20Abi } from '@/lib/erc20Abi';
import { EURC_TOKEN, WALLETCONNECT_PROJECT_ID } from '@/lib/constants';
import { useUserProfile } from '@/hooks/useUserProfile';

interface QRPageClientProps {
  userId: string;
}

export default function QRPageClient({ userId }: QRPageClientProps) {
  const router = useRouter();
  const { profile, loading, error } = useUserProfile(userId);
  const [wcError, setWcError] = useState<string | null>(null);

  useEffect(() => {
    const setupWalletConnect = async () => {
      if (!profile?.wallet_address || !profile?.current_amount_base_units) {
        return;
      }

      try {
        const client = await SignClient.init({
          projectId: WALLETCONNECT_PROJECT_ID,
          metadata: {
            name: 'Loqq',
            description: 'Pay securely in EURC',
            url: 'https://loqq.app',
            icons: ['https://loqq.app/icon.png'],
          },
        });

        const encodedData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [profile.wallet_address, BigInt(profile.current_amount_base_units)],
        });

        const { uri } = await client.connect({
          requiredNamespaces: {
            eip155: {
              methods: ['eth_sendTransaction'],
              chains: ['eip155:8453'], // Base chain
              events: ['accountsChanged', 'chainChanged'],
            },
          },
        });

        if (!uri) throw new Error('No WalletConnect URI returned');

        const modal = new Web3Modal({
          projectId: WALLETCONNECT_PROJECT_ID,
          walletConnectVersion: 2,
        });

        modal.openModal({ uri });
      } catch (err) {
        console.error('❌ Error setting up WalletConnect:', err);
        setWcError(err instanceof Error ? err.message : 'Failed to initialize WalletConnect');
      }
    };

    setupWalletConnect();
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex items-center justify-center">
        <div className="text-red-400">Error: {error || 'Profile not found'}</div>
      </div>
    );
  }

  if (!profile.wallet_address) {
    return (
      <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex flex-col items-center justify-center">
        <div className="text-white/80 text-base sm:text-lg text-center mb-6">
          No wallet address set. Please set your wallet address in your profile.
        </div>
        <button
          onClick={() => router.push(`/dashboard/${userId}`)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Go to Profile
        </button>
      </div>
    );
  }

  if (!profile.current_amount_base_units) {
    return (
      <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex flex-col items-center justify-center">
        <div className="text-white/80 text-base sm:text-lg text-center mb-6">
          No payment amount set. Please set an amount first.
        </div>
        <button
          onClick={() => router.push(`/dashboard/${userId}/amount`)}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Set Amount
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8 flex flex-col items-center justify-center">
      <img
        src="/loqq-logo-transparent-v2.png"
        alt="Loqq"
        className="h-16 sm:h-20 w-auto absolute top-6 left-6 z-10"
      />
      <div className="w-full max-w-xl">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8 text-center">
            Scan to Pay
          </h1>
          
          <div className="bg-white p-6 rounded-xl flex items-center justify-center mb-8">
            <QRCodeSVG
              value={profile.wallet_address}
              size={256}
              level="H"
              includeMargin={true}
              className="mx-auto"
            />
          </div>

          <div className="text-center space-y-2">
            <p className="text-white/70 text-sm">Wallet Address:</p>
            <p className="text-white/80 font-mono text-sm break-all">
              {profile.wallet_address}
            </p>
          </div>
        </div>

        {profile.current_amount !== undefined && profile.current_amount !== null && (
          <div className="mt-8 text-center space-y-2">
            <p className="text-white/80 text-base sm:text-lg">
              Amount: {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(profile.current_amount)}
            </p>
            <p className="text-white/60 text-sm">
              {EURC_TOKEN.symbol} on Base Network
            </p>
          </div>
        )}

        {wcError && (
          <div className="mt-8 text-center space-y-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400">WalletConnect Error: {wcError}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
            >
              Retry Connection
            </button>
          </div>
        )}

        <button
          onClick={() => router.push(`/dashboard/${userId}`)}
          className="mt-8 border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
} 