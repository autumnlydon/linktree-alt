'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

interface AuthProps {
  initialView?: 'sign-up' | 'sign-in';
}

export default function Auth({ initialView = 'sign-in' }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(initialView === 'sign-up');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsSignUp(initialView === 'sign-up');
  }, [initialView]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isSignUp) {
        // Check if username is taken
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username.toLowerCase())
          .single();

        if (existingUser) {
          setError('Username already taken');
          setLoading(false);
          return;
        }

        // Sign up with email, password, and store username in metadata
        console.log('Starting signup process with username:', username.toLowerCase());
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username: username.toLowerCase(),
              full_name: username.toLowerCase()
            }
          }
        });

        if (signUpError) {
          console.error('Signup error:', signUpError);
          throw signUpError;
        }

        if (data.user) {
          console.log('User created:', data.user.id);
          console.log('User metadata:', data.user.user_metadata);
          setSuccessMessage(
            'Please check your email to confirm your account. You can close this window after confirming.'
          );
          // Clear form
          setEmail('');
          setPassword('');
          setUsername('');
        }
      } else {
        // Handle sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          console.error('Sign in error:', signInError);
          throw signInError;
        }

        if (data.user) {
          // Get user's profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw new Error('Failed to fetch profile');
          }

          if (!profile) {
            throw new Error('Profile not found');
          }

          // Redirect to profile page
          window.location.href = `/${profile.username}`;
        }
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <form onSubmit={handleAuth} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-white/90 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setSuccessMessage(null);
          }}
          className="w-full px-4 py-2 bg-transparent text-white/90 hover:text-white transition-colors"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </form>
    </div>
  );
} 