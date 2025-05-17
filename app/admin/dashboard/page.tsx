'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface Profile {
  id: string;
  email: string;
  status: string;
  is_active: boolean;
  role: 'user' | 'subadmin' | 'admin';
  created_at: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentAdmin, setCurrentAdmin] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current admin and check permissions
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/');
          return;
        }

        const { data: adminProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError || !adminProfile || adminProfile.role !== 'admin') {
          router.push('/');
          return;
        }

        setCurrentAdmin(adminProfile);
        fetchProfiles();
      } catch (err) {
        console.error('Error checking admin access:', err);
        router.push('/');
      }
    };

    checkAdminAccess();
  }, [router]);

  // Fetch all profiles
  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError('Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  };

  // Toggle user activation status
  const handleActivationToggle = async (profile: Profile) => {
    try {
      const newIsActive = !profile.is_active;
      
      // Optimistic update
      setProfiles(profiles.map(p => 
        p.id === profile.id ? { ...p, is_active: newIsActive } : p
      ));
      setError(null);

      const { error } = await supabase
        .from('profiles')
        .update({ is_active: newIsActive })
        .eq('id', profile.id);

      if (error) {
        // Revert optimistic update on error
        setProfiles(profiles.map(p => 
          p.id === profile.id ? { ...p, is_active: !newIsActive } : p
        ));
        throw error;
      }
    } catch (err) {
      console.error('Error updating activation status:', err);
      setError('Failed to update user activation status');
    }
  };

  // Update user role
  const handleRoleChange = async (profile: Profile, newRole: Profile['role']) => {
    // Prevent admin from changing their own role
    if (profile.id === currentAdmin?.id) {
      setError('You cannot modify your own role');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profile.id);

      if (error) throw error;
      
      // Update local state
      setProfiles(profiles.map(p => 
        p.id === profile.id ? { ...p, role: newRole } : p
      ));
    } catch (err) {
      console.error('Error updating role:', err);
      setError('Failed to update user role');
    }
  };

  // Filter profiles based on search term
  const filteredProfiles = profiles.filter(profile =>
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans tracking-tight leading-relaxed px-4 py-12 sm:px-8">
      <img
        src="/loqq-logo-transparent-v2.png"
        alt="Loqq"
        className="h-16 sm:h-20 w-auto absolute top-6 left-6 z-10"
      />
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-xl p-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">User Management</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className={profile.is_active ? 'bg-green-500/10' : undefined}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{profile.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {profile.is_active ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                      {profile.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">
                      {currentAdmin?.role === 'admin' && profile.id !== currentAdmin.id ? (
                        <select
                          value={profile.role}
                          onChange={(e) => handleRoleChange(profile, e.target.value as Profile['role'])}
                          className="bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-2 focus:ring-white px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="subadmin">Subadmin</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        profile.role
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white/60">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleActivationToggle(profile)}
                        className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
                      >
                        {profile.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 