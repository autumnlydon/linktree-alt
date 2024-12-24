'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';

interface Profile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
}

export default function EditProfileForm({
  username,
}: {
  username: string;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!profile || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    try {
      setUploadProgress(0);
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      setUploadProgress(100);
    } catch (error: any) {
      setError(error.message);
      setUploadProgress(0);
    }
  }, [profile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    multiple: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Get profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username.toLowerCase())
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error('Profile not found');

        // Check if current user is the profile owner
        if (user.id !== profileData.id) {
          throw new Error('Unauthorized');
        }

        setProfile(profileData);
      } catch (error: any) {
        setError(error.message);
        if (error.message === 'Not authenticated') {
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: profile.username.toLowerCase(),
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      router.push(`/${profile.username}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

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
        <div className="text-white/90">{error || 'Profile not found'}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Profile Picture
              </label>
              <div
                {...getRootProps()}
                className={`w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/40'
                }`}
              >
                <input {...getInputProps()} />
                {profile.avatar_url ? (
                  <div className="relative w-full h-full">
                    <img
                      src={profile.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white text-sm">Drop a new image or click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-white/90 text-sm mb-1">
                      {isDragActive ? 'Drop the image here' : 'Drag and drop an image here'}
                    </p>
                    <p className="text-white/60 text-sm">or click to select</p>
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Username
              </label>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Bio
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 h-32 resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/${profile.username}`)}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 