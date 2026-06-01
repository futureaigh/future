import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCMS } from '../hooks/useCMS';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings, headerLinks } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultLinks = [
    { label: 'Home', path: '/' },
    { label: 'Work', path: '/work' },
    { label: 'Studio', path: '/studio' },
    { label: 'Skills', path: '/skills' },
    { label: 'Labs', path: '/labs' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const linksToDisplay = headerLinks.length > 0 ? headerLinks : defaultLinks;

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
          {linksToDisplay.map((link) => (
            <Link
              key={link.path + link.label}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-brand-gold ${
                location.pathname === link.path ? 'text-brand-gold' : 'text-brand-navy'
              } ${link.isCTA ? 'btn-primary py-2 px-6 ml-2' : ''}`}
            >
              {link.label}
              {link.isCTA && <ArrowRight size={14} className="ml-1" />}
            </Link>
          ))}
          {!headerLinks.some(l => l.isCTA) && (
            <Link to="/contact" className="btn-primary py-2 px-6 text-sm">
              Get Started
            </Link>
          )}
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
            <div className="flex flex-col gap-4 p-6">
              {linksToDisplay.map((link) => (
                <Link
                  key={link.path + link.label}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    location.pathname === link.path ? 'text-brand-gold' : 'text-brand-navy'
                  } ${link.isCTA ? 'btn-primary w-full justify-center mt-2' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {!headerLinks.some(l => l.isCTA) && (
                <Link 
                  to="/contact" 
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full"
                >
                  Get Started
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
