import React from 'react';
import { Card } from './admin/Shared';
import { Lock, FileCheck, ShieldCheck, UserCheck, Database, AlertCircle } from 'lucide-react';

export const PopiaCompliance: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <ShieldCheck className="w-16 h-16 text-brand-green mx-auto mb-4" />
                <h1 className="text-4xl font-serif text-slate-900 mb-4">POPIA Compliance</h1>
                <p className="text-lg text-slate-600">Protection of Personal Information Act (Act 4 of 2013)</p>
            </div>

            <Card className="p-8 md:p-12 shadow-lg space-y-8">
                <section>
                    <div className="bg-brand-green/5 border border-brand-green/20 rounded-xl p-6 mb-8">
                        <h3 className="text-lg font-bold text-brand-green mb-2 flex items-center gap-2">
                            <FileCheck size={20} /> Commitment Statement
                        </h3>
                        <p className="text-slate-700">
                            Mandated Property Group is fully committed to compliance with the Protection of Personal Information Act (POPIA).
                            We value your privacy and are dedicated to processing your personal information lawfully, transparently, and securely.
                        </p>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Database className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">1. Information Processing</h2>
                    </div>
                    <p className="text-slate-600 mb-4">
                        We collect and process personal information solely for specific, explicitly defined, and lawful purposes related to our real estate and property maintenance services.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li><strong>Consent:</strong> We obtain your consent before collecting personal information.</li>
                        <li><strong>Minimality:</strong> We only collect information that is adequate, relevant, and not excessive for the purpose.</li>
                        <li><strong>Accuracy:</strong> We take reasonable steps to ensure your information is complete, accurate, not misleading, and updated.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <Lock className="w-6 h-6 text-brand-purple" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">2. Security Safeguards</h2>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        In accordance with Section 19 of POPIA, we secure the integrity and confidentiality of personal information in our possession by taking appropriate, reasonable technical and organizational measures.
                    </p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li>Encryption of data in transit and at rest.</li>
                        <li>Regular security assessments and updates.</li>
                        <li>Access control mechanisms to restrict data access to authorized personnel only.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <UserCheck className="w-6 h-6 text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">3. Data Subject Rights</h2>
                    </div>
                    <p className="text-slate-600 mb-4">You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-3 text-slate-600">
                        <li>Request confirmation of whether we hold personal information about you.</li>
                        <li>Access the record of your personal information.</li>
                        <li>Request correction, destruction, or deletion of your personal information.</li>
                        <li>Object to the processing of your personal information for reasonable grounds.</li>
                    </ul>
                </section>

                <div className="h-px bg-slate-100" />

                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">4. Information Officer</h2>
                    </div>
                    <p className="text-slate-600">
                        Our appointed Information Officer ensures compliance with POPIA. For any POPIA-related queries or requests, please contact:
                    </p>
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-bold text-slate-900">The Information Officer</p>
                        <p className="text-slate-600">Email: <span className="text-brand-green font-bold">compliance@showhouseproperty.co.za</span></p>
                        <p className="text-slate-600">Phone: +27 11 555 0123</p>
                    </div>
                </section>
            </Card>
        </div>
    );
};
