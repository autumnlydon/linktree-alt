'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Auth from '@/components/Auth';
import Navigation from '@/components/Navigation';

interface TopProfile {
  username: string;
  total_views: number;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [topProfiles, setTopProfiles] = useState<TopProfile[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');

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
      <Navigation />

      {view === 'sign-in' || view === 'sign-up' ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <button
              onClick={() => router.push('/')}
              className="text-white/80 hover:text-white mb-6"
            >
              ← Back
            </button>
            <Auth initialView={view === 'sign-up' ? 'sign-up' : 'sign-in'} />
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="flex-1 flex flex-col items-center justify-center px-4 py-16">
            <div className="w-full max-w-3xl mx-auto text-center">
              <h1 className="text-8xl font-bold text-white mb-3 tracking-tight">
                linkli
              </h1>
              <div className="h-1 w-32 bg-white/20 mx-auto mb-10 rounded-full" />
              <p className="text-3xl text-white/90 font-light mb-2">
                One simple page for all your important links.
              </p>
              <p className="text-xl text-white/70 mb-12">
                Easy to set up, easy to share.
              </p>

              <form onSubmit={handleSubmit} className="relative mb-16 max-w-xl mx-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
          </section>

          {/* Stats Section */}
          <section className="bg-white/5 backdrop-blur-sm border-t border-white/10">
            <div className="max-w-6xl mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Top Profiles */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-semibold text-white mb-6">Top Profiles</h2>
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

                {/* Platform Stats */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h2 className="text-2xl font-semibold text-white mb-6">Platform Stats</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Total Links Created</p>
                      <p className="text-3xl font-bold text-white">1,234</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Total Link Clicks</p>
                      <p className="text-3xl font-bold text-white">45.6K</p>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-1">Active Users</p>
                      <p className="text-3xl font-bold text-white">789</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
