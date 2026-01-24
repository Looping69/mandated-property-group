"use client";

import React, { useState, useEffect } from 'react';
import {
    Building, Upload, CheckCircle, ArrowRight,
    MapPin, Globe, FileText, Smartphone, Mail, Award, Camera,
    Users
} from 'lucide-react';
import { Card, Input } from './admin/Shared';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { SignUpStep } from './SignUpStep';
import { useUser } from '../contexts/AuthContext';

interface AgencyRegistrationProps {
    onSubmit: (agency: any, user?: any) => Promise<void>;
    onCancel?: () => void;
    onDashboardRedirect?: () => void;
}

export const AgencyRegistration: React.FC<AgencyRegistrationProps> = ({
    onSubmit,
    onCancel,
    onDashboardRedirect
}) => {
    const { isSignedIn, user } = useUser();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        registrationNumber: '',
        principalName: '',
        officeAddress: '',
        website: '',
        phone: '',
        email: '',
        description: '',
        logo: '',
        serviceAreas: '',
        teamSize: '',
        franchise: false
    });

    const [wasSignedInOnMount] = useState(isSignedIn);
    const hasAutoSubmitted = React.useRef(false);

    useEffect(() => {
        const autoSubmit = async () => {
            if (step === 4 && isSignedIn && !hasAutoSubmitted.current) {
                // If they were already signed in, we auto-submit
                // If they just signed up, the SignUpStep's onSuccess handles it
                if (wasSignedInOnMount) {
                    hasAutoSubmitted.current = true;
                    try {
                        await onSubmit(formData, user);
                        setStep(5);
                    } catch (e) {
                        console.error("Auto submit failed", e);
                    }
                }
            }
        };
        autoSubmit();
    }, [step, isSignedIn, wasSignedInOnMount, onSubmit, formData]);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            updateField('logo', reader.result as string);
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
    const isStep2Valid = () => !!formData.officeAddress && !!formData.description;
    const isStep3Valid = () => !!formData.registrationNumber && !!formData.teamSize;

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
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Agency Details</h3>
                <p className="text-slate-500">Establish your agency profile</p>
            </div>

            <div className="flex justify-center mb-6">
                <div className="relative">
                    {formData.logo ? (
                        <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-brand-green shadow-lg">
                            <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-brand-purple/10 to-brand-green/10 flex items-center justify-center border-4 border-dashed border-slate-300">
                            <Building size={40} className="text-slate-400" />
                        </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 bg-brand-green text-white p-3 rounded-full cursor-pointer hover:bg-brand-green/90 transition-colors shadow-lg">
                        <Upload size={18} />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <Building size={14} /> Agency Name *
                </label>
                <Input value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="e.g. Pam Golding Properties" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Smartphone size={14} /> Phone *</label>
                    <Input value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder="+27 21 555 1234" required />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Mail size={14} /> Email *</label>
                    <Input value={formData.email} onChange={e => updateField('email', e.target.value)} type="email" placeholder="agency@example.com" required />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Location & Info</h3>
                <p className="text-slate-500">Where does your agency operate?</p>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><MapPin size={14} /> Office Address *</label>
                <Input value={formData.officeAddress} onChange={e => updateField('officeAddress', e.target.value)} placeholder="123 Main Rd, Sea Point, Cape Town" required />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Globe size={14} /> Website</label>
                <Input value={formData.website} onChange={e => updateField('website', e.target.value)} placeholder="https://www.youragency.co.za" />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><FileText size={14} /> Agency Bio *</label>
                <textarea
                    className="w-full rounded-lg border-2 border-slate-200 p-4 text-sm focus:ring-2 focus:ring-brand-green/50 focus:border-brand-green outline-none min-h-[120px]"
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                    placeholder="Tell us about your agency's history and mission..."
                    required
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Final Details</h3>
                <p className="text-slate-500">Almost there!</p>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Award size={14} /> Registration No (PPRA) *</label>
                <Input value={formData.registrationNumber} onChange={e => updateField('registrationNumber', e.target.value)} placeholder="Certificate Number" required />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2"><Users size={14} /> Team Size *</label>
                <select
                    className="w-full rounded-lg border-2 border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-green outline-none"
                    value={formData.teamSize}
                    onChange={e => updateField('teamSize', e.target.value)}
                >
                    <option value="">Select size...</option>
                    <option value="1-5">1-5 Agents</option>
                    <option value="6-20">6-20 Agents</option>
                    <option value="21-50">21-50 Agents</option>
                    <option value="50+">50+ Agents</option>
                </select>
            </div>

            <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-4">Summary</h4>
                <p className="text-sm text-slate-600 mb-2"><span className="font-bold">Agency:</span> {formData.name}</p>
                <p className="text-sm text-slate-600 mb-2"><span className="font-bold">Email:</span> {formData.email}</p>
                <p className="text-sm text-slate-600"><span className="font-bold">Location:</span> {formData.officeAddress}</p>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300 py-8">
            <div className="w-24 h-24 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-brand-green" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
                Thank you for joining our network, <span className="font-bold text-slate-900">{formData.name}</span>.
                Our team will review your agency's professional profile.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left max-w-sm mx-auto mt-8">
                <p className="text-sm font-bold text-slate-900 mb-2">Next Steps:</p>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                    <li>PPRA Certificate verification</li>
                    <li>Office location validation</li>
                    <li>Welcome pack delivery</li>
                </ul>
            </div>

            <div className="pt-8">
                <Button
                    onClick={onDashboardRedirect || (() => window.location.reload())}
                    variant="brand"
                    className="w-full py-6 text-lg shadow-xl"
                >
                    Return to Portal <ArrowRight className="ml-2" />
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
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-purple to-indigo-600 rounded-2xl mb-4 shadow-lg">
                                <Building size={32} className="text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-3">Register Agency</h1>
                            <p className="text-lg text-slate-600">Join South Africa's leading property network</p>
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
                                    role="AGENCY"
                                    registrationData={{
                                        name: formData.name,
                                        registrationNumber: formData.registrationNumber,
                                        principalName: formData.principalName,
                                        officeAddress: formData.officeAddress,
                                        website: formData.website,
                                        phone: formData.phone,
                                        email: formData.email,
                                        description: formData.description,
                                        logo: formData.logo,
                                        serviceAreas: formData.serviceAreas,
                                        teamSize: formData.teamSize,
                                        franchise: formData.franchise,
                                    }}
                                    onSuccess={async (newUser) => {
                                        try {
                                            await onSubmit(formData, newUser);
                                        } catch (error) {
                                            console.error('Failed to save agency data:', error);
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
