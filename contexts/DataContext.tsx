"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent, Listing, Inquiry, Review, VirtualTour, Contractor, Conveyancer, TourStop, MaintenanceRequest } from '../types';
import { AGENTS as MOCK_AGENTS, LISTINGS as MOCK_LISTINGS } from '../constants';
import { propertyService } from '../services/propertyService';
import { agentService } from '../services/agentService';
import { inquiryService } from '../services/inquiryService';
import { contractorService } from '../services/contractorService';
import { conveyancerService } from '../services/conveyancerService';
import { tourService } from '../services/tourService';
import { maintenanceService } from '../services/maintenanceService';

// Mock data for contractors and conveyancers
const MOCK_CONTRACTORS: Contractor[] = [
  { id: 'c1', name: "BuildRight Construction", trade: "General Building", location: "Johannesburg", rating: 4.7, image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=400", phone: "+27 11 555 1234", email: "info@buildright.co.za", description: "Specializing in luxury home renovations.", isVerified: true, hourlyRate: 850 },
  { id: 'c2', name: "FlowMaster Plumbing", trade: "Plumbing", location: "Durban", rating: 4.9, image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=400", phone: "+27 31 555 5678", email: "support@flowmaster.co.za", description: "24/7 Emergency plumbing services.", isVerified: true, hourlyRate: 650 },
  { id: 'c3', name: "Spark Electrical", trade: "Electrical", location: "Cape Town", rating: 4.8, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400", phone: "+27 21 555 9012", email: "help@sparkelec.co.za", description: "Smart home integration specialists.", isVerified: true, hourlyRate: 750 },
];

const MOCK_CONVEYANCERS: Conveyancer[] = [
  { id: 'cv1', name: "Norton & Associates", specialist: "Property Transfers", location: "Cape Town", rating: 5, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400", website: "https://www.nortoninc.co.za", isVerified: true, phone: "+27 21 555 8888" },
  { id: 'cv2', name: "Prestige Legal", specialist: "Bond Registrations", location: "Sandton", rating: 4.8, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400", website: "https://www.prestigelegal.co.za", isVerified: true, phone: "+27 11 555 9999" },
];

const MOCK_TOURS: VirtualTour[] = [
  {
    id: 'vt1', title: 'Clifton Obsidian Walkthrough', agentId: 'a1', listingId: 'l1', date: new Date().toISOString(), status: 'published',
    stops: [
      { id: 's1', title: 'Entrance Hall', description: 'A grand double-volume entrance featuring imported Italian marble.', image: 'https://picsum.photos/id/164/800/600', timestamp: Date.now() },
      { id: 's2', title: 'Living Area', description: 'Open plan living space with ocean views.', image: 'https://picsum.photos/id/188/800/600', timestamp: Date.now() }
    ]
  }
];

interface DataContextType {
  agents: Agent[];
  listings: Listing[];
  inquiries: Inquiry[];
  virtualTours: VirtualTour[];
  contractors: Contractor[];
  conveyancers: Conveyancer[];
  maintenanceRequests: MaintenanceRequest[];
  isLoading: boolean;
  error: string | null;
  addListing: (listing: Listing | Omit<Listing, 'id'>) => Promise<void>;
  updateListing: (id: string, updates: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  addAgent: (agent: Agent | Omit<Agent, 'id'>) => Promise<void>;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: string) => Promise<void>;
  addReview: (agentId: string, review: Review) => void;
  addTour: (tour: Omit<VirtualTour, 'id' | 'date' | 'stops'>) => Promise<VirtualTour>;
  addTourStop: (tourId: string, stop: Omit<TourStop, 'id' | 'timestamp'>) => Promise<void>;
  updateTour: (tour: VirtualTour) => void;
  deleteTour: (id: string) => Promise<void>;
  addContractor: (contractor: Omit<Contractor, 'id'>) => Promise<void>;
  deleteContractor: (id: string) => Promise<void>;
  addConveyancer: (conveyancer: Omit<Conveyancer, 'id'>) => Promise<void>;
  deleteConveyancer: (id: string) => Promise<void>;
  addMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMaintenanceRequest: (id: string, updates: Partial<MaintenanceRequest>) => Promise<void>;
  deleteMaintenanceRequest: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [virtualTours, setVirtualTours] = useState<VirtualTour[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [conveyancers, setConveyancers] = useState<Conveyancer[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [listingsRes, agentsRes, inquiriesRes, contractorsRes, conveyancersRes, toursRes, maintenanceRes] = await Promise.all([
        propertyService.list().catch(() => ({ listings: [] })),
        agentService.list().catch(() => ({ agents: [] })),
        inquiryService.list().catch(() => ({ inquiries: [] })),
        contractorService.list().catch(() => ({ contractors: [] })),
        conveyancerService.list().catch(() => ({ conveyancers: [] })),
        tourService.list().catch(() => ({ tours: [] })),
        maintenanceService.getAll().catch(() => []),
      ]);

      setListings(listingsRes.listings.length > 0 ? listingsRes.listings : MOCK_LISTINGS);
      setAgents(agentsRes.agents.length > 0 ? agentsRes.agents : MOCK_AGENTS);
      setInquiries(inquiriesRes.inquiries);
      setContractors(contractorsRes.contractors.length > 0 ? contractorsRes.contractors : MOCK_CONTRACTORS);
      setConveyancers(conveyancersRes.conveyancers.length > 0 ? conveyancersRes.conveyancers : MOCK_CONVEYANCERS);
      setVirtualTours(toursRes.tours.length > 0 ? toursRes.tours : MOCK_TOURS);
      setMaintenanceRequests(Array.isArray(maintenanceRes) ? maintenanceRes : []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Connection to Mandated Cloud Backend failed. Using local cache.');
      setListings(MOCK_LISTINGS);
      setAgents(MOCK_AGENTS);
      setContractors(MOCK_CONTRACTORS);
      setConveyancers(MOCK_CONVEYANCERS);
      setVirtualTours(MOCK_TOURS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listings
  const addListing = async (listing: Listing | Omit<Listing, 'id'>) => {
    try {
      const newListing = await propertyService.create(listing as Listing);
      setListings(prev => [...prev, newListing]);
    } catch (err) {
      console.error('Failed to create listing:', err);
      throw err;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const updated = await propertyService.update(id, updates);
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
    } catch (err) {
      console.error('Failed to update listing:', err);
      throw err;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      await propertyService.delete(id);
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
      throw err;
    }
  };

  // Agents
  const addAgent = async (agent: Agent | Omit<Agent, 'id'>) => {
    try {
      const newAgent = await agentService.create(agent as Agent);
      setAgents(prev => [...prev, newAgent]);
    } catch (err) {
      console.error('Failed to add agent:', err);
      // Fallback for demo if API fails/not ready (though it should be)
      const mockAgent = 'id' in agent ? agent : { ...agent, id: `a${agents.length + 1}` };
      setAgents([...agents, mockAgent as Agent]);
    }
  };

  const updateAgent = (updatedAgent: Agent) => setAgents(agents.map(a => a.id === updatedAgent.id ? updatedAgent : a));

  const deleteAgent = async (id: string) => {
    try {
      await agentService.delete(id);
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Failed to delete agent:", err);
      // Fallback
      setAgents(prev => prev.filter(a => a.id !== id));
    }
  };
  const addReview = (agentId: string, review: Review) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, reviews: [review, ...a.reviews] } : a));
  };

  // Inquiries
  const addInquiry = async (data: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
    try {
      const newInquiry = await inquiryService.create(data);
      setInquiries(prev => [newInquiry, ...prev]);
    } catch (err) {
      console.error('Failed to send inquiry:', err);
      throw err;
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      await inquiryService.updateStatus(id, status);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: status as 'new' | 'contacted' | 'closed' } : i));
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
      throw err;
    }
  };


  // Tours
  const addTour = async (data: Omit<VirtualTour, 'id' | 'date' | 'stops'>) => {
    try {
      const newTour = await tourService.create(data as any);
      setVirtualTours(prev => [newTour, ...prev]);
      return newTour;
    } catch (err) {
      console.error('Failed to create tour:', err);
      throw err;
    }
  };

  const addTourStop = async (tourId: string, stop: Omit<TourStop, 'id' | 'timestamp'>) => {
    try {
      const newStop = await tourService.addStop(tourId, stop as any);
      setVirtualTours(prev => prev.map(t =>
        t.id === tourId ? { ...t, stops: [...t.stops, { ...newStop, timestamp: Date.now() }] } : t
      ));
    } catch (err) {
      console.error('Failed to add tour stop:', err);
      throw err;
    }
  };

  const updateTour = (updated: VirtualTour) => setVirtualTours(prev => prev.map(t => t.id === updated.id ? updated : t));

  const deleteTour = async (id: string) => {
    try {
      await tourService.delete(id);
      setVirtualTours(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete tour:', err);
      throw err;
    }
  };

  // Contractors
  const addContractor = async (data: Omit<Contractor, 'id'>) => {
    try {
      const newContractor = await contractorService.create(data);
      setContractors(prev => [...prev, newContractor]);
    } catch (err) {
      console.error('Failed to add contractor:', err);
      throw err;
    }
  };

  const deleteContractor = async (id: string) => {
    try {
      await contractorService.delete(id);
      setContractors(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete contractor:', err);
      throw err;
    }
  };

  // Conveyancers
  const addConveyancer = async (data: Omit<Conveyancer, 'id'>) => {
    try {
      const newConveyancer = await conveyancerService.create(data);
      setConveyancers(prev => [...prev, newConveyancer]);
    } catch (err) {
      console.error('Failed to add conveyancer:', err);
      throw err;
    }
  };

  const deleteConveyancer = async (id: string) => {
    try {
      await conveyancerService.delete(id);
      setConveyancers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete conveyancer:', err);
      throw err;
    }
  };

  // Maintenance Requests
  const addMaintenanceRequest = async (data: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newRequest = await maintenanceService.create(data);
      setMaintenanceRequests(prev => [newRequest, ...prev]);
    } catch (err) {
      console.error('Failed to create maintenance request:', err);
      throw err;
    }
  };

  const updateMaintenanceRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const updated = await maintenanceService.update(id, updates);
      setMaintenanceRequests(prev => prev.map(r => r.id === id ? updated : r));
    } catch (err) {
      console.error('Failed to update maintenance request:', err);
      throw err;
    }
  };

  const deleteMaintenanceRequest = async (id: string) => {
    try {
      await maintenanceService.delete(id);
      setMaintenanceRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete maintenance request:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      agents, listings, inquiries, virtualTours, contractors, conveyancers, maintenanceRequests,
      isLoading, error,
      addListing, updateListing, deleteListing,
      addAgent, updateAgent, deleteAgent, addReview,
      addInquiry, updateInquiryStatus,
      addTour, addTourStop, updateTour, deleteTour,
      addContractor, deleteContractor,
      addConveyancer, deleteConveyancer,
      addMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest,
      refreshData: fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
