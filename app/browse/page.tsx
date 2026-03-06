import BrowseFoodListings from '@/components/BrowseFoodListings'
import { getFoodListings } from '@/lib/actions/food-listings'
import { getSession } from '@/lib/supabase-server'

export default async function BrowsePage() {
  const session = await getSession()
  const { data: listings, error } = await getFoodListings()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Available Food</h1>
          <p className="text-gray-600">Find and claim food in your area</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BrowseFoodListings 
          initialListings={listings || []} 
          error={error}
          userId={session?.user?.id}
        />
      </div>
    </div>
  )
} 