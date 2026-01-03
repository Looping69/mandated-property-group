import React from 'react';
import { Users, Home, Briefcase } from 'lucide-react';

export const ServiceShowProperty = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-brand-purple text-white py-24 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-purpleDark to-brand-purple opacity-90"></div>
                <div className="relative max-w-5xl mx-auto text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        On Show Property
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-light max-w-3xl mx-auto">
                        Transforming the show house experience into a focused, results-driven event.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">

                {/* Intro */}
                <section className="text-center max-w-4xl mx-auto">
                    <p className="text-xl text-slate-700 leading-relaxed font-medium">
                        Show House Property is a purpose-built real estate platform designed to transform the traditional show house experience into a focused, results-driven event for all parties involved.
                    </p>
                </section>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                    {/* Buyers */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-brand-green hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 text-brand-green shadow-sm">
                            <Users size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">For Buyers</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            The platform connects serious buyers with specific properties that are on show, in a defined area, on a specific date and time. Buyers can easily view what properties are available to see on any given day, compare options, and choose show houses that align with their needs, preferences, and budget—saving time and eliminating unnecessary viewings.
                        </p>
                    </div>

                    {/* Sellers */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-purple-500 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-purple-600 shadow-sm">
                            <Home size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">For Sellers</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            Show House Property provides an additional, highly targeted marketing channel. Instead of relying solely on passive listings, sellers benefit from increased visibility and buyer intent, with attention directed specifically to their property during scheduled show house times. This results in more focused foot traffic and higher-quality enquiries.
                        </p>
                    </div>

                    {/* Agents */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-600 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 text-blue-600 shadow-sm">
                            <Briefcase size={40} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">For Agents</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                            The platform solves one of the industry’s most common frustrations: hosting show houses for hours with little or no buyer turnout. Show House Property actively markets each show house event, attracting qualified buyers to the property at the right time. Agents benefit from improved attendance, better use of their time, and increased conversion opportunities.
                        </p>
                    </div>
                </div>

                {/* Conclusion / CTA */}
                <section className="bg-brand-purpleLight/30 rounded-3xl p-10 md:p-20 text-center border border-brand-purpleLight">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-purpleDark mb-8">
                        Efficiency, Visibility, and Value
                    </h2>
                    <p className="text-lg md:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed">
                        In essence, Show House Property turns show houses into strategic, buyer-focused events rather than passive open doors. It brings efficiency, visibility, and value to the entire real estate ecosystem—buyers, sellers, and professionals alike.
                    </p>
                </section>

            </div>
        </div>
    );
};
