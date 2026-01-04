import React from 'react';
import { ShieldCheck, Clock } from 'lucide-react';

export const PendingApproval: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-brand-purple p-6 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Clock size={40} className="text-brand-green" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Verification Pending</h2>
                    <p className="text-white/80">Your application is under review</p>
                </div>

                <div className="p-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                            <ShieldCheck size={18} />
                            What happens next?
                        </h4>
                        <p className="text-sm text-blue-800">
                            Our admin team will review your submitted credentials and documentation.
                            Once verified, you will receive full access to the platform dashboard.
                        </p>
                    </div>

                    <div className="space-y-4 text-sm text-slate-600">
                        <p className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">1</span>
                            <span>We check all certifications and licenses for validity.</span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">2</span>
                            <span>Background checks are performed for safety compliance.</span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-500">3</span>
                            <span>You receive an email notification upon approval.</span>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            className="text-slate-400 font-bold hover:text-brand-green text-sm transition-colors"
                            onClick={() => window.location.reload()}
                        >
                            Check Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
