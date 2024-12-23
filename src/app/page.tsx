'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Auth from '@/components/Auth';

interface TopProfile {
  username: string;
  total_views: number;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [topProfiles, setTopProfiles] = useState<TopProfile[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check for authenticated user
    const checkUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          return;
        }

        if (user) {
          console.log('User found:', user.id);
          // Get user's profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', user.id)
            .single();
            
          if (profileError) {
            console.log('No profile found, creating one...');
            // Create a profile if it doesn't exist
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: user.id,
                  username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
                  email: user.email
                }
              ])
              .select('username')
              .single();

            if (createError) {
              console.error('Error creating profile:', createError);
              return;
            }

            if (newProfile) {
              console.log('New profile created:', newProfile);
              router.push(`/${newProfile.username}`);
            }
            return;
          }

          if (profile) {
            console.log('Profile found:', profile);
            router.push(`/${profile.username}`);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const fetchTopProfiles = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, links(click_count)')
        .limit(5);

      if (data) {
        const profiles = data.map(profile => ({
          username: profile.username,
          total_views: profile.links?.reduce((sum: number, link: any) => sum + (link.click_count || 0), 0) || 0
        }));

        profiles.sort((a, b) => b.total_views - a.total_views);
        setTopProfiles(profiles);
      }
    };

    fetchTopProfiles();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/${username.toLowerCase()}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-purple-500 to-pink-500">
      {/* Navigation */}
      <nav className="w-full px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-end gap-4">
          <button
            onClick={() => {
              setIsSignUp(false);
              setShowAuth(true);
            }}
            className="px-4 py-2 text-white/90 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => {
              setIsSignUp(true);
              setShowAuth(true);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all"
          >
            Sign up
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {showAuth ? (
          <div className="w-full max-w-md">
            <button
              onClick={() => setShowAuth(false)}
              className="text-white/80 hover:text-white mb-6"
            >
              ← Back
            </button>
            <Auth initialView={isSignUp ? 'sign-up' : 'sign-in'} />
          </div>
        ) : (
          <>
            <div className="text-center mb-16">
              <h1 className="text-8xl font-bold text-white mb-3 tracking-tight">
                linkli
              </h1>
              <div className="h-1 w-32 bg-white/20 mx-auto mb-10 rounded-full" />
              <p className="text-3xl text-white/90 font-light mb-2">
                One simple page for all your important links.
              </p>
              <p className="text-xl text-white/70">
                Easy to set up, easy to share.
              </p>
            </div>

            <div className="w-full max-w-6xl flex items-center gap-12">
              {/* Left side - Leaderboard */}
              <div className="hidden md:block w-72 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-6">Top Profiles</h2>
                <div className="space-y-4">
                  {topProfiles.map((profile, index) => (
                    <button
                      key={profile.username}
                      onClick={() => router.push(`/${profile.username}`)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors group text-left"
                    >
                      <span className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white/80 text-sm font-medium">
                        #{index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-white font-medium group-hover:text-white/90">
                          @{profile.username}
                        </p>
                        <p className="text-white/60 text-sm">
                          {profile.total_views.toLocaleString()} views
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Center content */}
              <div className="flex-1">
                <div className="max-w-xl mx-auto">
                  <form onSubmit={handleSubmit} className="relative mb-16">
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter a username"
                        className="w-full px-7 py-5 text-lg border-2 border-white/20 bg-white/10 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/40 pr-36"
                        required
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-7 py-3 bg-white text-purple-600 rounded-full font-medium hover:bg-opacity-90 transition-colors"
                      >
                        View Page
                      </button>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-2">Simple Setup</h3>
                      <p className="text-white/80">Create your page in seconds, no sign up required</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-2">All Your Links</h3>
                      <p className="text-white/80">Showcase your social media, portfolio, and more</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                      <h3 className="text-xl font-semibold text-white mb-2">Share Easily</h3>
                      <p className="text-white/80">One link to share all your online presence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
