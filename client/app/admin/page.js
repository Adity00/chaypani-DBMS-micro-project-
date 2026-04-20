"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('restaurants');

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Management <span className="text-orange-500">Center</span></h1>
                <p className="text-slate-500 font-medium">Configure your platform settings and monitor orders</p>
            </div>

            <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10 w-fit">
                <button
                    className={`py-2.5 px-8 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'restaurants' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('restaurants')}
                >
                    Restaurants
                </button>
                <button
                    className={`py-2.5 px-8 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'menuitems' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('menuitems')}
                >
                    Menu Items
                </button>
                <button
                    className={`py-2.5 px-8 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'orders' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Orders
                </button>
            </div>

            <div className="animate-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'restaurants' && <RestaurantsTab />}
                {activeTab === 'menuitems' && <MenuItemsTab />}
                {activeTab === 'orders' && <OrdersTab />}
            </div>
        </div>
    );
}

function RestaurantsTab() {
    const [restaurants, setRestaurants] = useState([]);
    const [formData, setFormData] = useState({ name: '', cuisine: '', address: '', phone: '', isOpen: true });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => { fetchRestaurants(); }, []);

    const fetchRestaurants = async () => {
        try {
            const res = await api.get('/api/restaurants');
            if (res.data.success) setRestaurants(res.data.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/api/restaurants/${editingId}`, formData);
            } else {
                await api.post('/api/restaurants', formData);
            }
            setFormData({ name: '', cuisine: '', address: '', phone: '', isOpen: true });
            setEditingId(null);
            fetchRestaurants();
        } catch (e) {
            alert("Error saving restaurant");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/api/restaurants/${id}`);
            fetchRestaurants();
        } catch (e) { alert("Error deleting restaurant"); }
    };

    const handleEdit = (r) => {
        setFormData({ name: r.name, cuisine: r.cuisine || '', address: r.address || '', phone: r.phone || '', isOpen: r.isOpen });
        setEditingId(r._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-8">
            <div className="glass-card p-10 rounded-[2.5rem]">
                <h2 className="text-2xl font-bold mb-6 text-slate-900">{editingId ? 'Edit' : 'Add New'} Restaurant</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Restaurant Name</label>
                        <input required type="text" placeholder="e.g. The Gourmet Kitchen" className="w-full border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Cuisine Type</label>
                        <input type="text" placeholder="e.g. Italian, Continental" className="w-full border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={formData.cuisine} onChange={e => setFormData({ ...formData, cuisine: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Full Address</label>
                        <input type="text" placeholder="e.g. 123 Food Street, Downtown" className="w-full border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Contact Phone</label>
                        <input type="text" placeholder="e.g. +1 234 567 890" className="w-full border-slate-200 border px-6 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-4 py-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={formData.isOpen} onChange={e => setFormData({ ...formData, isOpen: e.target.checked })} />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            <span className="ml-3 text-sm font-bold text-slate-700">Currently Open</span>
                        </label>
                    </div>
                    <div className="flex gap-4 md:col-span-2 pt-4">
                        <button type="submit" className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all min-w-[200px]">
                            {editingId ? 'Update Restaurant' : 'Register Restaurant'}
                        </button>
                        {editingId && (
                            <button type="button" className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all" onClick={() => { setEditingId(null); setFormData({ name: '', cuisine: '', address: '', phone: '', isOpen: true }); }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                <th className="py-6 px-8">Restaurant</th>
                                <th className="py-6 px-8">Cuisine</th>
                                <th className="py-6 px-8">Status</th>
                                <th className="py-6 px-8 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {restaurants.map(r => (
                                <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-6 px-8">
                                        <span className="font-bold text-slate-900">{r.name}</span>
                                    </td>
                                    <td className="py-6 px-8 text-slate-500 font-medium">{r.cuisine}</td>
                                    <td className="py-6 px-8">
                                        {r.isOpen ? (
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-lg">Active</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded-lg">Inactive</span>
                                        )}
                                    </td>
                                    <td className="py-6 px-8 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button onClick={() => handleEdit(r)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button onClick={() => handleDelete(r._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function MenuItemsTab() {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestId, setSelectedRestId] = useState('');
    const [menuItems, setMenuItems] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: '', category: '', isVeg: false });

    useEffect(() => {
        api.get('/api/restaurants').then(res => {
            if (res.data.success) {
                setRestaurants(res.data.data);
                if (res.data.data.length > 0) setSelectedRestId(res.data.data[0]._id);
            }
        });
    }, []);

    useEffect(() => {
        if (selectedRestId) fetchMenuItems();
    }, [selectedRestId]);

    const fetchMenuItems = async () => {
        try {
            const res = await api.get(`/api/menuitems?restaurantId=${selectedRestId}`);
            if (res.data.success) setMenuItems(res.data.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/menuitems', { ...formData, restaurantId: selectedRestId, price: Number(formData.price) });
            setFormData({ name: '', price: '', category: '', isVeg: false });
            fetchMenuItems();
        } catch (e) { alert("Error saving item"); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/api/menuitems/${id}`);
            fetchMenuItems();
        } catch (e) { alert("Error deleting item"); }
    };

    return (
        <div className="space-y-8">
            <div className="glass-card p-10 rounded-[2.5rem]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <h2 className="text-2xl font-bold text-slate-900">Manage Menu</h2>
                    <div className="w-full md:w-72">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-2">Select Restaurant</label>
                        <select
                            className="w-full border-slate-200 border px-6 py-3 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-bold text-slate-700"
                            value={selectedRestId}
                            onChange={(e) => setSelectedRestId(e.target.value)}
                        >
                            {restaurants.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>

                {selectedRestId && (
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 ml-1">Item Name</label>
                            <input required type="text" className="w-full border-slate-200 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 ml-1">Price (₹)</label>
                            <input required type="number" min="0" className="w-full border-slate-200 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-600 ml-1">Category</label>
                            <input type="text" placeholder="e.g. Starter" className="w-full border-slate-200 border px-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>
                        <div className="flex items-end justify-between gap-4">
                            <label className="flex items-center gap-3 mb-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500 accent-orange-500" checked={formData.isVeg} onChange={e => setFormData({ ...formData, isVeg: e.target.checked })} />
                                <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600 transition-colors">Veg Only</span>
                            </label>
                            <button type="submit" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all min-w-[120px]">
                                Add Item
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                            <th className="py-6 px-8 w-16"></th>
                            <th className="py-6 px-8">Item</th>
                            <th className="py-6 px-8">Category</th>
                            <th className="py-6 px-8">Price</th>
                            <th className="py-6 px-8 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {menuItems.map(item => (
                            <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-6 px-8 text-center">
                                    <div className={`w-3 h-3 rounded-full mx-auto ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} title={item.isVeg ? "Veg" : "Non-Veg"}></div>
                                </td>
                                <td className="py-6 px-8">
                                    <span className="font-bold text-slate-900">{item.name}</span>
                                </td>
                                <td className="py-6 px-8">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-lg tracking-wide">{item.category}</span>
                                </td>
                                <td className="py-6 px-8 font-extrabold text-slate-900">₹{item.price}</td>
                                <td className="py-6 px-8 text-right">
                                    <button onClick={() => handleDelete(item._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function OrdersTab() {
    const [orders, setOrders] = useState([]);

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders');
            if (res.data.success) setOrders(res.data.data);
        } catch (e) { console.error(e); }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/api/orders/${id}/status`, { status });
            fetchOrders();
        } catch (e) { alert("Error changing status"); }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-wider">
                        <th className="py-6 px-8">Order Detail</th>
                        <th className="py-6 px-8">Customer</th>
                        <th className="py-6 px-8">Amount</th>
                        <th className="py-6 px-8">Update Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {orders.map(o => (
                        <tr key={o._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-6 px-8">
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">{new Date(o.createdAt).toLocaleDateString()}</span>
                                    <span className="text-[10px] text-slate-400 font-bold">{new Date(o.createdAt).toLocaleTimeString()}</span>
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900">{o.customerName}</span>
                                    <span className="text-xs text-slate-500 font-medium">{o.customerPhone}</span>
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <span className="text-lg font-black text-orange-600">₹{o.totalAmount}</span>
                            </td>
                            <td className="py-6 px-8">
                                <select
                                    className={`border-none rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider appearance-none focus:ring-0 cursor-pointer ${o.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            o.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-emerald-100 text-emerald-700'
                                        }`}
                                    value={o.status}
                                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
