-- Create storage bucket for food images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'food-images',
  'food-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- Create storage policy for food images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'food-images');

-- Create storage policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload food images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'food-images' 
    AND auth.role() = 'authenticated'
  );

-- Create storage policy for users to update their own images
CREATE POLICY "Users can update own food images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'food-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policy for users to delete their own images
CREATE POLICY "Users can delete own food images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'food-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
