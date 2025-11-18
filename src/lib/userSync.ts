// src/lib/userSync.ts
import { AuthContextType } from '../contexts/AuthContext';

const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
const n8nApiKey = import.meta.env.VITE_N8N_WEBHOOK_HEADER_KEY;

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
