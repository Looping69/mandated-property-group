
"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, MapPin, Sparkles } from 'lucide-react';
import { Listing } from '../types';
import { cn } from '../lib/utils';

interface FeaturedCarouselProps {
    listings: Listing[];
    onViewDetails: (listing: Listing) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ listings, onViewDetails }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (listings.length === 0) return null;

    const next = () => setCurrentIndex((prev) => (prev + 1) % listings.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + listings.length) % listings.length);

    const current = listings[currentIndex];

    return (
        <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-slate-900 aspect-[21/9] min-h-[400px] shadow-2xl group">
            {/* Background Image */}
            <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
                <img
                    src={current.image}
                    className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[2s]"
                    alt={current.title}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center px-12 md:px-20 z-10 w-full md:w-2/3">
                <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-[0.2em] border border-brand-green/30 mb-6 backdrop-blur-md">
                        <Sparkles size={12} /> Featured Residence
                    </div>

                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                        {current.title}
                    </h2>

                    <div className="flex items-center text-slate-300 gap-4 mb-8">
                        <div className="flex items-center gap-1 text-sm font-medium">
                            <MapPin size={16} className="text-brand-green" /> {current.address}
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                        <div className="text-sm font-bold text-white">R {(current.price / 1000000).toFixed(1)}M</div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => onViewDetails(current)}
                            className="bg-brand-green hover:bg-brand-green/90 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all hover:scale-105"
                        >
                            View Residence
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold py-4 px-10 rounded-xl border border-white/20 transition-all">
                            Virtual Tour
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 right-12 flex items-center gap-6 z-20">
                <div className="flex gap-2">
                    {listings.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                currentIndex === idx ? "w-8 bg-brand-green" : "w-2 bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={prev}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-110"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={next}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all hover:scale-110"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Slide Counter */}
            <div className="absolute top-12 left-12 text-white/20 font-serif text-8xl font-bold select-none">
                0{currentIndex + 1}
            </div>
        </div>
    );
};
