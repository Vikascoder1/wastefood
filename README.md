# LeftoverFood - Share Food, Reduce Waste

Connect food donors with those in need. Reduce waste, help communities, and make a difference one meal at a time.

## 🚀 Phase 2 - Auth & Profiles Complete!

### What's Been Implemented:

✅ **Supabase Authentication**
- Email/password authentication
- Google OAuth integration
- Session management with middleware
- Protected routes

✅ **User Profiles System**
- Profiles table with RLS policies
- Automatic profile creation on signup
- Profile editing functionality
- Role-based user management (donor/recipient/both)

✅ **Database Schema**
- PostgreSQL with Row Level Security (RLS)
- Triggers for automatic profile creation
- SQL functions for data integrity
- Proper indexing and constraints

✅ **UI/UX Features**
- Dynamic navbar with user status
- Profile management page
- Authentication forms with validation
- Loading states and error handling

## 🛠️ Setup Instructions

### 1. Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  contact_no TEXT,
  role TEXT CHECK (role IN ('donor', 'recipient', 'both')) DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'both')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2. Environment Variables

Make sure your `.env` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bqyulioidcfblqtwvlgm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Supabase Configuration

1. **Enable Email Auth**: Go to Authentication > Settings > Auth Providers and enable Email
2. **Configure Google OAuth**: Add Google OAuth provider in Authentication > Settings > Auth Providers
3. **Set Site URL**: In Authentication > Settings > URL Configuration, set your site URL

### 4. Run the Application

```bash
npm run dev
```

## 🎯 Features Implemented

### Authentication
- ✅ Email/password signup and login
- ✅ Google OAuth integration
- ✅ Session management
- ✅ Protected routes
- ✅ Automatic redirects

### User Profiles
- ✅ Profile creation on signup
- ✅ Profile editing
- ✅ Role selection (donor/recipient/both)
- ✅ Contact information
- ✅ Avatar support (ready for Phase 3)

### Database Features
- ✅ Row Level Security (RLS)
- ✅ Automatic triggers
- ✅ SQL functions
- ✅ Data validation
- ✅ Timestamps

### UI Components
- ✅ Dynamic navbar with user menu
- ✅ Profile management page
- ✅ Authentication forms
- ✅ Loading states
- ✅ Error handling

## 🔐 Security Features

- **Row Level Security**: Users can only access their own data
- **Input Validation**: Form validation on both client and server
- **Session Management**: Secure session handling with middleware
- **Protected Routes**: Automatic redirects for unauthenticated users

## 📱 Pages Available

- `/` - Home page
- `/login` - Authentication page
- `/signup` - Registration page
- `/profile` - Profile management (protected)
- `/browse` - Browse food listings
- `/list-food` - List food form

## 🚀 Next Steps - Phase 3

Phase 3 will focus on:
- Food listing functionality
- Image upload to Supabase Storage
- Location-based features
- Real-time updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (ready for Phase 3)
- **Real-time**: Supabase Realtime (ready for Phase 4)

---

**Phase 2 Complete!** ✅ Users can now sign up, log in, and manage their profiles with full authentication and authorization.
