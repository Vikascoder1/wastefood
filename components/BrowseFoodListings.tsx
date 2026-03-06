'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FoodListingCard from './FoodListingCard'
import MapView from './MapView'
import { FoodListing } from '@/lib/types'
import { Search, Map, Grid } from 'lucide-react'

interface BrowseFoodListingsProps {
  initialListings: FoodListing[]
  error: any
  userId?: string
}

export default function BrowseFoodListings({ 
  initialListings, 
  error, 
  userId 
}: BrowseFoodListingsProps) {
  const [listings, setListings] = useState<FoodListing[]>(initialListings)
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  const handleSearch = () => {
    const filtered = initialListings.filter(listing => {
      const matchesSearch = !searchTerm || 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = !locationFilter ||
        listing.location.toLowerCase().includes(locationFilter.toLowerCase())
      
      return matchesSearch && matchesLocation
    })
    setListings(filtered)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setLocationFilter('')
    setListings(initialListings)
  }

  const handleClaim = async (listing: FoodListing) => {
    // TODO: Implement claim functionality in Phase 4
    console.log('Claiming food:', listing.id)
  }

  const handleEdit = (listing: FoodListing) => {
    // TODO: Implement edit functionality
    console.log('Editing food:', listing.id)
  }

  const handleDelete = async (listing: FoodListing) => {
    // TODO: Implement delete functionality
    console.log('Deleting food:', listing.id)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading listings</h3>
        <p className="text-gray-500 mb-4">
          There was an error loading the food listings. Please try again later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search for food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <div className="flex gap-2 w-full">
                <Button onClick={handleSearch} className="flex-1">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          {listings.length} listing{listings.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {listings.map((listing) => (
            <FoodListingCard
              key={listing.id}
              listing={listing}
              onClaim={handleClaim}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isOwner={userId === listing.posted_by}
            />
          ))}
        </div>
      ) : (
        <MapView 
          listings={listings}
          onListingClick={(listing) => console.log('Clicked listing:', listing.id)}
        />
      )}

      {/* Empty State */}
      {listings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No food available</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || locationFilter 
              ? 'No food listings match your search criteria. Try adjusting your filters.'
              : 'There are currently no food listings in your area. Check back later!'
            }
          </p>
          {(searchTerm || locationFilter) && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
