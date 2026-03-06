import { User, Session } from '@supabase/supabase-js'

// Profile interface
export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  contact_no: string | null
  role: 'donor' | 'recipient' | 'both'
  created_at: string
  updated_at: string
}

// Food listing interface (for Phase 3)
export interface FoodListing {
  id: string
  title: string
  description: string
  pickup_time: string
  location: string
  lat: number | null
  lng: number | null
  status: 'available' | 'claimed' | 'completed'
  posted_by: string
  image_url: string | null
  food_type: string | null
  dietary_info: string[] | null
  quantity: string | null
  contact_info: string | null
  created_at: string
  updated_at: string
}

// Food listing form data interface
export interface FoodListingFormData {
  title: string
  description: string
  pickup_time: string
  location: string
  lat?: number
  lng?: number
  food_type?: string
  dietary_info?: string[]
  quantity?: string
  contact_info?: string
  image?: File
}

// Food listing search filters interface
export interface FoodListingFilters {
  search?: string
  location?: string
  pickup_time?: string
  food_type?: string
  dietary_info?: string[]
}

// Map view interface
export interface MapViewProps {
  listings: FoodListing[]
  onListingClick?: (listing: FoodListing) => void
}

// Food listing card interface
export interface FoodListingCardProps {
  listing: FoodListing
  onClaim?: (listing: FoodListing) => void
  onEdit?: (listing: FoodListing) => void
  onDelete?: (listing: FoodListing) => void
  isOwner?: boolean
}

// Claim interface (for Phase 4)
export interface Claim {
  id: string
  food_id: string
  claimed_by: string
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  created_at: string
  updated_at: string
}

// Message interface (for Phase 5)
export interface Message {
  id: string
  claim_id: string
  sender_id: string
  message: string
  created_at: string
}

// Auth context interface
export interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

// Image upload props interface
export interface ImageUploadProps {
  currentImageUrl?: string | null
  onImageUploaded: (url: string) => void
  userId: string
}

// Form data interfaces
export interface ProfileFormData {
  first_name: string
  last_name: string
  contact_no: string
  role: 'donor' | 'recipient' | 'both'
}

export interface SignupFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  role: 'donor' | 'recipient' | 'both'
}

export interface LoginFormData {
  email: string
  password: string
}

// API response interfaces
export interface ApiResponse<T> {
  data: T | null
  error: any
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}
