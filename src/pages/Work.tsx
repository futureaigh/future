import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Globe, Cpu, Database, UserCheck, Repeat, Bot, Headset, Construction, CheckCircle2, ArrowRight, Lightbulb, Zap, Smartphone, MessageSquare, ShieldCheck, Settings, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';
import { usePage } from '../hooks/usePage';
import { Service } from '../types';

const iconMap: Record<string, any> = {
  Globe, Cpu, Database, UserCheck, Repeat, Bot, Headset, Construction, Lightbulb, Zap, Smartphone, MessageSquare, ShieldCheck, Settings, Briefcase
};

const Work = () => {
  const { page, loading: pageLoading } = usePage('work');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const content = page?.content || {};

  useEffect(() => {
    const q = query(collection(db, 'services'), where('category', '==', 'work'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const defaultServices = [
    { title: 'Websites', icon: 'Globe' },
    { title: 'AI Automations', icon: 'Cpu' },
    { title: 'CRM Systems', icon: 'Database' },
    { title: 'Lead Generation Systems', icon: 'UserCheck' },
    { title: 'Business Workflows', icon: 'Repeat' },
    { title: 'AI Integrations', icon: 'Bot' },
    { title: 'Customer Support Systems', icon: 'Headset' },
    { title: 'Digital Infrastructure', icon: 'Construction' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (pageLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="section-padding relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-gold font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            WORK
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter"
          >
            {content.heroHeading || 'We build systems that help businesses operate smarter.'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            {content.heroSubtext || 'Helping businesses save time, get more customers, and operate 24/7 with custom digital infrastructure.'}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding py-24">
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
                className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-2xl transition-all group"
              >
                <div className="w-12 h-12 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold mb-6 group-hover:scale-110 transition-transform">
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
      <section className="bg-brand-navy/5 py-24">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-brand-navy tracking-tight">Our Goal is Your Growth</h2>
              <div className="space-y-6">
                {[
                  { title: 'Save Time', desc: 'Automate repetitive tasks so you can focus on high-level strategy.' },
                   { title: 'Get More Customers', desc: 'Intelligent lead generation systems that work while you sleep.' },
                  { title: 'Operate 24/7', desc: 'Your business never closes with automated support and sales.' },
                  { title: 'Reduce Manual Work', desc: 'Smart workflows that minimize errors and maximize efficiency.' }
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
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" 
                  alt="Business Systems" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-brand-gold p-10 rounded-[2rem] shadow-2xl hidden md:block">
                 <p className="text-brand-navy font-bold text-4xl mb-1">24/7</p>
                 <p className="text-brand-navy/80 text-sm font-bold uppercase tracking-widest">Operation Potential</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Revenue Sections (Display labels) */}
      <section className="section-padding py-24 border-t border-gray-100">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-navy mb-4">Investment Models</h2>
            <p className="text-gray-500">Flexible ways to partner with us</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Website Projects', 'AI Setup Fees', 'Monthly Maintenance', 'Automation Retainers', 'Hosting/Support'].map((model, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 text-center">
                 <p className="font-bold text-brand-navy text-sm uppercase tracking-tight">{model}</p>
              </div>
            ))}
         </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy text-white py-24">
        <div className="section-padding text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">Ready to build your system?</h2>
          <Link to="/contact" className="btn-gold px-12 py-4 text-lg">
            Book a Free Consultation
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Work;
