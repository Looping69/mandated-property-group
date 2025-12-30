
"use client";

import React, { useState } from 'react';
import {
    X, MapPin, BedDouble, Bath, Car, Waves, Calendar,
    Phone, Mail, Play, ChevronRight, Share2, Heart,
    Info, ShieldCheck, Sparkles, PawPrint
} from 'lucide-react';
import { Listing, VirtualTour } from '../types';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface PropertyDetailModalProps {
    listing: Listing;
    onClose: () => void;
    onStartTour: (tour: VirtualTour) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ listing, onClose, onStartTour }) => {
    const { agents, virtualTours } = useData();
    const agent = agents.find(a => a.id === listing.agentId);
    const tour = virtualTours.find(t => t.listingId === listing.id);
    const [activeImage, setActiveImage] = useState(listing.image);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-colors md:top-6 md:right-6"
                >
                    <X size={20} />
                </button>

                {/* Gallery Section */}
                <div className="w-full md:w-3/5 h-[40vh] md:h-auto relative bg-slate-900">
                    <img src={activeImage} className="w-full h-full object-cover" alt={listing.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div className="flex gap-2">
                            {listing.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={cn(
                                        "w-16 h-12 rounded-lg border-2 overflow-hidden transition-all",
                                        activeImage === img ? "border-brand-green scale-110" : "border-white/20 hover:border-white/50"
                                    )}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>
                        {tour && (
                            <button
                                onClick={() => onStartTour(tour)}
                                className="bg-brand-green hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                            >
                                <Play size={18} fill="currentColor" /> Virtual Tour
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="w-full md:w-2/5 p-8 overflow-y-auto bg-white">
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-brand-green uppercase tracking-[0.2em] bg-brand-purpleLight px-2 py-0.5 rounded">Exclusive Mandate</span>
                            <div className="flex gap-3 text-slate-400">
                                <button className="hover:text-brand-purple transition-colors"><Share2 size={18} /></button>
                                <button className="hover:text-red-500 transition-colors"><Heart size={18} /></button>
                            </div>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">{listing.title}</h2>
                        <div className="flex items-center text-slate-500 text-sm">
                            <MapPin size={16} className="mr-1 text-slate-400" />
                            {listing.address}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1 mb-8 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
                        {[
                            { icon: BedDouble, label: 'Beds', value: listing.beds },
                            { icon: Bath, label: 'Baths', value: listing.baths },
                            { icon: Car, label: 'Garage', value: listing.garage },
                            { icon: Waves, label: 'Pool', value: listing.pool === 'none' ? 'No' : listing.pool.charAt(0).toUpperCase() + listing.pool.slice(1) }
                        ].map((stat, i) => (
                            <div key={i} className="py-4 px-1 flex flex-col items-center border-r last:border-0 border-slate-100">
                                <stat.icon size={20} className="text-slate-400 mb-1" />
                                <span className="font-bold text-slate-800 text-[11px] text-center leading-tight truncate w-full px-1">{stat.value}</span>
                                <span className="text-[9px] text-slate-400 uppercase tracking-wider">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center border-l-2 border-brand-green pl-3">Description</h3>
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-6 mb-4">{listing.description}</p>
                        <button className="text-brand-green text-sm font-bold hover:underline">Read full description</button>
                    </div>

                    <div className="mb-8">
                        <div className="flex gap-2">
                            {listing.isPetFriendly ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 italic">
                                    <PawPrint size={14} /> Pet Friendly Property
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-full text-xs font-bold border border-slate-100 italic">
                                    <ShieldCheck size={14} /> No Pets Allowed
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Agent Section */}
                    {agent && (
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                                    <img src={agent.image} className="w-full h-full object-cover" alt={agent.name} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-base">{agent.name}</h4>
                                    <p className="text-xs text-brand-purple font-medium">{agent.title}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">
                                    <Phone size={14} /> Call
                                </a>
                                <a href={`mailto:${agent.email}`} className="flex items-center justify-center gap-2 py-2.5 bg-brand-purple text-white rounded-lg text-sm font-bold hover:bg-brand-purpleDark transition-colors shadow-sm">
                                    <Mail size={14} /> Inquire
                                </a>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <div className="text-center">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Market Value</span>
                            <div className="text-4xl font-bold text-slate-900 tracking-tight">R {(listing.price).toLocaleString('en-ZA')}</div>
                        </div>
                        {listing.viewingType === 'on_show' ? (
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm"><Calendar size={20} /></div>
                                <div>
                                    <div className="text-xs font-extrabold text-amber-800 uppercase tracking-tight">On Show - Save the Date</div>
                                    <div className="text-sm font-bold text-amber-600">{listing.onShowDate || "Contact for times"}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-brand-green/5 border border-brand-green/10 rounded-xl p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm"><Calendar size={20} /></div>
                                <div>
                                    <div className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">Viewing by Appointment Only</div>
                                    <div className="text-sm font-bold text-brand-green">Contact Agent to Schedule</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
