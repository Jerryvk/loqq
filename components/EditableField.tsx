'use client';

import { useState } from 'react';

interface EditableFieldProps {
  label: string;
  value: string | null;
  onSave: (value: string) => Promise<void>;
  showCopy?: boolean;
}

export default function EditableField({ label, value, onSave, showCopy }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(inputValue);
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
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
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
              <span className="flex-1">{value || 'Not set'}</span>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
              >
                ✏️ Edit
              </button>
              {showCopy && value && (
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
      </dd>
    </div>
  );
} 