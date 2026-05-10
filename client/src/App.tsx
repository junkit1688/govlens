/* GovLens App — Glassmorphic Civic Premium
 * Dark mode default, Syne + DM Sans typography
 * Routes: Landing, Map, State Dashboard, Petitions, Voting, Forum, Reports
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import StateDashboard from "./pages/StateDashboard";
import PetitionsPage from "./pages/PetitionsPage";
import VotingPage from "./pages/VotingPage";
import ForumPage from "./pages/ForumPage";
import ReportsPage from "./pages/ReportsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/map">
        <DashboardLayout>
          <MapPage />
        </DashboardLayout>
      </Route>
      <Route path="/state/:stateId">
        {(params) => (
          <DashboardLayout>
            <StateDashboard stateId={params.stateId} />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/petitions">
        <DashboardLayout>
          <PetitionsPage />
        </DashboardLayout>
      </Route>
      <Route path="/voting">
        <DashboardLayout>
          <VotingPage />
        </DashboardLayout>
      </Route>
      <Route path="/forum">
        <DashboardLayout>
          <ForumPage />
        </DashboardLayout>
      </Route>
      <Route path="/reports">
        <DashboardLayout>
          <ReportsPage />
        </DashboardLayout>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
