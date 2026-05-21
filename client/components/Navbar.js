"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('chaypani_token');
        setIsLoggedIn(!!token);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('chaypani_token');
        localStorage.removeItem('chaypani_user');
        setIsLoggedIn(false);
        toast.success("Successfully logged out");
        router.push('/login');
    };

    return (
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
                        <Link href="/" className="nav-link font-bold text-slate-600 hover:text-orange-500 transition-colors">Explore</Link>
                        <Link href="/orders" className="nav-link font-bold text-slate-600 hover:text-orange-500 transition-colors">My Orders</Link>
                        <Link href="/admin" className="nav-link font-bold text-slate-600 hover:text-orange-500 transition-colors">Dashboard</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative p-2 text-slate-600 hover:text-orange-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </Link>

                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl hover:bg-slate-200 transition-all text-sm"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-orange-500 text-white font-bold px-6 py-2 rounded-xl hover:bg-orange-600 shadow-md shadow-orange-100 transition-all text-sm"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
