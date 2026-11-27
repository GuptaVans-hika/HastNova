import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import SmartLayout from './components/layout/SmartLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import Explore from './pages/Explore.jsx';
import CraftDetail from './pages/CraftDetail.jsx';
import MyLearning from './pages/MyLearning.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Opportunities from './pages/Opportunities.jsx';
import MarketTrends from './pages/MarketTrends.jsx';
import FAQ from './pages/FAQ.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import { useAuth } from './context/AuthContext.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function GuestOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public only */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <GuestOnly>
                <Auth />
              </GuestOnly>
            }
          />
        </Route>

        {/* Shared pages: public navbar for guests, sidebar for logged-in users */}
        <Route element={<SmartLayout />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/explore/:craftId" element={<CraftDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Logged-in only */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning" element={<MyLearning />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/roadmap/:craftId" element={<Roadmap />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/trends" element={<MarketTrends />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
