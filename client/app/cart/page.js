"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('chaypani_cart')) || [];
        setCart(savedCart);
    }, []);

    const updateQuantity = (name, delta) => {
        const newCart = cart.map(item => {
            if (item.name === name) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        setCart(newCart);
        localStorage.setItem('chaypani_cart', JSON.stringify(newCart));
    };

    const removeItem = (name) => {
        const newCart = cart.filter(item => item.name !== name);
        setCart(newCart);
        localStorage.setItem('chaypani_cart', JSON.stringify(newCart));
    };

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = totalAmount > 0 ? 40 : 0;
    const platformFee = totalAmount > 0 ? 5 : 0;
    const grandTotal = totalAmount + deliveryFee + platformFee;

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Cart is empty");

        setLoading(true);
        try {
            const orderData = {
                restaurantId: cart[0].restaurantId,
                customerName: formData.name,
                customerPhone: formData.phone,
                customerAddress: formData.address,
                items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
                totalAmount: grandTotal
            };

            const res = await api.post('/api/orders', orderData);
            if (res.data.success) {
                localStorage.removeItem('chaypani_cart');
                alert("Order placed successfully!");
                router.push('/orders');
            }
        } catch (error) {
            console.error(error);
            alert("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) return (
        <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <div className="text-9xl animate-float">🛒</div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your cart is empty</h1>
            <p className="text-slate-500 font-medium max-w-xs text-center">Sounds like a good time to start exploring your favorite restaurants!</p>
            <button onClick={() => router.push('/')} className="btn-primary">
                Browse Restaurants
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 px-4">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">My <span className="text-orange-500">Cart</span></h1>
                <p className="text-slate-500 font-medium">Review your items and complete your order</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Order from <span className="text-orange-600">{cart[0]?.restaurantName}</span></h2>
                            <span className="text-slate-400 font-bold text-sm tracking-widest uppercase">{cart.length} Items</span>
                        </div>
                        <div className="divide-y divide-slate-50">
                            {cart.map(item => (
                                <div key={item.name} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all duration-300">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                                        <p className="text-slate-500 font-bold">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                                            <button
                                                onClick={() => updateQuantity(item.name, -1)}
                                                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:bg-white rounded-xl transition-all font-black text-xl"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center font-black text-slate-900">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.name, 1)}
                                                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-orange-500 hover:bg-white rounded-xl transition-all font-black text-xl"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.name)}
                                            className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-10 bg-orange-50/30 border-t border-orange-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Items Subtotal</p>
                                    <p className="text-3xl font-black text-slate-900">₹{totalAmount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Est. Completion</p>
                                    <p className="text-xl font-bold text-slate-900">25-35 Mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Summary */}
                <div className="space-y-8">
                    <div className="glass-card p-10 rounded-[2.5rem] sticky top-32">
                        <h2 className="text-2xl font-bold mb-8 text-slate-900">Checkout</h2>
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Full Name</label>
                                <input required className="w-full bg-white/50 border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="Aditya" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Phone Number</label>
                                <input required className="w-full bg-white/50 border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 ml-1 uppercase tracking-wider">Delivery Address</label>
                                <textarea required className="w-full bg-white/50 border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-300 font-medium min-h-[100px]" placeholder="Flat no, Street Name, City" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>

                            <div className="pt-6 border-t border-slate-100 space-y-3">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Delivery Fee</span>
                                    <span className="text-emerald-500 font-bold">₹{deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span>Platform Fee</span>
                                    <span>₹{platformFee}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black text-slate-900 pt-4">
                                    <span>Total</span>
                                    <span className="text-orange-600">₹{grandTotal}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-full !py-5 !text-lg mt-4 disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place My Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
