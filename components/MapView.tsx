'use client'

import { FoodListing } from '@/lib/types'
import { MapPin } from 'lucide-react'

interface MapViewProps {
  listings: FoodListing[]
  onListingClick?: (listing: FoodListing) => void
}

export default function MapView({ listings, onListingClick }: MapViewProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
      <MapPin className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Map View</h3>
      <p className="text-gray-500 mb-4">
        Interactive map view will be implemented in a future update.
      </p>
      <div className="text-sm text-gray-400">
        {listings.length} listing{listings.length !== 1 ? 's' : ''} available
      </div>
    </div>
  )
}
