import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { auth, db, doc, getDoc, setDoc, increment, serverTimestamp, onAuthStateChanged } from './firebase';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Work from './pages/Work';
import Studio from './pages/Studio';
import Skills from './pages/Skills';
import Labs from './pages/Labs';
import Contact from './pages/Contact';
import Team from './pages/Team';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';

const AnalyticsTracker = () => {
  const location = useLocation();

/*  useEffect(() => {
    const trackView = async () => {
      try {
        const analyticsRef = doc(db, 'analytics', 'site');
        const isNewVisitor = !localStorage.getItem('future_visited');
        if (isNewVisitor) {
          localStorage.setItem('future_visited', 'true');
        }

        const device = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
        const pathSlug = location.pathname.replace(/\//g, '_') || 'home';

        await setDoc(analyticsRef, {
          pageViews: increment(1),
          uniqueVisitors: isNewVisitor ? increment(1) : increment(0),
          [`pages.${pathSlug}`]: increment(1),
          [`devices.${device}`]: increment(1),
          lastUpdated: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.error("Analytics error", e);
      }
    };
    trackView();
  }, [location]); */

  return null;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        setIsAdmin(userData?.role === 'admin' || user?.username === 'admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const bootstrapPages = async () => {
      if (!isAdmin) return;
      
      const pagesToCreate = [
        { title: 'Home', slug: 'home' },
        { title: 'Work', slug: 'work' },
        { title: 'Studio', slug: 'studio' },
        { title: 'Skills', slug: 'skills' },
        { title: 'Labs', slug: 'labs' },
        { title: 'About', slug: 'about' },
        { title: 'Team', slug: 'team' },
        { title: 'Contact', slug: 'contact' }
      ];

      for (const p of pagesToCreate) {
        const pageRef = doc(db, 'pages', p.slug);
        const snap = await getDoc(pageRef);
        if (!snap.exists()) {
          await setDoc(pageRef, {
            title: p.title,
            slug: p.slug,
            status: 'published',
            seo: {
              metaTitle: `Future | ${p.title}`,
              metaDescription: `Empowering Africa through Intelligence and Modern Systems.`,
              noIndex: false
            },
            content: {},
            updatedAt: serverTimestamp()
          });
        }
      }
    };
    bootstrapPages();
  }, [isAdmin]);

  useEffect(() => {
    const checkSlogan = async () => {
      if (isAdmin) {
        const settingsRef = doc(db, 'settings', 'global');
        const snap = await getDoc(settingsRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.slogan === 'The Future. Simplified.' || data.slogan === 'solutions. simplified.' || data.slogan === 'solutions. simplified') {
            await setDoc(settingsRef, { slogan: 'simplified AI solutions for Africa' }, { merge: true });
          }
        }
      }
    };
    checkSlogan();
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-navy flex items-center justify-center text-brand-gold">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <Router>
      <AnalyticsTracker />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Work />} />
          <Route path="studio" element={<Studio />} />
          <Route path="skills" element={<Skills />} />
          <Route path="labs" element={<Labs />} />
          <Route path="products" element={<Navigate to="/labs" replace />} />
          <Route path="products/:id" element={<Navigate to="/labs" replace />} />
          <Route path="about" element={<About />} />
          <Route path="team" element={<Team />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login user={user} isAdmin={isAdmin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route 
          path="/admin/*" 
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}
