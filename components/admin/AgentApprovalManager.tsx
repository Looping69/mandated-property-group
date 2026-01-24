
import React, { useState } from 'react';
import { CheckCircle, XCircle, User, Award, Mail, Phone, Calendar, Search } from 'lucide-react';
import { Card, Badge, Input } from './Shared';
import { Button } from '../ui/button';
import { Agent } from '../../types';
import { cn } from '../../lib/utils';

interface AgentApprovalManagerProps {
    agents: Agent[];
    updateAgentStatus: (id: string, status: string) => Promise<void>;
}

export const AgentApprovalManager: React.FC<AgentApprovalManagerProps> = ({
    agents,
    updateAgentStatus
}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const pendingAgents = agents.filter(agent =>
        agent.status === 'pending' &&
        (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            agent.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleApprove = async (id: string) => {
        try {
            await updateAgentStatus(id, 'active');
        } catch (error) {
            console.error("Failed to approve agent:", error);
        }
    };

    const handleReject = async (id: string) => {
        // For rejection, we might just suspend them or delete them.
        // For now, let's just suspend them.
        try {
            await updateAgentStatus(id, 'suspended');
        } catch (error) {
            console.error("Failed to reject agent:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">
                        Agent Approvals ({pendingAgents.length})
                    </h2>
                    <p className="text-slate-500 text-sm">Review and approve new agent registrations.</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        placeholder="Search pending agents..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {pendingAgents.length === 0 ? (
                <Card className="p-12 text-center bg-slate-50/50 border-dashed border-2">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Pending Approvals</h3>
                    <p className="text-slate-500 max-w-sm mx-auto">
                        All clear! There are currently no new agent registrations waiting for review.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pendingAgents.map(agent => (
                        <Card key={agent.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row">
                                {/* Profile Image & Basic Info */}
                                <div className="p-6 md:w-1/3 bg-slate-50/50 border-r border-slate-100 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-sm">
                                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{agent.name}</h3>
                                    <p className="text-slate-500 text-sm mb-4">{agent.title}</p>
                                    <Badge variant="neutral" className="bg-amber-100 text-amber-700 border-amber-200">
                                        PENDING REVIEW
                                    </Badge>
                                </div>

                                {/* Details & Actions */}
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                                                <Mail size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                                                <p className="text-sm font-medium">{agent.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                                                <Phone size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                                                <p className="text-sm font-medium">{agent.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                                                <Award size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Sales Record</p>
                                                <p className="text-sm font-medium">{agent.sales || 'New Agent'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                                                <Calendar size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Registered On</p>
                                                <p className="text-sm font-medium">Recently</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 justify-end pt-4 border-t border-slate-50">
                                        <Button
                                            variant="outline"
                                            className="text-slate-500 hover:text-red-600 hover:border-red-200"
                                            onClick={() => handleReject(agent.id)}
                                        >
                                            <XCircle size={16} className="mr-2" />
                                            Reject Agent
                                        </Button>
                                        <Button
                                            variant="brand"
                                            onClick={() => handleApprove(agent.id)}
                                        >
                                            <CheckCircle size={16} className="mr-2" />
                                            Approve Agent
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
