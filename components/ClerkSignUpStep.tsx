/**
 * ClerkSignUpStep Component
 * 
 * Integration step that appears AFTER the user completes their registration form.
 * Creates a Clerk account and stores the role + registration data in metadata.
 * 
 * Flow: Form Data → This Component → Clerk SignUp → Role saved → Success
 */

"use client";

import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { UserRole } from '../types';
import { Card } from './admin/Shared';
import { Button } from './ui/button';
import { CheckCircle, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { userService } from '../services/userService';

interface ClerkSignUpStepProps {
    role: UserRole;
    registrationData: Record<string, unknown>;
    onSuccess: () => void;
    onBack: () => void;
}

export const ClerkSignUpStep: React.FC<ClerkSignUpStepProps> = ({
    role,
    registrationData,
    onSuccess,
    onBack,
}) => {
    const { isLoaded, signUp, setActive } = useSignUp();

    const [email, setEmail] = useState((registrationData.email as string) || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingVerification, setPendingVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    // Extract name from registration data if available
    React.useEffect(() => {
        const name = registrationData.name as string;
        if (name && !firstName && !lastName) {
            const parts = name.split(' ');
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
        }
    }, [registrationData.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!isLoaded || !signUp) {
            setError('Authentication service not ready');
            return;
        }

        setIsSubmitting(true);

        try {
            // Create the user with role in unsafeMetadata
            await signUp.create({
                emailAddress: email,
                password,
                firstName,
                lastName,
                unsafeMetadata: {
                    role,
                    registrationData,
                    registeredAt: new Date().toISOString(),
                },
            });

            // Send email verification
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> };
            setError(clerkError.errors?.[0]?.message || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isLoaded || !signUp) return;

        setIsSubmitting(true);

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            if (result.status === 'complete') {
                // Set the session as active
                await setActive({ session: result.createdSessionId });

                // Sync user to backend
                try {
                    await userService.syncFromClerk({
                        clerkId: result.createdUserId || '',
                        email: email,
                        role: role as 'AGENT' | 'AGENCY' | 'CONTRACTOR',
                        firstName: firstName || undefined,
                        lastName: lastName || undefined,
                        phone: (registrationData.phone as string) || undefined,
                        imageUrl: (registrationData.image as string) || undefined,
                    });
                    console.log('User synced to backend successfully');
                } catch (syncError) {
                    // Log but don't block - user is created in Clerk, backend sync can be retried
                    console.warn('Backend sync failed (non-blocking):', syncError);
                }

                onSuccess();
            } else {
                setError('Verification incomplete. Please try again.');
            }
        } catch (err: unknown) {
            const clerkError = err as { errors?: Array<{ message: string }> };
            setError(clerkError.errors?.[0]?.message || 'Verification failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleLabel = () => {
        switch (role) {
            case 'AGENT': return 'Agent';
            case 'AGENCY': return 'Agency';
            case 'CONTRACTOR': return 'Contractor';
            default: return 'User';
        }
    };

    if (pendingVerification) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} className="text-brand-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Verify Your Email</h3>
                    <p className="text-slate-500">
                        We've sent a verification code to <span className="font-bold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleVerification} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                            maxLength={6}
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        variant="brand"
                        disabled={isSubmitting || verificationCode.length < 6}
                        className="w-full py-4"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="mr-2 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify & Complete Registration
                                <CheckCircle size={18} className="ml-2" />
                            </>
                        )}
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Your Account</h3>
                <p className="text-slate-500">
                    Complete your {getRoleLabel()} registration by creating a secure account
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
                            <User size={14} /> First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Smith"
                            className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                        <Mail size={14} /> Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                        <Lock size={14} /> Password
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                        required
                        minLength={8}
                    />
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                        required
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1"
                    >
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

            <p className="text-xs text-center text-slate-400">
                By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
        </div>
    );
};
