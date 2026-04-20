import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'ChayPani | Modern Food Delivery',
  description: 'Gourmet experience at your doorstep.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 min-h-screen text-slate-900 selection:bg-orange-100 selection:text-orange-600">
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <Link href="/" className="group flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform duration-300">
                    🍵
                  </div>
                  <span className="text-2xl font-extrabold tracking-tight">
                    <span className="text-slate-900">Chay</span>
                    <span className="text-orange-500">Pani</span>
                  </span>
                </Link>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="nav-link">Explore</Link>
                <Link href="/orders" className="nav-link">My Orders</Link>
                <Link href="/admin" className="nav-link">Dashboard</Link>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/cart" className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {/* Cart count will be handled by client components in specific pages or context */}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in duration-700">
          {children}
        </main>

        <footer className="border-t border-slate-200 bg-white py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-md">
                🍵
              </div>
              <span className="text-xl font-bold tracking-tight">ChayPani</span>
            </div>
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ChayPani. Built for the modern foodie.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
