
import React from 'react';
import { Settings, RefreshCw, Palette, Upload } from 'lucide-react';
import { Card, Input } from './Shared';
import { Button } from '../ui/button';
import { Listing, Agent, Inquiry, Contractor, Conveyancer } from '../../types';

interface SettingsManagerProps {
    listings: Listing[];
    agents: Agent[];
    inquiries: Inquiry[];
    contractors: Contractor[];
    conveyancers: Conveyancer[];
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
    listings,
    agents,
    inquiries,
    contractors,
    conveyancers
}) => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">Enterprise Settings</h2>
                <p className="text-slate-500 text-sm">Manage branding, integrations, and system configuration.</p>
            </div>

            {/* System Status */}
            <Card className="p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center"><Settings className="mr-2 text-brand-green" /> System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">API Server</p>
                            <p className="text-xs text-emerald-600">Connected to Mandated Cloud</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">Database</p>
                            <p className="text-xs text-emerald-600">Neon PostgreSQL Active</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">AI Services</p>
                            <p className="text-xs text-emerald-600">Gemini Connected</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 text-xs text-slate-400 flex justify-between items-center">
                    <span>Last synced: {new Date().toLocaleTimeString()}</span>
                    <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                        <RefreshCw size={14} className="mr-1" /> Refresh Status
                    </Button>
                </div>
            </Card>

            {/* Current Stats */}
            <Card className="p-6">
                <h3 className="font-bold text-lg mb-6">Data Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-brand-green">{listings.length}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase">Listings</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-brand-purple">{agents.length}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase">Agents</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{inquiries.length}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase">Inquiries</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">{contractors.length}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase">Contractors</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                        <p className="text-2xl font-bold text-teal-600">{conveyancers.length}</p>
                        <p className="text-xs text-slate-500 font-bold uppercase">Conveyancers</p>
                    </div>
                </div>
            </Card>

            {/* Branding */}
            <Card className="p-8">
                <h3 className="font-bold text-lg mb-6 flex items-center"><Palette className="mr-2 text-brand-purple" /> Agency Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Primary Color</label>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-brand-green shadow-sm border border-slate-200"></div>
                            <Input value="#059669" disabled className="font-mono" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Secondary Color</label>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-brand-purple shadow-sm border border-slate-200"></div>
                            <Input value="#4c1d95" disabled className="font-mono" />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Agency Logo</label>
                        <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400">
                            <Upload size={24} className="mb-2" />
                            <span className="text-xs">Drag and drop logo here</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button variant="brand">Save Changes</Button>
                </div>
            </Card>
        </div>
    );
};
