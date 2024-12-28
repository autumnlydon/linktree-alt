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
    <main className="relative bg-gradient-to-br from-sky-400/80 to-blue-500/80">
      {view === 'sign-in' || view === 'sign-up' ? (
        <div className="min-h-screen flex items-center justify-center p-4">
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
          <section className="min-h-screen flex flex-col">
            <Navigation />
            <div className="flex-1 flex flex-col items-center px-4">
              <div className="w-full max-w-6xl mx-auto text-center">
                <img 
                  src="/icon.svg" 
                  alt="linkli logo" 
                  className="w-40 h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 mx-auto -mt-12 mb-6 lg:mb-8 xl:mb-10 opacity-90 animate-fade-in"
                />
                <h1 className="text-7xl lg:text-8xl xl:text-9xl font-bold text-white/90 mb-2 tracking-tight">
                  linkli
                </h1>
                <div className="h-1 w-32 lg:w-40 xl:w-48 bg-white/10 mx-auto mb-6 lg:mb-8 xl:mb-10 rounded-full" />
                <p className="text-2xl lg:text-3xl xl:text-4xl text-white/80 font-light mb-2">
                  One simple page for all your important links.
                </p>
                <p className="text-lg lg:text-xl xl:text-2xl text-white/60 mb-6 lg:mb-8 xl:mb-10">
                  Easy to set up, easy to share.
                </p>

                <form onSubmit={handleSubmit} className="relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto mb-8 lg:mb-10 xl:mb-12">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-white/20 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter a username"
                      className="relative w-full px-7 py-5 lg:py-6 xl:py-7 text-lg lg:text-xl xl:text-2xl border-2 border-white/20 bg-white/10 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-white/30 pr-36 lg:pr-40 xl:pr-44 backdrop-blur-sm"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-7 lg:px-8 xl:px-10 py-3 lg:py-4 xl:py-5 bg-white/90 text-blue-500 rounded-full font-medium hover:bg-white transition-colors text-lg lg:text-xl xl:text-2xl"
                    >
                      View Page
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-10 max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 xl:p-10 text-center border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-white/90 mb-2 lg:mb-3 xl:mb-4">Simple Setup</h3>
                    <p className="text-base lg:text-lg xl:text-xl text-white/70">Create your page in seconds, no sign up required</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 xl:p-10 text-center border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-white/90 mb-2 lg:mb-3 xl:mb-4">All Your Links</h3>
                    <p className="text-base lg:text-lg xl:text-xl text-white/70">Showcase your social media, portfolio, and more</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 lg:p-8 xl:p-10 text-center border border-white/10 hover:bg-white/10 transition-colors">
                    <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold text-white/90 mb-2 lg:mb-3 xl:mb-4">Share Easily</h3>
                    <p className="text-base lg:text-lg xl:text-xl text-white/70">One link to share all your online presence</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-gradient-to-b from-blue-500/50 to-blue-600/50 border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Top Profiles */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h2 className="text-2xl font-semibold text-white/90 mb-6">Top Profiles</h2>
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
                          <p className="text-white/90 font-medium group-hover:text-white">
                            @{profile.username}
                          </p>
                          <p className="text-white/50 text-sm">
                            {profile.total_views.toLocaleString()} views
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Platform Stats */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h2 className="text-2xl font-semibold text-white/90 mb-6">Platform Stats</h2>
                  <div className="space-y-6">
                    <div>
                      <p className="text-white/50 text-sm mb-1">Total Links Created</p>
                      <p className="text-3xl font-bold text-white/90">1,234</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm mb-1">Total Link Clicks</p>
                      <p className="text-3xl font-bold text-white/90">45.6K</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm mb-1">Active Users</p>
                      <p className="text-3xl font-bold text-white/90">789</p>
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
