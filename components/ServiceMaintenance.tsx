import React from 'react';
import { Hammer, ShieldCheck, MapPin } from 'lucide-react';

export const ServiceMaintenance = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-brand-purple text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purpleDark to-brand-green/20 opacity-90"></div>
                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        Maintenance Contractors
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light max-w-3xl mx-auto">
                        Access to Trusted Local Maintenance Professionals
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

                {/* Intro */}
                <section className="text-center max-w-4xl mx-auto">
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        Showhouse Property connects buyers and sellers with trusted, vetted maintenance contractors in the areas where they own property or intend to invest.
                    </p>
                </section>

                {/* Core Value Props Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Vetted Professionals */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-brand-green hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 text-brand-green shadow-sm">
                            <ShieldCheck size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Trusted & Vetted</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            We ensure that property owners receive dependable, high-quality service from professionals who understand local standards. This feature is especially valuable for new buyers who may be unfamiliar with the area.
                        </p>
                    </div>

                    {/* Local Repairs */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 text-blue-600 shadow-sm">
                            <Hammer size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Reliable Support</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Get reliable support for property maintenance, repairs, or upgrades. Buyers and sellers can proceed with confidence, knowing their properties are cared for by experience service providers committed to delivering workmanship that meets their expectations.
                        </p>
                    </div>

                    {/* Peace of Mind */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-purple-600 shadow-sm">
                            <MapPin size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Ongoing Value</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            This integrated support enhances the overall property experience, offering peace of mind, convenience, and ongoing value long after the transaction is complete.
                        </p>
                    </div>
                </div>

                {/* Conclusion / CTA */}
                <section className="bg-brand-purpleLight/30 rounded-3xl p-10 md:p-20 text-center border border-brand-purpleLight">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-purpleDark mb-8">
                        Confidence in Every Job
                    </h2>
                    <p className="text-lg md:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
                        Proceed with confidence, knowing their properties are cared for by experienced service providers committed to delivering workmanship that meets their expectations.
                    </p>
                </section>

            </div>
        </div>
    );
};
