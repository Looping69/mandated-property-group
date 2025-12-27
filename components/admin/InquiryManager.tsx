
import React, { useState } from 'react';
import { MessageSquare, Phone, CheckCircle, RefreshCw } from 'lucide-react';
import { Card, Badge } from './Shared';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Inquiry, Listing } from '../../types';

interface InquiryManagerProps {
    inquiries: Inquiry[];
    listings: Listing[];
    updateInquiryStatus: (id: string, status: 'new' | 'contacted' | 'closed') => Promise<void>;
}

export const InquiryManager: React.FC<InquiryManagerProps> = ({
    inquiries,
    listings,
    updateInquiryStatus
}) => {
    const [inquiryFilter, setInquiryFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');

    const filteredInquiries = inquiryFilter === 'all'
        ? inquiries
        : inquiries.filter(i => i.status === inquiryFilter);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Customer Inquiries</h2>
                    <p className="text-slate-500 text-sm">Manage leads and property interest from potential buyers.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-100 rounded-lg p-1">
                    {['all', 'new', 'contacted', 'closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setInquiryFilter(status as any)}
                            className={cn(
                                "px-4 py-2 text-sm font-bold rounded-md transition-all",
                                inquiryFilter === status ? "bg-white text-brand-green shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg"><MessageSquare size={20} className="text-blue-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{inquiries.filter(i => i.status === 'new').length}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">New Leads</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-lg"><Phone size={20} className="text-amber-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{inquiries.filter(i => i.status === 'contacted').length}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">In Progress</p>
                    </div>
                </Card>
                <Card className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg"><CheckCircle size={20} className="text-emerald-600" /></div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{inquiries.filter(i => i.status === 'closed').length}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase">Closed</p>
                    </div>
                </Card>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {filteredInquiries.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <MessageSquare size={40} className="mx-auto mb-4 text-slate-200" />
                        <p>No {inquiryFilter === 'all' ? '' : inquiryFilter} inquiries found.</p>
                    </div>
                ) : (
                    filteredInquiries.map(inquiry => (
                        <div key={inquiry.id} className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-green flex items-center justify-center text-white font-bold text-sm">
                                        {inquiry.customerName.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-900">{inquiry.customerName}</span>
                                        <div className="text-sm text-brand-green">{inquiry.customerEmail}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant={inquiry.status === 'new' ? 'warning' : inquiry.status === 'contacted' ? 'purple' : 'success'}>
                                        {inquiry.status.toUpperCase()}
                                    </Badge>
                                    <span className="text-xs text-slate-400">{new Date(inquiry.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <p className="text-slate-600 mb-4 pl-13">{inquiry.message}</p>
                            <div className="flex justify-between items-center pl-13">
                                <span className="text-xs text-slate-400">Property: {listings.find(l => l.id === inquiry.listingId)?.title || 'General Inquiry'}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {inquiry.status === 'new' && (
                                        <Button variant="outline" size="sm" onClick={() => updateInquiryStatus(inquiry.id, 'contacted')}>
                                            <Phone size={14} className="mr-1" /> Mark Contacted
                                        </Button>
                                    )}
                                    {inquiry.status === 'contacted' && (
                                        <Button variant="brand" size="sm" onClick={() => updateInquiryStatus(inquiry.id, 'closed')}>
                                            <CheckCircle size={14} className="mr-1" /> Close Lead
                                        </Button>
                                    )}
                                    {inquiry.status === 'closed' && (
                                        <Button variant="ghost" size="sm" onClick={() => updateInquiryStatus(inquiry.id, 'new')}>
                                            <RefreshCw size={14} className="mr-1" /> Reopen
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
