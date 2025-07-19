import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EnergyPermitsProcessor from "./components/permit/EnergyPermitsProcessor";
import AnalysisResult from "./components/permit/AnalysisResult";
import ReportViewer from "./components/permit/ReportViewer";
import PermitChat from "./components/permit/PermitChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/permit/analysis" element={<AnalysisResult />} />
          <Route path="/permit/report" element={<ReportViewer />} />
          <Route path="/permit/chat" element={<PermitChat />} /> {/* ✅ Moved above / */}
          <Route path="/processor" element={<EnergyPermitsProcessor />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;