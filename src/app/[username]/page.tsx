'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import UserLinks from '@/components/UserLinks';
import AddLinkForm from '@/components/AddLinkForm';
import { useRouter, useParams } from 'next/navigation';

interface Profile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
}

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username.toLowerCase())
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error('Profile not found');

        setProfile(profileData);

        // Check if current user is the profile owner
        const { data: { user } } = await supabase.auth.getUser();
        setIsOwner(user?.id === profileData.id);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white/70">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-white/90">Profile not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
          <div className="flex items-center gap-6 mb-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-24 h-24 rounded-full border-2 border-white/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-white/60 text-2xl font-medium">
                {profile.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                @{profile.username}
              </h1>
              {profile.bio && (
                <p className="text-white/80">{profile.bio}</p>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => router.push(`/edit-profile/${profile.username}`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {isOwner && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Add New Link</h2>
            <AddLinkForm onSuccess={() => router.refresh()} />
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Links</h2>
          <UserLinks userId={profile.id} isOwner={isOwner} />
        </div>
      </div>
    </main>
  );
} 