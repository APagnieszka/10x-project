-- Migration: Fix RLS performance issue in user_households policy
-- Created: 2025-10-26 12:30:00 UTC
-- Purpose: Replace direct auth.uid() call with subquery to improve performance
-- Affected tables: user_households
-- Special considerations: This resolves the warning about re-evaluating auth.uid() for each row

-- Drop the old policy that causes performance issues
drop policy "authenticated_users_can_access_own_user_household" on user_households;

-- Create the new policy with improved performance using subquery
create policy "authenticated_users_can_access_own_user_household" on user_households
for all using (user_id = (select auth.uid()));