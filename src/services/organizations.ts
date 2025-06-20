import { supabase } from './supabase';
import type { Organization, OrganizationMembership } from '../types';

export const organizationService = {
  // Create a new organization
  async createOrganization(name: string): Promise<{ data?: Organization; error?: string }> {
    const { data, error } = await supabase
      .from('organizations')
      .insert({ name })
      .select()
      .single();

    if (error) return { error: error.message };

    // Add the creator as admin
    const { error: membershipError } = await supabase
      .from('organization_memberships')
      .insert({
        organization_id: data.id,
        role: 'admin',
      });

    if (membershipError) return { error: membershipError.message };

    return { data };
  },

  // Get user's organizations
  async getUserOrganizations(): Promise<{ data?: Organization[]; error?: string }> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        organization_memberships!inner(user_id)
      `);

    if (error) return { error: error.message };
    return { data };
  },

  // Get organization details with members
  async getOrganization(id: string): Promise<{ data?: Organization & { members: OrganizationMembership[] }; error?: string }> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        organization_memberships(
          *,
          user_id
        )
      `)
      .eq('id', id)
      .single();

    if (error) return { error: error.message };
    return { data };
  },

  // Invite user to organization
  async inviteUser(organizationId: string, email: string, role: 'admin' | 'member' = 'member'): Promise<{ error?: string }> {
    // This needs to be implemented as a Supabase Edge Function for security.
    const { error } = await supabase.functions.invoke('invite-user', {
      body: { organizationId, email, role },
    });

    if (error) {
      console.error('Error inviting user:', error);
      return { error: error.message };
    }
    
    return {};
  },

  // Remove user from organization
  async removeUser(organizationId: string, userId: string): Promise<{ error?: string }> {
    const { error } = await supabase
      .from('organization_memberships')
      .delete()
      .eq('organization_id', organizationId)
      .eq('user_id', userId);

    return { error: error?.message };
  },
}; 