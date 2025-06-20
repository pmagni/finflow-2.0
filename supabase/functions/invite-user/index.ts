// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

// Define the shape of the incoming request body
interface InviteUserPayload {
  organizationId: string;
  email: string;
  role: 'admin' | 'member';
}

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { organizationId, email, role }: InviteUserPayload = await req.json();

    // Create a Supabase client with the user's auth token
    const userSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the user who is making the request
    const { data: { user: invokingUser } } = await userSupabaseClient.auth.getUser();
    if (!invokingUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Check if the invoking user is an admin of the organization
    const { data: membership, error: membershipError } = await userSupabaseClient
      .from('organization_memberships')
      .select('role')
      .eq('user_id', invokingUser.id)
      .eq('organization_id', organizationId)
      .single();

    if (membershipError || membership?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: User is not an admin of this organization' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Create a Supabase admin client to perform privileged operations
    const adminSupabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Find the user to invite by their email
    const { data: invitedUserData, error: invitedUserError } = await adminSupabaseClient.auth.admin.getUserByEmail(email);
    if (invitedUserError || !invitedUserData.user) {
      return new Response(JSON.stringify({ error: 'User to invite not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }
    const invitedUser = invitedUserData.user;

    // Check if the user is already a member
    const { data: existingMembership } = await adminSupabaseClient
      .from('organization_memberships')
      .select('id')
      .eq('user_id', invitedUser.id)
      .eq('organization_id', organizationId)
      .single();
      
    if (existingMembership) {
        return new Response(JSON.stringify({ error: 'User is already a member of this organization' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 409, // Conflict
        });
    }

    // Create the new membership
    const { error: insertError } = await adminSupabaseClient
      .from('organization_memberships')
      .insert({
        organization_id: organizationId,
        user_id: invitedUser.id,
        role: role || 'member',
      });

    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ message: 'User invited successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/invite-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
