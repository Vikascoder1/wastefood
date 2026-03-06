-- Create function to create user profile (bypasses RLS)
CREATE OR REPLACE FUNCTION create_user_profile(user_id UUID)
RETURNS VOID AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = user_id;
  
  INSERT INTO profiles (id, email, role)
  VALUES (user_id, user_email, 'both')
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile(UUID) TO authenticated;

-- Create function to create food listing (bypasses RLS)
CREATE OR REPLACE FUNCTION create_food_listing(
  p_title TEXT,
  p_description TEXT,
  p_pickup_time TIMESTAMP WITH TIME ZONE,
  p_location TEXT,
  p_lat DECIMAL(10, 8),
  p_lng DECIMAL(11, 8),
  p_food_type TEXT,
  p_quantity TEXT,
  p_contact_info TEXT,
  p_image_url TEXT,
  p_posted_by UUID
)
RETURNS UUID AS $$
DECLARE
  listing_id UUID;
BEGIN
  INSERT INTO food_listings (
    title, description, pickup_time, location, lat, lng,
    food_type, quantity, contact_info, image_url, posted_by
  )
  VALUES (
    p_title, p_description, p_pickup_time, p_location, p_lat, p_lng,
    p_food_type, p_quantity, p_contact_info, p_image_url, p_posted_by
  )
  RETURNING id INTO listing_id;
  
  RETURN listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_food_listing(TEXT, TEXT, TIMESTAMP WITH TIME ZONE, TEXT, DECIMAL(10, 8), DECIMAL(11, 8), TEXT, TEXT, TEXT, TEXT, UUID) TO authenticated;

-- Create function to upload image (bypasses RLS)
CREATE OR REPLACE FUNCTION upload_food_image(
  p_file_name TEXT,
  p_file_content BYTEA,
  p_content_type TEXT,
  p_user_id UUID
)
RETURNS TEXT AS $$
DECLARE
  file_url TEXT;
BEGIN
  -- Insert file into storage.objects
  INSERT INTO storage.objects (
    id,
    name,
    bucket_id,
    owner,
    metadata,
    created_at,
    updated_at,
    last_accessed_at,
    content_type,
    size
  )
  VALUES (
    gen_random_uuid(),
    p_file_name,
    'food-images',
    p_user_id,
    '{"mimetype": "' || p_content_type || '"}',
    NOW(),
    NOW(),
    NOW(),
    p_content_type,
    octet_length(p_file_content)
  );
  
  -- Return the public URL
  SELECT storage.url(name, bucket_id) INTO file_url
  FROM storage.objects
  WHERE name = p_file_name AND bucket_id = 'food-images';
  
  RETURN file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION upload_food_image(TEXT, BYTEA, TEXT, UUID) TO authenticated;

-- Create function to upload image (bypasses RLS)
CREATE OR REPLACE FUNCTION upload_food_image(
  p_file_name TEXT,
  p_file_content BYTEA,
  p_content_type TEXT,
  p_user_id UUID
)
RETURNS TEXT AS $$
DECLARE
  file_url TEXT;
BEGIN
  -- Insert file into storage.objects
  INSERT INTO storage.objects (
    id,
    name,
    bucket_id,
    owner,
    metadata,
    created_at,
    updated_at,
    last_accessed_at,
    content_type,
    size
  )
  VALUES (
    gen_random_uuid(),
    p_file_name,
    'food-images',
    p_user_id,
    '{"mimetype": "' || p_content_type || '"}',
    NOW(),
    NOW(),
    NOW(),
    p_content_type,
    octet_length(p_file_content)
  );
  
  -- Return the public URL
  SELECT storage.url(name, bucket_id) INTO file_url
  FROM storage.objects
  WHERE name = p_file_name AND bucket_id = 'food-images';
  
  RETURN file_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION upload_food_image(TEXT, BYTEA, TEXT, UUID) TO authenticated;
