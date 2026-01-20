"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/button';
import { Home, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, getDashboardUrl, isSignedIn, isLoaded } = useAuth();
    const { showToast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Redirect if already signed in
    useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate(getDashboardUrl(), { replace: true });
        }
    }, [isLoaded, isSignedIn, navigate, getDashboardUrl]);

    const validateForm = (): boolean => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return false;
        }
        if (!email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!password) {
            setError('Please enter your password');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await signIn(email.trim().toLowerCase(), password);
            showToast("Successfully signed in", "success");
            // Navigation will happen via the useEffect above
        } catch (err: any) {
            console.error("Login failed:", err);
            const msg = err.message || 'Invalid email or password. Please try again.';
            setError(msg);
            showToast(msg, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show loading state while checking auth
    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-brand-purpleLight flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-purpleLight flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8 group">
                <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Home className="text-white" size={24} />
                </div>
                <span className="font-serif text-2xl font-bold text-brand-green tracking-tight">
                    Show House Property
                </span>
            </Link>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                        <p className="text-slate-500">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(null);
                                }}
                                placeholder="you@example.com"
                                className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                                autoComplete="email"
                                autoFocus
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Lock size={14} /> Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-brand-green hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(null);
                                    }}
                                    placeholder="••••••••"
                                    className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all outline-none"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-start gap-2 animate-in fade-in duration-200">
                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="brand"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="mr-2 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Register Link */}
                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/join" className="text-brand-green font-bold hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-xs text-slate-400">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="underline hover:text-slate-600">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>
            </p>
        </div>
    );
};
