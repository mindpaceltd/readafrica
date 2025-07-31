-- Add a 'role' column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN role TEXT NOT NULL DEFAULT 'reader';

-- Set the role for existing admins
UPDATE public.profiles
SET role = 'admin'
WHERE is_admin = true;

-- We can now consider making is_admin redundant in the future
-- and relying solely on the 'role' column.
