-- Create a view that includes email from auth.users
CREATE OR REPLACE VIEW profiles_with_email AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.avatar_url,
  p.contact_no,
  p.role,
  p.created_at,
  p.updated_at,
  u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id;

-- Grant access to the view
GRANT SELECT ON profiles_with_email TO authenticated;
