"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/api/restaurants');
      if (res.data.success) {
        setRestaurants(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-100">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/hero.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col justify-center px-12 md:px-20 max-w-3xl space-y-6">
          <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded-full animate-bounce">
            Fresh & Fast
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Craving for something <span className="text-orange-400">Delicious?</span>
          </h1>
          <p className="text-lg text-slate-200 font-medium max-w-lg">
            Discover the best food and drinks in your city from over 500+ top rated restaurants.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for restaurants, cuisines..."
                className="w-full pl-12 pr-6 py-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section>
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Popular Restaurants</h2>
            <p className="text-slate-500 font-medium">Explore top-rated spots in your neighborhood</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button className="p-2 rounded-xl border border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="p-2 rounded-xl border border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20 bg-slate-100 rounded-3xl border-2 border-dashed border-slate-200">
            <span className="text-6xl block mb-4">🔍</span>
            <p className="text-xl font-bold text-slate-900">No restaurants found</p>
            <p className="text-slate-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <Link key={restaurant._id} href={`/restaurant/${restaurant._id}`} className="group">
                <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 z-20">
                      {restaurant.isOpen ? (
                        <span className="px-3 py-1 bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg backdrop-blur-sm shadow-lg">Open Now</span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg backdrop-blur-sm shadow-lg">Closed</span>
                      )}
                    </div>
                    <img
                      src={`https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800&food=${restaurant.cuisine}`}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">{restaurant.name}</h3>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>4.5</span>
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium mb-6 line-clamp-1">{restaurant.cuisine} • {restaurant.address}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>25-35 min</span>
                      </div>
                      <span className="text-orange-500 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Menu
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
