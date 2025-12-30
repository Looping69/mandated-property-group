import React from 'react';
import { Card } from './admin/Shared';
import { FileText, CheckCircle, AlertTriangle, Users, Scale, CreditCard } from 'lucide-react';

export const TermsOfService: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <FileText className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h1 className="text-4xl font-serif text-slate-900 mb-4">Terms of Service</h1>
                <p className="text-lg text-slate-600">Effective Date: {new Date().toLocaleDateString()}</p>
            </div>

            <Card className="p-8 md:p-12 shadow-lg space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-brand-green/10 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-brand-green" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        By accessing or using the Mandated Property Group platform ("Service"), you agree to be bound by these Terms of Service.
                        If you disagree with any part of the terms, you may not access the Service.
                    </p>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">2. User Accounts</h2>
                    </div>
                    <p className="text-slate-600 mb-4">
                        When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                        <li>You agree not to disclose your password to any third party.</li>
                        <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <CreditCard className="w-6 h-6 text-brand-purple" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">3. Listings and Services</h2>
                    </div>
                    <p className="text-slate-600 mb-4">
                        Agents and Contractors adhere to specific codes of conduct:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li><strong>Property Listings:</strong> Must be accurate, not misleading, and the lister must have the mandate to sell/rent the property.</li>
                        <li><strong>Maintenance Services:</strong> Contractors must be qualified and insured. We conduct verification but do not guarantee workmanship.</li>
                        <li><strong>Pricing:</strong> All prices listed for properties or services must be inclusive of VAT where applicable unless stated otherwise.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">4. Limitation of Liability</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        In no event shall Mandated Property Group, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Scale className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">5. Governing Law</h2>
                    </div>
                    <p className="text-slate-600">
                        These Terms shall be governed and construed in accordance with the laws of South Africa, without regard to its conflict of law provisions.
                    </p>
                </section>
            </Card>
        </div>
    );
};
