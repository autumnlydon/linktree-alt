'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

interface Profile {
  username: string;
}

export default function Navigation() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) return null;

  return (
    <nav className="w-full px-3 py-5 lg:px-4 lg:py-6">
      <div className="max-w-[98%] mx-auto flex justify-end gap-4">
        {profile ? (
          <>
            <button
              onClick={() => router.push(`/${profile.username}`)}
              className="px-6 py-3 text-lg lg:text-xl text-white/90 hover:text-white transition-colors"
            >
              My Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 text-lg lg:text-xl bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/?view=sign-in')}
              className="px-6 py-3 text-lg lg:text-xl text-white/90 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => router.push('/?view=sign-up')}
              className="px-6 py-3 text-lg lg:text-xl bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
} 