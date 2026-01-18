"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Home, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, getDashboardUrl } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await signIn(email, password);
            navigate(getDashboardUrl());
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-purpleLight flex flex-col items-center justify-center p-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-purple rounded-lg flex items-center justify-center shadow-md">
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

                    <form onSubmit={handleSubmit} className="space-y-4">
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

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Lock size={14} /> Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-brand-green hover:underline font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white px-4 text-sm font-medium focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm flex items-start gap-2">
                                <AlertCircle size={16} className="mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="brand"
                            disabled={isSubmitting}
                            className="w-full h-12 text-base"
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

                <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/join" className="text-brand-green font-bold hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
