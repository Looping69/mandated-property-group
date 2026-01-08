import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPanel } from '../components/AdminPanel';
import { SignedIn } from '../contexts/AuthContext';
import { useBackendUser } from '../hooks/useBackendUser';

export const AdminPage: React.FC = () => {
    const navigate = useNavigate();
    const { user: backendUser } = useBackendUser();

    const role = backendUser?.role || 'AGENT';
    const agentId = backendUser?.agentId || 'a1';

    return (
        <SignedIn>
            <AdminPanel
                onLogout={() => navigate('/')}
                userRole={role}
                currentAgentId={agentId}
            />
        </SignedIn>
    );
};
