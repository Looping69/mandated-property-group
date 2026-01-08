import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailsPage } from './pages/AgentDetailsPage';
import { AdminPage } from './pages/AdminPage';
import { JoinPage } from './pages/JoinPage';
import { MaintenancePage, MaintenanceDashboardPage } from './pages/MaintenancePage';
import { ConveyancerPage } from './pages/ConveyancerPage';
import { DashboardPage } from './pages/DashboardPage';
import { PrivacyPage, TermsPage, PopiaPage } from './pages/LegalPages';
import {
    ServiceShowPropertyPage,
    ServiceTopAreaAgentPage,
    ServiceMaintenancePage,
    ServiceConveyancingPage,
    ServicePartnerPortalPage
} from './pages/ServicePages';
import { VirtualTourCreator } from './components/VirtualTourCreator';
import { PendingApproval } from './components/PendingApproval';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { ContractorDetailModal } from './components/ContractorDetailModal';
import { VirtualTourPlayer } from './components/VirtualTourPlayer';
import { Layout } from './components/Layout';
import { SignedIn } from './contexts/AuthContext';
import { useBackendUser } from './hooks/useBackendUser';
import { Listing, VirtualTour, Contractor } from './types';

export const MainRoutes = () => {
    const location = useLocation();
    const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
    const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
    const [activeTour, setActiveTour] = useState<VirtualTour | null>(null);

    const { hasProfile, isVerified, isLoading: isLoadingBackend } = useBackendUser();

    // Onboarding logic
    const isOnboardingRoute = location.pathname.startsWith('/join') || location.pathname === '/pending-approval';

    if (!isLoadingBackend && hasProfile && !isVerified && !isOnboardingRoute) {
        return <Navigate to="/pending-approval" replace />;
    }

    const handleViewListingDetails = (listing: Listing) => setSelectedListing(listing);
    const handleStartTour = (tour: VirtualTour) => {
        setActiveTour(tour);
        setSelectedListing(null);
    };

    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage onViewListingDetails={handleViewListingDetails} />} />
                <Route path="/listings" element={<ListingsPage onViewListingDetails={handleViewListingDetails} />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/agents/:id" element={<AgentDetailsPage onViewListingDetails={handleViewListingDetails} />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/join/*" element={<JoinPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/maintenance-dashboard" element={<MaintenanceDashboardPage />} />
                <Route path="/conveyancing" element={<ConveyancerPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tour-creator" element={<SignedIn><VirtualTourCreator /></SignedIn>} />
                <Route path="/pending-approval" element={<PendingApproval />} />

                {/* Legal */}
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/popia" element={<PopiaPage />} />

                {/* Services */}
                <Route path="/services/show-property" element={<ServiceShowPropertyPage />} />
                <Route path="/services/top-area-agent" element={<ServiceTopAreaAgentPage />} />
                <Route path="/services/maintenance" element={<ServiceMaintenancePage />} />
                <Route path="/services/conveyancing" element={<ServiceConveyancingPage />} />
                <Route path="/services/partner-portal" element={<ServicePartnerPortalPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {selectedListing && (
                <PropertyDetailModal
                    listing={selectedListing}
                    onClose={() => setSelectedListing(null)}
                    onStartTour={handleStartTour}
                />
            )}

            {selectedContractor && (
                <ContractorDetailModal
                    contractor={selectedContractor}
                    onClose={() => setSelectedContractor(null)}
                />
            )}

            {activeTour && (
                <VirtualTourPlayer
                    tour={activeTour}
                    onClose={() => setActiveTour(null)}
                />
            )}
        </Layout>
    );
};
