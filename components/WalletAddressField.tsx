'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface WalletAddressFieldProps {
  label: string;
  value: string | null;
  onSave: (value: string) => Promise<void>;
}

const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export default function WalletAddressField({ label, value, onSave }: WalletAddressFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (inputValue) {
      setIsValid(isValidEthereumAddress(inputValue.trim().toLowerCase()));
    } else {
      setIsValid(null);
    }
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
  };

  const handleSave = async () => {
    const trimmedValue = inputValue.trim().toLowerCase();
    if (!isValidEthereumAddress(trimmedValue)) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave(trimmedValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setInputValue(value || '');
    setIsEditing(false);
    setIsValid(value ? isValidEthereumAddress(value) : null);
  };

  const handleCopy = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
        alert('Copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy:', error);
        alert('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    maxLength={42}
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="0x..."
                    className={`block w-full rounded-md shadow-sm sm:text-sm ${
                      isValid === true
                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                        : isValid === false
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                  {inputValue && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {isValid ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {inputValue && (
                  <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isValid ? 'Valid Ethereum address' : 'Invalid address format'}
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !isValid}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="flex-1 font-mono">{value || 'Not set'}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  ✏️ Edit
                </button>
                {value && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                  >
                    📋 Copy
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </dd>
    </div>
  );
} 