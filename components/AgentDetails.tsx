
"use client";

import React from 'react';
import {
    ChevronLeft, Phone, Mail, Instagram, Linkedin,
    Award, Star, Calendar, MessageSquare, ExternalLink
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Listing } from '../types';
import { PropertyCard } from './PropertyCard';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface AgentDetailsProps {
    agentId: string;
    onBack: () => void;
    onViewListingDetails: (listing: Listing) => void;
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agentId, onBack, onViewListingDetails }) => {
    const { agents, listings } = useData();
    const agent = agents.find(a => a.id === agentId);
    const agentListings = listings.filter(l => l.agentId === agentId);

    if (!agent) return null;

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-500 hover:text-slate-900 font-bold mb-8 group transition-colors"
                >
                    <ChevronLeft size={20} className="mr-1 transform group-hover:-translate-x-1 transition-transform" />
                    Back to Directory
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                            <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-slate-50 mx-auto mb-6 shadow-inner ring-1 ring-slate-100">
                                <img src={agent.image} className="w-full h-full object-cover" alt={agent.name} />
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-1">{agent.name}</h1>
                            <p className="text-sm text-brand-green font-bold uppercase tracking-[0.2em] mb-6">{agent.title}</p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-xl font-bold text-slate-900">{agentListings.length}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Active Listings</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="text-xl font-bold text-slate-900">4.9/5</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Client Rating</div>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <button className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all group">
                                    <Phone size={18} /> Schedule Call
                                </button>
                                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all">
                                    <Mail size={18} /> Send Inquiry
                                </button>
                            </div>

                            <div className="flex justify-center gap-4 text-slate-400">
                                <Instagram size={20} className="hover:text-pink-500 cursor-pointer transition-colors" />
                                <Linkedin size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
                            </div>
                        </div>

                        <div className="bg-brand-purple rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                                    <Award className="text-brand-green" /> Top Performer
                                </h3>
                                <p className="text-brand-purpleLight text-sm leading-relaxed mb-6">
                                    Recognized as part of the Chairman's Elite Circle for 2024, handling over R2.5 Billion in luxury transactions.
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <Star className="text-brand-green" size={18} fill="currentColor" />
                                    </div>
                                    <span className="font-bold">Platinum Member</span>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Bio Section */}
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <MessageSquare className="text-brand-green" size={24} />
                                Client Testimonials
                            </h2>
                            <div className="space-y-6">
                                {agent.reviews.length === 0 ? (
                                    <p className="text-slate-500 italic">No testimonials yet.</p>
                                ) : (
                                    agent.reviews.map(review => (
                                        <div key={review.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={cn(i < review.rating ? "text-amber-500 fill-amber-500" : "text-slate-200")} />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold">{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-slate-600 text-sm italic mb-4">"{review.comment}"</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-[10px]">
                                                    {review.author.charAt(0)}
                                                </div>
                                                <span className="text-xs font-bold text-slate-900">{review.author}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Listings Grid */}
                        <div>
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="text-3xl font-serif font-bold text-slate-900">Portfolio</h2>
                                <div className="text-sm font-bold text-brand-green">{agentListings.length} Exclusive Listings</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {agentListings.map(l => (
                                    <PropertyCard
                                        key={l.id}
                                        listing={l}
                                        onViewDetails={onViewListingDetails}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
