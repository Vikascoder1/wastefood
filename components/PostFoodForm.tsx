'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createFoodListing } from '@/lib/actions/food-listings'
import { useAuth } from '@/lib/auth-context'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { TimePicker } from '@/components/ui/time-picker'

const foodTypes = [
  'Bread & Bakery',
  'Cooked Meals',
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Canned Goods',
  'Snacks',
  'Beverages',
  'Other'
]

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Nut-Free',
  'Dairy-Free',
  'Halal',
  'Kosher'
]

export default function PostFoodForm() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [pickupTime, setPickupTime] = useState<string>('')
  const [pickupDate, setPickupDate] = useState<string>('')

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        event.target.value = ''
        return
      }
      
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleDietaryToggle = (option: string) => {
    setSelectedDietary(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  const handleSubmit = async (formData: FormData) => {
    if (!user) {
      alert('You must be logged in to post food')
      return
    }
    
    setIsLoading(true)
    try {
      let imageUrl = null
      
      // Upload image first if selected
      if (selectedImage) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        
        const fileExt = selectedImage.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { data: urlData } = supabase.storage
          .from('food-images')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }
      
      // Add image URL to form data
      if (imageUrl) {
        formData.append('image_url', imageUrl)
      }
      
      if (selectedDietary.length > 0) {
        formData.append('dietary_info', JSON.stringify(selectedDietary))
      }
      
      // Add pickup date and time to form data
      if (pickupDate) {
        formData.append('pickup_date', pickupDate)
      }
      if (pickupTime) {
        formData.append('pickup_time', pickupTime)
      }
      
      // Add user ID to form data
      formData.append('user_id', user.id)
      await createFoodListing(formData)
    } catch (error) {
      console.error('Error creating food listing:', error)
      alert('Failed to create food listing. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Food Details</CardTitle>
          <CardDescription>
            Provide information about the food you're sharing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {/* Food Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Food Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Fresh Homemade Bread, Vegetable Curry"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the food, ingredients, quantity, and any special notes..."
                rows={4}
                required
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                placeholder="e.g., 2 loaves, 4 servings, 1 kg"
              />
            </div>

            {/* Pickup Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Pickup Location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="Enter your address or pickup location"
                required
              />
            </div>

            {/* Pickup Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pickup-date">Pickup Date *</Label>
                <Input
                  id="pickup-date"
                  name="pickup_date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pickup-time">Pickup Time *</Label>
                <TimePicker
                  value={pickupTime}
                  onChange={setPickupTime}
                  selectedDate={pickupDate}
                  placeholder="Select pickup time"
                />
              </div>
            </div>

            {/* Food Type */}
            <div className="space-y-2">
              <Label htmlFor="food-type">Food Type</Label>
              <select
                id="food-type"
                name="food_type"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select food type</option>
                {foodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-2">
              <Label>Dietary Information</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {dietaryOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedDietary.includes(option)}
                      onChange={() => handleDietaryToggle(option)}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="contact_info">Contact Information</Label>
              <Input
                id="contact_info"
                name="contact_info"
                placeholder="Phone number or email for coordination"
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Food Photo (Optional)</Label>
              {imagePreview ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Food preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeImage}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  <p className="text-xs text-gray-400 mt-1">Maximum file size: 10MB</p>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image')?.click()}
                    className="mt-4"
                  >
                    Choose File
                  </Button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'List Food'}
              </Button>
              <Button type="button" variant="outline">
                Save Draft
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tips for Listing Food</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Be specific about the quantity and type of food</li>
            <li>• Include any dietary restrictions or allergens</li>
            <li>• Set a realistic pickup time window</li>
            <li>• Provide clear pickup location instructions</li>
            <li>• Take a clear photo of the food if possible</li>
            <li>• Only list food that is safe to consume</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
