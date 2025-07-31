-- Grant admin privileges to a user.
--
-- 1. Sign up a new user in your application.
-- 2. Replace 'user@example.com' with the new user's email address.
-- 3. Run this script in the Supabase SQL Editor.

with user_to_make_admin as (
  select id from auth.users where email = 'user@example.com'
)
update public.profiles
set is_admin = true
where id = (select id from user_to_make_admin);

-- To verify the change, run:
-- select id, email, is_admin from public.profiles p join auth.users u on p.id = u.id where u.email = 'user@example.com';
