import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import LoopPage from "@/pages/LoopPage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import AdsManagerPage from "@/pages/AdsManagerPage";
import CompanyPage from "@/pages/CompanyPage";
import StrategyPage from "@/pages/StrategyPage";
import ContentLibraryPage from "@/pages/ContentLibraryPage";
import CompetitorIntelPage from "@/pages/CompetitorIntelPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <DashboardLayout hideSidebar>
                  <OnboardingPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/ads" element={<ProtectedRoute><DashboardLayout><AdsManagerPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/company" element={<ProtectedRoute><DashboardLayout><CompanyPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/strategy" element={<ProtectedRoute><DashboardLayout><StrategyPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/content" element={<ProtectedRoute><DashboardLayout><ContentLibraryPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/competitors" element={<ProtectedRoute><DashboardLayout><CompetitorIntelPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/loop" element={<ProtectedRoute><DashboardLayout><LoopPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><DashboardLayout><ReportsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><DashboardLayout><SettingsPage /></DashboardLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;