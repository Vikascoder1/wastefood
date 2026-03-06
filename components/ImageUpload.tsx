'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import { ImageUploadProps } from '@/lib/types'


export default function ImageUpload({ currentImageUrl, onImageUploaded, userId }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)

      // Delete old image if it exists
      if (currentImageUrl) {
        const oldImagePath = currentImageUrl.split('/').pop()
        if (oldImagePath) {
          await supabase.storage
            .from('profile-images')
            .remove([`${userId}/${oldImagePath}`])
        }
      }

      // Upload new image
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

    //   const { data, error } = await supabase.storage
    //     .from('profile-images')
    //     .upload(fileName, file, {
    //       cacheControl: '3600',
    //       upsert: false
    //     })

    //   if (error) {
    //     throw error
    //   }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName)

      onImageUploaded(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      uploadImage(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {currentImageUrl ? (
          <div className="space-y-4">
            <img
              src={currentImageUrl}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
            />
            <p className="text-sm text-gray-600">
              Drag and drop a new image here, or click to select
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-32 h-32 rounded-full bg-gray-100 mx-auto flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Drag and drop an image here, or click to select
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
        >
          {uploading ? 'Uploading...' : 'Select Image'}
        </Button>
        
        {currentImageUrl && (
          <Button
            onClick={() => onImageUploaded('')}
            disabled={uploading}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            Remove Image
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center">
        Supported formats: JPG, PNG, GIF. Max size: 5MB
      </p>
    </div>
  )
}
