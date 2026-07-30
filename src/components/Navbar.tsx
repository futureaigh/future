import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown, Briefcase, Video, GraduationCap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../hooks/useCMS';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useCMS();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setSolutionsOpen(false);
    setIsOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSolutionsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setSolutionsOpen(false);
    }, 150);
  };

  const solutionsSubItems = [
    { label: 'Work', path: '/work', description: 'Case studies & client systems', icon: Briefcase },
    { label: 'Studio', path: '/studio', description: 'Creative media & AI visual services', icon: Video },
    { label: 'Skills', path: '/skills', description: 'Practical AI upskilling & training', icon: GraduationCap },
    { label: 'Labs', path: '/labs', description: 'Innovative AI tools & prototypes', icon: Sparkles },
  ];

  const isSolutionsActive = ['/work', '/studio', '/skills', '/labs'].includes(location.pathname);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          {settings?.logoMain ? (
            <img src={settings.logoMain} alt={settings.brandName} className="h-8 md:h-10 w-auto transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-navy rounded flex items-center justify-center overflow-hidden">
                <span className="text-brand-gold font-display font-bold text-xl leading-none">F</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tighter text-brand-navy">{settings?.brandName || 'FUTURE'}</span>
            </div>
          )}
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-brand-gold ${
              location.pathname === '/' ? 'text-brand-gold' : 'text-brand-navy'
            }`}
          >
            Home
          </Link>

          {/* Solutions Dropdown */}
          <div 
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              className={`text-sm font-medium transition-colors hover:text-brand-gold flex items-center gap-1 py-1 ${
                isSolutionsActive ? 'text-brand-gold' : 'text-brand-navy'
              }`}
            >
              <span>Solutions</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${solutionsOpen ? 'rotate-180 text-brand-gold' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-72 bg-brand-navy border border-white/10 rounded-2xl shadow-2xl p-3 z-50"
                >
                  <div className="space-y-1">
                    {solutionsSubItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all group/item ${
                            isActive 
                              ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/20' 
                              : 'hover:bg-white/5 text-gray-200 hover:text-white'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isActive ? 'bg-brand-gold text-brand-navy' : 'bg-white/5 group-hover/item:bg-brand-gold group-hover/item:text-brand-navy text-brand-gold transition-colors'
                          }`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold leading-none">{item.label}</p>
                            <p className="text-[11px] text-gray-400 mt-1 leading-snug">{item.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-brand-gold ${
              location.pathname === '/about' ? 'text-brand-gold' : 'text-brand-navy'
            }`}
          >
            About
          </Link>

          <Link
            to="/team"
            className={`text-sm font-medium transition-colors hover:text-brand-gold ${
              location.pathname === '/team' ? 'text-brand-gold' : 'text-brand-navy'
            }`}
          >
            Team
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors hover:text-brand-gold ${
              location.pathname === '/contact' ? 'text-brand-gold' : 'text-brand-navy'
            }`}
          >
            Contact
          </Link>

          <Link to="/contact" className="btn-primary py-2 px-6 text-sm ml-2">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-brand-navy"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-brand-navy/5 overflow-hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors py-2 ${
                  location.pathname === '/' ? 'text-brand-gold' : 'text-brand-navy'
                }`}
              >
                Home
              </Link>

              {/* Mobile Solutions Accordion */}
              <div>
                <button
                  onClick={() => setMobileSolutionsOpen(!mobileSolutionsOpen)}
                  className={`w-full flex items-center justify-between text-lg font-medium transition-colors py-2 ${
                    isSolutionsActive ? 'text-brand-gold' : 'text-brand-navy'
                  }`}
                >
                  <span>Solutions</span>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-200 ${mobileSolutionsOpen ? 'rotate-180 text-brand-gold' : ''}`} 
                  />
                </button>

                {mobileSolutionsOpen && (
                  <div className="pl-4 py-2 space-y-3 border-l-2 border-brand-gold/30 my-1 bg-brand-navy/5 rounded-r-xl">
                    {solutionsSubItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 text-base font-medium transition-colors ${
                          location.pathname === item.path ? 'text-brand-gold' : 'text-brand-navy/80'
                        }`}
                      >
                        <item.icon size={16} className="text-brand-gold" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors py-2 ${
                  location.pathname === '/about' ? 'text-brand-gold' : 'text-brand-navy'
                }`}
              >
                About
              </Link>

              <Link
                to="/team"
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors py-2 ${
                  location.pathname === '/team' ? 'text-brand-gold' : 'text-brand-navy'
                }`}
              >
                Team
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`text-lg font-medium transition-colors py-2 ${
                  location.pathname === '/contact' ? 'text-brand-gold' : 'text-brand-navy'
                }`}
              >
                Contact
              </Link>

              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full mt-4 justify-center"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
