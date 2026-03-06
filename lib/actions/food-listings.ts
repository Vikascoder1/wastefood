'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { FoodListingFormData } from '@/lib/types'

export async function getFoodListings(filters?: {
  search?: string
  location?: string
  food_type?: string
}) {
  const supabase = await createClient()
  
  // First, let's check if profiles exist
  const { data: profilesCheck } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .limit(5)
  
  console.log('Profiles check:', profilesCheck)
  
  let query = supabase
    .from('food_listings')
    .select(`
      *,
      profiles:posted_by (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .eq('status', 'available')
    .order('created_at', { ascending: false })

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters?.food_type) {
    query = query.eq('food_type', filters.food_type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching food listings:', error)
    return { data: null, error }
  }

  // Debug: Log the first listing to see the structure
  if (data && data.length > 0) {
    console.log('First listing data:', JSON.stringify(data[0], null, 2))
  }

  return { data, error: null }
}

export async function getFoodListingById(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('food_listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching food listing:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createFoodListing(formData: FormData) {
  try {
    const supabase = await createClient()
    
    // Get user ID from form data
    const userId = formData.get('user_id') as string
    if (!userId) {
      throw new Error('User ID is required')
    }

    console.log('Creating food listing for user:', userId)

    // Check if user profile exists, create if not
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingProfile) {
      console.log('Creating profile for user:', userId)
      // Get user email from auth.users
      const { data: authUser } = await supabase.auth.getUser()
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: authUser?.user?.email || '',
          role: 'both'
        })
      
      if (profileError) {
        console.error('Error creating profile:', profileError)
        throw new Error('Failed to create user profile')
      }
    }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const pickup_date = formData.get('pickup_date') as string
  const pickup_time = formData.get('pickup_time') as string
  const location = formData.get('location') as string
  const food_type = formData.get('food_type') as string
  const quantity = formData.get('quantity') as string
  const contact_info = formData.get('contact_info') as string
  const image = formData.get('image') as File

  // Validate required fields
  if (!title || !description || !pickup_date || !pickup_time || !location) {
    throw new Error('Missing required fields')
  }

  // Combine date and time
  const pickup_datetime = `${pickup_date}T${pickup_time}`

  // Get image URL from form data (uploaded client-side)
  const image_url = formData.get('image_url') as string || null

  // Create food listing using database function that bypasses RLS
  const { data: listingId, error } = await (supabase as any).rpc('create_food_listing', {
    p_title: title,
    p_description: description,
    p_pickup_time: pickup_datetime,
    p_location: location,
    p_lat: null,
    p_lng: null,
    p_food_type: food_type || null,
    p_quantity: quantity || null,
    p_contact_info: contact_info || null,
    p_image_url: image_url,
    p_posted_by: userId
  })

  if (error) {
    console.error('Error creating food listing:', error)
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    })
    throw new Error(`Failed to create food listing: ${error.message}`)
  }

    revalidatePath('/browse')
    revalidatePath('/list-food')
    // Don't redirect - stay on the same page
  } catch (error) {
    console.error('Error in createFoodListing:', error)
    throw error
  }
}

export async function updateFoodListing(id: string, formData: FormData) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  // Verify ownership
  const { data: existingListing } = await supabase
    .from('food_listings')
    .select('posted_by')
    .eq('id', id)
    .single()

  if (!existingListing || existingListing.posted_by !== session.user.id) {
    throw new Error('Not authorized to edit this listing')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const pickup_date = formData.get('pickup_date') as string
  const pickup_time = formData.get('pickup_time') as string
  const location = formData.get('location') as string
  const food_type = formData.get('food_type') as string
  const quantity = formData.get('quantity') as string
  const contact_info = formData.get('contact_info') as string

  // Combine date and time
  const pickup_datetime = `${pickup_date}T${pickup_time}`

  const { data, error } = await supabase
    .from('food_listings')
    .update({
      title,
      description,
      pickup_time: pickup_datetime,
      location,
      food_type: food_type || null,
      quantity: quantity || null,
      contact_info: contact_info || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating food listing:', error)
    throw new Error('Failed to update food listing')
  }

  revalidatePath('/browse')
  revalidatePath(`/food/${id}`)
  redirect('/browse')
}

export async function deleteFoodListing(id: string) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    throw new Error('Not authenticated')
  }

  // Verify ownership
  const { data: existingListing } = await supabase
    .from('food_listings')
    .select('posted_by, image_url')
    .eq('id', id)
    .single()

  if (!existingListing || existingListing.posted_by !== session.user.id) {
    throw new Error('Not authorized to delete this listing')
  }

  // Delete image from storage if exists
  if (existingListing.image_url) {
    const fileName = existingListing.image_url.split('/').pop()
    if (fileName) {
      await supabase.storage
        .from('food-images')
        .remove([`${session.user.id}/${fileName}`])
    }
  }

  const { error } = await supabase
    .from('food_listings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting food listing:', error)
    throw new Error('Failed to delete food listing')
  }

  revalidatePath('/browse')
  revalidatePath('/profile')
  redirect('/browse')
}

export async function getUserFoodListings() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) {
    return { data: null, error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('food_listings')
    .select('*')
    .eq('posted_by', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user food listings:', error)
    return { data: null, error }
  }

  return { data, error: null }
}
