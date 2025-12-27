
"use client";

import React from 'react';
import { Mail, Phone, ExternalLink, Star, Award, TrendingUp } from 'lucide-react';
import { Agent } from '../types';
import { cn } from '../lib/utils';

interface AgentCardProps {
    agent: Agent;
    onImageUpdate: (id: string, newImage: string) => void;
    onViewProfile: (id: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onImageUpdate, onViewProfile }) => {
    const rating = agent.reviews.length > 0
        ? (agent.reviews.reduce((acc, r) => acc + r.rating, 0) / agent.reviews.length).toFixed(1)
        : "5.0";

    return (
        <div
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-center p-8 relative"
            onClick={() => onViewProfile(agent.id)}
        >
            {/* Decorative background */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-purpleLight/50 to-transparent z-0" />

            {/* Profile Image */}
            <div className="relative z-10 mb-6 group/img">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl ring-2 ring-brand-green ring-offset-2 group-hover:ring-brand-purple transition-all duration-500 transform group-hover:scale-105">
                    <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 right-4 bg-white shadow-md rounded-full px-2 py-1 flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-bold text-slate-800">{rating}</span>
                </div>
            </div>

            <div className="text-center relative z-10 w-full">
                <h3 className="text-xl font-serif font-bold text-slate-900 mb-1 group-hover:text-brand-purple transition-colors">{agent.name}</h3>
                <p className="text-xs text-brand-green font-bold uppercase tracking-[0.2em] mb-4">{agent.title}</p>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-100 flex items-center gap-1.5">
                        <Award size={12} className="text-brand-purple" /> Elite Status
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                        <TrendingUp size={12} /> {agent.sales}
                    </span>
                </div>

                <div className="space-y-3 w-full border-t border-slate-50 pt-6">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Email</span>
                        <a href={`mailto:${agent.email}`} className="text-slate-900 font-bold hover:text-brand-green transition-colors">{agent.email}</a>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 font-medium">Cell</span>
                        <a href={`tel:${agent.phone}`} className="text-slate-900 font-bold hover:text-brand-green transition-colors">{agent.phone}</a>
                    </div>
                </div>

                <button
                    className="mt-8 w-full bg-slate-900 hover:bg-brand-purple text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center group/btn"
                >
                    View Full Profile
                    <ExternalLink size={16} className="ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Background patterns */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-green/5 rounded-full blur-3xl" />
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-brand-purple/5 rounded-full blur-3xl" />
        </div>
    );
};
