
import React, { useState } from 'react';
import {
    Plus, XCircle, Search, Home, Edit, Sparkles, RefreshCw, Filter, Trash2, MapPin, Video
} from 'lucide-react';
import { Card, Badge, Input } from './Shared';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Listing, Agent } from '../../types';

interface ListingsManagerProps {
    listings: Listing[];
    agents: Agent[];
    isAddingListing: boolean;
    setIsAddingListing: (adding: boolean) => void;
    addListing: (listing: any) => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    handleAIDescription: () => Promise<void>;
    isGeneratingDesc: boolean;
    newListing: Partial<Listing>;
    setNewListing: React.Dispatch<React.SetStateAction<Partial<Listing>>>;
    handleCreateListing: (e: React.FormEvent) => Promise<void>;
}

export const ListingsManager: React.FC<ListingsManagerProps> = ({
    listings,
    agents,
    isAddingListing,
    setIsAddingListing,
    addListing,
    deleteListing,
    handleAIDescription,
    isGeneratingDesc,
    newListing,
    setNewListing,
    handleCreateListing
}) => {
    const [listingSearch, setListingSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [featuredFilter, setFeaturedFilter] = useState("ALL");

    const totalValue = listings.reduce((acc, l) => acc + l.price, 0);
    const avgPrice = listings.length > 0 ? totalValue / listings.length : 0;
    const featuredCount = listings.filter(l => l.isFeatured).length;
    const soldCount = listings.filter(l => l.status === 'sold').length;
    const activeCount = listings.filter(l => l.status !== 'sold').length;
    const onShowCount = listings.filter(l => l.status === 'on_show').length;

    const displayedListings = listings
        .filter(l =>
            (statusFilter === 'ALL' ||
                (statusFilter === 'SOLD' && l.status === 'sold') ||
                (statusFilter === 'ON_SHOW' && l.status === 'on_show') ||
                (statusFilter === 'ACTIVE' && l.status === 'active') ||
                (statusFilter === 'FEATURED' && l.isFeatured)) &&
            (featuredFilter === 'ALL' || (featuredFilter === 'FEATURED' && l.isFeatured)) &&
            (l.title.toLowerCase().includes(listingSearch.toLowerCase()) ||
                l.address.toLowerCase().includes(listingSearch.toLowerCase()))
        );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Property Portfolio</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your exclusive listings and track performance.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                        <Filter size={16} className="mr-2" /> Export
                    </Button>
                    <Button variant={isAddingListing ? "outline" : "brand"} onClick={() => setIsAddingListing(!isAddingListing)}>
                        {isAddingListing ? <><XCircle size={16} className="mr-2" /> Cancel</> : <><Plus size={16} className="mr-2" /> Add Property</>}
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('ALL')}>
                    <p className="text-3xl font-bold text-slate-900">{listings.length}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('ACTIVE')}>
                    <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active</p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('ON_SHOW')}>
                    <p className="text-3xl font-bold text-amber-600">{onShowCount}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">On Show</p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('SOLD')}>
                    <p className="text-3xl font-bold text-red-500">{soldCount}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sold</p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer" onClick={() => setStatusFilter('FEATURED')}>
                    <p className="text-3xl font-bold text-brand-purple">{featuredCount}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Featured</p>
                </Card>
                <Card className="p-4 text-center bg-gradient-to-br from-brand-green/10 to-brand-green/5 border-brand-green/20">
                    <p className="text-2xl font-bold text-brand-green">R{(totalValue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Portfolio</p>
                </Card>
            </div>

            {isAddingListing ? (
                <Card className="p-8 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">List New Property</h3>
                            <p className="text-sm text-slate-500">Add a new exclusive listing to your portfolio.</p>
                        </div>
                        <Badge variant="purple">DRAFT</Badge>
                    </div>
                    <form onSubmit={handleCreateListing} className="space-y-8">
                        {/* Basic Info */}
                        <div>
                            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Home size={16} className="text-brand-green" /> Basic Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Property Title</label>
                                    <Input
                                        placeholder="e.g. Clifton Oceanfront Villa"
                                        value={newListing.title}
                                        onChange={e => setNewListing({ ...newListing, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Asking Price (ZAR)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 15000000"
                                        value={newListing.price || ''}
                                        onChange={e => setNewListing({ ...newListing, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Address</label>
                                <Input
                                    placeholder="e.g. 42 Ocean View Drive, Clifton, Cape Town"
                                    value={newListing.address}
                                    onChange={e => setNewListing({ ...newListing, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Property Details */}
                        <div>
                            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Edit size={16} className="text-brand-purple" /> Property Details
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bedrooms</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={newListing.beds || ''}
                                        onChange={e => setNewListing({ ...newListing, beds: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bathrooms</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={newListing.baths || ''}
                                        onChange={e => setNewListing({ ...newListing, baths: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Size (m²)</label>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={newListing.size || ''}
                                        onChange={e => setNewListing({ ...newListing, size: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 w-full hover:bg-slate-100 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={newListing.isFeatured}
                                            onChange={e => setNewListing({ ...newListing, isFeatured: e.target.checked })}
                                            className="rounded border-slate-300 text-brand-green focus:ring-brand-green w-4 h-4"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-slate-700 block">Featured</span>
                                            <span className="text-[10px] text-slate-400">Homepage highlight</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Description with AI */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                    <Sparkles size={16} className="text-amber-500" /> Description
                                </h4>
                                <button
                                    type="button"
                                    onClick={handleAIDescription}
                                    disabled={isGeneratingDesc}
                                    className="text-xs font-bold text-brand-purple flex items-center gap-1 px-3 py-1.5 bg-brand-purple/10 rounded-full hover:bg-brand-purple/20 transition-colors disabled:opacity-50"
                                >
                                    {isGeneratingDesc ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                    {isGeneratingDesc ? "Generating..." : "Generate with AI"}
                                </button>
                            </div>
                            <textarea
                                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-brand-green outline-none min-h-[140px] resize-none"
                                placeholder="Describe the property's unique features, views, finishes, and lifestyle..."
                                value={newListing.description}
                                onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setIsAddingListing(false)}>Cancel</Button>
                            <Button type="submit" variant="brand">
                                <Plus size={16} className="mr-2" /> Create Listing
                            </Button>
                        </div>
                    </form>
                </Card>
            ) : (
                <>
                    {/* Filters Bar */}
                    <Card className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <Input
                                    placeholder="Search by title, address, or agent..."
                                    className="pl-10"
                                    value={listingSearch}
                                    onChange={(e) => setListingSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {['ALL', 'ACTIVE', 'ON_SHOW', 'SOLD', 'FEATURED'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={cn(
                                            "px-4 py-2 rounded-lg text-xs font-bold transition-all",
                                            statusFilter === status
                                                ? status === 'SOLD' ? "bg-red-500 text-white"
                                                    : status === 'ON_SHOW' ? "bg-amber-500 text-white"
                                                        : status === 'FEATURED' ? "bg-brand-purple text-white"
                                                            : "bg-slate-900 text-white"
                                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                        )}
                                    >
                                        {status.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* Listings Grid */}
                    {displayedListings.length === 0 ? (
                        <Card className="p-16 text-center">
                            <Home size={48} className="mx-auto mb-4 text-slate-200" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Properties Found</h3>
                            <p className="text-slate-500 text-sm mb-6">
                                {listingSearch ? "Try adjusting your search terms." : "Add your first exclusive listing to get started."}
                            </p>
                            <Button variant="brand" onClick={() => setIsAddingListing(true)}>
                                <Plus size={16} className="mr-2" /> Add Property
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {displayedListings.map(listing => (
                                <Card key={listing.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                                    {/* Image Section */}
                                    <div className="relative h-48 bg-slate-100">
                                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                        {/* Overlays */}
                                        {listing.status === 'sold' && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider">SOLD</span>
                                            </div>
                                        )}

                                        {/* Top badges */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {listing.isFeatured && (
                                                <span className="bg-brand-purple text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                                                    <Sparkles size={10} /> Featured
                                                </span>
                                            )}
                                            {listing.status === 'on_show' && (
                                                <span className="bg-amber-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                                                    On Show
                                                </span>
                                            )}
                                        </div>

                                        {/* Price Tag */}
                                        <div className="absolute bottom-3 left-3">
                                            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                                                <span className="text-brand-green font-bold text-lg">R{(listing.price / 1000000).toFixed(2)}M</span>
                                            </div>
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-md">
                                                <Edit size={14} className="text-slate-600" />
                                            </button>
                                            <button
                                                onClick={() => deleteListing(listing.id)}
                                                className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-red-50 transition-colors shadow-md"
                                            >
                                                <Trash2 size={14} className="text-red-500" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-5">
                                        <h4 className="font-bold text-slate-900 text-lg mb-1 truncate">{listing.title}</h4>
                                        <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                                            <MapPin size={12} /> {listing.address}
                                        </p>

                                        {/* Property Stats */}
                                        <div className="flex items-center gap-4 py-3 border-t border-b border-slate-100 mb-4">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                                                    <span className="text-xs font-bold">{listing.beds}</span>
                                                </div>
                                                <span className="text-xs">Beds</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                                                    <span className="text-xs font-bold">{listing.baths}</span>
                                                </div>
                                                <span className="text-xs">Baths</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center">
                                                    <span className="text-xs font-bold">{listing.size || '—'}</span>
                                                </div>
                                                <span className="text-xs">m²</span>
                                            </div>
                                        </div>

                                        {/* Agent & Actions */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {agents.find(a => a.id === listing.agentId) ? (
                                                    <>
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-green overflow-hidden">
                                                            <img
                                                                src={agents.find(a => a.id === listing.agentId)?.image || ''}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-600">
                                                            {agents.find(a => a.id === listing.agentId)?.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-slate-400">No agent assigned</span>
                                                )}
                                            </div>
                                            <Button variant="outline" size="sm" className="h-8">
                                                <Video size={12} className="mr-1" /> Tour
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Portfolio Summary */}
                    {displayedListings.length > 0 && (
                        <Card className="p-6 bg-gradient-to-r from-slate-50 to-white">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Showing</p>
                                        <p className="text-lg font-bold text-slate-900">{displayedListings.length} of {listings.length} Properties</p>
                                    </div>
                                    <div className="h-10 w-px bg-slate-200"></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase">Average Price</p>
                                        <p className="text-lg font-bold text-brand-green">R{(avgPrice / 1000000).toFixed(2)}M</p>
                                    </div>
                                    <div className="h-10 w-px bg-slate-200 hidden md:block"></div>
                                    <div className="hidden md:block">
                                        <p className="text-xs font-bold text-slate-500 uppercase">Total Value</p>
                                        <p className="text-lg font-bold text-brand-purple">R{(totalValue / 1000000).toFixed(1)}M</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => { setListingSearch(''); setStatusFilter('ALL'); }}>
                                    <RefreshCw size={14} className="mr-2" /> Reset Filters
                                </Button>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};
