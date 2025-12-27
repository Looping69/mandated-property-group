
import React, { useState } from 'react';
import {
    Plus, XCircle, Trash2, CheckCircle, MapPin, Phone, Search, Filter, Star,
    Mail, Award, TrendingUp, Users, Wrench, DollarSign, Briefcase, Camera,
    ExternalLink, Calendar, Clock
} from 'lucide-react';
import { Card, Badge, Input } from './Shared';
import { Button } from '../ui/button';
import { Contractor, UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface MaintenanceManagerProps {
    contractors: Contractor[];
    userRole: UserRole;
    isAddingContractor: boolean;
    setIsAddingContractor: (adding: boolean) => void;
    newContractor: Partial<Contractor>;
    setNewContractor: React.Dispatch<React.SetStateAction<Partial<Contractor>>>;
    handleCreateContractor: (e: React.FormEvent) => void;
    deleteContractor: (id: string) => void;
}

export const MaintenanceManager: React.FC<MaintenanceManagerProps> = ({
    contractors,
    userRole,
    isAddingContractor,
    setIsAddingContractor,
    newContractor,
    setNewContractor,
    handleCreateContractor,
    deleteContractor
}) => {
    // Local state for enhanced features
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTrade, setFilterTrade] = useState<string>('all');
    const [filterLocation, setFilterLocation] = useState<string>('all');
    const [filterVerified, setFilterVerified] = useState<boolean | 'all'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'rating' | 'hourlyRate'>('rating');
    const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
    const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all');

    // Extract unique values for filters
    const trades = ['all', ...new Set(contractors.map(c => c.trade))];
    const locations = ['all', ...new Set(contractors.map(c => c.location))];

    // Price range helper
    const getPriceCategory = (rate: number | undefined): 'budget' | 'mid' | 'premium' => {
        if (!rate) return 'mid';
        if (rate < 500) return 'budget';
        if (rate < 800) return 'mid';
        return 'premium';
    };

    // Filter and sort contractors
    const filteredContractors = contractors
        .filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.trade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTrade = filterTrade === 'all' || c.trade === filterTrade;
            const matchesLocation = filterLocation === 'all' || c.location === filterLocation;
            const matchesVerified = filterVerified === 'all' || c.isVerified === filterVerified;
            const matchesPrice = priceRange === 'all' || getPriceCategory(c.hourlyRate) === priceRange;
            return matchesSearch && matchesTrade && matchesLocation && matchesVerified && matchesPrice;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'rating': return b.rating - a.rating;
                case 'hourlyRate': return (a.hourlyRate || 0) - (b.hourlyRate || 0);
                default: return 0;
            }
        });

    // Calculate statistics
    const stats = {
        total: contractors.length,
        verified: contractors.filter(c => c.isVerified).length,
        avgRating: contractors.length > 0
            ? (contractors.reduce((sum, c) => sum + c.rating, 0) / contractors.length).toFixed(1)
            : '0.0',
        avgRate: contractors.length > 0
            ? Math.round(contractors.reduce((sum, c) => sum + (c.hourlyRate || 0), 0) / contractors.length)
            : 0
    };

    const renderDetailModal = () => {
        if (!selectedContractor) return null;

        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedContractor(null)}>
                <Card className="max-w-3xl w-full p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => setSelectedContractor(null)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    >
                        <XCircle size={24} />
                    </button>

                    <div className="flex gap-6 mb-6">
                        <div className="w-48 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-brand-purple/10 to-brand-green/10 flex-shrink-0">
                            <img src={selectedContractor.image} alt={selectedContractor.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedContractor.name}</h2>
                                    <p className="text-brand-green font-bold uppercase text-sm tracking-wide">{selectedContractor.trade}</p>
                                </div>
                                {selectedContractor.isVerified && (
                                    <Badge variant="success" className="flex items-center gap-1">
                                        <CheckCircle size={12} /> Verified Partner
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={cn(
                                                "fill-current",
                                                i < Math.floor(selectedContractor.rating)
                                                    ? "text-amber-400"
                                                    : "text-slate-200"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-700">{selectedContractor.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-green/5 to-brand-green/10 rounded-xl p-6 mb-6 border border-brand-green/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Hourly Rate</p>
                                <p className="text-3xl font-bold text-brand-green">R{selectedContractor.hourlyRate || 0}</p>
                            </div>
                            <div className="text-right">
                                <Badge variant={getPriceCategory(selectedContractor.hourlyRate) === 'budget' ? 'success' : getPriceCategory(selectedContractor.hourlyRate) === 'premium' ? 'purple' : 'warning'}>
                                    {getPriceCategory(selectedContractor.hourlyRate).toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <Briefcase size={16} className="text-brand-purple" /> About
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{selectedContractor.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <MapPin size={20} className="text-brand-purple" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Service Area</p>
                                <p className="text-sm font-medium text-slate-900">{selectedContractor.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Phone size={20} className="text-brand-green" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Phone</p>
                                <p className="text-sm font-medium text-slate-900">{selectedContractor.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg col-span-2">
                            <Mail size={20} className="text-blue-500" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Email</p>
                                <p className="text-sm font-medium text-slate-900">{selectedContractor.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${selectedContractor.phone}`)}>
                            <Phone size={16} className="mr-2" /> Call Now
                        </Button>
                        <Button variant="brand" className="flex-1" onClick={() => window.open(`mailto:${selectedContractor.email}`)}>
                            <Mail size={16} className="mr-2" /> Send Email
                        </Button>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Maintenance Partners</h2>
                    <p className="text-slate-500 text-sm">Manage trusted contractors and service providers.</p>
                </div>
                {userRole === 'AGENCY' && (
                    <Button variant={isAddingContractor ? "outline" : "brand"} onClick={() => setIsAddingContractor(!isAddingContractor)}>
                        {isAddingContractor ? <><XCircle size={16} className="mr-2" /> Cancel</> : <><Plus size={16} className="mr-2" /> Add Contractor</>}
                    </Button>
                )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-l-4 border-l-brand-green">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-green/10 rounded-lg">
                            <Users size={20} className="text-brand-green" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Total Contractors</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-emerald-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <CheckCircle size={20} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.verified}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Verified</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Star size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.avgRating}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Avg Rating</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-l-4 border-l-brand-purple">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-purple/10 rounded-lg">
                            <DollarSign size={20} className="text-brand-purple" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">R{stats.avgRate}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Avg Rate/hr</p>
                        </div>
                    </div>
                </Card>
            </div>

            {!isAddingContractor && (
                <>
                    {/* Search and Filters */}
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2 relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search contractors..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Trade Filter */}
                            <select
                                value={filterTrade}
                                onChange={e => setFilterTrade(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                            >
                                {trades.map(trade => (
                                    <option key={trade} value={trade}>
                                        {trade === 'all' ? 'All Trades' : trade}
                                    </option>
                                ))}
                            </select>

                            {/* Location Filter */}
                            <select
                                value={filterLocation}
                                onChange={e => setFilterLocation(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                            >
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>
                                        {loc === 'all' ? 'All Locations' : loc}
                                    </option>
                                ))}
                            </select>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as any)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                            >
                                <option value="rating">Sort by Rating</option>
                                <option value="name">Sort by Name</option>
                                <option value="hourlyRate">Sort by Rate</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 flex-wrap">
                                <button
                                    onClick={() => setFilterVerified('all')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-full transition-colors",
                                        filterVerified === 'all'
                                            ? "bg-brand-green text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilterVerified(true)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-full transition-colors flex items-center gap-1",
                                        filterVerified === true
                                            ? "bg-emerald-500 text-white"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    <CheckCircle size={12} /> Verified
                                </button>
                                <div className="h-4 w-px bg-slate-200 mx-1" />
                                <button
                                    onClick={() => setPriceRange('all')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-full transition-colors",
                                        priceRange === 'all' ? "bg-brand-purple text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    All Rates
                                </button>
                                <button
                                    onClick={() => setPriceRange('budget')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-full transition-colors",
                                        priceRange === 'budget' ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    Budget (&lt;R500)
                                </button>
                                <button
                                    onClick={() => setPriceRange('mid')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-full transition-colors",
                                        priceRange === 'mid' ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    Mid (R500-800)
                                </button>
                                <button
                                    onClick={() => setPriceRange('premium')}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-full transition-colors",
                                        priceRange === 'premium' ? "bg-brand-purple text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    )}
                                >
                                    Premium (&gt;R800)
                                </button>
                            </div>
                            <p className="text-sm text-slate-500">
                                <span className="font-bold text-slate-900">{filteredContractors.length}</span> of {contractors.length} contractors
                            </p>
                        </div>
                    </Card>
                </>
            )}

            {isAddingContractor && userRole === 'AGENCY' && (
                <Card className="p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Register New Contractor</h3>
                    <form onSubmit={handleCreateContractor} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Company Name</label>
                                <Input placeholder="e.g. BuildRight Construction" value={newContractor.name} onChange={e => setNewContractor({ ...newContractor, name: e.target.value })} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Trade</label>
                                <Input placeholder="e.g. Plumbing, Electrical" value={newContractor.trade} onChange={e => setNewContractor({ ...newContractor, trade: e.target.value })} required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Location</label>
                                <Input placeholder="e.g. Cape Town" value={newContractor.location} onChange={e => setNewContractor({ ...newContractor, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Hourly Rate (ZAR)</label>
                                <Input type="number" placeholder="e.g. 650" value={newContractor.hourlyRate || ''} onChange={e => setNewContractor({ ...newContractor, hourlyRate: Number(e.target.value) })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
                                <Input type="email" placeholder="contractor@email.com" value={newContractor.email} onChange={e => setNewContractor({ ...newContractor, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone</label>
                                <Input placeholder="+27..." value={newContractor.phone} onChange={e => setNewContractor({ ...newContractor, phone: e.target.value })} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description</label>
                            <textarea
                                className="w-full rounded-md border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-green outline-none min-h-[80px]"
                                placeholder="Describe services..."
                                value={newContractor.description}
                                onChange={e => setNewContractor({ ...newContractor, description: e.target.value })}
                            />
                        </div>
                        <Button type="submit" variant="brand" className="w-full">Add Contractor</Button>
                    </form>
                </Card>
            )}

            {!isAddingContractor && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredContractors.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400">
                            <Wrench size={48} className="mx-auto mb-4 text-slate-200" />
                            <p className="font-medium">No contractors found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        filteredContractors.map(c => (
                            <Card
                                key={c.id}
                                className="overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => setSelectedContractor(c)}
                            >
                                <div className="h-32 relative bg-gradient-to-br from-brand-purple/10 to-brand-green/10">
                                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                    {c.isVerified && (
                                        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                            <CheckCircle size={12} className="mr-1" /> Verified
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">{c.name}</h3>
                                            <Badge variant="purple" className="mb-2">{c.trade}</Badge>
                                        </div>
                                        {userRole === 'AGENCY' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteContractor(c.id);
                                                }}
                                                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={cn(
                                                    "fill-current",
                                                    i < Math.floor(c.rating)
                                                        ? "text-amber-400"
                                                        : "text-slate-200"
                                                )}
                                            />
                                        ))}
                                        <span className="text-xs font-bold text-slate-600 ml-1">{c.rating.toFixed(1)}</span>
                                    </div>

                                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">{c.description}</p>

                                    <div className="flex justify-between items-center text-xs text-slate-400 py-3 border-t border-slate-100 mb-3">
                                        <span className="flex items-center"><MapPin size={12} className="mr-1" />{c.location}</span>
                                        <span className="font-bold text-brand-green">R{c.hourlyRate || 0}/hr</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                        <Phone size={12} /> {c.phone}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`tel:${c.phone}`);
                                            }}
                                        >
                                            <Phone size={14} className="mr-1" /> Call
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedContractor(c);
                                            }}
                                        >
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Detail Modal */}
            {renderDetailModal()}
        </div>
    );
};
