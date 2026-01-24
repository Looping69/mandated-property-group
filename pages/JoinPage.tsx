import React from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { JoinSelection } from '../components/JoinSelection';
import { ContractorRegistration } from '../components/ContractorRegistration';
import { AgencyRegistration } from '../components/AgencyRegistration';
import { AgentRegistration } from '../components/AgentRegistration';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { userService } from '../services/userService';

export const JoinPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, getDashboardUrl } = useAuth();
    const { addContractor, addAgency, addAgent } = useData();
    const { showToast } = useToast();

    /**
     * Handle contractor registration completion
     */
    const handleContractorSubmit = async (data: any, newUser?: any) => {
        try {
            // Add contractor to the system
            const newContractor = await addContractor(data);

            // Use provided user or current context user
            const targetUser = newUser || user;

            // Link contractor to the user and mark as verified
            if (targetUser) {
                await userService.update(targetUser.id, {
                    contractorId: newContractor.id,
                    isVerified: true,
                });
            }

            // Redirect to contractor dashboard
            showToast("Contractor registration successful!", "success");
            navigate('/maintenance-dashboard', { replace: true });
        } catch (e) {
            console.error("Contractor registration failed:", e);
            showToast("Registration failed. Please try again.", "error");
            throw e; // Re-throw so the component can handle the error
        }
    };

    /**
     * Handle agency registration completion
     */
    const handleAgencySubmit = async (data: any, newUser?: any) => {
        try {
            // Add agency to the system
            const agency = await addAgency(data);

            // Use the provided user object (from signup) or current user
            const targetUser = newUser || user;

            // Link agency to the user and mark as verified
            if (targetUser && agency) {
                await userService.update(targetUser.id, {
                    agencyId: agency.id,
                    isVerified: true,
                });
            }

            // Redirect to agency dashboard
            showToast("Agency registration successful!", "success");
            navigate('/dashboard', { replace: true });
        } catch (e) {
            console.error("Agency registration failed:", e);
            showToast("Agency registration failed.", "error");
            throw e;
        }
    };

    /**
     * Handle agent registration completion
     */
    const handleAgentSubmit = async (data: any, newUser?: any) => {
        try {
            // Add agent to the system
            const newAgent = await addAgent(data);

            // Use provided user or current context user
            const targetUser = newUser || user;

            // Link agent to the user and mark as verified
            if (targetUser) {
                await userService.update(targetUser.id, {
                    agentId: newAgent.id,
                    isVerified: false, // Agents need manual verification
                });
            }

            // Redirect to agent dashboard
            showToast("Welcome! Your agent profile is active.", "success");
            navigate('/dashboard', { replace: true });
        } catch (e) {
            console.error("Agent registration failed:", e);
            showToast("Failed to link agent profile.", "error");
            throw e;
        }
    };

    return (
        <Routes>
            {/* Role Selection */}
            <Route
                index
                element={
                    <JoinSelection
                        onSelectType={(type) => navigate(type)}
                        onCancel={() => navigate('/')}
                    />
                }
            />

            {/* Contractor Registration */}
            <Route
                path="contractor"
                element={
                    <ContractorRegistration
                        onSubmit={handleContractorSubmit}
                        onDashboardRedirect={() => navigate('/maintenance-dashboard')}
                        onCancel={() => navigate('/join')}
                    />
                }
            />

            {/* Agency Registration */}
            <Route
                path="agency"
                element={
                    <AgencyRegistration
                        onSubmit={handleAgencySubmit}
                        onCancel={() => navigate('/join')}
                    />
                }
            />

            {/* Agent Registration */}
            <Route
                path="agent"
                element={
                    <AgentRegistration
                        onSubmit={handleAgentSubmit}
                        onCancel={() => navigate('/join')}
                        onDashboardRedirect={() => navigate('/dashboard')}
                    />
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="" replace />} />
        </Routes>
    );
};
