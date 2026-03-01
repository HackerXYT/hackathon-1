# AI Marketing Loop - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Quick Start](#quick-start)
5. [Project Structure](#project-structure)
6. [Environment Setup](#environment-setup)
7. [Available Scripts](#available-scripts)
8. [Documentation Index](#documentation-index)

---

## 🎯 Project Overview

**AI Marketing Loop** is a comprehensive AI-powered marketing analytics and strategy platform designed for digital marketers, agencies, and businesses. The application leverages artificial intelligence to provide intelligent insights into marketing campaigns, competitor analysis, content recommendations, and performance optimization.

### Purpose
The AI Marketing Loop platform helps marketing teams:
- Manage and monitor advertising campaigns across multiple channels
- Analyze competitor strategies and market positioning
- Generate AI-powered strategic recommendations
- Track KPIs and marketing performance metrics
- Optimize marketing spend and ROI
- Manage content creation and distribution
- Generate detailed analytics reports

### Target Users
- Digital Marketing Managers
- Marketing Agencies
- Business Owners
- Content Strategists
- Analytics Professionals

---

## ✨ Key Features

### 1. **Dashboard**
- Real-time marketing metrics overview
- Customizable widget-based layouts
- Key performance indicators (KPIs) at a glance
- Interactive charts and data visualizations
- Drag-and-drop widget personalization

### 2. **Ads Manager**
- Campaign management and monitoring
- Performance analytics for ad campaigns
- Real-time metrics tracking
- Spend analysis and optimization
- AI-powered recommendations for campaign improvements

### 3. **Strategy Module**
- AI-generated marketing strategies
- Competitor analysis integration
- Market positioning recommendations
- Performance insights and trends
- Historical strategy comparison

### 4. **Competitor Intelligence**
- Competitor website analysis
- SEO scoring and competitive benchmarking
- Market intelligence gathering
- Competitor strategy insights
- Website performance comparison

### 5. **Content Library**
- Centralized content repository
- Content categorization and tagging
- Asset management (logos, fonts, style guides)
- Content recommendations
- Brand consistency management

### 6. **Reports**
- Comprehensive marketing reports
- Custom report generation
- Data export capabilities
- Performance trend analysis
- Period-over-period comparisons

### 7. **Company Profile**
- Business information management
- Brand guidelines and assets
- Company settings and preferences
- Logo and branding management
- Audience segmentation

### 8. **Onboarding**
- Guided setup wizard
- Account configuration
- Audience definition
- Budget allocation
- Integration setup
- Campaign goal setting

### 9. **Analytics & Reporting**
- KPI projections and forecasting
- Usage analytics and metrics
- Performance summaries
- Data-driven insights

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite 5** - Build tool and development server
- **React Router DOM v6** - Client-side routing
- **TanStack React Query v5** - Server state management
- **Framer Motion** - Animations and transitions

### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Icon library

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - TypeScript-first schema validation

### Data Visualization
- **Recharts** - Charting library
- **Chart.js** - Advanced charting capabilities

### Backend Services
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework (inferred from server setup)
- **MongoDB** - NoSQL database

### AI Integration
- **Anthropic Claude API** - AI/ML capabilities

### Additional Libraries
- **date-fns** - Date manipulation
- **clsx** - Conditional class merging
- **next-themes** - Theme management
- **embla-carousel-react** - Carousel component
- **googleapis** - Google API integration
- **google-auth-library** - Authentication

### Development & Testing
- **ESLint** - Code linting
- **Vitest** - Unit testing framework

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher) - [Install Node.js](https://nodejs.org/)
- **npm** (v7 or higher) or **pnpm** (recommended)
- **Git** - [Install Git](https://git-scm.com/)

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/HackerXYT/hackathon-1
cd hackathon-1

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Set up environment variables
# Create a .env.local file in the root directory
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Start the development server
npm run dev
# or
pnpm dev

# The application will be available at http://localhost:5173
```

Visit [SETUP.md](./SETUP.md) for detailed setup instructions and configuration options.

---

## 📁 Project Structure

```
ai-marketing-loop/
├── src/
│   ├── pages/                 # Page components (one per route)
│   │   ├── DashboardPage.tsx
│   │   ├── AdsManagerPage.tsx
│   │   ├── StrategyPage.tsx
│   │   ├── CompetitorIntelPage.tsx
│   │   ├── ContentLibraryPage.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── ...
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── dashboard/        # Dashboard-specific components
│   │   ├── charts/          # Charting components
│   │   ├── onboarding/      # Onboarding flow components
│   │   └── ...
│   ├── hooks/                # Custom React hooks
│   │   ├── use-dashboard-layout.ts
│   │   ├── use-mobile.tsx
│   │   └── ...
│   ├── lib/                  # Utility functions and helpers
│   │   ├── api.ts           # API client/helpers
│   │   ├── utils.ts         # General utilities
│   │   └── ...
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── server/                    # Backend server
│   ├── server.js            # Main server file
│   ├── accounts/            # User account data
│   └── uploads/             # File uploads storage
├── public/                    # Static assets
├── DOCUMENTS/               # Documentation (this folder)
├── package.json             # Project dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── README.md               # Project readme
```

---

## ⚙️ Environment Setup

### Required Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Authentication
VITE_AUTH_ENABLED=true

# AI/ML Services
VITE_ANTHROPIC_API_KEY=your_api_key_here

# Google Integration
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_client_secret_here

# Database
MONGODB_URI=mongodb://localhost:27017/ai-marketing-loop

# Server
PORT=3000
NODE_ENV=development
```

See [SETUP.md](./SETUP.md) for detailed configuration instructions.

---

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing & Code Quality
```bash
npm run test         # Run tests once
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
```

### Server
```bash
cd server
npm start            # Start the backend server
npm run dev          # Start backend in development mode
```

---

## 📚 Documentation Index

- **[SETUP.md](./SETUP.md)** - Detailed installation, configuration, and deployment instructions
- **[FEATURES.md](./FEATURES.md)** - Comprehensive feature documentation and usage guides
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Technical architecture, design patterns, and best practices
- **[API.md](./API.md)** - Backend API documentation and endpoints
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines and development workflow

---

## 🔗 Useful Links

- **Project Repository**: [GitHub](https://github.com/yourusername/ai-marketing-loop)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/ai-marketing-loop/issues)
- **Documentation**: [Full Docs](./README.md)
- **Tech Stack Documentation**:
  - [React](https://react.dev)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev)
  - [Tailwind CSS](https://tailwindcss.com)
  - [shadcn/ui](https://ui.shadcn.com)
  - [TanStack Query](https://tanstack.com/query)

---

## 💡 Common Tasks

### Running the Application
```bash
npm run dev
# Visit http://localhost:5173
```

### Building for Production
```bash
npm run build
npm run preview  # Test the production build locally
```

### Adding a New Page
1. Create a new file in `src/pages/`
2. Add the corresponding route in `src/App.tsx`
3. Update sidebar navigation if needed

### Adding a New Component
1. Create a new file in `src/components/`
2. Use shadcn/ui components and Tailwind CSS
3. Import and use in your pages

### Running Tests
```bash
npm run test        # Single run
npm run test:watch  # Watch mode for development
```

---

## 🤝 Support & Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to:
- Report bugs
- Suggest features
- Submit pull requests
- Set up your development environment

---

## 📝 License

This project is proprietary and confidential.

---

## ❓ FAQ

**Q: What are the system requirements?**
A: Node.js v16+, npm/pnpm, and a modern web browser.

**Q: Do I need MongoDB installed locally?**
A: For development, you can use MongoDB Atlas (cloud) or install MongoDB Community Edition locally.

**Q: How do I add API keys?**
A: Store them in `.env.local` file. See [SETUP.md](./SETUP.md) for details.

**Q: How do I deploy this application?**
A: See deployment instructions in [SETUP.md](./SETUP.md).

---

## 📞 Contact

For questions or support, please reach out to the development team.

---

**Last Updated**: March 2026
**Version**: 1.0.0
