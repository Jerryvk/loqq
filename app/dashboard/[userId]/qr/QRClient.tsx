'use client'

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Web3Modal } from '@web3modal/standalone';
import { SignClient } from '@walletconnect/sign-client';
import { encodeFunctionData } from 'viem';
import { erc20Abi } from '@/lib/erc20Abi';
import { BASE_CHAIN_ID, EURC_TOKEN, WALLETCONNECT_PROJECT_ID } from '@/lib/constants';

interface QRClientProps {
  userId: string;
}

export default function QRClient({ userId }: QRClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const setupQR = async () => {
      try {
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('wallet_address, current_amount, current_amount_base_units')
          .eq('id', userId)
          .single();

        if (fetchError) throw new Error('Failed to load profile');
        if (!profile?.wallet_address || !profile?.current_amount_base_units) {
          throw new Error('Missing wallet address or amount');
        }

        const { wallet_address } = profile;
        const amountInBaseUnits = BigInt(profile?.current_amount_base_units || 0);

        const encodedData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'transfer',
          args: [wallet_address, amountInBaseUnits],
        });

        const client = await SignClient.init({
          projectId: WALLETCONNECT_PROJECT_ID,
          metadata: {
            name: 'Loqq',
            description: 'Pay securely in EURC',
            url: 'https://loqq.app',
            icons: ['https://loqq.app/icon.png'],
          },
        });

        const { uri, approval } = await client.connect({
          requiredNamespaces: {
            eip155: {
              methods: ['eth_sendTransaction'],
              chains: [`eip155:${BASE_CHAIN_ID}`],
              events: ['accountsChanged', 'chainChanged'],
            },
          },
        });

        if (!uri) throw new Error('No WalletConnect URI returned');

        console.log('✅ WalletConnect URI:', uri);
        const modal = new Web3Modal({ 
          projectId: WALLETCONNECT_PROJECT_ID,
          walletConnectVersion: 2
        });
        modal.openModal({ uri });

        setLoading(false);
      } catch (err: any) {
        console.error('❌ Error setting up QR:', err.message);
        setError(err.message || 'Unknown error');
        setLoading(false);
      }
    };

    setupQR();
  }, [userId]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Loqq</h1>
      <div className="w-64 h-64 bg-gray-800 flex items-center justify-center rounded-xl mb-4">
        {loading ? 'Loading QR code...' : error ? 'Error loading QR' : 'QR Ready'}
      </div>
      {error && <p className="text-red-500 text-sm mb-2">Error: {error}</p>}
      {!error && <p className="text-lg">Ready for payment</p>}
      {profile?.current_amount !== undefined ? (
        <p className="text-center text-lg mt-4">
          Amount: {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(profile.current_amount)}
        </p>
      ) : (
        <div className="h-6 w-32 mx-auto bg-gray-300 rounded animate-pulse mt-4" />
      )}
    </main>
  );
} 