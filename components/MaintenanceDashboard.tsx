"use client";

import React, { useState } from 'react';
import {
    Wrench, CheckCircle, Clock, AlertCircle, Calendar,
    MapPin, DollarSign, Image as ImageIcon, Filter, Search,
    TrendingUp, Users, Briefcase, Phone, Mail, FileText
} from 'lucide-react';
import { Card, Badge, Input } from './admin/Shared';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { MaintenanceRequest, Contractor, Listing } from '../types';

interface MaintenanceDashboardProps {
    currentContractor: Contractor;
    requests: MaintenanceRequest[];
    listings: Listing[];
    updateRequest: (id: string, updates: Partial<MaintenanceRequest>) => Promise<void>;
}

export const MaintenanceDashboard: React.FC<MaintenanceDashboardProps> = ({
    currentContractor,
    requests,
    listings,
    updateRequest
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<MaintenanceRequest['status'] | 'all'>('all');
    const [filterPriority, setFilterPriority] = useState<MaintenanceRequest['priority'] | 'all'>('all');
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

    // Filter requests for this contractor
    const myRequests = requests.filter(r =>
        r.assignedTo === currentContractor.id || r.contractorId === currentContractor.id
    );

    // Apply filters
    const filteredRequests = myRequests.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
        const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    // Statistics
    const stats = {
        total: myRequests.length,
        pending: myRequests.filter(r => r.status === 'pending').length,
        inProgress: myRequests.filter(r => r.status === 'in_progress').length,
        completed: myRequests.filter(r => r.status === 'completed').length,
        totalEarned: myRequests
            .filter(r => r.status === 'completed' && r.actualCost)
            .reduce((sum, r) => sum + (r.actualCost || 0), 0),
        avgCompletionTime: '2.3 days' // Placeholder
    };

    const getPriorityColor = (priority: MaintenanceRequest['priority']): string => {
        switch (priority) {
            case 'urgent': return 'bg-red-500 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-amber-500 text-white';
            case 'low': return 'bg-blue-500 text-white';
            default: return 'bg-slate-500 text-white';
        }
    };

    const getStatusColor = (status: MaintenanceRequest['status']): string => {
        switch (status) {
            case 'pending': return 'text-amber-600 bg-amber-50';
            case 'assigned': return 'text-blue-600 bg-blue-50';
            case 'in_progress': return 'text-purple-600 bg-purple-50';
            case 'completed': return 'text-emerald-600 bg-emerald-50';
            case 'cancelled': return 'text-slate-600 bg-slate-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    const getStatusIcon = (status: MaintenanceRequest['status']) => {
        switch (status) {
            case 'pending': return <Clock size={16} />;
            case 'assigned': return <Users size={16} />;
            case 'in_progress': return <Wrench size={16} />;
            case 'completed': return <CheckCircle size={16} />;
            default: return <AlertCircle size={16} />;
        }
    };

    const handleStatusChange = async (requestId: string, newStatus: MaintenanceRequest['status']) => {
        await updateRequest(requestId, {
            status: newStatus,
            updatedAt: new Date().toISOString(),
            ...(newStatus === 'completed' && { completedAt: new Date().toISOString() })
        });
    };

    const renderRequestDetail = () => {
        if (!selectedRequest) return null;

        const listing = listings.find(l => l.id === selectedRequest.listingId);

        return (
            <div
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedRequest(null)}
            >
                <Card
                    className="max-w-3xl w-full p-8 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-2xl font-bold text-slate-900">{selectedRequest.title}</h2>
                                <Badge className={cn("uppercase text-xs font-bold", getPriorityColor(selectedRequest.priority))}>
                                    {selectedRequest.priority}
                                </Badge>
                            </div>
                            <p className="text-brand-green font-bold uppercase text-sm tracking-wide">{selectedRequest.category}</p>
                        </div>
                        <Badge className={cn(getStatusColor(selectedRequest.status), "flex items-center gap-1")}>
                            {getStatusIcon(selectedRequest.status)}
                            {selectedRequest.status}
                        </Badge>
                    </div>

                    {listing && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center gap-4">
                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{listing.title}</h4>
                                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                                    <MapPin size={12} /> {listing.address}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <FileText size={16} className="text-brand-purple" /> Description
                        </h3>
                        <p className="text-slate-600 leading-relaxed">{selectedRequest.description}</p>
                    </div>

                    {selectedRequest.images && selectedRequest.images.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-bold text-slate-900 mb-3">Attached Images</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {selectedRequest.images.map((img, idx) => (
                                    <div key={idx} className="h-32 rounded-lg overflow-hidden border border-slate-200">
                                        <img src={img} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Calendar size={20} className="text-brand-purple" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Created</p>
                                <p className="text-sm font-medium text-slate-900">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                            <Clock size={20} className="text-brand-green" />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Updated</p>
                                <p className="text-sm font-medium text-slate-900">{new Date(selectedRequest.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {selectedRequest.estimatedCost && (
                        <div className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 rounded-xl p-6 mb-6 border border-brand-green/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase mb-1">Estimated Cost</p>
                                    <p className="text-3xl font-bold text-brand-green">R{selectedRequest.estimatedCost.toLocaleString()}</p>
                                </div>
                                {selectedRequest.actualCost && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Actual Cost</p>
                                        <p className="text-2xl font-bold text-slate-900">R{selectedRequest.actualCost.toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Update Status</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant={selectedRequest.status === 'in_progress' ? 'brand' : 'outline'}
                                onClick={() => handleStatusChange(selectedRequest.id, 'in_progress')}
                                disabled={selectedRequest.status === 'completed'}
                            >
                                <Wrench size={16} className="mr-2" /> In Progress
                            </Button>
                            <Button
                                variant={selectedRequest.status === 'completed' ? 'brand' : 'outline'}
                                onClick={() => handleStatusChange(selectedRequest.id, 'completed')}
                            >
                                <CheckCircle size={16} className="mr-2" /> Mark Complete
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-brand-green to-emerald-600 rounded-2xl p-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/30 bg-white/10 flex items-center justify-center">
                            <Wrench size={40} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome, {currentContractor.name}</h1>
                            <p className="text-white/80">{currentContractor.trade} Specialist</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1"><Phone size={14} /> {currentContractor.phone}</span>
                                <span className="flex items-center gap-1"><Mail size={14} /> {currentContractor.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-5 border-l-4 border-l-amber-500">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <Clock size={24} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">Pending</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-l-4 border-l-brand-purple">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-purple/10 rounded-xl">
                                <Wrench size={24} className="text-brand-purple" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">In Progress</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-l-4 border-l-emerald-500">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <CheckCircle size={24} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stats.completed}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">Completed</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-5 border-l-4 border-l-brand-green">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-brand-green/10 rounded-xl">
                                <DollarSign size={24} className="text-brand-green" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">R{stats.totalEarned.toLocaleString()}</p>
                                <p className="text-xs text-slate-500 font-bold uppercase">Total Earned</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value as any)}
                            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            value={filterPriority}
                            onChange={e => setFilterPriority(e.target.value as any)}
                            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                        >
                            <option value="all">All Priorities</option>
                            <option value="urgent">Urgent</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </Card>

                {/* Requests List */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Briefcase size={24} className="text-brand-green" />
                        My Work Orders ({filteredRequests.length})
                    </h3>
                    {filteredRequests.length === 0 ? (
                        <Card className="p-12 text-center">
                            <Wrench size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No maintenance requests found</p>
                            <p className="text-sm text-slate-400 mt-1">Check back later for new assignments</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredRequests.map(request => {
                                const listing = listings.find(l => l.id === request.listingId);
                                return (
                                    <Card
                                        key={request.id}
                                        className="p-6 cursor-pointer hover:shadow-lg transition-all"
                                        onClick={() => setSelectedRequest(request)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                {listing ? (
                                                    <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Wrench size={32} className="text-slate-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-lg text-slate-900 mb-1">{request.title}</h4>
                                                        <Badge variant="purple" className="mb-2">{request.category}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={cn("uppercase text-xs font-bold", getPriorityColor(request.priority))}>
                                                            {request.priority}
                                                        </Badge>
                                                        <Badge className={cn(getStatusColor(request.status), "flex items-center gap-1")}>
                                                            {getStatusIcon(request.status)}
                                                            {request.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{request.description}</p>
                                                <div className="flex items-center gap-6 text-sm text-slate-500">
                                                    {listing && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={14} /> {listing.address}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} /> {new Date(request.createdAt).toLocaleDateString()}
                                                    </span>
                                                    {request.estimatedCost && (
                                                        <span className="flex items-center gap-1 font-bold text-brand-green">
                                                            <DollarSign size={14} /> R{request.estimatedCost.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {renderRequestDetail()}
        </div>
    );
};
