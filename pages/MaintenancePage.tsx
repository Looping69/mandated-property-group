import React from 'react';
import { MaintenanceView } from '../components/MaintenanceView';
import { MaintenanceDashboard } from '../components/MaintenanceDashboard';
import { useBackendUser } from '../hooks/useBackendUser';
import { useData } from '../contexts/DataContext';
import { SignedIn } from '../contexts/AuthContext';

export const MaintenancePage: React.FC = () => {
    return <MaintenanceView onViewDetails={(c) => console.log("Selecting contractor", c)} />;
};

export const MaintenanceDashboardPage: React.FC = () => {
    const { user: backendUser } = useBackendUser();
    const { maintenanceRequests, listings, contractors, updateMaintenanceRequest } = useData();

    const currentContractor = contractors.find(c => c.id === backendUser?.contractorId) || contractors[0] || {
        id: 'c1', name: 'Demo Contractor', trade: 'General', location: 'CT',
        rating: 5, image: '', phone: '', email: '', description: '', isVerified: true
    };

    return (
        <SignedIn>
            <MaintenanceDashboard
                currentContractor={currentContractor}
                requests={maintenanceRequests}
                listings={listings}
                updateRequest={updateMaintenanceRequest}
            />
        </SignedIn>
    );
};
