import React from 'react';
import { Scale, FileText, Globe } from 'lucide-react';

export const ServiceConveyancing = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-brand-purple text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purpleDark to-brand-green/20 opacity-90"></div>
                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        Conveyancing Services
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light max-w-3xl mx-auto">
                        Access to Leading Conveyancing Professionals Nationwide
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

                {/* Intro */}
                <section className="text-center max-w-4xl mx-auto">
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        Showhouse Property provides sellers with the opportunity to engage with top conveyancers across the country when preparing to sell their property.
                    </p>
                </section>

                {/* Core Value Props Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Top Conveyancers */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-brand-green hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 text-brand-green shadow-sm">
                            <Globe size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Nationwide Access</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Ensure that you are connected with experienced legal professionals who specialise in property transfers and understand the complexities of the conveyancing process. We provide access to leading professionals across the country.
                        </p>
                    </div>

                    {/* Seamless Process */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 text-blue-600 shadow-sm">
                            <FileText size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Seamless Transfer</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            By working with trusted conveyancers, sellers are assured of receiving efficient, accurate, and professional service. This results in a seamless and transparent transfer process that reduces delays and minimizes risk.
                        </p>
                    </div>

                    {/* Precision & Care */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-purple-600 shadow-sm">
                            <Scale size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Precision & Care</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            We simplify the selling journey by giving sellers access to reliable conveyancing expertise. Enjoy peace of mind from offer acceptance through to registration, knowing every transaction is handled with precision.
                        </p>
                    </div>
                </div>

                {/* Conclusion / CTA */}
                <section className="bg-brand-purpleLight/30 rounded-3xl p-10 md:p-20 text-center border border-brand-purpleLight">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-purpleDark mb-8">
                        Expertise You Can Trust
                    </h2>
                    <p className="text-lg md:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
                        Show House Property simplifies the selling journey by giving sellers access to reliable conveyancing expertise, ensuring every transaction is handled with precision and care.
                    </p>
                </section>

            </div>
        </div>
    );
};
