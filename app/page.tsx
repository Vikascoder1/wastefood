import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Share Food, <span className="text-green-600">Reduce Waste</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect food donors with those in need. Reduce waste, help communities, 
              and make a difference one meal at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="text-lg px-8 py-3">
                  Browse Available Food
                </Button>
              </Link>
              <Link href="/list-food">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  List Your Food
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to connect food donors with those who need it
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <CardTitle>List Your Food</CardTitle>
                <CardDescription>
                  Have leftover food? List it on our platform with details and pickup time.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <CardTitle>Browse & Claim</CardTitle>
                <CardDescription>
                  Find available food in your area and claim it before it's gone.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle>Connect & Share</CardTitle>
                <CardDescription>
                  Coordinate pickup and make a difference in your community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Making a Difference
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of people reducing food waste
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">1,000+</div>
              <div className="text-gray-300">Meals Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-300">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50+</div>
              <div className="text-gray-300">Cities Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start sharing food today and help reduce waste in your community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/list-food">
              <Button size="lg" className="text-lg px-8 py-3">
                List Your Food
              </Button>
            </Link>
            <Link href="/browse">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Browse Food
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
