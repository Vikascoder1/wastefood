-- Add email field to profiles table
ALTER TABLE profiles ADD COLUMN email TEXT;

-- Update existing profiles with email from auth.users
UPDATE profiles 
SET email = auth.users.email 
FROM auth.users 
WHERE profiles.id = auth.users.id;

-- Make email field required for new profiles
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

-- Add unique constraint on email
ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
