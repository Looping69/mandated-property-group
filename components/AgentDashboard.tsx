"use client";

import React, { useState } from 'react';
import {
    Plus, Home, TrendingUp, MapPin, Calendar, DollarSign,
    Eye, Edit, Trash2, Image as ImageIcon, Sparkles, Upload,
    BarChart3, Users, Phone, Mail, Video
} from 'lucide-react';
import { Card, Badge, Input } from './admin/Shared';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Listing, Agent, VirtualTour, Inquiry, ListingStatus } from '../types';

interface AgentDashboardProps {
    currentAgent: Agent;
    listings: Listing[];
    virtualTours: VirtualTour[];
    inquiries: Inquiry[];
    addListing: (listing: any) => Promise<void>;
    updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
    deleteListing: (id: string) => Promise<void>;
    handleAIDescription: (listing: Partial<Listing>) => Promise<string>;
    onNavigateToTourCreator: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
    currentAgent,
    listings,
    virtualTours,
    inquiries,
    addListing,
    updateListing,
    deleteListing,
    handleAIDescription,
    onNavigateToTourCreator
}) => {
    const [isCreatingListing, setIsCreatingListing] = useState(false);
    const [editingListing, setEditingListing] = useState<Listing | null>(null);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [newListing, setNewListing] = useState<Partial<Listing>>({
        agentId: currentAgent.id,
        status: 'active',
        isFeatured: false
    });

    // Filter to show only this agent's listings
    const myListings = listings.filter(l => l.agentId === currentAgent.id);
    const myInquiries = inquiries.filter(i => i.agentId === currentAgent.id);
    const myTours = virtualTours.filter(t => t.agentId === currentAgent.id);

    // Statistics
    const stats = {
        totalListings: myListings.length,
        activeListings: myListings.filter(l => l.status === 'active').length,
        soldListings: myListings.filter(l => l.status === 'sold').length,
        totalInquiries: myInquiries.length,
        newInquiries: myInquiries.filter(i => i.status === 'new').length,
        totalTours: myTours.length,
        avgPrice: myListings.length > 0
            ? Math.round(myListings.reduce((sum, l) => sum + l.price, 0) / myListings.length)
            : 0
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewListing({ ...newListing, image: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    const handleGenerateDescription = async () => {
        if (!newListing.address || !newListing.beds || !newListing.baths) {
            alert('Please fill in address, beds, and baths first');
            return;
        }
        setIsGeneratingDesc(true);
        try {
            const description = await handleAIDescription(newListing);
            setNewListing({ ...newListing, description });
        } catch (error) {
            console.error('Failed to generate description', error);
        } finally {
            setIsGeneratingDesc(false);
        }
    };

    const handleSubmitListing = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListing.title || !newListing.price || !newListing.address) {
            alert('Please fill in all required fields');
            return;
        }
        await addListing({
            ...newListing,
            id: `listing-${Date.now()}`,
            agentId: currentAgent.id,
            images: newListing.image ? [newListing.image] : [],
            isFeatured: false
        });
        setNewListing({ agentId: currentAgent.id, status: 'active', isFeatured: false });
        setIsCreatingListing(false);
    };

    const getStatusColor = (status: ListingStatus): string => {
        switch (status) {
            case 'active': return 'text-emerald-600 bg-emerald-50';
            case 'sold': return 'text-blue-600 bg-blue-50';
            case 'on_show': return 'text-amber-600 bg-amber-50';
            case 'reduced': return 'text-red-600 bg-red-50';
            case 'new': return 'text-purple-600 bg-purple-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-brand-purple to-brand-green rounded-2xl p-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30">
                            <img src={currentAgent.image} alt={currentAgent.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {currentAgent.name}</h1>
                            <p className="text-white/80">{currentAgent.title}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1"><Phone size={14} /> {currentAgent.phone}</span>
                                <span className="flex items-center gap-1"><Mail size={14} /> {currentAgent.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 border-l-4 border-l-brand-green">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-green/10 rounded-xl">
                                <Home size={24} className="text-brand-green" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.activeListings}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">Active Listings</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <TrendingUp size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.soldListings}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">Properties Sold</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-l-4 border-l-amber-500">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <Users size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.newInquiries}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">New Inquiries</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-l-4 border-l-brand-purple">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-purple/10 rounded-xl">
                                <Video size={24} className="text-brand-purple" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.totalTours}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">Virtual Tours</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="flex gap-3">
                        <Button
                            variant="brand"
                            onClick={() => setIsCreatingListing(true)}
                            className="flex-1"
                        >
                            <Plus size={16} className="mr-2" /> Upload New Listing
                        </Button>
                        <Button
                            variant="outline"
                            onClick={onNavigateToTourCreator}
                            className="flex-1"
                        >
                            <Video size={16} className="mr-2" /> Create Virtual Tour
                        </Button>
                    </div>
                </Card>

                {/* Create Listing Form */}
                {isCreatingListing && (
                    <Card className="p-8 border-2 border-brand-green/30">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Upload New Property</h3>
                        <form onSubmit={handleSubmitListing} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Property Image</label>
                                <div className="flex items-center gap-4">
                                    {newListing.image && (
                                        <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-slate-200">
                                            <img src={newListing.image} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-green transition-colors">
                                        <Upload size={32} className="text-slate-400 mb-2" />
                                        <span className="text-sm text-slate-600">Click to upload image</span>
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Property Title *</label>
                                    <Input
                                        placeholder="e.g. Modern 3 Bed in Sandton"
                                        value={newListing.title || ''}
                                        onChange={e => setNewListing({ ...newListing, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Price (ZAR) *</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 3500000"
                                        value={newListing.price || ''}
                                        onChange={e => setNewListing({ ...newListing, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Address *</label>
                                <Input
                                    placeholder="e.g. 123 Main Street, Sandton, Johannesburg"
                                    value={newListing.address || ''}
                                    onChange={e => setNewListing({ ...newListing, address: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bedrooms</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 3"
                                        value={newListing.beds || ''}
                                        onChange={e => setNewListing({ ...newListing, beds: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Bathrooms</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 2"
                                        value={newListing.baths || ''}
                                        onChange={e => setNewListing({ ...newListing, baths: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Size (m²)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 250"
                                        value={newListing.size || ''}
                                        onChange={e => setNewListing({ ...newListing, size: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Status</label>
                                <select
                                    value={newListing.status || 'active'}
                                    onChange={e => setNewListing({ ...newListing, status: e.target.value as ListingStatus })}
                                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                                >
                                    <option value="active">Active</option>
                                    <option value="new">New</option>
                                    <option value="on_show">On Show</option>
                                    <option value="reduced">Price Reduced</option>
                                </select>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleGenerateDescription}
                                        disabled={isGeneratingDesc}
                                    >
                                        <Sparkles size={14} className="mr-1" />
                                        {isGeneratingDesc ? 'Generating...' : 'AI Generate'}
                                    </Button>
                                </div>
                                <textarea
                                    className="w-full rounded-md border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-green outline-none min-h-[120px]"
                                    placeholder="Describe the property features, amenities, neighborhood..."
                                    value={newListing.description || ''}
                                    onChange={e => setNewListing({ ...newListing, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" variant="brand" className="flex-1">
                                    <Upload size={16} className="mr-2" /> Upload Listing
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsCreatingListing(false);
                                        setNewListing({ agentId: currentAgent.id, status: 'active', isFeatured: false });
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {/* My Listings */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Home size={24} className="text-brand-green" />
                        My Listings ({myListings.length})
                    </h3>
                    {myListings.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Home size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No listings yet</p>
                            <p className="text-sm text-slate-400 mt-1">Upload your first property to get started</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myListings.map(listing => (
                                <Card key={listing.id} className="overflow-hidden group hover:shadow-xl transition-all">
                                    <div className="relative h-48">
                                        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                                        <div className={cn("absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold uppercase", getStatusColor(listing.status))}>
                                            {listing.status}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-bold text-lg text-slate-900 mb-2">{listing.title}</h4>
                                        <p className="text-2xl font-bold text-brand-green mb-3">R{listing.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                            <MapPin size={14} /> {listing.address}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                            <span>{listing.beds} beds</span>
                                            <span>{listing.baths} baths</span>
                                            <span>{listing.size}m²</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Eye size={14} className="mr-1" /> View
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteListing(listing.id)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Inquiries */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-brand-purple" />
                        Recent Inquiries ({myInquiries.length})
                    </h3>
                    {myInquiries.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No inquiries yet</p>
                    ) : (
                        <div className="space-y-3">
                            {myInquiries.slice(0, 5).map(inquiry => (
                                <div key={inquiry.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-900">{inquiry.customerName}</p>
                                        <p className="text-sm text-slate-500">{inquiry.message}</p>
                                        <p className="text-xs text-slate-400 mt-1">{inquiry.date}</p>
                                    </div>
                                    <Badge variant={inquiry.status === 'new' ? 'success' : 'default'}>
                                        {inquiry.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
