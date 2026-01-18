"use client";

import React, { useState, useEffect } from 'react';
import {
    User, Upload, CheckCircle, ArrowRight,
    MapPin, Smartphone, Mail, Award, Camera,
    Briefcase
} from 'lucide-react';
import { Card, Input } from './admin/Shared';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { SignUpStep } from './SignUpStep';
import { useUser } from '../contexts/AuthContext';

interface AgentRegistrationProps {
    onSubmit: (agent: any) => Promise<void>;
    onCancel?: () => void;
    onDashboardRedirect?: () => void;
}

export const AgentRegistration: React.FC<AgentRegistrationProps> = ({
    onSubmit,
    onCancel,
    onDashboardRedirect
}) => {
    const { isSignedIn } = useUser();
    const [step, setStep] = useState(1);

    useEffect(() => {
        const autoSubmit = async () => {
            if (step === 4 && isSignedIn) {
                try {
                    await onSubmit(formData);
                    setStep(5);
                } catch (e) {
                    console.error("Auto submit failed", e);
                }
            }
        };
        autoSubmit();
    }, [step, isSignedIn]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        ppraNumber: '',
        agency: '',
        phone: '',
        email: '',
        bio: '',
        image: '',
        areas: '',
        experience: ''
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateField('image', reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prevent skipping steps via Enter
        if (step === 1) {
            if (isStep1Valid()) setStep(2);
            return;
        }
        if (step === 2) {
            if (isStep2Valid()) setStep(3);
            return;
        }
        if (step === 3 && !isStep3Valid()) {
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStep(4);
        setIsSubmitting(false);
    };

    const isStep1Valid = () => !!formData.name && !!formData.email && !!formData.phone;
    const isStep2Valid = () => !!formData.title && !!formData.agency && !!formData.ppraNumber;
    const isStep3Valid = () => !!formData.areas && !!formData.bio;

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
                {[1, 2, 3, 4].map(num => (
                    <React.Fragment key={num}>
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all text-sm",
                            step >= num ? "bg-brand-green text-white shadow-lg" : "bg-slate-200 text-slate-400"
                        )}>
                            {step > num ? <CheckCircle size={18} /> : num}
                        </div>
                        {num < 4 && <div className={cn("w-8 h-1 transition-all", step > num ? "bg-brand-green" : "bg-slate-200")} />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Personal Profile</h3>
                <p className="text-slate-500">Create your agent identity</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="relative">
                    {formData.image ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-green shadow-lg">
                            <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-purple/10 to-brand-green/10 flex items-center justify-center border-4 border-dashed border-slate-300">
                            <User size={40} className="text-slate-400" />
                        </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-brand-green text-white p-3 rounded-full cursor-pointer hover:bg-green-700 transition-colors shadow-lg">
                        <Upload size={18} />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <User size={14} /> Full Name *
                </label>
                <Input value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Sarah Smit" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Smartphone size={14} /> Mobile *</label>
                    <Input value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+27 82 555 1234" required />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Mail size={14} /> Email *</label>
                    <Input value={formData.email} onChange={e => updateField('email', e.target.value)} type="email" placeholder="sarah@agency.co.za" required />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Professional Details</h3>
                <p className="text-slate-500">Your accreditations and experience</p>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Award size={14} /> Job Title *</label>
                <Input value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="e.g. Senior Partner / Intern Agent" required />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Briefcase size={14} /> Agency *</label>
                <Input value={formData.agency} onChange={e => updateField('agency', e.target.value)} placeholder="Enter your agency name" required />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Award size={14} /> FFC / PPRA Number *</label>
                <Input value={formData.ppraNumber} onChange={e => updateField('ppraNumber', e.target.value)} placeholder="2024123456" required />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Portfolio & Bio</h3>
                <p className="text-slate-500">Sell yourself to potential clients</p>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><MapPin size={14} /> Operational Areas *</label>
                <Input value={formData.areas} onChange={e => updateField('areas', e.target.value)} placeholder="e.g. Sea Point, Green Point, Camps Bay" required />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block"><User size={14} className="inline mr-2" /> Personal Bio *</label>
                <textarea
                    className="w-full rounded-lg border-2 border-slate-200 p-4 text-sm focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none min-h-[120px]"
                    value={formData.bio}
                    onChange={e => updateField('bio', e.target.value)}
                    placeholder="Describe your experience and approach..."
                />
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Profile Preview</h4>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                        {formData.image && <img src={formData.image} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{formData.name}</p>
                        <p className="text-xs text-slate-500">{formData.title} at {formData.agency}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300 py-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-brand-green" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">Registration Complete!</h3>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
                Welcome to the network, <span className="font-bold text-slate-900">{formData.name}</span>.
                Your profile has been submitted for verification.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left max-w-sm mx-auto mt-8">
                <p className="text-sm font-bold text-slate-900 mb-2">Next Steps:</p>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                    <li>FFC Number verification</li>
                    <li>Profile photos approval</li>
                    <li>Access to Lead Management tools</li>
                </ul>
            </div>

            <div className="pt-8">
                <Button
                    onClick={onDashboardRedirect || (() => window.location.reload())}
                    variant="brand"
                    className="w-full py-6 text-lg shadow-xl"
                >
                    Go to Portal <ArrowRight className="ml-2" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    {step < 5 && step !== 4 && (
                        <>
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-green to-teal-600 rounded-2xl mb-4 shadow-lg">
                                <User size={32} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-3">Agent Registration</h1>
                            <p className="text-lg text-slate-600">Build your personal brand with us</p>
                        </>
                    )}
                </div>

                <Card className="p-8 md:p-12 shadow-xl">
                    {step < 5 && renderStepIndicator()}
                    <form onSubmit={handleSubmit}>
                        {step === 1 && renderStep1()}
                        {step === 2 && renderStep2()}
                        {step === 3 && renderStep3()}
                        {step === 4 && (
                            isSignedIn ? (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-bold mb-4">Submitting Application...</h3>
                                    <p className="text-slate-500">Please wait while we process your registration.</p>
                                </div>
                            ) : (
                                <SignUpStep
                                    role="AGENT"
                                    registrationData={{
                                        name: formData.name,
                                        title: formData.title,
                                        ppraNumber: formData.ppraNumber,
                                        agency: formData.agency,
                                        phone: formData.phone,
                                        email: formData.email,
                                        bio: formData.bio,
                                        areas: formData.areas,
                                        experience: formData.experience,
                                        image: formData.image,
                                    }}
                                    onSuccess={async () => {
                                        try {
                                            await onSubmit(formData);
                                        } catch (error) {
                                            console.error('Failed to save agent data:', error);
                                        }
                                        setStep(5);
                                    }}
                                    onBack={() => setStep(3)}
                                />
                            )
                        )}
                        {step === 5 && renderStep4()}

                        {step < 4 && (
                            <div className="flex gap-4 mt-8 pt-8 border-t border-slate-100">
                                {step > 1 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>}
                                {step < 3 ? (
                                    <Button type="button" variant="brand" onClick={() => setStep(step + 1)} disabled={step === 1 ? !isStep1Valid() : !isStep2Valid()} className="flex-1">Continue <ArrowRight size={16} className="ml-2" /></Button>
                                ) : (
                                    <Button type="button" variant="brand" onClick={() => setStep(4)} disabled={!isStep3Valid()} className="flex-1">
                                        {isSignedIn ? 'Submit Application' : 'Continue to Account Setup'} <ArrowRight size={16} className="ml-2" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </form>
                </Card>
                {onCancel && step < 5 && step !== 4 && <button onClick={onCancel} className="w-full mt-8 text-slate-400 hover:text-slate-600 font-medium text-sm">Cancel Registration</button>}
            </div>
        </div>
    );
};
