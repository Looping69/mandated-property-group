import React from 'react';
import { BadgeCheck, MapPin, ShieldCheck } from 'lucide-react';

export const ServiceTopAreaAgent = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-brand-purple text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purpleDark to-brand-green/20 opacity-90"></div>
                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        Top Area Agent
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light max-w-3xl mx-auto">
                        Connecting Buyers and Sellers with Trusted Local Expertise
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

                {/* Intro */}
                <section className="text-center max-w-4xl mx-auto">
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        Showhouse Property provides buyers and sellers with a powerful opportunity to engage directly with top-performing real estate agents in the exact areas where they wish to sell, buy, or invest.
                    </p>
                </section>

                {/* Core Value Props Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Market Knowledge */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-brand-green hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 text-brand-green shadow-sm">
                            <MapPin size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Local Expertise</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Our platform is designed to connect users with experienced, area-specialist professionals who have proven market knowledge and a strong track record. Engage with agents who truly understand local market dynamics related to your specific area.
                        </p>
                    </div>

                    {/* Expert Guidance */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 text-blue-600 shadow-sm">
                            <BadgeCheck size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Expert Guidance</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Buyers and sellers are assured of receiving the highest level of service and tailored advice throughout their property journey. We ensure that every client’s needs are professionally managed from initial enquiry to successful transaction.
                        </p>
                    </div>

                    {/* Confidence & Transparency */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-purple-600 shadow-sm">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Trusted Confidence</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Experience confidence, transparency, and results-driven support. Show House Property makes informed property decisions easier by placing trusted local expertise at the centre of every interaction.
                        </p>
                    </div>
                </div>

                {/* Conclusion / CTA */}
                <section className="bg-brand-purpleLight/30 rounded-3xl p-10 md:p-20 text-center border border-brand-purpleLight">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-purpleDark mb-8">
                        The Centre of Trusted Interactions
                    </h2>
                    <p className="text-lg md:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
                        Show House Property makes informed property decisions easier by placing trusted local expertise at the centre of every interaction.
                    </p>
                </section>

            </div>
        </div>
    );
};
