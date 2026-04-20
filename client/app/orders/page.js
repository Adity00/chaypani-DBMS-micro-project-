"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders');
            if (res.data.success) {
                setOrders(res.data.data.reverse()); // Show newest first
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-4"></div>
            <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Order <span className="text-orange-500">History</span></h1>
                <p className="text-slate-500 font-medium">Track your current and past culinary adventures</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <span className="text-7xl block mb-6 animate-float">📦</span>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">No orders yet</h2>
                    <p className="text-slate-500 font-medium mb-8">When you place an order, it will appear here.</p>
                    <Link href="/" className="btn-primary inline-flex">
                        Start Ordering
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden group hover:border-orange-500/30 transition-all duration-300">
                            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50 border-b border-slate-50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID: {order._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-lg font-bold text-slate-900">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-emerald-100 text-emerald-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Details</h3>
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 text-xs">{item.quantity}x</span>
                                                    <span className="font-bold text-slate-700">{item.name}</span>
                                                </div>
                                                <span className="text-slate-400 font-medium">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 bg-slate-50/30 p-8 rounded-3xl border border-slate-50">
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Delivery Address</h3>
                                        <p className="text-slate-600 font-medium line-clamp-2">{order.customerAddress}</p>
                                    </div>
                                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Paid</span>
                                        <span className="text-3xl font-black text-orange-600">₹{order.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
