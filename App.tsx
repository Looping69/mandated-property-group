
"use client";

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { VirtualTourCreator } from './components/VirtualTourCreator';
import { AdminPanel } from './components/AdminPanel';
import { VirtualTourPlayer } from './components/VirtualTourPlayer';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AgentCard } from './components/AgentCard';
import { AgentDetails } from './components/AgentDetails';
import { ConveyancerView } from './components/ConveyancerView';
import { ContractorDetailModal } from './components/ContractorDetailModal';
import { MaintenanceView } from './components/MaintenanceView';
import { FeaturedCarousel } from './components/FeaturedCarousel';
import { ContractorRegistration } from './components/ContractorRegistration';
import { JoinSelection } from './components/JoinSelection';
import { AgencyRegistration } from './components/AgencyRegistration';
import { AgentRegistration } from './components/AgentRegistration';
import { AgentDashboard } from './components/AgentDashboard';
import { MaintenanceDashboard } from './components/MaintenanceDashboard';

import { AppView, Listing, VirtualTour, Contractor, UserRole } from './types';
import { DataProvider, useData } from './contexts/DataContext';
import {
  MapPin, Search, ChevronRight, Users, ChevronLeft, Home
} from 'lucide-react';
import { AuthProvider, useUser, SignedIn } from './contexts/AuthContext';

const InnerApp = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [activeTour, setActiveTour] = useState<VirtualTour | null>(null);
  const [searchType, setSearchType] = useState<'properties' | 'agents'>('properties');
  const {
    listings, agents, virtualTours, inquiries, maintenanceRequests, contractors,
    updateAgent, addContractor, addListing, updateListing, deleteListing, updateMaintenanceRequest
  } = useData();
  const { user } = useUser();

  const handleAgentImageUpdate = (id: string, newImage: string) => {
    const agent = agents.find(a => a.id === id);
    if (agent) updateAgent({ ...agent, image: newImage });
  };

  const handleViewProfile = (id: string) => {
    setSelectedAgentId(id);
    setCurrentView(AppView.AGENT_DETAILS);
  };

  const handleViewListingDetails = (listing: Listing) => setSelectedListing(listing);
  const handleStartTour = (tour: VirtualTour) => {
    setActiveTour(tour);
    setSelectedListing(null);
  };

  // --- Auth & Role Logic ---
  const getUserRole = (): UserRole => {
    if (!user) return 'AGENT';
    return user.primaryEmailAddress?.emailAddress.includes('agency') ? 'AGENCY' : 'AGENT';
  };

  const getCurrentAgentId = (): string => 'a1';

  const role = getUserRole();
  const agentId = getCurrentAgentId();

  if (currentView === AppView.ADMIN) {
    return (
      <SignedIn>
        <AdminPanel
          onLogout={() => setCurrentView(AppView.HOME)}
          userRole={role}
          currentAgentId={agentId}
        />
      </SignedIn>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.TOUR_CREATOR: return (
        <SignedIn>
          <VirtualTourCreator />
        </SignedIn>
      );
      case AppView.AGENT_DETAILS:
        return selectedAgentId ? (
          <AgentDetails
            agentId={selectedAgentId}
            onBack={() => setCurrentView(AppView.AGENTS)}
            onViewListingDetails={handleViewListingDetails}
          />
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-500 mb-4">Agent not found</p>
              <button
                onClick={() => setCurrentView(AppView.AGENTS)}
                className="text-brand-green font-bold hover:underline"
              >
                Back to Agents
              </button>
            </div>
          </div>
        );
      case AppView.CONVEYANCER:
        return <ConveyancerView />;
      case AppView.MAINTENANCE:
        return <MaintenanceView onViewDetails={setSelectedContractor} />;
      case AppView.CONTRACTOR_REGISTRATION:
        return (
          <ContractorRegistration
            onSubmit={async (contractor) => {
              await addContractor(contractor);
            }}
            onDashboardRedirect={() => setCurrentView(AppView.MAINTENANCE)}
            onCancel={() => setCurrentView(AppView.JOIN_SELECTION)}
          />
        );
      case AppView.JOIN_SELECTION:
        return (
          <JoinSelection
            onSelectType={(type) => {
              if (type === 'contractor') setCurrentView(AppView.CONTRACTOR_REGISTRATION);
              else if (type === 'agency') setCurrentView(AppView.REGISTER_AGENCY);
              else if (type === 'agent') setCurrentView(AppView.REGISTER_AGENT);
            }}
            onCancel={() => setCurrentView(AppView.HOME)}
          />
        );
      case AppView.REGISTER_AGENCY:
        return (
          <AgencyRegistration
            onSubmit={async (agency) => {
              // In a real app, we'd add this to the database
              console.log("Agency Registered:", agency);
              alert('Agency application submitted! We will be in touch shortly.');
              setCurrentView(AppView.HOME);
            }}
            onCancel={() => setCurrentView(AppView.JOIN_SELECTION)}
          />
        );
      case AppView.REGISTER_AGENT:
        return (
          <AgentRegistration
            onSubmit={async (agent) => {
              console.log("Agent Registered:", agent);
              alert('Agent profile received! Verification is pending.');
              setCurrentView(AppView.HOME);
            }}
            onCancel={() => setCurrentView(AppView.JOIN_SELECTION)}
          />
        );
      case AppView.AGENT_DASHBOARD: {
        const currentAgent = agents.find(a => a.id === agentId) || agents[0]; // Fallback to first agent
        return (
          <AgentDashboard
            currentAgent={currentAgent}
            listings={listings}
            virtualTours={virtualTours}
            inquiries={inquiries}
            addListing={addListing}
            updateListing={updateListing}
            deleteListing={deleteListing}
            handleAIDescription={async (l) => {
              console.log("Generating AI description for", l);
              return "This is an AI generated description placeholder. Connect to Gemini API for real generation.";
            }}
            onNavigateToTourCreator={() => setCurrentView(AppView.TOUR_CREATOR)}
          />
        );
      }
      case AppView.MAINTENANCE_DASHBOARD: {
        // In a real app, getting the logged-in contractor
        const currentContractor = contractors[0] || { id: 'c1', name: 'Demo Contractor', trade: 'General', location: 'CT', rating: 5, image: '', phone: '', email: '', description: '', isVerified: true };
        return (
          <MaintenanceDashboard
            currentContractor={currentContractor}
            requests={maintenanceRequests}
            listings={listings}
            updateRequest={updateMaintenanceRequest}
          />
        );
      }
      case AppView.LISTINGS:
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div>
              <h2 className="text-4xl font-serif text-slate-900 mb-2">Exclusive Portfolio</h2>
              <p className="text-slate-500 font-bold">Curated properties for the discerning buyer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {listings.map(l => <PropertyCard key={l.id} listing={l} onViewDetails={handleViewListingDetails} />)}
            </div>
          </div>
        );
      case AppView.AGENTS:
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-serif text-slate-900 mb-4">Elite Representation</h2>
              <p className="text-slate-600 font-bold">Industry leaders in market expertise and service.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {agents.map(a => <AgentCard key={a.id} agent={a} onImageUpdate={handleAgentImageUpdate} onViewProfile={handleViewProfile} />)}
            </div>
          </div>
        );
      case AppView.HOME:
      default:
        return (
          <>
            <div className="relative min-h-[85vh] flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden bg-brand-purple">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" alt="" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-green/50 via-brand-purple/50 to-brand-purpleDark/90"></div>
              </div>
              <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">Find Your Perfect <span className="text-brand-green">Show House Property</span></h1>
                <p className="text-lg md:text-xl text-slate-200 mb-10 font-bold max-w-2xl mx-auto drop-shadow-md">Connect with top agents, conveyancers, and maintenance contractors.</p>
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-5xl mx-auto text-left border-b-4 border-brand-green transition-all duration-300">
                  <div className="flex justify-center space-x-8 mb-6 border-b border-slate-100 pb-4">
                    <button
                      onClick={() => setSearchType('properties')}
                      className={`text-lg font-bold pb-4 -mb-4 transition-colors ${searchType === 'properties' ? 'text-brand-green border-b-2 border-brand-green' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Find Properties
                    </button>
                    <button
                      onClick={() => setSearchType('agents')}
                      className={`text-lg font-bold pb-4 -mb-4 transition-colors ${searchType === 'agents' ? 'text-brand-green border-b-2 border-brand-green' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Find Agents
                    </button>
                  </div>

                  {searchType === 'properties' ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="relative"><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none cursor-pointer"><option>Property Type</option><option>House</option><option>Apartment</option></select></div>
                      <div className="relative"><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none cursor-pointer"><option>Province</option><option>Eastern Cape</option><option>Free State</option><option>Gauteng</option><option>KwaZulu-Natal</option><option>Limpopo</option><option>Mpumalanga</option><option>Northern Cape</option><option>North West</option><option>Western Cape</option></select></div>
                      <div className="relative"><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none cursor-pointer"><option>City</option><option>Cape Town</option></select></div>
                      <div className="relative"><div className="absolute left-3 top-3 text-slate-400"><MapPin size={20} /></div><input type="text" placeholder="Area or Suburb" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none" /></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-2">
                      <div className="relative">
                        <Users className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input type="text" placeholder="Agent Name" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none" />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-400" size={20} />
                        <input type="text" placeholder="Area or City" className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none" />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setCurrentView(searchType === 'properties' ? AppView.LISTINGS : AppView.AGENTS)}
                    className="w-full bg-brand-green hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg transition-colors flex items-center justify-center text-lg uppercase tracking-wider"
                  >
                    <Search size={20} className="mr-2" />
                    {searchType === 'properties' ? 'Search Properties' : 'Search Agents'}
                  </button>
                </div>
              </div>
              <div className="absolute bottom-10 left-0 right-0 max-w-4xl mx-auto px-4 hidden md:block text-center">
                <h2 className="text-5xl font-serif text-white font-bold tracking-wide drop-shadow-lg italic">“From Show to Sold”</h2>
              </div>
            </div>
            <div className="bg-brand-purpleLight py-12">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-serif font-bold text-brand-green mb-4">Featured Collection</h2>
                </div>
                <FeaturedCarousel listings={listings.filter(l => l.isFeatured)} onViewDetails={handleViewListingDetails} />
              </div>
            </div>
            <div className="bg-white py-16">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-end mb-8">
                  <h2 className="text-3xl font-serif font-bold text-slate-900">Latest Properties</h2>
                  <button onClick={() => setCurrentView(AppView.LISTINGS)} className="text-brand-green font-bold text-sm hover:underline flex items-center">
                    View All <ChevronRight size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {listings.map(l => <PropertyCard key={l.id} listing={l} onViewDetails={handleViewListingDetails} />)}
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}

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

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <InnerApp />
      </DataProvider>
    </AuthProvider>
  );
}
