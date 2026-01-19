"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Agent, Listing, Inquiry, Review, VirtualTour, Contractor, Conveyancer, TourStop, MaintenanceRequest } from '../types';
import { propertyService } from '../services/propertyService';
import { agentService } from '../services/agentService';
import { inquiryService } from '../services/inquiryService';
import { contractorService } from '../services/contractorService';
import { conveyancerService } from '../services/conveyancerService';
import { tourService } from '../services/tourService';
import { maintenanceService } from '../services/maintenanceService';




interface DataContextType {
  agents: Agent[];
  listings: Listing[];
  myListings: Listing[];
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
  addAgent: (agent: Agent | Omit<Agent, 'id'>) => Promise<Agent>;
  updateAgent: (agent: Agent) => void;
  deleteAgent: (id: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => Promise<void>;
  updateInquiryStatus: (id: string, status: string) => Promise<void>;
  addReview: (agentId: string, review: Review) => void;
  addTour: (tour: Omit<VirtualTour, 'id' | 'date' | 'stops'>) => Promise<VirtualTour>;
  addTourStop: (tourId: string, stop: Omit<TourStop, 'id' | 'timestamp'>) => Promise<void>;
  updateTour: (tour: VirtualTour) => void;
  deleteTour: (id: string) => Promise<void>;
  addContractor: (contractor: Omit<Contractor, 'id'>) => Promise<Contractor>;
  addAgency?: (agency: any) => Promise<any>;
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
  const { getToken, isSignedIn } = useAuth();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [virtualTours, setVirtualTours] = useState<VirtualTour[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [conveyancers, setConveyancers] = useState<Conveyancer[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = isSignedIn ? await getToken() : undefined;
      const [listings, myListings, agents, inquiries, contractors, conveyancers, tours, maintenance] = await Promise.all([
        propertyService.list(token || undefined).catch(() => []),
        token ? propertyService.listMy(token).catch(() => []) : Promise.resolve([]),
        agentService.list(token || undefined).catch(() => []),
        inquiryService.list(token || undefined).catch(() => []),
        contractorService.list(token || undefined).catch(() => []),
        conveyancerService.list(token || undefined).catch(() => []),
        tourService.list(token || undefined).catch(() => []),
        maintenanceService.getAll(token || undefined).catch(() => []),
      ]);

      setListings(listings);
      setMyListings(myListings);
      setAgents(agents);
      setInquiries(inquiries);
      setContractors(contractors);
      setConveyancers(conveyancers);
      setVirtualTours(tours);
      setMaintenanceRequests(maintenance);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to load data from backend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listings
  const addListing = async (listing: Listing | Omit<Listing, 'id'>) => {
    try {
      const token = await getToken();
      const newListing = await propertyService.create(listing as Listing, token || undefined);
      setListings(prev => [...prev, newListing]);
    } catch (err) {
      console.error('Failed to create listing:', err);
      throw err;
    }
  };

  const updateListing = async (id: string, updates: Partial<Listing>) => {
    try {
      const token = await getToken();
      const updated = await propertyService.update(id, updates, token || undefined);
      setListings(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
    } catch (err) {
      console.error('Failed to update listing:', err);
      throw err;
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const token = await getToken();
      await propertyService.delete(id, token || undefined);
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Failed to delete listing:', err);
      throw err;
    }
  };

  // Agents
  const addAgent = async (agent: Agent | Omit<Agent, 'id'>) => {
    try {
      const token = await getToken();
      // Assuming CreateAgentParams is compatible with Agent | Omit<Agent, 'id'>
      const newAgent = await agentService.create(agent as Agent, token || undefined);
      setAgents(prev => [...prev, newAgent]);
      return newAgent;
    } catch (err) {
      console.error('Failed to add agent:', err);
      // Fallback for demo if API fails/not ready (though it should be)
      const mockAgent = 'id' in agent ? agent : { ...agent, id: `a${agents.length + 1} ` };
      setAgents([...agents, mockAgent as Agent]);
      return mockAgent as Agent;
    }
  };

  const updateAgent = (updatedAgent: Agent) => setAgents(agents.map(a => a.id === updatedAgent.id ? updatedAgent : a));

  const deleteAgent = async (id: string) => {
    try {
      const token = await getToken();
      await agentService.delete(id, token || undefined);
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
      const token = await getToken();
      const newInquiry = await inquiryService.create(data, token || undefined);
      setInquiries(prev => [newInquiry, ...prev]);
    } catch (err) {
      console.error('Failed to send inquiry:', err);
      throw err;
    }
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const token = await getToken();
      await inquiryService.updateStatus(id, status, token || undefined);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: status as 'new' | 'contacted' | 'closed' } : i));
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
      throw err;
    }
  };


  // Tours
  const addTour = async (data: Omit<VirtualTour, 'id' | 'date' | 'stops'>) => {
    try {
      const token = await getToken();
      const newTour = await tourService.create(data as any, token || undefined);
      setVirtualTours(prev => [newTour, ...prev]);
      return newTour;
    } catch (err) {
      console.error('Failed to create tour:', err);
      throw err;
    }
  };

  const addTourStop = async (tourId: string, stop: Omit<TourStop, 'id' | 'timestamp'>) => {
    try {
      const token = await getToken();
      const newStop = await tourService.addStop(tourId, stop as any, token || undefined);
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
      const token = await getToken();
      await tourService.delete(id, token || undefined);
      setVirtualTours(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete tour:', err);
      throw err;
    }
  };

  // Contractors
  const addContractor = async (data: Omit<Contractor, 'id'>) => {
    try {
      const token = await getToken();
      const newContractor = await contractorService.create(data, token || undefined);
      setContractors(prev => [...prev, newContractor]);
      return newContractor;
    } catch (err) {
      console.error('Failed to add contractor:', err);
      throw err;
    }
  };

  // Agencies (New)
  // Assuming agencyService is imported
  const addAgency = async (data: any) => {
    // Stub for agency creation
    // const newAgency = await agencyService.create(data);
    // setAgencies...
    return { id: 'test', ...data };
  };

  const deleteContractor = async (id: string) => {
    try {
      const token = await getToken();
      await contractorService.delete(id, token || undefined);
      setContractors(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete contractor:', err);
      throw err;
    }
  };

  // Conveyancers
  const addConveyancer = async (data: Omit<Conveyancer, 'id'>) => {
    try {
      const token = await getToken();
      const newConveyancer = await conveyancerService.create(data, token || undefined);
      setConveyancers(prev => [...prev, newConveyancer]);
    } catch (err) {
      console.error('Failed to add conveyancer:', err);
      throw err;
    }
  };

  const deleteConveyancer = async (id: string) => {
    try {
      const token = await getToken();
      await conveyancerService.delete(id, token || undefined);
      setConveyancers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete conveyancer:', err);
      throw err;
    }
  };

  // Maintenance Requests
  const addMaintenanceRequest = async (data: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const token = await getToken();
      const newRequest = await maintenanceService.create(data, token || undefined);
      setMaintenanceRequests(prev => [newRequest, ...prev]);
    } catch (err) {
      console.error('Failed to create maintenance request:', err);
      throw err;
    }
  };

  const updateMaintenanceRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const token = await getToken();
      await maintenanceService.update(id, updates, token || undefined);
      setMaintenanceRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));
    } catch (err) {
      console.error('Failed to update maintenance request:', err);
      throw err;
    }
  };

  const deleteMaintenanceRequest = async (id: string) => {
    try {
      const token = await getToken();
      await maintenanceService.delete(id, token || undefined);
      setMaintenanceRequests(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete maintenance request:', err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      agents, listings, myListings, inquiries, virtualTours, contractors, conveyancers, maintenanceRequests,
      isLoading, error,
      addListing, updateListing, deleteListing,
      addAgent, updateAgent, deleteAgent, addReview,
      addInquiry, updateInquiryStatus,
      addTour, addTourStop, updateTour, deleteTour,
      addContractor, deleteContractor,
      addConveyancer, deleteConveyancer,
      addMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest,
      addAgency,
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
