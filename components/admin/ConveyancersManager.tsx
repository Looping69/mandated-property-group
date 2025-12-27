
import React, { useState } from 'react';
import {
    Plus, XCircle, Camera, Trash2, Globe, Phone, Search, Filter, Star,
    CheckCircle, MapPin, Edit, Mail, Award, TrendingUp, Users, FileText,
    ExternalLink, Star as StarOutline
} from 'lucide-react';
import { Card, Badge, Input } from './Shared';
import { Button } from '../ui/button';
import { Conveyancer, UserRole } from '../../types';
import { cn } from '../../lib/utils';

interface ConveyancersManagerProps {
    conveyancers: Conveyancer[];
    userRole: UserRole;
    isAddingConveyancer: boolean;
    setIsAddingConveyancer: (adding: boolean) => void;
    newConveyancer: Partial<Conveyancer>;
    setNewConveyancer: React.Dispatch<React.SetStateAction<Partial<Conveyancer>>>;
    handleCreateConveyancer: (e: React.FormEvent) => void;
    handleConveyancerImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    deleteConveyancer: (id: string) => void;
}

export const ConveyancersManager: React.FC<ConveyancersManagerProps> = ({
    conveyancers,
    userRole,
    isAddingConveyancer,
    setIsAddingConveyancer,
    newConveyancer,
    setNewConveyancer,
    handleCreateConveyancer,
    handleConveyancerImageUpload,
    deleteConveyancer
}) => {
    // Local state for enhanced features
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState<string>('all');
    const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
    const [filterVerified, setFilterVerified] = useState<boolean | 'all'>('all');
    const [sortBy, setSortBy] = useState<'name' | 'rating' | 'location'>('rating');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedConveyancer, setSelectedConveyancer] = useState<Conveyancer | null>(null);
    const [editingConveyancer, setEditingConveyancer] = useState<Conveyancer | null>(null);

    // Extract unique values for filters
    const locations = ['all', ...new Set(conveyancers.map(c => c.location))];
    const specialties = ['all', ...new Set(conveyancers.map(c => c.specialist))];

    // Filter and sort conveyancers
    const filteredConveyancers = conveyancers
        .filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.specialist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = filterLocation === 'all' || c.location === filterLocation;
            const matchesSpecialty = filterSpecialty === 'all' || c.specialist === filterSpecialty;
            const matchesVerified = filterVerified === 'all' || c.isVerified === filterVerified;
            return matchesSearch && matchesLocation && matchesSpecialty && matchesVerified;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'rating': return b.rating - a.rating;
                case 'location': return a.location.localeCompare(b.location);
                default: return 0;
            }
        });

    // Calculate statistics
    const stats = {
        total: conveyancers.length,
        verified: conveyancers.filter(c => c.isVerified).length,
        avgRating: conveyancers.length > 0
            ? (conveyancers.reduce((sum, c) => sum + c.rating, 0) / conveyancers.length).toFixed(1)
            : '0.0',
        topRated: conveyancers.filter(c => c.rating >= 4.5).length
    };

    const renderDetailModal = () => {
        if (!selectedConveyancer) return null;

        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedConveyancer(null)}>
                <Card className="max-w-2xl w-full p-8 relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => setSelectedConveyancer(null)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                    >
                        <XCircle size={24} />
                    </button>

                    <div className="flex gap-6 mb-6">
                        <div className="w-40 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                            <img src={selectedConveyancer.image} alt={selectedConveyancer.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedConveyancer.name}</h2>
                                    <p className="text-brand-green font-bold uppercase text-sm tracking-wide">{selectedConveyancer.specialist}</p>
                                </div>
                                {selectedConveyancer.isVerified && (
                                    <Badge variant="success" className="flex items-center gap-1">
                                        <CheckCircle size={12} /> Verified
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
                                                i < Math.floor(selectedConveyancer.rating)
                                                    ? "text-amber-400"
                                                    : "text-slate-200"
                                            )}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-700">{selectedConveyancer.rating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <MapPin size={20} className="text-brand-purple" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Location</p>
                                <p className="text-sm font-medium text-slate-900">{selectedConveyancer.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Phone size={20} className="text-brand-green" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Phone</p>
                                <p className="text-sm font-medium text-slate-900">{selectedConveyancer.phone}</p>
                            </div>
                        </div>
                    </div>

                    {selectedConveyancer.website && (
                        <a
                            href={selectedConveyancer.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-brand-purple hover:text-brand-purple/80 font-medium text-sm mb-6"
                        >
                            <Globe size={16} />
                            Visit Website
                            <ExternalLink size={14} />
                        </a>
                    )}

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => window.open(`tel:${selectedConveyancer.phone}`)}>
                            <Phone size={16} className="mr-2" /> Call Now
                        </Button>
                        <Button variant="brand" className="flex-1" onClick={() => window.open(selectedConveyancer.website, '_blank')}>
                            <Globe size={16} className="mr-2" /> Website
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
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Legal Partners</h2>
                    <p className="text-slate-500 text-sm">Manage trusted conveyancers and attorneys.</p>
                </div>
                {userRole === 'AGENCY' && (
                    <Button variant={isAddingConveyancer ? "outline" : "brand"} onClick={() => setIsAddingConveyancer(!isAddingConveyancer)}>
                        {isAddingConveyancer ? <><XCircle size={16} className="mr-2" /> Cancel</> : <><Plus size={16} className="mr-2" /> Add Partner</>}
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
                            <p className="text-xs text-slate-500 font-bold uppercase">Total Partners</p>
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
                            <Award size={20} className="text-brand-purple" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{stats.topRated}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Top Rated</p>
                        </div>
                    </div>
                </Card>
            </div>

            {!isAddingConveyancer && (
                <>
                    {/* Search and Filters */}
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2 relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Search by name, specialty, or location..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

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

                            {/* Specialty Filter */}
                            <select
                                value={filterSpecialty}
                                onChange={e => setFilterSpecialty(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                            >
                                {specialties.map(spec => (
                                    <option key={spec} value={spec}>
                                        {spec === 'all' ? 'All Specialties' : spec}
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
                                <option value="location">Sort by Location</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
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
                                    <CheckCircle size={12} /> Verified Only
                                </button>
                            </div>
                            <p className="text-sm text-slate-500">
                                <span className="font-bold text-slate-900">{filteredConveyancers.length}</span> of {conveyancers.length} partners
                            </p>
                        </div>
                    </Card>
                </>
            )}

            {isAddingConveyancer ? (
                <Card className="p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Register New Conveyancer</h3>
                    <form onSubmit={handleCreateConveyancer} className="space-y-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden mb-2 relative group">
                                <img src={newConveyancer.image} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white" size={20} />
                                </div>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleConveyancerImageUpload} />
                            </div>
                            <span className="text-xs text-slate-400">Upload Logo</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Firm Name</label>
                                <Input
                                    placeholder="e.g. Smith & Jones Inc"
                                    value={newConveyancer.name}
                                    onChange={e => setNewConveyancer({ ...newConveyancer, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Specialty</label>
                                <Input
                                    placeholder="e.g. Bond Registration"
                                    value={newConveyancer.specialist}
                                    onChange={e => setNewConveyancer({ ...newConveyancer, specialist: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Location</label>
                                <Input
                                    placeholder="e.g. Sandton"
                                    value={newConveyancer.location}
                                    onChange={e => setNewConveyancer({ ...newConveyancer, location: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone</label>
                                <Input
                                    placeholder="+27..."
                                    value={newConveyancer.phone}
                                    onChange={e => setNewConveyancer({ ...newConveyancer, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Website</label>
                            <Input
                                placeholder="https://..."
                                value={newConveyancer.website}
                                onChange={e => setNewConveyancer({ ...newConveyancer, website: e.target.value })}
                            />
                        </div>
                        <Button type="submit" variant="brand" className="w-full">Add Partner</Button>
                    </form>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredConveyancers.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400">
                            <FileText size={48} className="mx-auto mb-4 text-slate-200" />
                            <p className="font-medium">No conveyancers found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        filteredConveyancers.map(c => (
                            <Card
                                key={c.id}
                                className="p-6 relative group hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => setSelectedConveyancer(c)}
                            >
                                {userRole === 'AGENCY' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteConveyancer(c.id);
                                        }}
                                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 z-10"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                                <div className="h-32 rounded-lg overflow-hidden mb-4 border border-slate-100 bg-slate-50">
                                    <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">{c.name}</h3>
                                            <p className="text-xs text-brand-green font-bold uppercase tracking-wide mb-2">{c.specialist}</p>
                                        </div>
                                        {c.isVerified && (
                                            <Badge variant="success" className="flex items-center gap-1 text-[10px]">
                                                <CheckCircle size={10} /> Verified
                                            </Badge>
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

                                    <div className="flex items-center text-xs text-slate-500 mb-2">
                                        <MapPin size={12} className="mr-2 text-brand-purple" />
                                        <span>{c.location}</span>
                                    </div>

                                    {c.website && (
                                        <div className="flex items-center text-xs text-slate-500 mb-2">
                                            <Globe size={12} className="mr-2" />
                                            <a
                                                href={c.website}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="hover:underline truncate text-brand-purple"
                                                onClick={e => e.stopPropagation()}
                                            >
                                                {c.website.replace(/^https?:\/\//, '')}
                                            </a>
                                        </div>
                                    )}

                                    <div className="flex items-center text-xs text-slate-500 mb-4">
                                        <Phone size={12} className="mr-2" /> {c.phone}
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 flex gap-2">
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
                                                setSelectedConveyancer(c);
                                            }}
                                        >
                                            View Details
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
