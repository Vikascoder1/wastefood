import PostFoodForm from '@/components/PostFoodForm'
import AuthGuard from '@/components/AuthGuard'

export default function ListFoodPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Post Your Food</h1>
            <p className="text-gray-600">Share your leftover food with the community</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PostFoodForm />
        </div>
      </div>
    </AuthGuard>
  )
} 