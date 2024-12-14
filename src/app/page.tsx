'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTopProfiles } from './utils/rankings';
import Link from 'next/link';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const topProfiles = getTopProfiles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/${username.toLowerCase()}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-pink-500">
      <div className="w-full max-w-6xl flex items-center gap-12">
        {/* Left side - Leaderboard */}
        <div className="hidden md:block w-64 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Top Profiles</h2>
          <div className="space-y-3">
            {topProfiles.map((profile, index) => (
              <Link
                key={profile.username}
                href={`/${profile.username}`}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <span className="w-6 text-white/60 text-sm">#{index + 1}</span>
                <div className="flex-1">
                  <p className="text-white font-medium group-hover:text-white/90">
                    @{profile.username}
                  </p>
                  <p className="text-white/60 text-sm">
                    {profile.analytics.totalViews.toLocaleString()} views
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 max-w-3xl">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-bold text-white mb-2 tracking-tight">
              linkli
            </h1>
            <div className="h-1 w-24 bg-white/20 mx-auto mb-8 rounded-full" />
            <p className="text-2xl text-white/90 font-light">
              One simple page for all your important links.
            </p>
            <p className="text-lg text-white/70">
              Easy to set up, easy to share.
            </p>
          </div>

          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-6 py-4 text-lg border-2 border-white/20 bg-white/10 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-white/40 pr-36"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-white text-purple-600 rounded-full font-medium hover:bg-opacity-90 transition-colors"
                >
                  Get Page
                </button>
              </div>
            </form>
            <p className="text-sm text-white/70 text-center mt-4">
              Try with usernames: autumn or bahij
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </main>
  );
}
