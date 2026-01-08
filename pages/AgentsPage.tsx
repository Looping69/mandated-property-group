import React from 'react';
import { AgentCard } from '../components/AgentCard';
import { Agent } from '../types';
import { useData } from '../contexts/DataContext';
import { useNavigate } from 'react-router-dom';

export const AgentsPage: React.FC = () => {
    const { agents, updateAgent } = useData();
    const navigate = useNavigate();

    const handleAgentImageUpdate = (id: string, newImage: string) => {
        const agent = agents.find(a => a.id === id);
        if (agent) updateAgent({ ...agent, image: newImage });
    };

    const handleViewProfile = (id: string) => {
        navigate(`/agents/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-4xl font-serif text-slate-900 mb-4">Elite Representation</h2>
                <p className="text-slate-600 font-bold">Industry leaders in market expertise and service.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {agents.map(a => (
                    <AgentCard
                        key={a.id}
                        agent={a}
                        onImageUpdate={handleAgentImageUpdate}
                        onViewProfile={handleViewProfile}
                    />
                ))}
            </div>
        </div>
    );
};
