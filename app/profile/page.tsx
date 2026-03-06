'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

export default function ProfilePage() {
  const { user, profile, updateProfile, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact_no: '',
    role: 'both' as 'donor' | 'recipient' | 'both'
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        contact_no: profile.contact_no || '',
        role: profile.role
      })
    }
  }, [profile])

  const handleSave = async () => {
    setIsSaving(true)
    const { error } = await updateProfile(formData)
    setIsSaving(false)
    
    if (!error) {
      setIsEditing(false)
    } else {
      console.error('Error updating profile:', error)
    }
  }

  const handleImageUploaded = async (imageUrl: string) => {
    if (!user) return
    
    try {
      const { error } = await updateProfile({ avatar_url: imageUrl })
      
      if (!error) {
      } else {
        console.error('Error updating profile with image:', error)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const getInitials = (firstName: string | null | undefined, lastName: string | null | undefined) => {
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return (first + last).toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
            {isEditing && (
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <ImageUpload
                  currentImageUrl={profile?.avatar_url}
                  onImageUploaded={handleImageUploaded}
                  userId={user.id}
                />
              </div>
              )}

              {/* Avatar Section */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.first_name || 'User'} />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile?.first_name, profile?.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </h3>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Phone Number</Label>
                <Input
                  id="contact"
                  value={formData.contact_no}
                  onChange={(e) => setFormData({ ...formData, contact_no: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'donor' | 'recipient' | 'both' })}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="donor">Donate leftover food</option>
                  <option value="recipient">Claim available food</option>
                  <option value="both">Both donate and claim</option>
                </select>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false)
                      // Reset form data to original values
                      if (profile) {
                        setFormData({
                          first_name: profile.first_name || '',
                          last_name: profile.last_name || '',
                          contact_no: profile.contact_no || '',
                          role: profile.role
                        })
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account details and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-gray-600">{user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Member Since</Label>
                <p className="text-gray-600">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-gray-600">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 