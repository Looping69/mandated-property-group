import React from 'react';
import { User, Building, Wrench, ArrowRight } from 'lucide-react';
import { Card } from './admin/Shared';
import { Button } from './ui/button';

interface JoinSelectionProps {
    onSelectType: (type: 'contractor' | 'agency' | 'agent') => void;
    onCancel: () => void;
}

export const JoinSelection: React.FC<JoinSelectionProps> = ({ onSelectType, onCancel }) => {
    const SelectionCard = ({
        icon: Icon,
        title,
        description,
        type
    }: {
        icon: React.ElementType;
        title: string;
        description: string;
        type: 'contractor' | 'agency' | 'agent'
    }) => (
        <Card className="p-8 hover:shadow-xl transition-all cursor-pointer group border-2 border-transparent hover:border-brand-green/20" onClick={() => onSelectType(type)}>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-green group-hover:text-white transition-colors">
                <Icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 mb-6 leading-relaxed">{description}</p>
            <div className="flex items-center text-brand-green font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                Get Started <ArrowRight size={16} className="ml-2" />
            </div>
        </Card>
    );

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-serif text-slate-900 font-bold mb-4">Join Our Ecosystem</h1>
                    <p className="text-xl text-slate-600 font-medium">Choose how you would like to partner with Show House Property</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <SelectionCard
                        icon={Wrench}
                        title="Contractor"
                        description="For maintenance professionals, tradespeople, and service providers looking to receive verified job requests."
                        type="contractor"
                    />
                    <SelectionCard
                        icon={Building}
                        title="Agency"
                        description="For real estate agencies wanting to manage their team, listings, and leads on a unified platform."
                        type="agency"
                    />
                    <SelectionCard
                        icon={User}
                        title="Agent"
                        description="For individual property practitioners seeking to showcase their portfolio and build their personal brand."
                        type="agent"
                    />
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-100 shadow-sm mb-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Partner Pricing at a Glance</h2>
                        <p className="text-slate-500">Transparent plans designed for your growth</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-1">Contractors</h4>
                            <p className="text-brand-green font-bold text-xl mb-1">Free to Join</p>
                            <p className="text-xs text-slate-400">Pay only when you win a lead</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-1">Individual Agents</h4>
                            <p className="text-slate-900 font-bold text-xl mb-1">Starting at R80</p>
                            <p className="text-xs text-slate-400">Pay-per-listing or Monthly Top Agent</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-1">Real Estate Agencies</h4>
                            <p className="text-slate-900 font-bold text-xl mb-1">Starting at R300/mo</p>
                            <p className="text-xs text-slate-400">Team management & bulk visibility</p>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        Detailed plans available during the registration process.
                    </div>
                </div>

                <div className="text-center">
                    <Button variant="ghost" onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                        Cancel and Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
};
