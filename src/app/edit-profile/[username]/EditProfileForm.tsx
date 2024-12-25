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
  avatar_position?: { x: number; y: number; scale: number };
}

interface ImagePosition {
  x: number;
  y: number;
  scale: number;
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePosition, setImagePosition] = useState<ImagePosition>({ x: 0, y: 0, scale: 1 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const router = useRouter();

  // Initialize position from profile data
  useEffect(() => {
    if (profile?.avatar_position) {
      setImagePosition(profile.avatar_position);
    }
  }, [profile?.avatar_position]);

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingImage(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingImage) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Limit the dragging range
    const maxOffset = 100; // Adjust this value to control how far the image can be dragged
    const boundedX = Math.max(-maxOffset, Math.min(maxOffset, newX));
    const boundedY = Math.max(-maxOffset, Math.min(maxOffset, newY));
    
    setImagePosition(prev => ({
      ...prev,
      x: boundedX,
      y: boundedY
    }));
  };

  const handleImageMouseUp = () => {
    setIsDraggingImage(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const scaleChange = e.deltaY * -0.001;
    const newScale = Math.max(1, Math.min(2, imagePosition.scale + scaleChange));
    setImagePosition(prev => ({
      ...prev,
      scale: newScale
    }));
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!profile || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Reset position when new image is uploaded
    setImagePosition({ x: 0, y: 0, scale: 1 });

    // Create and set preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      setUploadProgress(0);
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;

      console.log('Uploading file:', { filePath, fileType: file.type, fileSize: file.size });

      // Upload new file
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL and position
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          avatar_position: imagePosition
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        avatar_url: publicUrl,
        avatar_position: imagePosition
      } : null);
      setUploadProgress(100);
      // Clear preview URL after successful upload
      setPreviewUrl(null);
    } catch (error: any) {
      console.error('Full error details:', error);
      setError(error.message);
      setUploadProgress(0);
    }
  }, [profile, previewUrl, imagePosition]);

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
        <button
          onClick={() => router.push(`/${profile?.username}`)}
          className="text-white/80 hover:text-white mb-6 flex items-center gap-2"
        >
          <span className="text-lg">←</span>
          <span>Back to Profile</span>
        </button>

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
              <div className="text-center text-white/70 text-sm mb-2">
                <p>Scroll to zoom • Drag to adjust position</p>
              </div>
              <div
                {...getRootProps()}
                className={`w-40 h-40 mx-auto border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden ${
                  isDragActive ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/40'
                }`}
                onMouseDown={handleImageMouseDown}
                onMouseMove={handleImageMouseMove}
                onMouseUp={handleImageMouseUp}
                onMouseLeave={handleImageMouseUp}
                onWheel={handleWheel}
              >
                <input {...getInputProps()} />
                {(previewUrl || profile?.avatar_url) ? (
                  <div className="relative w-full h-full">
                    <img
                      src={previewUrl || profile?.avatar_url}
                      alt="Profile"
                      className="absolute w-full h-full object-cover select-none"
                      style={{
                        transform: `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${imagePosition.scale})`,
                        transition: isDraggingImage ? 'none' : 'transform 0.1s ease-out'
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm text-center px-2">
                        Drop a new image or click to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-white/90 text-sm mb-1">
                      {isDragActive ? 'Drop the image here' : 'Drag and drop an image here'}
                    </p>
                    <p className="text-white/60 text-sm">or click to select</p>
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2 w-40 mx-auto">
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