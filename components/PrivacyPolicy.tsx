import React from 'react';
import { Card } from './admin/Shared';
import { Shield, Lock, Eye, FileText, Server, Scale, Mail } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <Shield className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h1 className="text-4xl font-serif text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-lg text-slate-600">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <Card className="p-8 md:p-12 shadow-lg space-y-8">
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-brand-green/10 rounded-lg">
                            <Lock className="w-6 h-6 text-brand-green" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                        Mandated Property Group ("we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal information.
                        This Privacy Policy outlines how we collect, use, and safeguard your data when you use our platform, including our website and services for
                        property listings, agent interactions, and maintenance requests. We adhere to the Protection of Personal Information Act (POPIA) of South Africa.
                    </p>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">2. Information We Collect</h2>
                    </div>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li><strong>Personal Identity Information:</strong> Name, email address, phone number, and ID number (where required for verification).</li>
                        <li><strong>Property Information:</strong> Details about properties you list, search for, or inquire about.</li>
                        <li><strong>Professional Information:</strong> For agents, contractors, and agencies, we collect registration numbers, qualifications, and business details.</li>
                        <li><strong>Usage Data:</strong> Information on how you interact with our platform, including IP addresses and device information.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <FileText className="w-6 h-6 text-brand-purple" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
                    </div>
                    <p className="text-slate-600 mb-4">We use your information to:</p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li>Facilitate real estate transactions and inquiries.</li>
                        <li>Connect you with relevant agents, conveyancers, or maintenance contractors.</li>
                        <li>Verify the identity and credentials of service providers to ensure platform safety.</li>
                        <li>Send important service updates and notifications.</li>
                        <li>Improve our AI-driven features, such as property descriptions and virtual tours.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <Server className="w-6 h-6 text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">4. Data Sharing and Security</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        We generally do not share your personal data with third parties, except:
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li><strong>With Service Providers:</strong> Sharing inquiry details with the specific agent or contractor you have contacted.</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
                    </ul>
                    <p className="text-slate-600 mt-4">
                        We implement robust security measures, including encryption and secure server storage, to protect your data against unauthorized access.
                    </p>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Scale className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">5. Your Rights (POPIA)</h2>
                    </div>
                    <p className="text-slate-600 mb-4">Under the POPIA Act, you have the right to:</p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li>Access the personal information we hold about you.</li>
                        <li>Request correction or deletion of your personal data.</li>
                        <li>Object to the processing of your personal information.</li>
                        <li>Lodge a complaint with the Information Regulator.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg">
                            <Mail className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">6. Contact Us</h2>
                    </div>
                    <p className="text-slate-600">
                        If you have any questions about this Privacy Policy or wish to exercise your rights, please contact our Information Officer at:
                    </p>
                    <p className="mt-4 font-bold text-brand-green">privacy@showhouseproperty.co.za</p>
                </section>
            </Card>
        </div>
    );
};
