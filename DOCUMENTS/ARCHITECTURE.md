# Architecture & Technical Design

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Design Patterns](#design-patterns)
5. [Data Flow](#data-flow)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [API Architecture](#api-architecture)
9. [Database Schema](#database-schema)
10. [Performance Optimization](#performance-optimization)
11. [Security Architecture](#security-architecture)

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                       │
│                   React 18 + TypeScript                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Presentation Layer (Components, Pages, UI)              │  │
│  │  - shadcn/ui Components                                  │  │
│  │  - Tailwind CSS Styling                                  │  │
│  │  - Framer Motion Animations                              │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                    │  │
│  │  - Custom Hooks (React)                                  │  │
│  │  - Utility Functions                                     │  │
│  │  - Form Validation (React Hook Form + Zod)              │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Data Layer                                              │  │
│  │  - TanStack React Query (Server State)                   │  │
│  │  - Local State (useState/Context)                        │  │
│  │  - Browser Storage (localStorage)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                           │
│                    (REST API, Node.js)                           │
│  - Request Routing                                              │
│  - Authentication/Authorization                                │
│  - Rate Limiting                                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
    ┌─────────┐     ┌──────────┐     ┌──────────┐
    │ Database│     │AI Service│     │3rd Party │
    │MongoDB  │     │Anthropic │     │APIs      │
    └─────────┘     │Claude    │     │Google    │
                    └──────────┘     │Facebook  │
                                     │etc.      │
                                     └──────────┘
```

### Architectural Layers

#### 1. **Presentation Layer**
- React components using shadcn/ui
- Tailwind CSS for styling
- Framer Motion for animations
- Page-level components in `src/pages/`
- Reusable UI components in `src/components/`

#### 2. **Business Logic Layer**
- Custom React hooks in `src/hooks/`
- Utility functions in `src/lib/`
- Form handling with React Hook Form + Zod
- Component composition pattern

#### 3. **Data Management Layer**
- TanStack React Query for server state
- React Context for client state
- localStorage for persistence
- API client abstraction

#### 4. **Backend API Layer**
- Node.js/Express server
- Request routing and validation
- Authentication middleware
- Database operations

#### 5. **Data Layer**
- MongoDB database
- Collections for entities
- Indexing for performance
- Query optimization

#### 6. **External Services**
- Anthropic Claude API for AI
- Google APIs for analytics
- Social media APIs

---

## 🔧 Technology Stack

### Frontend Stack
```
React 18
├── Core Library
├── ReactDOM
├── React Router v6 (Routing)
├── React Query v5 (Server State)
└── React Hook Form (Forms)

Styling & UI
├── Tailwind CSS
├── shadcn/ui
├── Radix UI Primitives
├── Framer Motion (Animations)
└── Lucide React (Icons)

Utilities
├── TypeScript (Type Safety)
├── Vite (Build Tool)
├── SWC (React Transpiler)
└── date-fns (Date Manipulation)

Validation
├── Zod (Schema Validation)
└── @hookform/resolvers

Charts & Visualization
├── Recharts (Charts)
└── embla-carousel (Carousels)
```

### Backend Stack
```
Runtime & Framework
├── Node.js (JavaScript Runtime)
└── Express.js (Web Framework)

Database
├── MongoDB (NoSQL Database)
└── Mongoose (ODM - optional)

Authentication
├── JWT (JSON Web Tokens)
└── OAuth 2.0

External Services
├── Anthropic API (AI)
├── Google APIs
├── googleapis (Node.js Client)
└── google-auth-library

File Handling
├── Multer (File Upload)
└── Sharp (Image Processing)

Utilities
├── dotenv (Environment Variables)
├── cors (Cross-Origin Support)
└── helmet (Security Headers)
```

### Development Tools
```
Testing
├── Vitest (Unit Tests)
├── @testing-library/react (React Testing)
└── @testing-library/user-event

Code Quality
├── ESLint (Linting)
├── Prettier (Formatting)
└── TypeScript (Type Checking)

Build & Dev
├── Vite (Dev Server & Build)
├── npm (Package Manager)
└── Git (Version Control)
```

---

## 📁 Project Structure

### Directory Organization

```
ai-marketing-loop/
│
├── src/
│   ├── pages/                           # Route pages (one per URL path)
│   │   ├── DashboardPage.tsx           # Dashboard main view
│   │   ├── AdsManagerPage.tsx          # Advertising management
│   │   ├── StrategyPage.tsx            # AI strategy generation
│   │   ├── CompetitorIntelPage.tsx     # Competitor analysis
│   │   ├── ContentLibraryPage.tsx      # Asset management
│   │   ├── ReportsPage.tsx             # Analytics reports
│   │   ├── CompanyPage.tsx             # Company profile
│   │   ├── SettingsPage.tsx            # User settings
│   │   ├── KpiProjectionsPage.tsx      # KPI forecasting
│   │   ├── UsageSummaryPage.tsx        # Usage analytics
│   │   ├── OnboardingPage.tsx          # Setup wizard
│   │   ├── LoginPage.tsx               # Authentication
│   │   ├── LandingPage.tsx             # Marketing page
│   │   └── NotFound.tsx                # 404 page
│   │
│   ├── components/                     # Reusable components
│   │   ├── ui/                         # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── form.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── sonner.tsx
│   │   │   └── ... (40+ shadcn components)
│   │   │
│   │   ├── dashboard/                  # Dashboard-specific components
│   │   │   ├── WidgetPanel.tsx        # Widget container
│   │   │   ├── WidgetRenderer.tsx     # Dynamic widget renderer
│   │   │   └── SortableWidget.tsx     # Drag-drop widget
│   │   │
│   │   ├── charts/                     # Charting components
│   │   │   └── ChartTooltip.tsx       # Custom chart tooltip
│   │   │
│   │   ├── onboarding/                 # Onboarding step components
│   │   │   ├── OnboardingStepper.tsx  # Multi-step form
│   │   │   ├── StepCompany.tsx        # Step 1: Company info
│   │   │   ├── StepGoal.tsx           # Step 2: Goals
│   │   │   ├── StepBudget.tsx         # Step 3: Budget
│   │   │   ├── StepAccounts.tsx       # Step 4: Integrations
│   │   │   ├── StepAudience.tsx       # Step 5: Audience
│   │   │   ├── StepCreative.tsx       # Step 6: Content
│   │   │   ├── StepReporting.tsx      # Step 7: Reporting
│   │   │   ├── StepReview.tsx         # Step 8: Review
│   │   │   ├── FileUploadCard.tsx
│   │   │   └── SeedUploadCard.tsx
│   │   │
│   │   ├── strategy/                   # Strategy module components
│   │   │   ├── CompanyProfileSection.tsx
│   │   │   ├── CompetitorIntelSection.tsx
│   │   │   └── PerformanceSummarySection.tsx
│   │   │
│   │   ├── AppSidebar.tsx             # Main navigation sidebar
│   │   ├── DashboardLayout.tsx        # Main layout wrapper
│   │   ├── NavLink.tsx                # Navigation link component
│   │   └── InfoTooltip.tsx            # Info tooltip component
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── use-dashboard-layout.ts    # Dashboard state management
│   │   ├── use-debounced-save.ts      # Debounced save hook
│   │   ├── use-mobile.tsx             # Mobile detection
│   │   ├── use-toast.ts               # Toast notifications
│   │   └── use-user-config.ts         # User preferences
│   │
│   ├── lib/                            # Utility functions & helpers
│   │   ├── api.ts                      # API client/baseURL config
│   │   ├── utils.ts                    # General utilities (cn helper)
│   │   ├── dashboard-widgets.ts       # Widget configurations
│   │   └── mock-data.ts               # Mock data for development
│   │
│   ├── App.tsx                         # Main app component & routing
│   ├── main.tsx                        # React DOM render entry
│   └── index.css                       # Global styles
│
├── server/                             # Backend API server
│   ├── server.js                       # Express server entry point
│   ├── package.json                    # Server dependencies
│   ├── accounts/                       # User data files
│   │   ├── user@email.json            # User config/data
│   │   └── user@email_agent_logs.json # AI agent logs
│   └── uploads/                        # User file uploads
│       ├── user@email/
│       │   ├── logos/
│       │   ├── fonts/
│       │   ├── seedAudience/
│       │   └── styleGuides/
│       └── tmp/
│
├── public/                             # Static assets
│   └── robots.txt
│
├── DOCUMENTS/                          # Documentation
│   ├── README.md                       # This file
│   ├── SETUP.md                        # Setup guide
│   ├── FEATURES.md                     # Feature documentation
│   ├── ARCHITECTURE.md                 # This file
│   ├── API.md                          # API documentation
│   └── CONTRIBUTING.md                 # Contributing guide
│
├── Configuration Files
│   ├── package.json                    # Frontend dependencies
│   ├── tsconfig.json                   # TypeScript config
│   ├── vite.config.ts                  # Vite configuration
│   ├── tailwind.config.ts              # Tailwind CSS config
│   ├── eslint.config.js                # ESLint configuration
│   ├── postcss.config.js               # PostCSS configuration
│   ├── vitest.config.ts                # Testing configuration
│   └── components.json                 # shadcn/ui config
│
└── Root Files
    ├── index.html                      # HTML entry point
    ├── README.md                       # Original readme
    ├── AI_RULES.md                     # Development rules
    └── .gitignore                      # Git ignore rules
```

---

## 🎯 Design Patterns

### 1. **Component Composition Pattern**
```tsx
// Small, focused components composed together
function WidgetPanel({ children }) {
  return <div className="border rounded-lg">{children}</div>;
}

function ChartWidget() {
  return (
    <WidgetPanel>
      <Chart data={data} />
    </WidgetPanel>
  );
}
```

### 2. **Custom Hooks Pattern**
```tsx
// Logic abstracted into reusable hooks
function useDashboardLayout() {
  const [layout, setLayout] = useState([]);
  const saveLayout = useCallback((newLayout) => {
    setLayout(newLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(newLayout));
  }, []);
  
  return { layout, saveLayout };
}
```

### 3. **React Query Pattern**
```tsx
// Server state management
function CompaniesComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: () => api.getCompanies(),
  });
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorBoundary />;
  
  return <CompanyList companies={data} />;
}
```

### 4. **React Hook Form Pattern**
```tsx
// Type-safe form handling
const form = useForm<CompanyFormData>({
  resolver: zodResolver(companySchema),
});

const onSubmit = form.handleSubmit((data) => {
  // Process form data
});
```

### 5. **Container/Presentational Pattern**
```tsx
// Container (Smart Component)
function CompanyContainer() {
  const { data } = useQuery({ queryKey: ['company'] });
  return <CompanyPresentation company={data} />;
}

// Presentational (Dumb Component)
function CompanyPresentation({ company }: Props) {
  return <div>{company.name}</div>;
}
```

### 6. **Provider Pattern**
```tsx
// Context for global state
<QueryClientProvider client={queryClient}>
  <TooltipProvider>
    <App />
  </TooltipProvider>
</QueryClientProvider>
```

---

## 🔄 Data Flow

### User Interaction Data Flow

```
User Action
    │
    ▼
Event Handler (onClick, onChange, etc.)
    │
    ▼
State Update (useState/useReducer/Context)
    │
    ▼
Component Re-render
    │
    ▼
UI Update (Visual Feedback)
```

### Server Data Flow

```
Component Mount / User Action
    │
    ▼
React Query useQuery/useMutation
    │
    ▼
API Call (fetch/axios)
    │
    ▼
Backend Route Handler
    │
    ▼
Database Query
    │
    ▼
Response Processed
    │
    ▼
React Query Cache Updated
    │
    ▼
Component Re-renders with New Data
```

### Complex Form Submission Flow

```
Form Submission
    │
    ▼
Validation (Zod Schema)
    │
    ├─ Valid: Continue ──┐
    │                    │
    └─ Invalid: Show     │
      Error Messages     │
                         ▼
                   API Request
                         │
                    ┌────┴────┐
                    ▼         ▼
                 Success    Error
                    │         │
                    ▼         ▼
              Update Cache  Show Toast
              Close Dialog  Keep Form
                 Redirect
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
App (Root)
├── QueryClientProvider
├── TooltipProvider
├── Toaster (Toast Notifications)
└── BrowserRouter
    └── Routes
        ├── LandingPage (Public)
        ├── LoginPage (Public)
        ├── OnboardingPage (Protected)
        └── ProtectedRoute (Private Routes)
            └── DashboardLayout
                ├── AppSidebar
                ├── MainContent
                │   ├── DashboardPage
                │   │   ├── WidgetPanel
                │   │   └── WidgetRenderer
                │   │
                │   ├── AdsManagerPage
                │   ├── StrategyPage
                │   ├── CompetitorIntelPage
                │   ├── ContentLibraryPage
                │   ├── ReportsPage
                │   ├── CompanyPage
                │   ├── SettingsPage
                │   └── ... (other pages)
                │
                └── Footer
```

### Component Types

#### 1. Page Components (`src/pages/`)
- Top-level route components
- Handle page-level state and logic
- Compose multiple feature components
- Example: `DashboardPage.tsx`

#### 2. Feature Components (`src/components/`)
- Mid-level components for specific features
- Examples: `WidgetPanel.tsx`, `CompanyForm.tsx`
- Composed of smaller UI components

#### 3. UI Components (`src/components/ui/`)
- Base components from shadcn/ui
- Low-level reusable UI elements
- Examples: `Button`, `Card`, `Input`, `Dialog`
- Should NOT be modified directly

#### 4. Layout Components
- `DashboardLayout.tsx` - Main app layout
- `AppSidebar.tsx` - Navigation sidebar

#### 5. Specialized Components
- `WidgetRenderer.tsx` - Dynamic component rendering
- `SortableWidget.tsx` - Drag-drop functionality
- `ChartTooltip.tsx` - Custom chart tooltips

---

## 💾 State Management

### 1. **Server State** (TanStack React Query)
- API responses
- Database data
- Asynchronous operations
- Caching strategy

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['users', userId],
  queryFn: () => api.getUser(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
});
```

### 2. **Client State** (React State)
- UI state (modals, dropdowns, forms)
- User input
- Form values
- Temporary state

```tsx
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState(initialValues);
```

### 3. **Global Client State** (React Context)
- User authentication info
- Theme preferences
- Global app settings
- Cross-component communication

```tsx
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 4. **Persistent State** (localStorage)
- Dashboard layout preferences
- Theme selection
- User preferences
- Session tokens

```tsx
useEffect(() => {
  localStorage.setItem('dashboardLayout', JSON.stringify(layout));
}, [layout]);

const savedLayout = JSON.parse(localStorage.getItem('dashboardLayout'));
```

---

## 🔌 API Architecture

### API Endpoints Structure

```
Backend API (http://localhost:3000)
├── /api/auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── GET /me
│
├── /api/companies
│   ├── GET / - Get all companies
│   ├── POST / - Create company
│   ├── GET /:id - Get specific company
│   ├── PUT /:id - Update company
│   └── DELETE /:id - Delete company
│
├── /api/campaigns
│   ├── GET / - List campaigns
│   ├── POST / - Create campaign
│   ├── GET /:id - Get campaign details
│   ├── PUT /:id - Update campaign
│   └── DELETE /:id - Delete campaign
│
├── /api/analytics
│   ├── GET /dashboard - Dashboard metrics
│   ├── GET /campaigns/:id - Campaign analytics
│   ├── GET /traffic - Traffic analytics
│   └── GET /kpi-projection - KPI forecasting
│
├── /api/strategy
│   ├── POST /generate - Generate strategy
│   ├── GET /history - History of strategies
│   └── GET /:id - Get specific strategy
│
├── /api/competitor
│   ├── GET /analysis - Competitor analysis
│   ├── POST /add - Add competitor
│   └── GET /:id - Specific competitor
│
├── /api/content
│   ├── GET /library - Content assets
│   ├── POST /upload - Upload asset
│   ├── DELETE /:id - Delete asset
│   └── GET /recommendations - Content ideas
│
├── /api/reports
│   ├── GET / - List reports
│   ├── POST / - Generate report
│   ├── GET /:id - Get report
│   └── POST /:id/export - Export report
│
└── /api/settings
    ├── GET /user - User settings
    ├── PUT /user - Update settings
    ├── POST /integrations - Add integration
    └── GET /integrations - List integrations
```

### API Client Implementation

```tsx
// lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  async request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  },

  companies: {
    getAll: () => api.request('/api/companies'),
    getOne: (id) => api.request(`/api/companies/${id}`),
    create: (data) => api.request('/api/companies', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  },

  // ... other endpoints
};
```

---

## 🗄️ Database Schema

### Core Collections

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,
  firstName: String,
  lastName: String,
  phone: String,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isActive: Boolean,
  role: Enum['admin', 'manager', 'analyst'],
  preferences: {
    theme: String,
    timeZone: String,
    language: String,
  }
}

// Companies Collection
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  name: String,
  industry: String,
  website: String,
  description: String,
  logo: String,
  targetAudience: Object,
  budget: Number,
  currency: String,
  createdAt: Date,
  updatedAt: Date,
}

// Campaigns Collection
{
  _id: ObjectId,
  companyId: ObjectId,
  name: String,
  description: String,
  status: Enum['draft', 'active', 'paused', 'completed'],
  platform: Enum['google', 'facebook', 'linkedin', 'tiktok'],
  budget: Number,
  startDate: Date,
  endDate: Date,
  metrics: {
    impressions: Number,
    clicks: Number,
    conversions: Number,
    spend: Number,
    roi: Number,
  },
  createdAt: Date,
  updatedAt: Date,
}

// Analytics Collection
{
  _id: ObjectId,
  campaignId: ObjectId,
  date: Date,
  metrics: {
    impressions: Number,
    clicks: Number,
    ctr: Number,
    conversions: Number,
    conversionRate: Number,
    spend: Number,
    roas: Number,
    cpc: Number,
  },
}

// Strategy Collection
{
  _id: ObjectId,
  companyId: ObjectId,
  generatedAt: Date,
  recommendations: Array,
  marketAnalysis: Object,
  competitorInsights: Array,
  projectedResults: Object,
}

// Competitors Collection
{
  _id: ObjectId,
  companyId: ObjectId,
  name: String,
  website: String,
  analysis: {
    seoScore: Number,
    keywords: Array,
    trafficEstimate: Number,
    backlinks: Number,
  },
  lastAnalyzed: Date,
}
```

### Indexes for Performance

```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });

// Campaign indexes
db.campaigns.createIndex({ companyId: 1, createdAt: -1 });
db.campaigns.createIndex({ status: 1 });

// Analytics indexes
db.analytics.createIndex({ campaignId: 1, date: -1 });
db.analytics.createIndex({ date: -1 });

// Strategy indexes
db.strategies.createIndex({ companyId: 1, generatedAt: -1 });
```

---

## ⚡ Performance Optimization

### Frontend Optimizations

#### 1. **Code Splitting**
```tsx
// Route-based code splitting with React Router
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));

<Suspense fallback={<Skeleton />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/reports" element={<ReportsPage />} />
  </Routes>
</Suspense>
```

#### 2. **React Query Caching**
```tsx
// Automatic caching and invalidation
const { data } = useQuery({
  queryKey: ['companies'],
  queryFn: getCompanies,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000,   // 10 minutes
});

// Manual invalidation when needed
queryClient.invalidateQueries({ queryKey: ['companies'] });
```

#### 3. **Component Memoization**
```tsx
const MemoizedWidget = memo(WidgetComponent, (prev, next) => {
  return prev.data === next.data; // Custom comparison
});
```

#### 4. **Vite Optimizations**
- Module preloading
- CSS minification
- Asset optimization
- Chunk size analysis

### Backend Optimizations

#### 1. **Database Indexing**
```javascript
db.campaigns.createIndex({ userId: 1, createdAt: -1 });
db.analytics.createIndex({ campaignId: 1, date: -1 });
```

#### 2. **Query Optimization**
```javascript
// Lean queries (exclude unnecessary fields)
Campaign.find({ userId }).lean().exec();

// Aggregation pipeline for complex queries
db.analytics.aggregate([
  { $match: { campaignId } },
  { $group: { _id: '$date', metrics: { $sum: '$value' } } }
]);
```

#### 3. **Caching Strategy**
```
Redis Cache Layer (if implemented):
- Store frequently accessed data
- Cache TTL: 5 minutes for analytics
- Cache TTL: 1 hour for company profiles
```

#### 4. **API Response Optimization**
- Pagination for large datasets
- Field selection (sparse fields)
- Compression (gzip)
- Response caching headers

---

## 🔒 Security Architecture

### Authentication Flow

```
User Login
    │
    ▼
Validate Credentials
    │
    ├─ Invalid: Return 401
    │
    └─ Valid: Generate JWT
           ├── Access Token (15 min)
           └── Refresh Token (7 days)
                  │
                  ▼
            Return to Client
                  │
                  ▼
            Store in localStorage
                  │
                  ▼
            Include in API requests
```

### API Security

```tsx
// Request Interceptor - Add Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle 401 Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Refresh token or redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Data Protection

1. **Encryption**
   - HTTPS/TLS for data in transit
   - Sensitive data encrypted at rest (database-level)

2. **Validation**
   - Input validation (Zod schemas)
   - Output sanitization
   - Request validation middleware

3. **CORS**
   - Whitelist allowed origins
   - Restrict credentials

4. **CSRF Protection**
   - Token-based CSRF prevention
   - SameSite cookie attribute

---

## 🔍 Monitoring & Logging

### Frontend Monitoring
- Error boundary for React errors
- API error logging
- User interaction analytics
- Performance metrics (if integrated)

### Backend Logging
- API request/response logging
- Database operation logging
- Error logging with stack traces
- Audit logging for security events

---

**Last Updated**: March 2026
