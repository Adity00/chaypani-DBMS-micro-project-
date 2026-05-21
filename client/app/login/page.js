"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/api/auth/login', { email, password });
            if (res.data.success) {
                localStorage.setItem('chaypani_token', res.data.token);
                localStorage.setItem('chaypani_user', JSON.stringify(res.data.user));

                // Redirect based on role
                if (res.data.user.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/');
                }
                router.refresh();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-orange-100 p-10 border border-slate-50 border-t-orange-500 border-t-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome <span className="text-orange-500">Back</span></h1>
                    <p className="text-slate-500 font-medium">Log in to manage your empire</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm font-bold mb-8 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="e.g. admin@chaypani.com"
                            className="w-full border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            className="w-full border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg shadow-orange-200 transition-all ${loading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600 hover:-translate-y-1'}`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        Don't have an account? <Link href="/register" className="text-orange-500 font-bold hover:underline">Sign Up</Link>
                    </p>
                    <Link href="/" className="inline-block mt-4 text-xs font-bold text-slate-300 hover:text-slate-600 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
