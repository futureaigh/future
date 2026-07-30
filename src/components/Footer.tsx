import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useCMS } from '../hooks/useCMS';

export const Footer = () => {
  const { settings, footerLinks } = useCMS();

  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-6">
            {settings?.logoAlt ? (
              <img src={settings.logoAlt} alt={settings.brandName} className="h-8 w-auto" referrerPolicy="no-referrer" />
            ) : settings?.logoMain ? (
              <img src={settings.logoMain} alt={settings.brandName} className="h-8 w-auto brightness-0 invert" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-brand-navy font-display font-bold text-xl">F</span>
                </div>
                <span className="font-display font-bold text-2xl tracking-tighter text-white">{settings?.brandName || 'FUTURE'}</span>
              </div>
            )}
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            {settings?.slogan || 'simplified AI solutions for Africa'}
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { Icon: Facebook, url: settings?.socialLinks?.facebook },
              { Icon: Twitter, url: settings?.socialLinks?.twitter },
              { Icon: Instagram, url: settings?.socialLinks?.instagram },
              { Icon: Linkedin, url: settings?.socialLinks?.linkedin },
            ].map(({ Icon, url }, i) => (
              <a 
                key={i} 
                href={url || '#'} 
                target={url ? "_blank" : undefined}
                rel={url ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:text-brand-navy transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            {footerLinks.length > 0 ? footerLinks.map((link) => (
              <li key={link.id}><Link to={link.path} className="hover:text-brand-gold transition-colors">{link.label}</Link></li>
            )) : (
              <>
                <li><Link to="/work" className="hover:text-brand-gold transition-colors">Work</Link></li>
                <li><Link to="/studio" className="hover:text-brand-gold transition-colors">Studio</Link></li>
                <li><Link to="/skills" className="hover:text-brand-gold transition-colors">Skills</Link></li>
                <li><Link to="/labs" className="hover:text-brand-gold transition-colors">Labs</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact Support</Link></li>
            <li><Link to="/businesses" className="hover:text-brand-gold transition-colors">For Businesses</Link></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-gold transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-lg mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-gold shrink-0 mt-0.5" />
              <span>{settings?.contactAddress || 'Accra, Ghana'}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-brand-gold shrink-0" />
              <a href={`tel:${settings?.contactPhone || '+233 20 000 0000'}`} className="hover:text-brand-gold transition-colors">
                {settings?.contactPhone || '+233 20 000 0000'}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle size={18} className="text-green-400 shrink-0" />
              <a 
                href={`https://wa.me/${(settings?.whatsappNumber || settings?.contactPhone || '233200000000').replace(/[\+\s\-\(\)]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors"
              >
                WhatsApp Us
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-brand-gold shrink-0" />
              <a href={`mailto:${settings?.contactEmail || 'futureaigh@gmail.com'}`} className="hover:text-brand-gold transition-colors">
                {settings?.contactEmail || 'futureaigh@gmail.com'}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} {settings?.brandName || 'Future'}. All Rights Reserved. {settings?.slogan || 'simplified AI solutions for Africa'}</p>
        <Link 
          to="/admin" 
          className="text-gray-600 hover:text-brand-gold/70 transition-colors inline-flex items-center gap-1.5 opacity-60 hover:opacity-100"
          title="Admin Portal"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/40"></span>
          <span>Admin</span>
        </Link>
      </div>
    </footer>
  );
};
