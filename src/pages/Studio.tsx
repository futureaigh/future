import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, Layers, Wand2, Palette, Share2, FileVideo, Camera, Scissors, CheckCircle2, ArrowRight, Briefcase, Zap, Smartphone, Globe, MessageSquare, ShieldCheck, Settings, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, onSnapshot, where } from '../firebase';
import { usePage } from '../hooks/usePage';
import { Service } from '../types';

const iconMap: Record<string, any> = {
  Video, Layers, Wand2, Palette, Share2, FileVideo, Camera, Scissors, Briefcase, Zap, Smartphone, Globe, MessageSquare, ShieldCheck, Settings, Bot
};

const Studio = () => {
  const { page, loading: pageLoading } = usePage('studio');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const content = page?.content || {};

  useEffect(() => {
    const q = query(collection(db, 'services'), where('category', '==', 'studio'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const defaultServices = [
    { title: 'Video Production', icon: 'Video' },
    { title: 'Motion Graphics', icon: 'Layers' },
    { title: 'AI Video', icon: 'Wand2' },
    { title: 'Brand Visuals', icon: 'Palette' },
    { title: 'Social Media Creatives', icon: 'Share2' },
    { title: 'Content Editing', icon: 'Scissors' },
    { title: 'Photography', icon: 'Camera' },
    { title: 'Event Coverage', icon: 'FileVideo' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (pageLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-brand-gold/20 to-transparent"></div>
        <div className="section-padding relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-gold font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            STUDIO
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter"
          >
            {content.heroHeading || 'We create media that helps brands stand out.'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            {content.heroSubtext || 'Elevating African brands through premium video production, AI-powered visuals, and compelling storytelling.'}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding py-24 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayServices.map((service, i) => {
            const IconComp = iconMap[service.icon] || Briefcase;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all group"
              >
                <div className="w-12 h-12 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold mb-6 group-hover:rotate-6 transition-transform">
                  <IconComp size={24} />
                </div>
                <h3 className="text-xl font-bold text-brand-navy">{service.title}</h3>
                {service.description && <p className="text-gray-500 text-sm mt-3 leading-relaxed">{service.description}</p>}
                {service.outcome && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-widest">
                     <CheckCircle2 size={12} className="text-brand-gold" />
                     {service.outcome}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
               <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden mt-12 shadow-xl">
                     <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Creation" referrerPolicy="no-referrer" />
                  </div>
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-xl">
                     <img src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Production" referrerPolicy="no-referrer" />
                  </div>
               </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl font-bold mb-8 text-brand-navy tracking-tight">Media with a Mission</h2>
              <div className="space-y-6">
                {[
                  { title: 'Look Premium', desc: 'Visual excellence that positions your brand as a leader in your industry.' },
                  { title: 'Capture Attention', desc: 'Short-form content designed for the modern scrolling world.' },
                  { title: 'Tell Better Stories', desc: 'Narrative-driven media that builds deep emotional connections.' },
                  { title: 'Market Effectively', desc: 'High-conversion visual assets for all your advertising needs.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="text-brand-gold" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-brand-navy mb-1">{item.title}</h4>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Models */}
      <section className="section-padding py-24 bg-brand-navy text-white">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-gold mb-4">Production Retainers</h2>
            <p className="text-gray-400">Scalable creative output for your brand</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Video Projects', 'Monthly Content', 'Campaign Production', 'Event Coverage', 'Editing Packages'].map((model, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-sm">
                 <p className="font-bold text-white text-sm uppercase tracking-tight">{model}</p>
              </div>
            ))}
         </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-padding text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-brand-navy mb-8 tracking-tighter">Ready to stand out?</h2>
          <Link to="/contact" className="btn-primary px-12 py-4 text-lg">
            Start a Creative Project
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Studio;
