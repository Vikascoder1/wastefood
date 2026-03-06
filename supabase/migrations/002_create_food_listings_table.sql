-- Create food_listings table
CREATE TABLE food_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  status TEXT CHECK (status IN ('available', 'claimed', 'completed')) DEFAULT 'available',
  posted_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  food_type TEXT,
  dietary_info TEXT[],
  quantity TEXT,
  contact_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Anyone can view available food listings
CREATE POLICY "Anyone can view available food listings" ON food_listings
  FOR SELECT USING (status = 'available');

-- Users can view their own listings regardless of status
CREATE POLICY "Users can view own listings" ON food_listings
  FOR SELECT USING (auth.uid() = posted_by);

-- Users can insert their own food listings
CREATE POLICY "Users can insert own food listings" ON food_listings
  FOR INSERT WITH CHECK (auth.uid() = posted_by);

-- Users can update their own food listings
CREATE POLICY "Users can update own food listings" ON food_listings
  FOR UPDATE USING (auth.uid() = posted_by);

-- Users can delete their own food listings
CREATE POLICY "Users can delete own food listings" ON food_listings
  FOR DELETE USING (auth.uid() = posted_by);

-- Create trigger for updating updated_at
CREATE TRIGGER update_food_listings_updated_at
  BEFORE UPDATE ON food_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_food_listings_status ON food_listings(status);
CREATE INDEX idx_food_listings_posted_by ON food_listings(posted_by);
CREATE INDEX idx_food_listings_pickup_time ON food_listings(pickup_time);
CREATE INDEX idx_food_listings_location ON food_listings USING GIN(to_tsvector('english', location));
