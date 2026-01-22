import React from 'react';
import { AgentDashboard } from '../components/AgentDashboard';
import { useData } from '../contexts/DataContext';
import { useBackendUser } from '../hooks/useBackendUser';
import { useNavigate } from 'react-router-dom';
import { SignedIn } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { agents, listings, myListings, virtualTours, inquiries, currentSubscription, addListing, updateListing, deleteListing } = useData();
    const { user: backendUser } = useBackendUser();

    const agentId = backendUser?.agentId || 'a1';
    const currentAgent = agents.find(a => a.id === agentId) || agents[0];

    return (
        <SignedIn>
            <AgentDashboard
                currentAgent={currentAgent}
                listings={myListings}
                virtualTours={virtualTours}
                inquiries={inquiries}
                currentSubscription={currentSubscription}
                addListing={addListing}
                updateListing={updateListing}
                deleteListing={deleteListing}
                handleAIDescription={async (l) => {
                    console.log("Generating AI description for", l);
                    return "This is an AI generated description placeholder. Connect to Gemini API for real generation.";
                }}
                onNavigateToTourCreator={() => navigate('/tour-creator')}
            />
        </SignedIn>
    );
};
