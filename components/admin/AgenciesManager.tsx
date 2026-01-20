
import React, { useState } from 'react';
import {
    Plus, XCircle, Search, Building2, MapPin, Phone,
    Mail, Globe, Shield, Trash2, Filter, RefreshCw
} from 'lucide-react';
import { Card, Badge, Input } from './Shared';
import { Button } from '../ui/button';
import { Agency } from '../../types';
import { cn } from '../../lib/utils';

interface AgenciesManagerProps {
    agencies: Agency[];
    updateAgencyStatus: (id: string, status: string) => Promise<void>;
}

export const AgenciesManager: React.FC<AgenciesManagerProps> = ({
    agencies,
    updateAgencyStatus
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredAgencies = agencies.filter(agency => {
        const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agency.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" && agency.status === 'active') ||
            (statusFilter === "SUSPENDED" && agency.status === 'suspended');
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: agencies.length,
        active: agencies.filter(a => a.status === 'active').length,
        suspended: agencies.filter(a => a.status === 'suspended').length,
        verified: agencies.filter(a => a.isVerified).length
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Agency Management</h2>
                    <p className="text-slate-500 text-sm mt-1">Monitor and manage all participating real estate agencies.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Agencies</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-slate-400">{stats.suspended}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suspended</p>
                </Card>
                <Card className="p-4 text-center">
                    <p className="text-2xl font-bold text-brand-purple">{stats.verified}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search agencies by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={statusFilter === 'ALL' ? 'brand' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('ALL')}
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'ACTIVE' ? 'brand' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('ACTIVE')}
                        >
                            Active
                        </Button>
                        <Button
                            variant={statusFilter === 'SUSPENDED' ? 'brand' : 'outline'}
                            size="sm"
                            onClick={() => setStatusFilter('SUSPENDED')}
                        >
                            Suspended
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Agency Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgencies.map(agency => (
                    <Card key={agency.id} className="overflow-hidden group hover:shadow-lg transition-all border-slate-100">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden">
                                    {agency.logoUrl ? (
                                        <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 size={32} className="text-slate-300" />
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Badge variant={agency.status === 'active' ? 'success' : 'neutral'}>
                                        {agency.status.toUpperCase()}
                                    </Badge>
                                    {agency.isVerified && (
                                        <Badge variant="purple" className="flex items-center gap-1">
                                            <Shield size={10} /> Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-900 text-lg mb-1">{agency.name}</h3>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Mail size={14} /> <span>{agency.email}</span>
                                </div>
                                {agency.phone && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Phone size={14} /> <span>{agency.phone}</span>
                                    </div>
                                )}
                                {agency.website && (
                                    <div className="flex items-center gap-2 text-sm text-blue-500">
                                        <Globe size={14} /> <a href={agency.website} target="_blank" rel="noreferrer" className="hover:underline truncate">{agency.website}</a>
                                    </div>
                                )}
                                {agency.officeAddress && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <MapPin size={14} /> <span className="truncate">{agency.officeAddress}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-slate-50">
                                <Button
                                    variant={agency.status === 'active' ? 'outline' : 'brand'}
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => updateAgencyStatus(agency.id, agency.status === 'active' ? 'suspended' : 'active')}
                                >
                                    {agency.status === 'active' ? 'Suspend Agency' : 'Activate Agency'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredAgencies.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <Building2 size={48} className="mx-auto mb-4 text-slate-200" />
                        <p className="text-slate-500 font-medium">No agencies found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
