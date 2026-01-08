import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentDetails } from '../components/AgentDetails';
import { Listing } from '../types';

interface AgentDetailsPageProps {
    onViewListingDetails: (listing: Listing) => void;
}

export const AgentDetailsPage: React.FC<AgentDetailsPageProps> = ({ onViewListingDetails }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
            {id ? (
                <AgentDetails
                    agentId={id}
                    onBack={() => navigate('/agents')}
                    onViewListingDetails={onViewListingDetails}
                />
            ) : (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-slate-500 mb-4">Agent not found</p>
                        <button
                            onClick={() => navigate('/agents')}
                            className="text-brand-green font-bold hover:underline"
                        >
                            Back to Agents
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
