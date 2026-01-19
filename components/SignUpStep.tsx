/**
 * SignUpStep Component
 * 
 * Account creation step that appears after completing registration forms.
 * Creates account in the backend auth system, then triggers registration completion.
 */

"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { Button } from './ui/button';
import {
    CheckCircle, Mail, Lock, User, ArrowRight, Loader2,
    AlertCircle, Eye, EyeOff, ArrowLeft
} from 'lucide-react';

interface SignUpStepProps {
    role: UserRole;
    registrationData: Record<string, unknown>;
    onSuccess: () => Promise<void> | void;
    onBack: () => void;
}

export const SignUpStep: React.FC<SignUpStepProps> = ({
    role,
    registrationData,
    onSuccess,
    onBack,
}) => {
    const { signUp } = useAuth();

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pre-fill from registration data
    useEffect(() => {
        const regEmail = registrationData.email as string;
        if (regEmail && !email) {
            setEmail(regEmail);
        }

        const name = registrationData.name as string;
        if (name && !firstName && !lastName) {
            const parts = name.trim().split(/\s+/);
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
        }
    }, [registrationData]);

    const getRoleLabel = (): string => {
        switch (role) {
            case 'AGENT': return 'Real Estate Agent';
            case 'AGENCY': return 'Real Estate Agency';
            case 'CONTRACTOR': return 'Service Contractor';
            default: return 'User';
        }
    };

    const validateForm = (): boolean => {
        // Clear previous errors
        setError(null);

        // Check required fields
        if (!firstName.trim()) {
            setError('Please enter your first name');
            return false;
        }
        if (!lastName.trim()) {
            setError('Please enter your last name');
            return false;
        }
        if (!email.trim()) {
            setError('Please enter your email address');
            return false;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError('Please enter a valid email address');
            return false;
        }

        // Password validation
        if (!password) {
            setError('Please enter a password');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            setError('Password must contain both letters and numbers');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // Create the account
            await signUp({
                email: email.trim().toLowerCase(),
                password,
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                role,
                phone: registrationData.phone as string,
                imageUrl: registrationData.image as string,
            });

            // Call the success handler to save role-specific data
            await onSuccess();
        } catch (err: any) {
            console.error('Signup failed:', err);

            // Handle specific error messages
            if (err.message?.includes('already exists')) {
                setError('An account with this email already exists. Please sign in instead.');
            } else {
                setError(err.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Your Account</h3>
                <p className="text-slate-500">
                    Final step! Set up your login credentials
                </p>
            </div>

            {/* Role Badge */}
            <div className="flex justify-center">
                <span className="inline-flex items-center px-4 py-2 bg-brand-green/10 text-brand-green rounded-full text-sm font-bold">
                    <CheckCircle size={16} className="mr-2" />
                    Registering as {getRoleLabel()}
                </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                            <User size={14} /> First Name *
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => { setFirstName(e.target.value); setError(null); }}
                            placeholder="John"
                            className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                            autoComplete="given-name"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                            Last Name *
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => { setLastName(e.target.value); setError(null); }}
                            placeholder="Smith"
                            className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                            autoComplete="family-name"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                        <Mail size={14} /> Email Address *
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(null); }}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                        autoComplete="email"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                        <Lock size={14} /> Password *
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(null); }}
                            placeholder="Min. 8 characters with letters and numbers"
                            className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Must be at least 8 characters with letters and numbers
                    </p>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                        Confirm Password *
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                            placeholder="Re-enter your password"
                            className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {/* Password match indicator */}
                    {confirmPassword && (
                        <p className={`text-xs mt-1 flex items-center gap-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                            {password === confirmPassword ? (
                                <>
                                    <CheckCircle size={12} /> Passwords match
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={12} /> Passwords don't match
                                </>
                            )}
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-start gap-2 animate-in fade-in duration-200">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="brand"
                        disabled={isSubmitting}
                        className="flex-1"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="mr-2 animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            <>
                                Create Account
                                <ArrowRight size={18} className="ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </form>

            {/* Terms */}
            <p className="text-xs text-center text-slate-400 pt-2">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="underline hover:text-slate-600">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>
            </p>
        </div>
    );
};
