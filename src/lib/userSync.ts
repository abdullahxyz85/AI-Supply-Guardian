// src/lib/userSync.ts
import { AuthContextType } from '../contexts/AuthContext';
import { supabase } from './supabase';

const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
const n8nApiKey = import.meta.env.VITE_N8N_WEBHOOK_HEADER_KEY;

/**
 * Creates or signs in a Google user to Supabase auth.users table
 * This ensures Google OAuth users are properly stored in Supabase
 * @param googleUser - The Google user data from OAuth
 * @returns The Supabase session or null if failed
 */
export async function createSupabaseUserFromGoogle(
  googleUser: { user_id: string; email: string; name: string; picture?: string }
) {
  try {
    console.log('🔄 Creating/signing in Google user to Supabase:', googleUser.email);

    // First, check if user already exists in our mapping table
    const { data: existingMapping, error: mappingError } = await supabase
      .from('google_oauth_tokens')
      .select('user_id')
      .eq('google_user_id', googleUser.user_id)
      .single();
    
    if (!mappingError && existingMapping?.user_id) {
      // User already exists and is mapped
      localStorage.setItem('supabase_user_id', existingMapping.user_id);
      console.log('✅ User already exists, retrieved UUID:', existingMapping.user_id);
      return { user: null, session: null };
    }

    // User doesn't exist in mapping, try to sign them up
    // Generate a secure random password (user won't need it for Google OAuth)
    const randomPassword = crypto.randomUUID() + crypto.randomUUID();
    
    // Try to sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: googleUser.email,
      password: randomPassword,
      options: {
        emailRedirectTo: undefined, // Disable email confirmation for Google OAuth users
        data: {
          full_name: googleUser.name,
          avatar_url: googleUser.picture,
          provider: 'google',
          google_id: googleUser.user_id,
        },
      },
    });

    if (signUpError) {
      // If user already exists, that's actually fine for our use case
      if (signUpError.message.includes('already registered') || 
          signUpError.message.includes('User already registered')) {
        console.log('ℹ️ User already exists in Supabase:', googleUser.email);
        
        // User exists - first try to fetch their Supabase UUID from google_oauth_tokens table
        const { data: tokenData, error: tokenError } = await supabase
          .from('google_oauth_tokens')
          .select('user_id')
          .eq('google_user_id', googleUser.user_id)
          .single();
        
        if (!tokenError && tokenData?.user_id) {
          localStorage.setItem('supabase_user_id', tokenData.user_id);
          console.log('✅ Retrieved Supabase user ID from mapping table:', tokenData.user_id);
          return { user: null, session: null };
        }
        
        // If not found in mapping table, use RPC function to get user ID by email
        console.log('🔍 Mapping not found, querying auth.users by email...');
        
        const { data: userId, error: rpcError } = await supabase
          .rpc('get_user_id_by_email', { user_email: googleUser.email });
        
        if (!rpcError && userId) {
          localStorage.setItem('supabase_user_id', userId);
          console.log('✅ Retrieved Supabase user ID from auth.users:', userId);
          
          // Create the mapping for future use
          await supabase.from('google_oauth_tokens').upsert({
            google_user_id: googleUser.user_id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            user_id: userId,
            access_token: 'managed_by_backend',
            refresh_token: 'managed_by_backend',
          }, {
            onConflict: 'google_user_id'
          });
          
          return { user: null, session: null };
        }
        
        console.error('❌ Could not retrieve Supabase user ID:', rpcError);
        console.warn('⚠️ Please run the SQL migration: supabase/migrations/get_user_id_by_email.sql');
        return { user: null, session: null };
      }
      
      console.error('❌ Error signing up user:', signUpError);
      return null;
    }

    if (signUpData.user) {
      console.log('✅ User created in Supabase auth.users:', signUpData.user.id);
      console.log('📧 Email:', signUpData.user.email);
      
      // Store the Supabase UUID for future database operations
      localStorage.setItem('supabase_user_id', signUpData.user.id);
      
      // Also store the mapping in google_oauth_tokens table for future lookups
      await supabase.from('google_oauth_tokens').upsert({
        google_user_id: googleUser.user_id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        user_id: signUpData.user.id,
        access_token: 'managed_by_backend',
        refresh_token: 'managed_by_backend',
      }, {
        onConflict: 'google_user_id'
      });
    }
    
    return signUpData;
  } catch (error) {
    console.error('❌ Unexpected error creating Supabase user:', error);
    return null;
  }
}

/**
 * Sends user data to the n8n webhook to sync with Supabase.
 * This function is designed to be called every time a user session is initialized.
 * @param user - The user object from the AuthContext.
 * @param accessToken - The user's access token.
 * @param refreshToken - The user's refresh token.
 */
export async function syncUserToSupabase(
  user: AuthContextType['user'],
  accessToken: string | null,
  refreshToken: string | null
) {
  if (!user) return;
  if (!n8nWebhookUrl || !n8nApiKey) {
    console.warn("n8n webhook URL or API key is missing. Skipping user sync.");
    return;
  }

  // Helper to check if the user object is a Supabase user
  const isSupabaseUser = (u: any): u is { id: string; user_metadata: any } => {
    return 'id' in u && 'user_metadata' in u;
  };

  // Helper to check if the user object is a Google user from your backend
  const isGoogleUser = (u: any): u is { user_id: string; name: string; picture: string } => {
    return 'user_id' in u && 'name' in u;
  };

  let userDataPayload;

  if (isSupabaseUser(user)) {
    userDataPayload = {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      provider: 'supabase',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } else if (isGoogleUser(user)) {
    userDataPayload = {
      id: user.user_id,
      email: user.email,
      full_name: user.name,
      avatar_url: user.picture,
      provider: 'google',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  } else {
    console.error("Unknown user object structure:", user);
    return;
  }
  
  console.log("Attempting to sync user to Supabase via n8n...");
  console.log("Webhook URL:", n8nWebhookUrl);
  console.log("Payload:", JSON.stringify(userDataPayload, null, 2));

  try {
    const headers = {
      'Authorization': n8nApiKey,
      'Content-Type': 'application/json',
    };

    console.log("Request Headers:", JSON.stringify(headers, null, 2));

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(userDataPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error syncing user to Supabase via n8n: ${response.status} ${errorText}`);
    } else {
      console.log("User sync successful!");
    }
  } catch (error) {
    console.error("An unexpected error occurred during user sync:", error);
  }
}
