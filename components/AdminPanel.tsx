
"use client";

import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Listing, Agent, Contractor, Conveyancer, UserRole, AdminView } from '../types';
import { generatePropertyDescription } from '../services/geminiService';
import { VirtualTourPlayer } from './VirtualTourPlayer';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

// Extracted Components
import { Sidebar } from './admin/Sidebar';
import { OverviewDashboard } from './admin/OverviewDashboard';
import { ListingsManager } from './admin/ListingsManager';
import { AgentsManager } from './admin/AgentsManager';
import { AgenciesManager } from './admin/AgenciesManager';
import { ConveyancersManager } from './admin/ConveyancersManager';
import { MaintenanceManager } from './admin/MaintenanceManager';
import { InquiryManager } from './admin/InquiryManager';
import { VirtualTourManager } from './admin/VirtualTourManager';
import { SettingsManager } from './admin/SettingsManager';
import { AgentApprovalManager } from './admin/AgentApprovalManager';

interface AdminPanelProps {
  onLogout: () => void;
  userRole: UserRole;
  currentAgentId?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onLogout,
  userRole,
  currentAgentId
}) => {
  const {
    listings,
    agents,
    agencies,
    inquiries,
    contractors,
    conveyancers,
    virtualTours,
    isLoading,
    error,
    addListing,
    deleteListing,
    addAgent,
    updateAgentStatus,
    deleteAgent,
    addContractor,
    updateContractorStatus,
    deleteContractor,
    addConveyancer,
    deleteConveyancer,
    deleteTour,
    updateAgencyStatus,
    updateInquiryStatus,
    currentSubscription
  } = useData();

  // Navigation State
  const [activeView, setActiveView] = useState<AdminView>('OVERVIEW');
  const [previewTour, setPreviewTour] = useState<any>(null);

  // Local UI States
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [isAddingContractor, setIsAddingContractor] = useState(false);
  const [isAddingConveyancer, setIsAddingConveyancer] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  // Form States
  const [newListing, setNewListing] = useState<Partial<Listing>>({
    title: '',
    price: 0,
    address: '',
    beds: 0,
    baths: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
    description: '',
    isFeatured: false,
    status: 'active',
    agentId: currentAgentId || (agents[0]?.id || '')
  });

  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    title: '',
    email: '',
    phone: '',
    sales: '',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80',
    reviews: []
  });

  const [newContractor, setNewContractor] = useState<Partial<Contractor>>({
    name: '',
    trade: '',
    location: '',
    email: '',
    phone: '',
    image: 'https://picsum.photos/300/200',
    description: '',
    hourlyRate: 0,
    isVerified: true
  });

  const [newConveyancer, setNewConveyancer] = useState<Partial<Conveyancer>>({
    name: '',
    specialist: '',
    location: '',
    image: 'https://picsum.photos/300/200',
    website: '',
    phone: '',
    isVerified: true,
    rating: 5
  });

  // Role-based filtering
  const filteredListings = userRole === 'AGENT' && currentAgentId
    ? listings.filter(l => l.agentId === currentAgentId)
    : listings;

  const filteredInquiries = userRole === 'AGENT' && currentAgentId
    ? inquiries.filter(i => i.agentId === currentAgentId || i.listingId && listings.find(l => l.id === i.listingId)?.agentId === currentAgentId)
    : inquiries;

  const filteredTours = userRole === 'AGENT' && currentAgentId
    ? virtualTours.filter(t => t.agentId === currentAgentId)
    : virtualTours;

  // Handlers
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    await addListing(newListing as Listing);
    setIsAddingListing(false);
    setNewListing({
      title: '', price: 0, address: '', beds: 0, baths: 0,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80',
      description: '', isFeatured: false, status: 'active', agentId: currentAgentId || (agents[0]?.id || '')
    });
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgent.name || !newAgent.email) return;
    addAgent(newAgent as Agent);
    setIsAddingAgent(false);
    setNewAgent({ name: '', title: '', email: '', phone: '', sales: '', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80', reviews: [] });
  };

  const handleCreateContractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContractor.name || !newContractor.trade) return;
    addContractor({
      name: newContractor.name!,
      trade: newContractor.trade!,
      location: newContractor.location || 'Cape Town',
      rating: 5.0,
      image: newContractor.image || 'https://picsum.photos/300/200',
      phone: newContractor.phone || '',
      email: newContractor.email || '',
      description: newContractor.description || '',
      isVerified: true,
      hourlyRate: Number(newContractor.hourlyRate) || 0,
      status: 'active'
    });
    setIsAddingContractor(false);
    setNewContractor({ name: '', trade: '', location: '', email: '', phone: '', image: 'https://picsum.photos/300/200', description: '', hourlyRate: 0, isVerified: true });
  };

  const handleCreateConveyancer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConveyancer.name || !newConveyancer.specialist) return;
    addConveyancer({
      name: newConveyancer.name!,
      specialist: newConveyancer.specialist!,
      location: newConveyancer.location || 'Cape Town',
      rating: 5.0,
      image: newConveyancer.image || 'https://picsum.photos/300/200',
      website: newConveyancer.website || '',
      phone: newConveyancer.phone || '',
      isVerified: true
    });
    setIsAddingConveyancer(false);
    setNewConveyancer({ name: '', specialist: '', location: '', image: 'https://picsum.photos/300/200', website: '', phone: '', isVerified: true, rating: 5 });
  };

  const handleAgentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { if (typeof reader.result === 'string') setNewAgent({ ...newAgent, image: reader.result }); };
      reader.readAsDataURL(file);
    }
  };

  const handleConveyancerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { if (typeof reader.result === 'string') setNewConveyancer({ ...newConveyancer, image: reader.result }); };
      reader.readAsDataURL(file);
    }
  };

  const handleAIDescription = async () => {
    if (!newListing.title || !newListing.address) {
      alert("Please provide at least a title and address for the AI to work with.");
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const features = `${newListing.title} at ${newListing.address}. ${newListing.beds} bedrooms, ${newListing.baths} bathrooms. ${newListing.description}`;
      const description = await generatePropertyDescription(features);
      setNewListing(prev => ({ ...prev, description }));
    } catch (err) {
      console.error("AI Description Error:", err);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-purpleLight font-sans flex">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        userRole={userRole}
        onLogout={onLogout}
      />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium">{error}</span>
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>Retry</Button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
              <RefreshCw size={40} className="animate-spin mb-4 text-brand-green" />
              <p className="font-bold animate-pulse">Synchronizing with Mandated Cloud...</p>
            </div>
          ) : (
            <div className="pb-12">
              {activeView === 'OVERVIEW' && (
                <OverviewDashboard
                  userRole={userRole}
                  listings={filteredListings}
                  agents={agents}
                  inquiries={filteredInquiries}
                  contractors={contractors}
                  conveyancers={conveyancers}
                  virtualTours={filteredTours}
                  setActiveView={setActiveView}
                  setIsAddingListing={setIsAddingListing}
                  setIsAddingAgent={setIsAddingAgent}
                  setPreviewTour={setPreviewTour}
                  currentSubscription={currentSubscription}
                />
              )}
              {activeView === 'LISTINGS' && (
                <ListingsManager
                  listings={filteredListings}
                  agents={agents}
                  isAddingListing={isAddingListing}
                  setIsAddingListing={setIsAddingListing}
                  addListing={addListing}
                  deleteListing={deleteListing}
                  handleAIDescription={handleAIDescription}
                  isGeneratingDesc={isGeneratingDesc}
                  newListing={newListing}
                  setNewListing={setNewListing}
                  handleCreateListing={handleCreateListing}
                />
              )}
              {activeView === 'AGENTS' && userRole === 'AGENCY' && (
                <AgentsManager
                  agents={agents}
                  isAddingAgent={isAddingAgent}
                  setIsAddingAgent={setIsAddingAgent}
                  newAgent={newAgent}
                  setNewAgent={setNewAgent}
                  handleCreateAgent={handleCreateAgent}
                  handleAgentImageUpload={handleAgentImageUpload}
                  updateAgentStatus={updateAgentStatus}
                  deleteAgent={deleteAgent}
                />
              )}
              {activeView === 'AGENCIES' && userRole === 'ADMIN' && (
                <AgenciesManager
                  agencies={agencies}
                  updateAgencyStatus={updateAgencyStatus}
                />
              )}
              {activeView === 'CONVEYANCERS' && (
                <ConveyancersManager
                  conveyancers={conveyancers}
                  userRole={userRole}
                  isAddingConveyancer={isAddingConveyancer}
                  setIsAddingConveyancer={setIsAddingConveyancer}
                  newConveyancer={newConveyancer}
                  setNewConveyancer={setNewConveyancer}
                  handleCreateConveyancer={handleCreateConveyancer}
                  handleConveyancerImageUpload={handleConveyancerImageUpload}
                  deleteConveyancer={deleteConveyancer}
                />
              )}
              {activeView === 'MAINTENANCE' && (
                <MaintenanceManager
                  contractors={contractors}
                  userRole={userRole}
                  isAddingContractor={isAddingContractor}
                  setIsAddingContractor={setIsAddingContractor}
                  newContractor={newContractor}
                  setNewContractor={setNewContractor}
                  handleCreateContractor={handleCreateContractor}
                  updateContractorStatus={updateContractorStatus}
                  deleteContractor={deleteContractor}
                />
              )}
              {activeView === 'LEADS' && (
                <InquiryManager
                  inquiries={filteredInquiries}
                  listings={listings}
                  updateInquiryStatus={updateInquiryStatus}
                />
              )}
              {activeView === 'VIRTUAL_TOURS' && (
                <VirtualTourManager
                  virtualTours={filteredTours}
                  setPreviewTour={setPreviewTour}
                  deleteTour={deleteTour}
                />
              )}
              {activeView === 'SETTINGS' && userRole === 'AGENCY' && (
                <SettingsManager
                  listings={listings}
                  agents={agents}
                  inquiries={inquiries}
                  contractors={contractors}
                  conveyancers={conveyancers}
                />
              )}
              {activeView === 'AGENT_APPROVAL' && userRole === 'ADMIN' && (
                <AgentApprovalManager
                  agents={agents}
                  updateAgentStatus={updateAgentStatus}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Tour Preview Modal */}
      {previewTour && (
        <VirtualTourPlayer tour={previewTour} onClose={() => setPreviewTour(null)} />
      )}
    </div>
  );
};
