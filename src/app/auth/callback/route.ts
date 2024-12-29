import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/?error=no_code_provided', request.url));
    }

    // Create a Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create a regular client for session handling
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Exchange the code for a session
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (!user) {
      throw new Error('No user found');
    }

    console.log('User authenticated:', user.id);
    console.log('User metadata:', user.user_metadata);

    // Get the username from user metadata
    const username = user.user_metadata?.username;
    
    if (!username) {
      console.error('No username in metadata');
      throw new Error('No username found in user metadata');
    }

    // Create profile using admin client
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert([
        {
          id: user.id,
          username: username,
          email: user.email,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'id' });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }

    console.log('Profile created/updated successfully');

    // Redirect to the user's profile page
    return NextResponse.redirect(`${new URL(request.url).origin}/${username}`);
  } catch (error) {
    console.error('Callback error:', error);
    // Redirect to home page with error
    return NextResponse.redirect(`${new URL(request.url).origin}?error=callback_error`);
  }
} 