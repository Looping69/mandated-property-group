import React from 'react';
import { LayoutGrid, Camera, MessageSquare, Network } from 'lucide-react';

export const ServicePartnerPortal = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-brand-purple text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purpleDark to-brand-green/20 opacity-90"></div>
                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        Partner Portal
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light max-w-3xl mx-auto">
                        Empowering Real Estate Professionals with Advanced Digital Tools
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

                {/* Intro */}
                <section className="text-center max-w-4xl mx-auto">
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        Showhouse Property’s Partner Portal is a comprehensive management suite designed for Real Estate Agencies, Agents, and Service Providers to streamline operations and drive success.
                    </p>
                </section>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* Listing Management */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-brand-green flex gap-6 items-start hover:shadow-2xl transition-shadow">
                        <div className="flex-shrink-0 w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-brand-green">
                            <LayoutGrid size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">Strategic Listing Management</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Manage your exclusive portfolio with ease. Upload, edit, and optimize listings for maximum engagement, ensuring your properties stand out in a competitive market.
                            </p>
                        </div>
                    </div>

                    {/* AI Tools */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-blue-500 flex gap-6 items-start hover:shadow-2xl transition-shadow">
                        <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Camera size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">AI Virtual Tour Creator</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Leverage advanced AI to create immersive 3D virtual tours in minutes. Reduce unnecessary viewings and attract serious buyers with a realistic "always-open" house experience.
                            </p>
                        </div>
                    </div>

                    {/* Lead Tracking */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-purple-500 flex gap-6 items-start hover:shadow-2xl transition-shadow">
                        <div className="flex-shrink-0 w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <MessageSquare size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">Lead & Inquiry Management</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Never miss an opportunity. Our centralized system captures and organizes inquiries, allowing agents to respond instantly and track the buyer's journey from click to close.
                            </p>
                        </div>
                    </div>

                    {/* Network */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-l-4 border-brand-purple flex gap-6 items-start hover:shadow-2xl transition-shadow">
                        <div className="flex-shrink-0 w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-brand-purpleDark">
                            <Network size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">Integrated Service Network</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Connect seamlessly with vetted maintenance contractors and conveyancers. Coordinate essential services directly through the portal for a smooth client transition.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Conclusion / CTA */}
                <section className="bg-brand-purpleLight/30 rounded-3xl p-10 md:p-20 text-center border border-brand-purpleLight">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-purpleDark mb-8">
                        The Digital Infrastructure for Modern Real Estate
                    </h2>
                    <p className="text-lg md:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
                        Showhouse Property simplifies the complexities of property management, providing professionals with the tools needed to deliver precision and care in every transaction.
                    </p>
                </section>

            </div>
        </div>
    );
};
