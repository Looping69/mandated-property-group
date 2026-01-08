import React from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { JoinSelection } from '../components/JoinSelection';
import { ContractorRegistration } from '../components/ContractorRegistration';
import { AgencyRegistration } from '../components/AgencyRegistration';
import { AgentRegistration } from '../components/AgentRegistration';
import { useData } from '../contexts/DataContext';
import { useUser } from '../contexts/AuthContext';
import { userService } from '../services/userService';

export const JoinPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { addContractor, addAgency, addAgent } = useData();

    const handleContractorSubmit = async (data: any) => {
        try {
            const newContractor = await addContractor(data);
            if (user) {
                await userService.syncFromClerk({
                    clerkId: user.id,
                    email: user.primaryEmailAddress?.emailAddress!,
                    role: 'CONTRACTOR',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    imageUrl: user.imageUrl,
                    contractorId: newContractor.id
                });
                window.location.reload();
            }
        } catch (e) {
            console.error("Registration failed", e);
            alert("Failed to register. Please try again.");
        }
    };

    const handleAgencySubmit = async (data: any) => {
        try {
            const newAgency = addAgency ? await addAgency(data) : data;
            if (user) {
                await userService.syncFromClerk({
                    clerkId: user.id,
                    email: user.primaryEmailAddress?.emailAddress!,
                    role: 'AGENCY',
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    imageUrl: user.imageUrl,
                });
                window.location.reload();
            }
        } catch (e) {
            console.error("Agency registration failed", e);
            alert("Registration failed. Please try again.");
        }
    };

    const handleAgentSubmit = async (data: any) => {
        try {
            const newAgent = await addAgent(data);
            if (user) {
                await userService.syncFromClerk({
                    clerkId: user.id,
                    email: user.primaryEmailAddress?.emailAddress!,
                    role: 'AGENT',
                    firstName: user.firstName || data.name.split(' ')[0],
                    lastName: user.lastName || data.name.split(' ').slice(1).join(' '),
                    imageUrl: user.imageUrl,
                    agentId: newAgent.id
                });
                window.location.reload();
            }
        } catch (e) {
            console.error("Agent registration failed", e);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <Routes>
            <Route index element={
                <JoinSelection
                    onSelectType={(type) => navigate(type)}
                    onCancel={() => navigate('/')}
                />
            } />
            <Route path="contractor" element={
                <ContractorRegistration
                    onSubmit={handleContractorSubmit}
                    onDashboardRedirect={() => navigate('/maintenance')}
                    onCancel={() => navigate('/join')}
                />
            } />
            <Route path="agency" element={
                <AgencyRegistration
                    onSubmit={handleAgencySubmit}
                    onCancel={() => navigate('/join')}
                />
            } />
            <Route path="agent" element={
                <AgentRegistration
                    onSubmit={handleAgentSubmit}
                    onCancel={() => navigate('/join')}
                    onDashboardRedirect={() => navigate('/dashboard')}
                />
            } />
            <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
    );
};
