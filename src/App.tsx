import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import About from './pages/About';
import WhatWeDo from './pages/WhatWeDo';
import Impact from './pages/Impact';
import Future from './pages/Future';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import News from './pages/News';
import Admin from './pages/Admin';
import SiteHead from './components/SiteHead';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SiteHead />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/what-we-do" element={<WhatWeDo />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/future" element={<Future />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/news" element={<News />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
