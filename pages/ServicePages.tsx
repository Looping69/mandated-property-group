import React from 'react';
import { ServiceShowProperty } from '../components/ServiceShowProperty';
import { ServiceTopAreaAgent } from '../components/ServiceTopAreaAgent';
import { ServiceMaintenance } from '../components/ServiceMaintenance';
import { ServiceConveyancing } from '../components/ServiceConveyancing';
import { ServicePartnerPortal } from '../components/ServicePartnerPortal';

export const ServiceShowPropertyPage: React.FC = () => <ServiceShowProperty />;
export const ServiceTopAreaAgentPage: React.FC = () => <ServiceTopAreaAgent />;
export const ServiceMaintenancePage: React.FC = () => <ServiceMaintenance />;
export const ServiceConveyancingPage: React.FC = () => <ServiceConveyancing />;
export const ServicePartnerPortalPage: React.FC = () => <ServicePartnerPortal />;
