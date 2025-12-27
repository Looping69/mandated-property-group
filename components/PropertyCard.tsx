
"use client";

import React from 'react';
import { MapPin, BedDouble, Bath, Square, ChevronRight } from 'lucide-react';
import { Listing } from '../types';
import { cn } from '../lib/utils';

interface PropertyCardProps {
    listing: Listing;
    onViewDetails: (listing: Listing) => void;
    className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ listing, onViewDetails, className }) => {
    const isSold = listing.status === 'sold';

    return (
        <div
            onClick={() => onViewDetails(listing)}
            className={cn(
                "group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative",
                className
            )}
        >
            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {listing.status === 'new' && (
                    <span className="bg-brand-green text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">New Listing</span>
                )}
                {listing.status === 'on_show' && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">On Show</span>
                )}
                {listing.status === 'reduced' && (
                    <span className="bg-brand-purple text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">Price Reduced</span>
                )}
            </div>

            {/* Image Container */}
            <div className="aspect-[4/3] overflow-hidden relative">
                <img
                    src={listing.image}
                    alt={listing.title}
                    className={cn(
                        "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110",
                        isSold && "grayscale-[0.5] opacity-80"
                    )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {isSold && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-white font-serif text-3xl font-bold tracking-widest uppercase border-2 border-white px-6 py-2 rotate-[-5deg]">Sold</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-slate-900 line-clamp-1 group-hover:text-brand-green transition-colors">{listing.title}</h3>
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1 text-brand-green" />
                    <span className="truncate">{listing.address}</span>
                </div>

                <div className="flex items-center gap-4 py-4 border-y border-slate-50 mb-4 text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium">
                        <BedDouble size={16} className="text-slate-400" />
                        <span className="text-sm">{listing.beds} <span className="hidden sm:inline">Beds</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Bath size={16} className="text-slate-400" />
                        <span className="text-sm">{listing.baths} <span className="hidden sm:inline">Baths</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                        <Square size={16} className="text-slate-400" />
                        <span className="text-sm">{listing.size}m²</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Asking Price</span>
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">
                            R {(listing.price / 1000000).toLocaleString('en-ZA', { maximumFractionDigits: 1 })}M
                        </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};
