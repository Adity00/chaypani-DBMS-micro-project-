import './globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'ChayPani | Modern Food Delivery',
  description: 'Gourmet experience at your doorstep.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 min-h-screen text-slate-900 selection:bg-orange-100 selection:text-orange-600">
        <Toaster position="top-center" />
        <Navbar />

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
