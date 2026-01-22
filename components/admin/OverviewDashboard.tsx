
import React from 'react';
import {
    Home, Users, MessageSquare, Hammer, DollarSign, Sparkles, Phone, TrendingUp, ChevronRight, CheckCircle, Wand2, Video, Settings, Play, Calendar, Plus
} from 'lucide-react';
import { Badge, Card, StatCard } from './Shared';
import { Button } from '../ui/button';
import { Listing, Agent, Inquiry, VirtualTour, Contractor, Conveyancer, UserRole, AdminView } from '../../types';
import { Subscription } from '../../services/subscriptionService';
import { useToast } from '../../contexts/ToastContext';
import { cn } from '../../lib/utils';

interface OverviewDashboardProps {
    userRole: UserRole;
    listings: Listing[];
    agents: Agent[];
    inquiries: Inquiry[];
    contractors: Contractor[];
    conveyancers: Conveyancer[];
    virtualTours: VirtualTour[];
    setActiveView: (view: AdminView) => void;
    setIsAddingListing: (adding: boolean) => void;
    setIsAddingAgent: (adding: boolean) => void;
    setPreviewTour: (tour: VirtualTour | null) => void;
    currentSubscription: Subscription | null;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
    userRole,
    listings,
    agents,
    inquiries,
    contractors,
    conveyancers,
    virtualTours,
    setActiveView,
    setIsAddingListing,
    setIsAddingAgent,
    setPreviewTour,
    currentSubscription
}) => {
    const { showToast } = useToast();
    const isTopAgent = currentSubscription?.status === 'active' && (currentSubscription?.package?.topAgents || 0) > 0;
    const totalValue = listings.reduce((acc, curr) => acc + curr.price, 0);
    const featuredListings = listings.filter(l => l.isFeatured);
    const newInquiries = inquiries.filter(i => i.status === 'new');
    const contactedInquiries = inquiries.filter(i => i.status === 'contacted');
    const closedInquiries = inquiries.filter(i => i.status === 'closed');
    const avgPrice = listings.length > 0 ? totalValue / listings.length : 0;
    const topListings = [...listings].sort((a, b) => b.price - a.price).slice(0, 3);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${userRole === 'AGENCY' ? 'bg-brand-purple text-white' : 'bg-brand-green text-white'}`}>
                            {userRole === 'AGENCY' ? 'Agency View' : 'Agent View'}
                        </span>
                        <p className="text-slate-500">Welcome back. Here's your business at a glance.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                        <Calendar size={16} className="mr-2" /> {new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </Button>
                    <Button variant="brand" size="sm" onClick={() => { setActiveView('LISTINGS'); setIsAddingListing(true); }}>
                        <Plus size={16} className="mr-2" /> New Listing
                    </Button>
                </div>
            </div>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <StatCard title="Total Listings" value={listings.length} icon={Home} trend="+12%" onClick={() => setActiveView('LISTINGS')} />
                <StatCard title="Featured" value={featuredListings.length} icon={Sparkles} />
                {userRole === 'AGENCY' && (
                    <StatCard title="Agents" value={agents.length} icon={Users} trend="+2" onClick={() => setActiveView('AGENTS')} />
                )}
                <StatCard title="New Leads" value={newInquiries.length} icon={MessageSquare} trend="+5" onClick={() => setActiveView('LEADS')} />
                <StatCard title="In Progress" value={contactedInquiries.length} icon={Phone} />
                <StatCard title="Portfolio Value" value={`R${(totalValue / 1000000).toFixed(1)}M`} icon={DollarSign} trend="+8%" />
            </div>

            {/* Inquiry Pipeline Visualization */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <TrendingUp size={18} className="text-brand-green" /> Lead Pipeline
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveView('LEADS')}>View All →</Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="relative">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageSquare size={20} className="text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-blue-700">{newInquiries.length}</p>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-1">New Leads</p>
                        </div>
                        <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                            <ChevronRight size={20} className="text-slate-300" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-center">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Phone size={20} className="text-amber-600" />
                            </div>
                            <p className="text-3xl font-bold text-amber-700">{contactedInquiries.length}</p>
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-1">Contacted</p>
                        </div>
                        <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                            <ChevronRight size={20} className="text-slate-300" />
                        </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle size={20} className="text-emerald-600" />
                        </div>
                        <p className="text-3xl font-bold text-emerald-700">{closedInquiries.length}</p>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mt-1">Closed</p>
                    </div>
                </div>
                {inquiries.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                                className="bg-blue-500 transition-all duration-500"
                                style={{ width: `${(newInquiries.length / inquiries.length) * 100}%` }}
                            />
                            <div
                                className="bg-amber-500 transition-all duration-500"
                                style={{ width: `${(contactedInquiries.length / inquiries.length) * 100}%` }}
                            />
                            <div
                                className="bg-emerald-500 transition-all duration-500"
                                style={{ width: `${(closedInquiries.length / inquiries.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center">
                            Conversion Rate: <span className="font-bold text-slate-600">{inquiries.length > 0 ? ((closedInquiries.length / inquiries.length) * 100).toFixed(0) : 0}%</span>
                        </p>
                    </div>
                )}
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Inquiries */}
                <Card className="lg:col-span-2 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare size={16} className="text-brand-purple" /> Recent Inquiries
                        </h3>
                        <Button variant="ghost" size="sm" className="text-brand-green h-8" onClick={() => setActiveView('LEADS')}>View All</Button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {inquiries.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <MessageSquare size={32} className="mx-auto mb-3 text-slate-200" />
                                <p className="font-medium">No inquiries yet</p>
                                <p className="text-xs mt-1">New leads will appear here</p>
                            </div>
                        ) : (
                            inquiries.slice(0, 5).map((inquiry) => (
                                <div key={inquiry.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center text-white font-bold text-sm">
                                                {inquiry.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-800 block">{inquiry.customerName}</span>
                                                <span className="text-xs text-slate-400">{inquiry.customerEmail}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant={inquiry.status === 'new' ? 'warning' : inquiry.status === 'contacted' ? 'purple' : 'success'}>
                                                {inquiry.status}
                                            </Badge>
                                            <span className="text-[10px] text-slate-400 font-medium">{new Date(inquiry.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-2 pl-13 line-clamp-1">{inquiry.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card className="p-5">
                        <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                            <Wand2 size={14} className="text-brand-green" /> Quick Actions
                        </h4>
                        <div className="space-y-2">
                            <button
                                onClick={() => { setActiveView('LISTINGS'); setIsAddingListing(true); }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                            >
                                <div className="w-8 h-8 bg-brand-green/10 rounded-lg flex items-center justify-center group-hover:bg-brand-green/20 transition-colors">
                                    <Plus size={14} className="text-brand-green" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Add New Listing</span>
                            </button>
                            <button
                                onClick={() => {
                                    if (listings.length === 0) {
                                        showToast("You must have at least one listing to create a virtual tour.", "error");
                                        return;
                                    }
                                    if (!isTopAgent) {
                                        showToast("Virtual tours are reserved for Top Agents. Please upgrade your plan.", "warning");
                                        return;
                                    }
                                    setActiveView('VIRTUAL_TOURS');
                                }}
                                className={cn("w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group", (!isTopAgent || listings.length === 0) && "opacity-50 cursor-not-allowed")}
                            >
                                <div className="w-8 h-8 bg-brand-purple/10 rounded-lg flex items-center justify-center group-hover:bg-brand-purple/20 transition-colors">
                                    <Video size={14} className="text-brand-purple" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{!isTopAgent ? 'Unlock Virtual Tours' : 'Create Virtual Tour'}</span>
                            </button>
                            <button
                                onClick={() => setActiveView('LEADS')}
                                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                            >
                                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                    <MessageSquare size={14} className="text-blue-500" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">Manage Inquiries</span>
                            </button>
                            {userRole === 'AGENCY' && (
                                <button
                                    onClick={() => { setActiveView('AGENTS'); setIsAddingAgent(true); }}
                                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
                                >
                                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                        <Users size={14} className="text-amber-500" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">Add New Agent</span>
                                </button>
                            )}
                        </div>
                    </Card>

                    {/* Top Listings */}
                    <Card className="p-5">
                        <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                            <DollarSign size={14} className="text-brand-green" /> Top Listings
                        </h4>
                        {topListings.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No listings yet</p>
                        ) : (
                            <div className="space-y-3">
                                {topListings.map((listing, idx) => (
                                    <div key={listing.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img src={listing.image} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">{listing.title}</p>
                                            <p className="text-xs text-brand-green font-bold">R{(listing.price / 1000000).toFixed(1)}M</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* System Status */}
                    <Card className="p-5">
                        <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                            <Settings size={14} className="text-slate-500" /> System Status
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center text-slate-600"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Cloud Backend</span>
                                <span className="text-emerald-600 font-bold text-xs">Connected</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center text-slate-600"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Neon Database</span>
                                <span className="text-emerald-600 font-bold text-xs">Active</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center text-slate-600"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div> Gemini AI</span>
                                <span className="text-emerald-600 font-bold text-xs">Ready</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Row - Virtual Tours & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Virtual Tours */}
                <Card className="overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Video size={16} className="text-brand-purple" /> Virtual Tours
                        </h3>
                        <Button variant="ghost" size="sm" className="text-brand-green h-8" onClick={() => setActiveView('VIRTUAL_TOURS')}>View All</Button>
                    </div>
                    {virtualTours.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">
                            <Video size={32} className="mx-auto mb-3 text-slate-200" />
                            <p className="font-medium">No virtual tours yet</p>
                            <p className="text-xs mt-1">Create immersive 3D tours for your listings</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 p-4">
                            {virtualTours.slice(0, 4).map(tour => (
                                <div key={tour.id} className="relative group rounded-xl overflow-hidden cursor-pointer" onClick={() => setPreviewTour(tour)}>
                                    <div className="aspect-video bg-slate-100">
                                        {tour.stops[0] && <img src={tour.stops[0].image} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                            <Play size={16} className="text-white" fill="white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                        <p className="text-white text-xs font-bold truncate">{tour.title}</p>
                                        <p className="text-white/70 text-[10px]">{tour.stops.length} scenes</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Portfolio Breakdown */}
                <Card className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-brand-purple" /> Portfolio Breakdown
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 rounded-xl p-4 border border-brand-green/20">
                            <p className="text-xs font-bold text-brand-green uppercase tracking-wider mb-1">Average Price</p>
                            <p className="text-2xl font-bold text-slate-900">R{(avgPrice / 1000000).toFixed(2)}M</p>
                        </div>
                        <div className="bg-gradient-to-br from-brand-purple/10 to-brand-purple/5 rounded-xl p-4 border border-brand-purple/20">
                            <p className="text-xs font-bold text-brand-purple uppercase tracking-wider mb-1">Total Portfolio</p>
                            <p className="text-2xl font-bold text-slate-900">R{(totalValue / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl p-4 border border-amber-500/20">
                            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Contractors</p>
                            <p className="text-2xl font-bold text-slate-900">{contractors.length}</p>
                        </div>
                        <div className="bg-gradient-to-br from-teal-500/10 to-teal-500/5 rounded-xl p-4 border border-teal-500/20">
                            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Conveyancers</p>
                            <p className="text-2xl font-bold text-slate-900">{conveyancers.length}</p>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Active Listings</span>
                            <span className="font-bold text-slate-900">{listings.filter(l => l.status === 'active').length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-slate-500">Featured Properties</span>
                            <span className="font-bold text-slate-900">{featuredListings.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-slate-500">On Show</span>
                            <span className="font-bold text-slate-900">{listings.filter(l => l.status === 'on_show').length}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
