'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FoodListing, FoodListingCardProps } from '@/lib/types'

interface FoodListingWithProfile extends FoodListing {
  profiles?: {
    first_name: string | null
    last_name: string | null
    avatar_url: string | null
  } | null
}
import { MapPin, Clock, User, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Badge } from './ui/badge'

// Utility function to format time consistently
const formatTime = (dateString: string) => {
  // Parse the time string as local time (not UTC)
  const [hours, minutes] = dateString.split('T')[1].split(':').map(Number)
  const displayHours = hours % 12 || 12
  const ampm = hours >= 12 ? 'PM' : 'AM'
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`
}

// Check if pickup time has passed
const isPickupTimePassed = (pickupTime: string) => {
  const now = new Date()
  const pickupDate = new Date(pickupTime)
  return now > pickupDate
}

export default function FoodListingCard({ 
  listing, 
  onClaim, 
  onEdit, 
  onDelete, 
  isOwner = false 
}: FoodListingCardProps & { listing: FoodListingWithProfile }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClaim = async () => {
    if (onClaim) {
      setIsLoading(true)
      try {
        await onClaim(listing)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(listing)
    }
  }

  const handleDelete = async () => {
    if (onDelete && confirm('Are you sure you want to delete this listing?')) {
      setIsLoading(true)
      try {
        await onDelete(listing)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getStatusColor = (status: string) => {
    // Check if pickup time has passed for available listings
    if (status === 'available' && isPickupTimePassed(listing.pickup_time)) {
      return 'bg-red-100 text-red-800'
    }
    
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'claimed':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    // Check if pickup time has passed for available listings
    if (status === 'available' && isPickupTimePassed(listing.pickup_time)) {
      return 'Expired'
    }
    
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {listing.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {listing.profiles?.first_name ? 
                    `${listing.profiles.first_name} ${listing.profiles.last_name || ''}` : 
                    'Anonymous User'
                  }
                </span>
              </div>
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(listing.status)} flex-shrink-0`}>
            {getStatusText(listing.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {listing.image_url && (
          <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
            <Image
              src={listing.image_url}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {listing.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            Pickup by {formatTime(listing.pickup_time)}
          </div>
          {listing.food_type && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Type:</span>
              <span className="ml-1">{listing.food_type}</span>
            </div>
          )}
          {listing.quantity && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="font-medium">Quantity:</span>
              <span className="ml-1">{listing.quantity}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          {!isOwner && listing.status === 'available' && !isPickupTimePassed(listing.pickup_time) && (
            <Button 
              onClick={handleClaim} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Claiming...' : 'Claim This Food'}
            </Button>
          )}
          
          {isOwner && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
                disabled={isLoading}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                disabled={isLoading}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
