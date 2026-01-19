// Central export for all API services
// This allows for cleaner imports: import { agentService, maintenanceService } from './services';

export { agentService, type CreateAgentParams, type ExtendedAgent } from './agentService';
export { agencyService, type Agency, type CreateAgencyParams, type AgencyAgent } from './agencyService';
export { contractorService, type CreateContractorParams } from './contractorService';
export { conveyancerService, type CreateConveyancerParams } from './conveyancerService';
export { inquiryService, type CreateInquiryParams } from './inquiryService';
export { maintenanceService } from './maintenanceService';
export { propertyService } from './propertyService';
export { tourService, type CreateTourParams, type CreateTourStopParams } from './tourService';
export { userService, type SignupParams, type LoginParams, type UpdateUserParams } from './userService';

// Re-export API config for custom requests
export { apiRequest } from './apiConfig';
