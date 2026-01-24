"use client";

import React, { useState } from 'react';
import {
    Wrench, Upload, CheckCircle, ArrowRight, Phone, Mail,
    MapPin, DollarSign, FileText, Award, Star, Briefcase,
    Camera, Building, Loader2
} from 'lucide-react';
import { Card, Input } from './admin/Shared';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { SignUpStep } from './SignUpStep';
import { useUser } from '../contexts/AuthContext';

interface ContractorRegistrationProps {
    onSubmit: (contractor: any, user?: any) => Promise<void>;
    onCancel?: () => void;
    onDashboardRedirect: () => void;
}

const TRADE_CATEGORIES = [
    'Plumbing', 'Electrical', 'General Building', 'Painting',
    'Roofing', 'HVAC', 'Carpentry', 'Landscaping',
    'Pool Maintenance', 'Security Systems', 'Interior Design',
    'Pest Control', 'Other'
];

const LOCATIONS = [
    'Cape Town', 'Johannesburg', 'Durban', 'Pretoria',
    'Port Elizabeth', 'Bloemfontein', 'East London',
    'Nelspruit', 'Polokwane', 'Kimberley'
];

type Step = 1 | 2 | 3 | 4 | 5;

export const ContractorRegistration: React.FC<ContractorRegistrationProps> = ({
    onSubmit,
    onCancel,
    onDashboardRedirect
}) => {
    const { isSignedIn, user } = useUser();
    const [step, setStep] = useState<Step>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        trade: '',
        customTrade: '',
        location: '',
        phone: '',
        email: '',
        hourlyRate: '',
        description: '',
        yearsExperience: '',
        certifications: '',
        image: '',
        emergencyService: false,
        insurance: false,
        license: false
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

    const isStep1Valid = () => formData.name && formData.trade && formData.location && formData.phone && formData.email;
    const isStep2Valid = () => formData.hourlyRate && formData.description;
    const isStep3Valid = () => formData.insurance && formData.license;

    const handleNextStep = () => {
        if (step === 1 && isStep1Valid()) setStep(2);
        else if (step === 2 && isStep2Valid()) setStep(3);
        else if (step === 3 && isStep3Valid()) {
            setStep(4);
            if (isSignedIn && user) {
                handleSignUpSuccess(user);
            }
        }
    };

    const handleBack = () => {
        if (step > 1 && step < 5) setStep((step - 1) as Step);
    };

    const getContractorData = () => ({
        name: formData.name,
        trade: formData.trade === 'Other' ? formData.customTrade : formData.trade,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
        hourlyRate: Number(formData.hourlyRate),
        description: formData.description,
        image: formData.image || 'https://images.unsplash.com/photo-1504253163759-c23fccaebb55?w=400',
        rating: 4.0,
        isVerified: false
    });

    const handleSignUpSuccess = async (newUser: any) => {
        setIsSubmitting(true);
        try {
            await onSubmit(getContractorData(), newUser);
            setStep(5);
        } catch (error) {
            console.error('Failed to save contractor data:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

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
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Basic Information</h3>
                <p className="text-slate-500">Let's start with your business details</p>
            </div>

            {/* Image Upload */}
            <div className="flex justify-center mb-6">
                <div className="relative">
                    {formData.image ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-green shadow-lg">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-brand-purple/10 to-brand-green/10 flex items-center justify-center border-4 border-dashed border-slate-300">
                            <Camera size={40} className="text-slate-400" />
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
                    <Building size={14} /> Business Name *
                </label>
                <Input placeholder="e.g. BuildRight Construction" value={formData.name} onChange={e => updateField('name', e.target.value)} />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <Wrench size={14} /> Trade/Service *
                </label>
                <select
                    value={formData.trade}
                    onChange={e => updateField('trade', e.target.value)}
                    className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:border-transparent transition-all"
                >
                    <option value="">Select your trade</option>
                    {TRADE_CATEGORIES.map(trade => (
                        <option key={trade} value={trade}>{trade}</option>
                    ))}
                </select>
            </div>

            {formData.trade === 'Other' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <Input placeholder="Please specify your trade" value={formData.customTrade} onChange={e => updateField('customTrade', e.target.value)} />
                </div>
            )}

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <MapPin size={14} /> Service Area *
                </label>
                <select
                    value={formData.location}
                    onChange={e => updateField('location', e.target.value)}
                    className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:border-transparent transition-all"
                >
                    <option value="">Select your location</option>
                    {LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                        <Phone size={14} /> Phone *
                    </label>
                    <Input type="tel" placeholder="+27 XX XXX XXXX" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                        <Mail size={14} /> Email *
                    </label>
                    <Input type="email" placeholder="your@email.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Service Details</h3>
                <p className="text-slate-500">Tell us about your services and rates</p>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <DollarSign size={14} /> Hourly Rate (ZAR) *
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R</span>
                    <Input type="number" placeholder="650" value={formData.hourlyRate} onChange={e => updateField('hourlyRate', e.target.value)} className="pl-10" />
                </div>
                <p className="text-xs text-slate-400 mt-1">Average rates: Budget (R300-500), Mid (R500-800), Premium (R800+)</p>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <Award size={14} /> Years of Experience
                </label>
                <Input type="number" placeholder="e.g. 5" value={formData.yearsExperience} onChange={e => updateField('yearsExperience', e.target.value)} />
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <FileText size={14} /> Service Description *
                </label>
                <textarea
                    className="w-full rounded-lg border-2 border-slate-200 p-4 text-sm focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none min-h-[120px] transition-all"
                    placeholder="Describe your services, specialties, and what sets you apart..."
                    value={formData.description}
                    onChange={e => updateField('description', e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">{formData.description.length}/500 characters</p>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                    <Award size={14} /> Certifications & Licenses
                </label>
                <Input placeholder="e.g. Licensed Electrician, PIRB Registered" value={formData.certifications} onChange={e => updateField('certifications', e.target.value)} />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Additional Information</h3>
                <p className="text-slate-500">Help us understand your service offerings</p>
            </div>

            <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border-2 border-transparent has-[:checked]:border-brand-green has-[:checked]:bg-brand-green/5">
                    <input type="checkbox" checked={formData.emergencyService} onChange={e => updateField('emergencyService', e.target.checked)} className="w-5 h-5 rounded text-brand-green focus:ring-brand-green" />
                    <div>
                        <p className="font-bold text-slate-900">24/7 Emergency Service</p>
                        <p className="text-xs text-slate-500">I offer round-the-clock emergency services</p>
                    </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border-2 border-transparent has-[:checked]:border-brand-green has-[:checked]:bg-brand-green/5">
                    <input type="checkbox" checked={formData.insurance} onChange={e => updateField('insurance', e.target.checked)} className="w-5 h-5 rounded text-brand-green focus:ring-brand-green" />
                    <div>
                        <p className="font-bold text-slate-900">Liability Insurance *</p>
                        <p className="text-xs text-slate-500">I carry professional liability insurance</p>
                    </div>
                </label>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors border-2 border-transparent has-[:checked]:border-brand-green has-[:checked]:bg-brand-green/5">
                    <input type="checkbox" checked={formData.license} onChange={e => updateField('license', e.target.checked)} className="w-5 h-5 rounded text-brand-green focus:ring-brand-green" />
                    <div>
                        <p className="font-bold text-slate-900">Licensed & Registered *</p>
                        <p className="text-xs text-slate-500">I am licensed with relevant authorities</p>
                    </div>
                </label>
            </div>

            {/* Summary Preview */}
            <div className="mt-8 p-6 bg-gradient-to-br from-brand-purple/5 to-brand-green/5 rounded-xl border border-brand-green/20">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Star className="text-brand-green" size={18} />
                    Registration Summary
                </h4>
                <div className="space-y-2 text-sm">
                    <p><span className="font-bold text-slate-700">Business:</span> {formData.name}</p>
                    <p><span className="font-bold text-slate-700">Trade:</span> {formData.trade === 'Other' ? formData.customTrade : formData.trade}</p>
                    <p><span className="font-bold text-slate-700">Location:</span> {formData.location}</p>
                    <p><span className="font-bold text-slate-700">Rate:</span> R{formData.hourlyRate}/hour</p>
                    <p><span className="font-bold text-slate-700">Contact:</span> {formData.email}</p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <span className="font-bold">📋 Note:</span> Your registration will be reviewed by our team.
                    Once approved, you'll receive a verification email and your profile will be live on the platform.
                </p>
            </div>
        </div>
    );

    const renderStep5Success = () => (
        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-300 py-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-brand-green" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900">Registration Successful!</h3>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
                Welcome to the network, <span className="font-bold text-slate-900">{formData.name}</span>.
                Your profile has been created and is now visible on the dashboard.
            </p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left max-w-sm mx-auto mt-8">
                <p className="text-sm font-bold text-slate-900 mb-2">Next Steps:</p>
                <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                    <li>Complete your verification profile</li>
                    <li>Upload portfolio images</li>
                    <li>Set your availability schedule</li>
                </ul>
            </div>

            <div className="pt-8">
                <Button onClick={onDashboardRedirect} variant="brand" className="w-full py-6 text-lg shadow-xl">
                    Go to Dashboard <ArrowRight className="ml-2" />
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                {step < 4 && (
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-green to-emerald-600 rounded-2xl mb-4 shadow-lg">
                            <Wrench size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-3">Join Our Network</h1>
                        <p className="text-lg text-slate-600">Register as a Maintenance Service Provider</p>
                    </div>
                )}

                <Card className="p-8 md:p-12 shadow-xl">
                    {step < 5 && step !== 4 && renderStepIndicator()}

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && (
                        isSignedIn ? (
                            <div className="text-center py-12">
                                <Loader2 size={40} className="mx-auto mb-4 text-brand-green animate-spin" />
                                <h3 className="text-xl font-bold mb-4">Processing Registration...</h3>
                                <p className="text-slate-500">Linking your profile to your professional account.</p>
                            </div>
                        ) : (
                            <SignUpStep
                                role="CONTRACTOR"
                                registrationData={{
                                    name: formData.name,
                                    phone: formData.phone,
                                    email: formData.email,
                                    image: formData.image,
                                }}
                                onSuccess={handleSignUpSuccess}
                                onBack={() => setStep(3)}
                            />
                        )
                    )}
                    {step === 5 && renderStep5Success()}

                    {/* Navigation Buttons */}
                    {step < 4 && (
                        <div className="flex gap-4 mt-8 pt-8 border-t border-slate-100">
                            {step > 1 && (
                                <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                                    Back
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="brand"
                                onClick={handleNextStep}
                                disabled={
                                    (step === 1 && !isStep1Valid()) ||
                                    (step === 2 && !isStep2Valid()) ||
                                    (step === 3 && !isStep3Valid())
                                }
                                className="flex-1"
                            >
                                {step === 3 ? 'Continue to Account Setup' : 'Continue'}
                                <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    )}
                </Card>

                {onCancel && step < 4 && (
                    <button onClick={onCancel} className="w-full mt-8 text-slate-400 hover:text-slate-600 font-medium text-sm">
                        Cancel Registration
                    </button>
                )}

                {/* Trust Indicators */}
                {step < 4 && (
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-2xl font-bold text-brand-green">500+</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Active Providers</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-2xl font-bold text-brand-green">4.8★</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Avg Rating</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-2xl font-bold text-brand-green">24/7</p>
                            <p className="text-xs text-slate-500 font-bold uppercase">Platform Access</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
