# Quick Start Guide - Dashboards

## For Agents

### Accessing the Dashboard
```typescript
// In your App.tsx, set view to AppView.AGENT_DASHBOARD
setView(AppView.AGENT_DASHBOARD);
```

### Upload a New Listing
1. Click "Upload New Listing" button
2. Upload property image
3. Fill in details:
   - Title (required)
   - Price (required)
   - Address (required)
   - Beds, baths, size
   - Status (active, new, on_show, reduced)
4. Click "AI Generate" for description (optional)
5. Submit

### Manage Existing Listings
- **View**: Click "View" button on any listing card
- **Edit**: Click edit icon
- **Delete**: Click trash icon (requires confirmation)

### Track Performance
Dashboard automatically shows:
- Active listings count
- Properties sold
- New inquiries
- Virtual tours created
- Average property price

---

## For Maintenance Contractors

### Accessing the Dashboard
```typescript
// In your App.tsx, set view to AppView.MAINTENANCE_DASHBOARD
setView(AppView.MAINTENANCE_DASHBOARD);
```

### View Work Orders
- All assigned requests shown as cards
- Color-coded by priority:
  - 🔴 Urgent (red)
  - 🟠 High (orange)
  - 🟡 Medium (amber)
  - 🔵 Low (blue)

### Filter Requests
Use the filter bar to search by:
- **Search term**: Title, description, category
- **Status**: Pending, assigned, in progress, completed
- **Priority**: Urgent, high, medium, low

### Update Job Status
1. Click on any work order card
2. Modal opens with full details
3. Click status button:
   - "In Progress" - Start work
   - "Mark Complete" - Finish job

### Track Earnings
Dashboard shows:
- Pending work count
- Jobs in progress
- Completed jobs
- Total earnings (sum of actualCost from completed jobs)

---

## Integration Example

```typescript
// App.tsx example integration
import { AgentDashboard } from './components/AgentDashboard';
import { MaintenanceDashboard } from './components/MaintenanceDashboard';
import { useData } from './contexts/DataContext';

function App() {
  const {
    listings,
    agents,
    contractors,
    maintenanceRequests,
    virtualTours,
    inquiries,
    addListing,
    updateListing,
    deleteListing,
    updateMaintenanceRequest
  } = useData();

  const [view, setView] = useState(AppView.HOME);
  const currentAgent = agents[0]; // Get from auth
  const currentContractor = contractors[0]; // Get from auth

  const renderContent = () => {
    switch (view) {
      case AppView.AGENT_DASHBOARD:
        return (
          <AgentDashboard
            currentAgent={currentAgent}
            listings={listings}
            virtualTours={virtualTours}
            inquiries={inquiries}
            addListing={addListing}
            updateListing={updateListing}
            deleteListing={deleteListing}
            handleAIDescription={async (listing) => {
              // Your AI description logic
              const response = await fetch('/api/generate-description', {
                method: 'POST',
                body: JSON.stringify(listing)
              });
              const data = await response.json();
              return data.description;
            }}
            onNavigateToTourCreator={() => setView(AppView.TOUR_CREATOR)}
          />
        );

      case AppView.MAINTENANCE_DASHBOARD:
        return (
          <MaintenanceDashboard
            currentContractor={currentContractor}
            requests={maintenanceRequests}
            listings={listings}
            updateRequest={updateMaintenanceRequest}
          />
        );

      default:
        return <HomePage />;
    }
  };

  return <div>{renderContent()}</div>;
}
```

---

## Backend Requirements

### Encore.ts Services Needed

#### Properties Service
```typescript
// properties.ts
export const update = api(
  { method: "PUT", path: "/properties/:id" },
  async ({ id, ...data }: { id: string } & Partial<Listing>): Promise<Listing> => {
    // Update property in Neon DB
    return updatedListing;
  }
);
```

#### Maintenance Service
```typescript
// maintenance.ts
export const create = api(
  { method: "POST", path: "/api/maintenance" },
  async (request: CreateMaintenanceRequest): Promise<MaintenanceRequest> => {
    // Create in Neon DB
    return newRequest;
  }
);

export const update = api(
  { method: "PUT", path: "/api/maintenance/:id" },
  async ({ id, ...updates }: { id: string } & Partial<MaintenanceRequest>): Promise<MaintenanceRequest> => {
    // Update in Neon DB
    return updatedRequest;
  }
);

export const getAll = api(
  { method: "GET", path: "/api/maintenance" },
  async (): Promise<MaintenanceRequest[]> => {
    // Fetch from Neon DB
    return requests;
  }
);
```

---

## Clerk Auth Integration

Add role-based routing:

```typescript
import { useUser } from './contexts/AuthContext';

function App() {
  const { user } = useUser();
  
  // Determine user role from Clerk metadata
  const userRole: UserRole = user?.publicMetadata?.role || 'AGENT';
  
  // Route to appropriate dashboard
  useEffect(() => {
    if (userRole === 'AGENT') {
      setView(AppView.AGENT_DASHBOARD);
    } else if (userRole === 'CONTRACTOR') {
      setView(AppView.MAINTENANCE_DASHBOARD);
    }
  }, [userRole]);
}
```

---

**Ready to go!** Build succeeded ✅
