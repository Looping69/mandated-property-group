
"use client";

import React from 'react';
import {
    X, MapPin, Star, ShieldCheck, Mail, Phone,
    Clock, Briefcase, ChevronRight, CheckCircle2
} from 'lucide-react';
import { Contractor } from '../types';
import { Button } from './ui/button';

interface ContractorDetailModalProps {
    contractor: Contractor;
    onClose: () => void;
}

export const ContractorDetailModal: React.FC<ContractorDetailModalProps> = ({ contractor, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-20 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="h-48 relative">
                    <img src={contractor.image} className="w-full h-full object-cover" alt={contractor.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                    <div className="absolute bottom-6 left-8">
                        <div className="flex items-center gap-2 bg-brand-green text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                            <ShieldCheck size={14} /> Verified Member
                        </div>
                    </div>
                </div>

                <div className="p-8 pb-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-1">{contractor.name}</h2>
                            <div className="text-brand-purple font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                                <Briefcase size={14} /> {contractor.trade} Expert
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1.5 text-amber-500 mb-1 justify-end">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(contractor.rating) ? "currentColor" : "none"} className={i < Math.floor(contractor.rating) ? "" : "text-slate-200"} />
                                ))}
                            </div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{contractor.rating} Rating</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><MapPin size={18} /></div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Location</div>
                                <div className="text-sm font-bold text-slate-700">{contractor.location}</div>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm"><Clock size={18} /></div>
                            <div>
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Rate</div>
                                <div className="text-sm font-bold text-slate-700">R{contractor.hourlyRate}/hr</div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-green" /> About Specialist
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm">{contractor.description}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {['Insurance Validated', 'Master Artisan Certified', 'Workmanship Guaranteed'].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                <CheckCircle2 size={18} className="text-brand-green" /> {item}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <a href={`tel:${contractor.phone}`} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all">
                            <Phone size={18} /> Call Specialist
                        </a>
                        <a href={`mailto:${contractor.email}`} className="w-full bg-brand-green hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all">
                            <Mail size={18} /> Send Brief
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
