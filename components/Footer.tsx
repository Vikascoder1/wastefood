export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">LF</span>
              </div>
              <span className="font-bold text-xl">LeftoverFood</span>
            </div>
            <p className="text-gray-300 max-w-md">
              Connecting food donors with those in need. Reduce waste, help communities, 
              and make a difference one meal at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/browse" className="text-gray-300 hover:text-white transition-colors">Browse Food</a></li>
              <li><a href="/list-food" className="text-gray-300 hover:text-white transition-colors">List Food</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 LeftoverFood. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 