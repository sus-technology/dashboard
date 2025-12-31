import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { Layout } from "@/components/Layout";

import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import VerifyEmail from "@/pages/VerifyEmail";
import Overview from "@/pages/Dashboard/Overview";
import MyApps from "@/pages/Dashboard/MyApps";
import Templates from "@/pages/Dashboard/Templates";
import AppBuilder from "@/pages/Dashboard/AppBuilder";
import Analytics from "@/pages/Dashboard/Analytics";
import Collaboration from "@/pages/Dashboard/Collaboration";
import Settings from "@/pages/Dashboard/Settings";
import ActivityLogs from "@/pages/Dashboard/ActivityLogs";
import NotFound from "@/pages/NotFound";

// Get the publishable key from the environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const queryClient = new QueryClient();

// Main app component with Clerk provider
const ClerkWithRoutes = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <PublicRoute>
                    <VerifyEmail />
                  </PublicRoute>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Overview />} />
                <Route path="my-apps" element={<MyApps />} />
                <Route path="templates" element={<Templates />} />
                <Route path="app-builder" element={<AppBuilder />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="collaboration" element={<Collaboration />} />
                <Route path="settings" element={<Settings />} />
                <Route path="activity-logs" element={<ActivityLogs />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

// Wrapper component to handle the Clerk provider
const App = () => {
  return <ClerkWithRoutes />;
};

export default App;
