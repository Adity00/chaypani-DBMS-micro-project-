"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RestaurantPage({ params }) {
    const router = useRouter();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        fetchRestaurantAndMenu();
        updateCartCount();

        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('chaypani_cart')) || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
    };

    const fetchRestaurantAndMenu = async () => {
        try {
            const [restRes, menuRes] = await Promise.all([
                api.get(`/api/restaurants/${params.id}`),
                api.get(`/api/menuitems?restaurantId=${params.id}`)
            ]);

            if (restRes.data.success) {
                setRestaurant(restRes.data.data);
            }
            if (menuRes.data.success) {
                setMenuItems(menuRes.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (item) => {
        if (!restaurant.isOpen) {
            alert("This restaurant is currently closed.");
            return;
        }

        const cart = JSON.parse(localStorage.getItem('chaypani_cart')) || [];

        if (cart.length > 0 && cart[0].restaurantId !== restaurant._id) {
            const clear = confirm("Your cart contains items from another restaurant. Do you want to clear it and add this item?");
            if (!clear) return;
            localStorage.removeItem('chaypani_cart');
            cart.length = 0;
        }

        const existingItem = cart.find(cartItem => cartItem.name === item.name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                restaurantId: restaurant._id,
                restaurantName: restaurant.name,
                name: item.name,
                price: item.price,
                quantity: 1
            });
        }

        localStorage.setItem('chaypani_cart', JSON.stringify(cart));
        updateCartCount();
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 animate-pulse">
            <div className="w-20 h-20 bg-orange-200 rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-slate-200 rounded-full"></div>
        </div>
    );

    if (!restaurant) return (
        <div className="text-center py-40">
            <h1 className="text-4xl font-bold text-slate-900">Restaurant not found.</h1>
            <button onClick={() => router.push('/')} className="mt-6 text-orange-500 font-bold hover:underline">Back to Explore</button>
        </div>
    );

    return (
        <div className="relative pb-24 space-y-12">
            {/* Restaurant Header */}
            <div className="glass-card p-12 rounded-[3rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            {restaurant.isOpen ? (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">Open Now</span>
                            ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-lg">Closed</span>
                            )}
                            <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>4.8 (120+ ratings)</span>
                            </div>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight">{restaurant.name}</h1>
                        <p className="text-xl text-slate-500 font-medium">{restaurant.cuisine} • {restaurant.address}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-4">
                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:text-orange-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-lg hover:text-rose-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                    Explore Menu
                    <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
                </h2>

                {menuItems.length === 0 ? (
                    <div className="text-center py-20 bg-slate-100 rounded-[2.5rem]">
                        <p className="text-xl font-bold text-slate-400 uppercase tracking-widest">No delicacies found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {menuItems.map(item => (
                            <div key={item._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 flex justify-between items-center group hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 border-2 p-0.5 flex items-center justify-center ${item.isVeg ? 'border-emerald-500' : 'border-rose-500'}`}>
                                            <div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.category}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-orange-500 transition-colors tracking-tight">{item.name}</h3>
                                    <p className="text-2xl font-black text-slate-800 tracking-tight">₹{item.price}</p>
                                </div>
                                <button
                                    className="w-16 h-16 bg-slate-100 group-hover:bg-orange-500 text-slate-400 group-hover:text-white rounded-[1.5rem] flex items-center justify-center font-black transition-all duration-300 shadow-xl shadow-slate-100 group-hover:shadow-orange-200"
                                    onClick={() => addToCart(item)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {cartCount > 0 && (
                <div className="fixed bottom-10 inset-x-0 flex justify-center z-50 px-4">
                    <button
                        onClick={() => router.push('/cart')}
                        className="btn-primary w-full max-w-md !rounded-3xl !py-6 !text-lg !shadow-2xl !shadow-orange-500/40 animate-float"
                    >
                        <span className="bg-white text-orange-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {cartCount}
                        </span>
                        View Your Cart
                        <span className="text-orange-200 font-medium ml-auto">Place Order</span>
                    </button>
                </div>
            )}
        </div>
    );
}
