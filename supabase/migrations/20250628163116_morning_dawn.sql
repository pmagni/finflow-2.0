/*
# Fix get_user_data RPC function

1. Changes Made
   - Modified `get_user_data` function to return TABLE instead of JSON
   - Updated return structure to be compatible with supabase.rpc expectations
   - Function now returns tabular data that can be properly consumed by the client

2. Function Structure
   - Returns a table with columns: id, email, user_role, preferences, organizations
   - Each column properly typed for client consumption
   - Maintains backward compatibility with existing data structure
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS public.get_user_data();

-- Create the new function that returns a table structure
CREATE OR REPLACE FUNCTION public.get_user_data()
RETURNS TABLE(
    id uuid,
    email text,
    user_role app_role,
    preferences jsonb,
    organizations jsonb
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid() as id,
        (SELECT u.email FROM auth.users u WHERE u.id = auth.uid()) as email,
        (SELECT ur.role FROM public.user_roles ur WHERE ur.user_id = auth.uid() LIMIT 1) as user_role,
        (SELECT row_to_json(up.*) FROM public.user_preferences up WHERE up.user_id = auth.uid()) as preferences,
        (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', o.id,
                    'name', o.name,
                    'role', om.role
                )
            ), '[]'::json)
            FROM public.organization_memberships om
            JOIN public.organizations o ON o.id = om.organization_id
            WHERE om.user_id = auth.uid()
        ) as organizations;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;