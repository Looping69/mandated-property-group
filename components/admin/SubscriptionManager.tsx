
"use client";

import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../../services/subscriptionService';
import { Card, Badge } from './Shared';
import { CreditCard, TrendingUp, Users, DollarSign, Calendar, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Button } from '../ui/button';

export const SubscriptionManager: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'SUBS' | 'PAYMENTS'>('SUBS');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subsData, paymentsData] = await Promise.all([
                    subscriptionService.listAllSubscriptions(),
                    subscriptionService.listAllPayments()
                ]);
                setSubscriptions(subsData);
                setPayments(paymentsData);
            } catch (err) {
                console.error("Failed to fetch subscription data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const calculateStats = () => {
        const totalRevenue = payments
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + (p.amountCents / 100), 0);

        const activeSubs = subscriptions.filter(s => s.status === 'active').length;

        const monthlyRevenue = payments
            .filter(p => p.status === 'completed' && new Date(p.createdAt).getMonth() === new Date().getMonth())
            .reduce((sum, p) => sum + (p.amountCents / 100), 0);

        return { totalRevenue, activeSubs, monthlyRevenue };
    };

    const stats = calculateStats();

    const filteredSubs = subscriptions.filter(s =>
        s.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.packageName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPayments = payments.filter(p =>
        p.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                <div className="animate-pulse flex flex-col items-center">
                    <CreditCard size={48} className="mb-4 text-brand-green opacity-20" />
                    <p className="font-bold">Loading Financial Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Income & Subscriptions</h2>
                    <p className="text-slate-500 mt-1">Track platform revenue and user tiers</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-green outline-none w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-brand-green bg-gradient-to-br from-white to-green-50/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">+12% vs last month</Badge>
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total Revenue</p>
                    <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">
                        R{stats.totalRevenue.toLocaleString()}
                    </h3>
                </Card>

                <Card className="p-6 border-l-4 border-brand-purple bg-gradient-to-br from-white to-purple-50/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-brand-purple">
                            <Users size={24} />
                        </div>
                        <div className="flex items-center text-purple-600 text-xs font-bold">
                            <TrendingUp size={14} className="mr-1" /> Growing
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Active Subscriptions</p>
                    <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">
                        {stats.activeSubs}
                    </h3>
                </Card>

                <Card className="p-6 border-l-4 border-amber-500 bg-gradient-to-br from-white to-amber-50/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">MTD Revenue</p>
                    <h3 className="text-3xl font-serif font-bold text-slate-900 mt-1">
                        R{stats.monthlyRevenue.toLocaleString()}
                    </h3>
                </Card>
            </div>

            {/* Tabs & Table */}
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('SUBS')}
                        className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'SUBS'
                            ? 'text-brand-green border-brand-green bg-green-50/30'
                            : 'text-slate-400 border-transparent hover:text-slate-600'
                            }`}
                    >
                        Active Subscriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('PAYMENTS')}
                        className={`px-8 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'PAYMENTS'
                            ? 'text-brand-green border-brand-green bg-green-50/30'
                            : 'text-slate-400 border-transparent hover:text-slate-600'
                            }`}
                    >
                        Payment Logs
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'SUBS' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">User</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Plan</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Status</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Started</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4 text-right">Expires</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredSubs.length > 0 ? filteredSubs.map((sub) => (
                                        <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 group-hover:text-brand-green transition-colors">{sub.userEmail}</span>
                                                    <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">ID: {sub.userId}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className="bg-slate-100 text-slate-600 border-slate-200">
                                                    {sub.packageName}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant={sub.status === 'active' ? 'success' : 'warning'}>
                                                    {sub.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center text-sm text-slate-500">
                                                    <Calendar size={14} className="mr-2" />
                                                    {new Date(sub.currentPeriodStart).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <span className="text-sm font-medium text-slate-900">
                                                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400 italic">No subscriptions found matching your search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Transaction ID</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">User</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4 text-right">Amount</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Status</th>
                                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredPayments.length > 0 ? filteredPayments.map((pay) => (
                                        <tr key={pay.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-4 px-4">
                                                <span className="font-mono text-xs text-slate-400">{pay.id}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{pay.userEmail}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <span className="font-bold text-slate-900">
                                                    R{(pay.amountCents / 100).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    {pay.status === 'completed' ? (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                                            <CheckCircle size={12} /> Success
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                                                            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> {pay.status}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="text-sm text-slate-500">
                                                    {new Date(pay.createdAt).toLocaleString()}
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-slate-400 italic">No payments found matching your search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Internal Helper Components for the Table
const CheckCircle = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);
