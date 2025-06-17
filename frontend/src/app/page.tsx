import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-blue-600">Clean<span className="text-blue-400">.</span>Website</h1>
              <nav className="space-x-4 text-sm font-medium">
                <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link href="/services" className="text-gray-700 hover:text-blue-600">Services</Link>
                <Link href="/shop" className="text-gray-700 hover:text-blue-600">Products</Link>
                <Link href="/about" className="text-gray-700 hover:text-blue-600">About</Link>
                <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
                <Link href="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
                <Link href="/register" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow transition-colors">
                  Sign&nbsp;Up
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative h-[80vh] flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70"></div>
            <Image
              src="/cleaning-hero.jpg"
              alt="Professional cleaning service"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-10 px-6 py-16 max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Book Cleaning Services &amp; Order Supplies Online
            </h2>
            <p className="text-xl text-blue-50 mb-10 max-w-3xl mx-auto leading-relaxed">
              A single platform to schedule professional cleaners and purchase eco-friendly cleaning products—intuitive, responsive, secure and lightning-fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/services" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-3 shadow transition-colors">
                Book&nbsp;Cleaning
              </Link>
              <Link href="/shop" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-8 py-3 shadow transition-colors">
                Shop&nbsp;Products
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 w-full">
            <img src="/wave-divider.svg" alt="" className="w-full" />
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
              <p className="text-gray-600">We combine quality service with eco-friendly products for a cleaner, healthier space.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { id: 1, title: 'Intuitive Interface', desc: 'Book services or shop in a few taps', icon: '🧭' },
                { id: 2, title: 'Responsive Design', desc: 'Seamless experience on any device', icon: '📱' },
                { id: 3, title: 'Secure & Fast', desc: 'Protected data and quick response times', icon: '🔒' },
                { id: 4, title: 'Live Order Tracking', desc: 'Follow your cleaner or delivery in real-time', icon: '⏱️' },
                { id: 5, title: 'Admin Dashboard', desc: 'Powerful management tools', icon: '🧰' },
                { id: 6, title: 'Eco Products', desc: 'Shop sustainable cleaning supplies', icon: '🌿' }
              ].map(({ id, title, desc, icon }) => (
                <div key={id} className="group bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:bg-blue-100 transition-colors">
                    {icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-600 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100 py-12">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to get started?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Join thousands of satisfied customers who trust us with their cleaning needs.</p>
              <Link href="/register" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-8 py-3 shadow-md hover:shadow-lg transition-all">
                Get Started Today
              </Link>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Clean Website. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

