
"use client";

import React, { useState } from 'react';
import {
    Hammer, MapPin, Star, ShieldCheck, Search,
    Filter, ChevronRight, Phone, Mail, Clock
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Contractor } from '../types';
import { cn } from '../lib/utils';

interface MaintenanceViewProps {
    onViewDetails: (contractor: Contractor) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({ onViewDetails }) => {
    const { contractors } = useData();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTrade, setActiveTrade] = useState("All");

    const trades = ["All", ...Array.from(new Set(contractors.map(c => c.trade)))];

    const filteredContractors = contractors.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.trade.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTrade = activeTrade === "All" || c.trade === activeTrade;
        return matchesSearch && matchesTrade;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <h1 className="text-5xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Maintenance Excellence</h1>
                    <p className="text-slate-600 font-medium text-lg max-w-xl">
                        Vetted premium contractors to maintain and enhance your property investments.
                    </p>
                </div>
                <div className="flex bg-white rounded-full p-1.5 shadow-sm border border-slate-100 overflow-x-auto max-w-full">
                    {trades.map(trade => (
                        <button
                            key={trade}
                            onClick={() => setActiveTrade(trade)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                                activeTrade === trade ? "bg-slate-900 text-white shadow-md font-bold" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            {trade}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-4 mb-10 w-full max-w-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or trade..."
                        className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green shadow-sm transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-500 hover:text-brand-purple hover:border-brand-purple transition-all shadow-sm">
                    <Filter size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredContractors.map((c, i) => (
                    <div
                        key={c.id}
                        onClick={() => onViewDetails(c)}
                        className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer flex flex-col"
                    >
                        <div className="h-40 overflow-hidden relative">
                            <img src={c.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={c.name} />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-bold">{c.rating}</span>
                            </div>
                            {c.isVerified && (
                                <div className="absolute bottom-4 left-4">
                                    <div className="bg-brand-green text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 shadow-lg">
                                        <ShieldCheck size={12} /> Verified
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4 flex-1">
                                <h3 className="font-bold text-slate-900 text-lg mb-1 group-hover:text-brand-purple transition-colors">{c.name}</h3>
                                <p className="text-xs text-brand-green font-bold uppercase tracking-widest">{c.trade}</p>

                                <div className="flex items-center text-slate-500 text-xs mt-4 gap-4">
                                    <div className="flex items-center gap-1"><MapPin size={12} /> {c.location}</div>
                                    <div className="flex items-center gap-1"><Clock size={12} /> Available</div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Rate</div>
                                <div className="text-slate-900 font-bold text-sm">R{c.hourlyRate}/hr</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredContractors.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Hammer size={48} className="text-slate-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No contractors found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};
