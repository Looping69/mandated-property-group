"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptionService, Package, Subscription } from '../services/subscriptionService';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Check, Crown, Building2, TrendingUp, Map, Zap, Loader2, ArrowRight } from 'lucide-react';

const PACKAGE_ICONS: Record<string, React.ReactNode> = {
    'solo-entry': <Zap className="w-6 h-6" />,
    'solo-entry-5': <Zap className="w-6 h-6" />,
    'top-agent': <Crown className="w-6 h-6" />,
    'local-presence': <Building2 className="w-6 h-6" />,
    'area-authority': <TrendingUp className="w-6 h-6" />,
    'market-leader': <Crown className="w-6 h-6" />,
    'regional-dominance': <Map className="w-6 h-6" />,
};

const PACKAGE_COLORS: Record<string, string> = {
    'solo-entry': 'from-slate-500 to-slate-600',
    'solo-entry-5': 'from-slate-600 to-slate-700',
    'top-agent': 'from-amber-500 to-amber-600',
    'local-presence': 'from-blue-500 to-blue-600',
    'area-authority': 'from-purple-500 to-purple-600',
    'market-leader': 'from-emerald-500 to-emerald-600',
    'regional-dominance': 'from-rose-500 to-rose-600',
};

export const PricingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isSignedIn, openSignIn } = useAuth();

    const [packages, setPackages] = useState<Package[]>([]);
    const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [processingPackage, setProcessingPackage] = useState<string | null>(null);
    const [verificationMessage, setVerificationMessage] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [pkgs, sub] = await Promise.all([
                    subscriptionService.listPackages(),
                    isSignedIn ? subscriptionService.getMySubscription() : null,
                ]);
                setPackages(pkgs);
                setCurrentSub(sub);
            } catch (err) {
                console.error('Failed to load packages:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [isSignedIn]);

    // Handle payment verification from success redirect
    useEffect(() => {
        const paymentId = searchParams.get('paymentId');
        if (paymentId && isSignedIn) {
            setVerificationMessage('Verifying your payment...');
            subscriptionService.verifyPayment(paymentId).then(result => {
                if (result.success) {
                    setVerificationMessage('Payment successful! Your subscription is now active.');
                    setCurrentSub(result.subscription || null);
                } else {
                    setVerificationMessage('Payment verification pending. Please refresh in a moment.');
                }
            }).catch(() => {
                setVerificationMessage('Could not verify payment. Please contact support.');
            });
        }
    }, [searchParams, isSignedIn]);

    const handleSelectPackage = async (pkg: Package) => {
        if (!isSignedIn) {
            openSignIn();
            return;
        }

        setProcessingPackage(pkg.id);
        try {
            const baseUrl = window.location.origin;
            const { checkoutUrl } = await subscriptionService.createCheckout(
                pkg.id,
                `${baseUrl}/pricing`,
                `${baseUrl}/pricing`
            );
            window.location.href = checkoutUrl;
        } catch (err) {
            console.error('Checkout failed:', err);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setProcessingPackage(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
        );
    }

    // Group packages
    const agentPackages = packages.filter(p => ['solo-entry', 'solo-entry-5', 'top-agent'].includes(p.slug));
    const agencyPackages = packages.filter(p => ['local-presence', 'area-authority', 'market-leader', 'regional-dominance'].includes(p.slug));

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Choose Your <span className="text-brand-purple">Visibility</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        From first-time agents to market leaders—find the package that matches your ambition.
                    </p>
                </div>

                {/* Verification Message */}
                {verificationMessage && (
                    <div className="max-w-md mx-auto mb-8 p-4 bg-brand-green/10 border border-brand-green/20 rounded-xl text-center">
                        <p className="text-brand-green font-medium">{verificationMessage}</p>
                    </div>
                )}

                {/* Current Subscription */}
                {currentSub && (
                    <div className="max-w-md mx-auto mb-12 p-6 bg-gradient-to-r from-brand-purple to-brand-green rounded-2xl text-white shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Crown className="w-6 h-6" />
                            <span className="text-sm font-bold uppercase tracking-wider opacity-80">Active Plan</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{currentSub.package?.name}</h3>
                        <p className="opacity-80">
                            Renews: {currentSub.currentPeriodEnd ? new Date(currentSub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                )}

                {/* Agent Packages */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-amber-500" />
                        For Agents
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {agentPackages.map(pkg => (
                            <PackageCard
                                key={pkg.id}
                                pkg={pkg}
                                isCurrentPlan={currentSub?.packageId === pkg.id}
                                isProcessing={processingPackage === pkg.id}
                                onSelect={() => handleSelectPackage(pkg)}
                            />
                        ))}
                    </div>
                </div>

                {/* Agency Packages */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-brand-purple" />
                        For Agencies
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {agencyPackages.map(pkg => (
                            <PackageCard
                                key={pkg.id}
                                pkg={pkg}
                                isCurrentPlan={currentSub?.packageId === pkg.id}
                                isProcessing={processingPackage === pkg.id}
                                onSelect={() => handleSelectPackage(pkg)}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <p className="text-slate-600 mb-4">
                        Not sure which package is right for you?
                    </p>
                    <Button variant="outline" onClick={() => navigate('/contact')}>
                        Talk to Our Team
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Package Card Component
const PackageCard: React.FC<{
    pkg: Package;
    isCurrentPlan: boolean;
    isProcessing: boolean;
    onSelect: () => void;
}> = ({ pkg, isCurrentPlan, isProcessing, onSelect }) => {
    const gradientClass = PACKAGE_COLORS[pkg.slug] || 'from-slate-500 to-slate-600';
    const icon = PACKAGE_ICONS[pkg.slug] || <Zap className="w-6 h-6" />;

    return (
        <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl hover:-translate-y-1 ${isCurrentPlan ? 'border-brand-green ring-2 ring-brand-green/20' : 'border-slate-100'}`}>
            {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-green text-white text-xs font-bold rounded-full">
                    Current Plan
                </div>
            )}

            <div className={`p-6 bg-gradient-to-br ${gradientClass} rounded-t-xl text-white`}>
                <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                        {pkg.billingPeriod === 'monthly' ? 'Monthly' : 'Once-off'}
                    </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                <div className="text-3xl font-bold">
                    {subscriptionService.formatPrice(pkg.priceCents)}
                    {pkg.billingPeriod === 'monthly' && <span className="text-sm font-normal opacity-80">/mo</span>}
                </div>
            </div>

            <div className="p-6">
                <p className="text-slate-600 text-sm mb-4">{pkg.description}</p>

                <ul className="space-y-2 mb-6">
                    {pkg.maxListings > 0 && (
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-brand-green" />
                            <span>Up to <strong>{pkg.maxListings}</strong> listings</span>
                        </li>
                    )}
                    {pkg.topAgents > 0 && (
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-brand-green" />
                            <span><strong>{pkg.topAgents}</strong> Top Area Agent{pkg.topAgents > 1 ? 's' : ''}</span>
                        </li>
                    )}
                    {pkg.featuredListings > 0 && (
                        <li className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-brand-green" />
                            <span><strong>{pkg.featuredListings}</strong> Featured Listing{pkg.featuredListings > 1 ? 's' : ''}</span>
                        </li>
                    )}
                </ul>

                <Button
                    variant={isCurrentPlan ? "outline" : "brand"}
                    className="w-full"
                    disabled={isCurrentPlan || isProcessing}
                    onClick={onSelect}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : isCurrentPlan ? (
                        'Current Plan'
                    ) : (
                        <>
                            Get Started
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
