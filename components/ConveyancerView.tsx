
"use client";

import React from 'react';
import { Scale, Globe, Phone, MapPin, CheckCircle, ShieldCheck, ChevronRight } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const ConveyancerView: React.FC = () => {
    const { conveyancers } = useData();

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center max-w-2xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold uppercase tracking-wider mb-6 border border-brand-green/20">
                    <Scale size={14} /> Legal Protection
                </div>
                <h1 className="text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">Expert Conveyancing</h1>
                <p className="text-slate-600 font-medium text-lg">
                    We partner with South Africa's leading property attorneys to ensure your transaction is seamless and secure.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {conveyancers.map((c, i) => (
                    <div
                        key={c.id}
                        className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="h-48 relative overflow-hidden">
                            <img src={c.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={c.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/30">
                                    <ShieldCheck size={12} className="text-brand-green" /> Verified Partner
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex-1 flex flex-col">
                            <div className="mb-6 flex-1">
                                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-brand-purple transition-colors">{c.name}</h3>
                                <div className="text-brand-green font-bold text-xs uppercase tracking-widest mb-4 flex items-center">
                                    <div className="w-6 h-[1px] bg-brand-green mr-3" /> {c.specialist}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center text-slate-500 group-hover:text-slate-700 transition-colors">
                                        <MapPin size={18} className="mr-3 text-slate-300 group-hover:text-brand-green transition-colors" />
                                        <span className="text-sm font-medium">{c.location}</span>
                                    </div>
                                    <div className="flex items-center text-slate-500 group-hover:text-slate-700 transition-colors">
                                        <Globe size={18} className="mr-3 text-slate-300 group-hover:text-brand-green transition-colors" />
                                        <a href={c.website} target="_blank" rel="noreferrer" className="text-sm font-medium truncate hover:underline">{c.website.replace('https://', '')}</a>
                                    </div>
                                    <div className="flex items-center text-slate-500 group-hover:text-slate-700 transition-colors">
                                        <Phone size={18} className="mr-3 text-slate-300 group-hover:text-brand-green transition-colors" />
                                        <span className="text-sm font-medium">{c.phone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    {[...Array(5)].map((_, idx) => (
                                        <CheckCircle key={idx} size={14} className={idx < Math.floor(c.rating) ? "text-brand-green" : "text-slate-200"} fill="currentColor" />
                                    ))}
                                    <span className="ml-1 text-xs font-bold text-slate-900">{c.rating}.0</span>
                                </div>
                                <button className="flex items-center gap-1 text-brand-purple font-bold text-sm hover:translate-x-1 transition-transform">
                                    Contact Firm <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-12 bg-slate-900 rounded-3xl text-white relative overflow-hidden animate-in fade-in duration-1000">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-serif font-bold mb-6">Need legal advice regarding a transfer?</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8">
                            Our associated conveyancers offer complimentary initial consultations for all Mandated clients to discuss bond registrations, transfers, and trust structures.
                        </p>
                        <button className="bg-brand-green hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-transform hover:scale-105">
                            Request Consultation
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            'Title Deed Search', 'Transfer Duty Calc', 'FICA Compliance', 'Escrow Services'
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl flex items-center gap-3">
                                <CheckCircle className="text-brand-green" size={20} />
                                <span className="font-bold text-sm tracking-wide">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2" />
            </div>
        </div>
    );
};
