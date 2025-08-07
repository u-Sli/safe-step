import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SafetyProvider } from "./contexts/SafetyContext";
import Dashboard from "./pages/Dashboard";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import SafeRoutes from "./pages/SafeRoutes";
import Community from "./pages/Community";
import Emergency from "./pages/Emergency";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SafetyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/safe-routes" element={<SafeRoutes />} />
              <Route path="/community" element={<Community />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SafetyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
