-- Fix foreign key relationship between food_listings and profiles
-- First, check if the constraint exists and drop it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'food_listings_posted_by_fkey'
    ) THEN
        ALTER TABLE food_listings DROP CONSTRAINT food_listings_posted_by_fkey;
    END IF;
END $$;

-- Add the correct foreign key constraint
ALTER TABLE food_listings 
ADD CONSTRAINT food_listings_posted_by_fkey 
FOREIGN KEY (posted_by) REFERENCES profiles(id) ON DELETE CASCADE;
