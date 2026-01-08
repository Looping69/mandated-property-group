import React, { useState } from 'react';
import { MapPin, Search, Users } from 'lucide-react';
import { AppView } from '../types';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { PropertyCard } from '../components/PropertyCard';
import { PROVINCES_CITIES } from '../mock/data';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
    onViewListingDetails: (listing: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onViewListingDetails }) => {
    const navigate = useNavigate();
    const { listings } = useData();
    const [searchType, setSearchType] = useState<'properties' | 'agents'>('properties');
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');

    return (
        <>
            <div className="relative min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden bg-brand-purple">
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-green/50 via-brand-purple/50 to-brand-purpleDark/90"></div>
                </div>
                <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Find Your Perfect <span className="text-brand-green">Show House Property</span></h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 font-bold max-w-2xl mx-auto drop-shadow-md">Connect with top agents, conveyancers, and maintenance contractors.</p>
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-5xl mx-auto text-left border-b-4 border-brand-green transition-all duration-300">
                        <div className="flex justify-center space-x-8 mb-6 border-b border-slate-100 pb-4">
                            <button
                                onClick={() => setSearchType('properties')}
                                className={`text-lg font-bold pb-4 -mb-4 transition-colors ${searchType === 'properties' ? 'text-brand-green border-b-2 border-brand-green' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Find Properties
                            </button>
                            <button
                                onClick={() => setSearchType('agents')}
                                className={`text-lg font-bold pb-4 -mb-4 transition-colors ${searchType === 'agents' ? 'text-brand-green border-b-2 border-brand-green' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Find Top Area Agents
                            </button>
                        </div>

                        {searchType === 'properties' ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="relative"><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none cursor-pointer"><option>Property Type</option><option>House</option><option>Apartment</option><option>Townhouse</option><option>Commercial Property</option></select></div>
                                <div className="relative">
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none cursor-pointer"
                                        value={selectedProvince}
                                        onChange={(e) => {
                                            setSelectedProvince(e.target.value);
                                            setSelectedCity('');
                                        }}
                                    >
                                        <option value="">Select Province</option>
                                        {Object.keys(PROVINCES_CITIES).map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div className="relative">
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none cursor-pointer"
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        disabled={!selectedProvince}
                                    >
                                        <option value="">{selectedProvince ? 'Select City' : 'Select Province First'}</option>
                                        {selectedProvince && PROVINCES_CITIES[selectedProvince].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="relative"><div className="absolute left-3 top-3 text-slate-400"><MapPin size={20} /></div><input type="text" placeholder="Area or Suburb" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none" /></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
                                <div className="relative">
                                    <Users className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input type="text" placeholder="Search by Agent Name" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none" />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <input type="text" placeholder="Enter Area to find Top Agents" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none" />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate(searchType === 'properties' ? '/listings' : '/agents')}
                            className="w-full bg-brand-green hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg transition-colors flex items-center justify-center text-lg uppercase tracking-wider"
                        >
                            <Search size={20} className="mr-2" />
                            {searchType === 'properties' ? 'Search Properties' : 'Find Top Area Agents'}
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-10 left-0 right-0 max-w-4xl mx-auto px-4 hidden md:block text-center">
                    <h2 className="text-5xl font-serif text-white font-bold tracking-wide drop-shadow-lg italic">“From Show to Sold”</h2>
                </div>
            </div>

            <div className="bg-brand-purpleLight py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif font-bold text-brand-green mb-4">Featured Collection</h2>
                    </div>
                    <FeaturedCarousel listings={listings.filter(l => l.isFeatured)} onViewDetails={onViewListingDetails} />
                </div>
            </div>

            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-3xl font-serif font-bold text-slate-900">Latest Properties</h2>
                        <button onClick={() => navigate('/listings')} className="text-brand-green font-bold text-sm hover:underline flex items-center">
                            View All <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {listings.slice(0, 4).map(l => <PropertyCard key={l.id} listing={l} onViewDetails={onViewListingDetails} />)}
                    </div>
                </div>
            </div>
        </>
    );
};

import { ChevronRight } from 'lucide-react';
