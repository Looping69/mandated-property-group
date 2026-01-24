"use client";

import React, { useState } from 'react';
import {
    Plus, Home, TrendingUp, MapPin, Calendar, DollarSign,
    Eye, Edit, Trash2, Image as ImageIcon, Sparkles, Upload,
    BarChart3, Users, Phone, Mail, Video, PawPrint, Car
} from 'lucide-react';
import { Card, Badge, Input } from './admin/Shared';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Listing, Agent, VirtualTour, Inquiry, ListingStatus } from '../types';
import { Subscription } from '../services/subscriptionService';
import { useToast } from '../contexts/ToastContext';

interface AgentDashboardProps {
    currentAgent: Agent;
    listings: Listing[];
    virtualTours: VirtualTour[];
    inquiries: Inquiry[];
    currentSubscription: Subscription | null;
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
    currentSubscription,
    addListing,
    updateListing,
    deleteListing,
    handleAIDescription,
    onNavigateToTourCreator
}) => {
    const { showToast } = useToast();
    const isTopAgent = currentSubscription?.status === 'active' && (currentSubscription?.package?.topAgents || 0) > 0;
    const [isCreatingListing, setIsCreatingListing] = useState(false);
    const [editingListing, setEditingListing] = useState<Listing | null>(null);
    const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
    const [newListing, setNewListing] = useState<Partial<Listing>>({
        agentId: currentAgent?.id || '',
        status: 'active',
        isFeatured: false,
        propertyType: 'House',
        images: []
    });

    const maxPhotos = currentSubscription?.package?.maxPhotos || 5;
    const remainingPhotos = maxPhotos - (newListing.images?.length || 0);

    if (!currentAgent) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <div className="w-12 h-12 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Loading Profile</h3>
                <p className="text-slate-500">Please wait while we fetch your agent information...</p>
            </div>
        );
    }

    if (currentAgent.status === 'pending') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <Card className="max-w-md w-full p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                        <Calendar size={40} className="text-amber-600" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Approval Pending</h2>
                        <p className="text-slate-500">
                            Your agent account is currently being reviewed by our admin team.
                            You'll receive full access once your profile has been verified.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg text-sm text-left space-y-2">
                        <p className="font-bold text-slate-700">What happens next?</p>
                        <ul className="list-disc pl-4 text-slate-600 space-y-1">
                            <li>We'll verify your FFC/PPRA number</li>
                            <li>Your profile photos will be reviewed</li>
                            <li>You'll get an email once approved</li>
                        </ul>
                    </div>
                    <div className="pt-4 flex flex-col gap-3">
                        <Button variant="brand" className="w-full" onClick={() => window.location.reload()}>
                            Refresh Status
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => window.location.href = '/'}>
                            Back to Home
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

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
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const currentImages = newListing.images || [];
        if (currentImages.length + files.length > maxPhotos) {
            showToast(`You can only upload up to ${maxPhotos} photos. You have ${maxPhotos - currentImages.length} slots remaining.`, "error");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewListing(prev => ({
                    ...prev,
                    images: [...(prev.images || []), reader.result as string],
                    // Use the first image as the main featured image if none exists
                    image: prev.image || (reader.result as string)
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        const updatedImages = [...(newListing.images || [])];
        updatedImages.splice(index, 1);
        setNewListing({
            ...newListing,
            images: updatedImages,
            image: index === 0 ? (updatedImages[0] || '') : newListing.image
        });
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
            isFeatured: newListing.isFeatured || false
        });
        setNewListing({
            agentId: currentAgent.id,
            status: 'active',
            isFeatured: false,
            propertyType: 'House',
            images: []
        });
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
                <div className="relative overflow-hidden bg-gradient-to-br from-brand-purple via-brand-purple/90 to-brand-green rounded-3xl p-8 text-white shadow-2xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-green/20 rounded-full blur-3xl -ml-24 -mb-24" />

                    <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* Avatar Section */}
                        <div className="relative flex-shrink-0">
                            <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 bg-white/10 backdrop-blur-md">
                                {currentAgent.image ? (
                                    <img
                                        src={currentAgent.image}
                                        alt={currentAgent.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAgent.name)}&background=random`;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-brand-purple/20">
                                        <Users size={40} className="text-white/50" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-brand-green text-white p-2 rounded-lg shadow-lg">
                                <Sparkles size={16} />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-white/70 text-sm font-bold uppercase tracking-[0.2em] mb-1">Agent Portal</h4>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 tracking-tight">
                                Welcome back, <span className="text-white">{currentAgent.name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-xl text-white/80 font-medium mb-6">{currentAgent.title}</p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 whitespace-nowrap">
                                    <Phone size={14} className="text-brand-green" />
                                    <span className="font-bold">{currentAgent.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 whitespace-nowrap">
                                    <Mail size={14} className="text-brand-green" />
                                    <span className="font-bold">{currentAgent.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Badge */}
                        <div className="hidden lg:flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
                            <div className="text-3xl font-bold">{stats.totalListings}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Listings</div>
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
                            onClick={() => {
                                if (myListings.length === 0) {
                                    showToast("You must have at least one listing to create a virtual tour.", "error");
                                    return;
                                }
                                if (!isTopAgent) {
                                    showToast("Virtual tours are exclusively for Top Agents. Please upgrade your plan to unlock this feature.", "info");
                                    return;
                                }
                                onNavigateToTourCreator();
                            }}
                            className={cn("flex-1", (!isTopAgent || myListings.length === 0) && "opacity-50 cursor-not-allowed")}
                        >
                            <Video size={16} className="mr-2" />
                            {!isTopAgent ? 'Unlock Virtual Tours' : 'Create Virtual Tour'}
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
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase block">Property Photos ({newListing.images?.length || 0}/{maxPhotos})</label>
                                    <span className="text-[10px] font-bold text-slate-400">
                                        {remainingPhotos > 0 ? `${remainingPhotos} slots remaining` : 'Limit reached'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {newListing.images?.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-slate-200 group">
                                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                            {idx === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-brand-green/80 text-white text-[10px] font-bold text-center py-0.5">
                                                    Main Photo
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {remainingPhotos > 0 && (
                                        <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-brand-green transition-colors">
                                            <Plus size={24} className="text-slate-400 mb-1" />
                                            <span className="text-[10px] text-slate-600 font-bold">Add Photo</span>
                                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    )}
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
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Garage Type</label>
                                    <select
                                        value={newListing.garage || ''}
                                        onChange={e => setNewListing({ ...newListing, garage: e.target.value })}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                                    >
                                        <option value="">Select Garage</option>
                                        <option value="None">None</option>
                                        <option value="Single">Single</option>
                                        <option value="Double">Double</option>
                                        <option value="Triple">Triple</option>
                                        <option value="4+ Cars">4+ Cars</option>
                                        <option value="Reserved">Reserved/Parking Bay</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Swimming Pool</label>
                                    <select
                                        value={newListing.pool || 'none'}
                                        onChange={e => setNewListing({ ...newListing, pool: e.target.value as any })}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                                    >
                                        <option value="none">None</option>
                                        <option value="private">Private</option>
                                        <option value="communal">Communal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Viewing Type</label>
                                    <select
                                        value={newListing.viewingType || 'appointment'}
                                        onChange={e => setNewListing({ ...newListing, viewingType: e.target.value as any })}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                                    >
                                        <option value="appointment">By Appointment</option>
                                        <option value="on_show">On Show</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Property Type</label>
                                    <select
                                        value={newListing.propertyType || 'House'}
                                        onChange={e => setNewListing({ ...newListing, propertyType: e.target.value as any })}
                                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                                    >
                                        <option value="House">House</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Townhouse">Townhouse</option>
                                        <option value="Commercial">Commercial</option>
                                        <option value="Land">Land</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer py-2">
                                        <input
                                            type="checkbox"
                                            checked={newListing.isPetFriendly}
                                            onChange={e => setNewListing({ ...newListing, isPetFriendly: e.target.checked })}
                                            className="rounded border-slate-300 text-brand-green w-4 h-4"
                                        />
                                        <span className="text-sm font-bold text-slate-700">Pet Friendly</span>
                                    </label>
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer py-2">
                                        <input
                                            type="checkbox"
                                            checked={newListing.isFeatured}
                                            onChange={e => setNewListing({ ...newListing, isFeatured: e.target.checked })}
                                            className="rounded border-slate-300 text-brand-green w-4 h-4"
                                        />
                                        <span className="text-sm font-bold text-slate-700">Featured</span>
                                    </label>
                                </div>
                            </div>

                            {newListing.viewingType === 'on_show' && (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">On Show Schedule</label>
                                    <Input
                                        placeholder="e.g. Sunday 14:00 - 17:00"
                                        value={newListing.onShowDate || ''}
                                        onChange={e => setNewListing({ ...newListing, onShowDate: e.target.value })}
                                    />
                                </div>
                            )}

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
                                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4 overflow-hidden">
                                            <span>{listing.beds} beds</span>
                                            <span>{listing.baths} baths</span>
                                            <span className="truncate">{listing.garage} garage</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1">
                                                <Eye size={14} className="mr-1" /> View
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setNewListing(listing);
                                                    setIsCreatingListing(true);
                                                    setEditingListing(listing);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            >
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
