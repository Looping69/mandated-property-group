
import React from 'react';
import { Plus, XCircle, Camera, Trash2, TrendingUp } from 'lucide-react';
import { Card, Badge, Input } from './Shared';
import { Button } from '../ui/button';
import { Agent } from '../../types';

interface AgentsManagerProps {
    agents: Agent[];
    isAddingAgent: boolean;
    setIsAddingAgent: (adding: boolean) => void;
    newAgent: Partial<Agent>;
    setNewAgent: React.Dispatch<React.SetStateAction<Partial<Agent>>>;
    handleCreateAgent: (e: React.FormEvent) => void;
    handleAgentImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    updateAgentStatus: (id: string, status: string) => Promise<void>;
    deleteAgent: (id: string) => void;
}

export const AgentsManager: React.FC<AgentsManagerProps> = ({
    agents,
    isAddingAgent,
    setIsAddingAgent,
    newAgent,
    setNewAgent,
    handleCreateAgent,
    handleAgentImageUpload,
    updateAgentStatus,
    deleteAgent
}) => {
    const [statusFilter, setStatusFilter] = useState("ALL");

    const filteredAgents = agents.filter(agent => {
        if (statusFilter === "ALL") return true;
        return agent.status === statusFilter.toLowerCase();
    });

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900">Agents</h2>
                    <p className="text-slate-500 text-sm">Manage your team.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                        <button
                            onClick={() => setStatusFilter("ALL")}
                            className={cn("px-3 py-1 text-xs font-bold rounded-md transition-colors", statusFilter === "ALL" ? "bg-brand-green text-white" : "text-slate-500 hover:bg-slate-50")}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setStatusFilter("ACTIVE")}
                            className={cn("px-3 py-1 text-xs font-bold rounded-md transition-colors", statusFilter === "ACTIVE" ? "bg-brand-green text-white" : "text-slate-500 hover:bg-slate-50")}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setStatusFilter("SUSPENDED")}
                            className={cn("px-3 py-1 text-xs font-bold rounded-md transition-colors", statusFilter === "SUSPENDED" ? "bg-brand-green text-white" : "text-slate-500 hover:bg-slate-50")}
                        >
                            Suspended
                        </button>
                    </div>
                    <Button variant={isAddingAgent ? "outline" : "brand"} onClick={() => setIsAddingAgent(!isAddingAgent)}>
                        {isAddingAgent ? <><XCircle size={16} className="mr-2" /> Cancel</> : <><Plus size={16} className="mr-2" /> Add Agent</>}
                    </Button>
                </div>
            </div>

            {isAddingAgent ? (
                <Card className="p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Register New Agent</h3>
                    <form onSubmit={handleCreateAgent} className="space-y-6">
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 bg-slate-100 rounded-full overflow-hidden mb-2 relative group">
                                <img src={newAgent.image} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white" size={20} />
                                </div>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleAgentImageUpload} />
                            </div>
                            <span className="text-xs text-slate-400">Upload Photo</span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
                                <Input
                                    placeholder="e.g. Sarah Connor"
                                    value={newAgent.name}
                                    onChange={e => setNewAgent({ ...newAgent, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Title</label>
                                <Input
                                    placeholder="e.g. Senior Partner"
                                    value={newAgent.title}
                                    onChange={e => setNewAgent({ ...newAgent, title: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Email</label>
                                <Input
                                    type="email"
                                    placeholder="agent@mandated.co.za"
                                    value={newAgent.email}
                                    onChange={e => setNewAgent({ ...newAgent, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Phone</label>
                                <Input
                                    placeholder="+27..."
                                    value={newAgent.phone}
                                    onChange={e => setNewAgent({ ...newAgent, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Sales Record (Display Text)</label>
                            <Input
                                placeholder="e.g. R50M Sold 2024"
                                value={newAgent.sales}
                                onChange={e => setNewAgent({ ...newAgent, sales: e.target.value })}
                            />
                        </div>
                        <Button type="submit" variant="brand" className="w-full">Add Agent</Button>
                    </form>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAgents.map(agent => (
                        <div key={agent.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => updateAgentStatus(agent.id, agent.status === 'suspended' ? 'active' : 'suspended')}
                                    className="text-slate-400 hover:text-brand-purple transition-colors text-xs font-bold uppercase"
                                >
                                    {agent.status === 'suspended' ? 'Activate' : 'Suspend'}
                                </button>
                                <button
                                    onClick={() => deleteAgent(agent.id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="w-20 h-20 mx-auto bg-slate-200 rounded-full overflow-hidden mb-4 border-2 border-brand-green">
                                <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-slate-900 flex items-center justify-center gap-2">
                                {agent.name}
                                {agent.status === 'suspended' && <Badge variant="neutral" className="text-[8px] bg-slate-100 text-slate-400">SUSPENDED</Badge>}
                            </h3>
                            <p className="text-xs text-brand-purple font-bold uppercase tracking-wide mb-2">{agent.title}</p>
                            <div className="text-xs text-slate-500 mb-4">{agent.email}</div>
                            <div className="flex justify-center gap-2">
                                <Badge variant="neutral">{agent.sales}</Badge>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                                <span>{agent.reviews.length} Reviews</span>
                                <div className="flex items-center"><TrendingUp size={12} className="mr-1 text-emerald-500" /> High Perf.</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
