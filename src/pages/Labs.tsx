import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layout, CreditCard, Send, Bot, Rocket, ShieldCheck, Globe, Zap, CheckCircle2, ArrowRight, Video, FileVideo, Palette, Briefcase, Smartphone, MessageSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase';
import { usePage } from '../hooks/usePage';
import { Service } from '../types';

const iconMap: Record<string, any> = {
  Layout, CreditCard, Send, Bot, Rocket, ShieldCheck, Globe, Zap, Video, FileVideo, Palette, Briefcase, Smartphone, MessageSquare, Settings
};

const Labs = () => {
  const { page, loading: pageLoading } = usePage('labs');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const content = page?.content || {};

  useEffect(() => {
    const q = query(collection(db, 'services'), where('category', '==', 'labs'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const defaultServices = [
    { title: 'AI Apps', icon: 'Bot' },
    { title: 'SaaS Products', icon: 'Rocket' },
    { title: 'Internal Tools', icon: 'Layout' },
    { title: 'Automation Products', icon: 'Zap' },
    { title: 'African Digital Products', icon: 'Globe' },
    { title: 'White-label Platforms', icon: 'ShieldCheck' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (pageLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent"></div>
        <div className="section-padding relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-gold font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            LABS
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter"
          >
            {content.heroHeading || 'We build products and experiment with future ideas.'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            {content.heroSubtext || 'Solivng African business problems through scalable digital products and innovative experiments.'}
          </motion.p>
        </div>
      </section>

      {/* Experiment Grid */}
      <section className="section-padding py-24 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, i) => {
            const IconComp = iconMap[service.icon] || Rocket;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-10 rounded-[2.5rem] bg-white shadow-sm hover:shadow-2xl transition-all group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-brand-navy rounded-3xl flex items-center justify-center text-brand-gold mb-8 group-hover:scale-110 transition-transform">
                  <IconComp size={32} />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                   {service.description || 'Pioneering new ways to bridge the technology gap for African users.'}
                </p>
                {service.outcome && (
                  <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-widest w-full justify-center">
                     <CheckCircle2 size={14} className="text-brand-gold" />
                     {service.outcome}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Products Showcase (reusing logic from products) */}
      <section className="section-padding py-24">
         <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-brand-navy tracking-tighter">Featured Labs Products</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto mt-6"></div>
         </div>
         <div className="space-y-24">
            {[
               { id: 'izyflow', name: 'IzyFlow', slogan: 'Smart Invoicing & Business Management', icon: Layout, desc: 'Simplified invoicing, expense tracking, and inventory management for modern businesses.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
               { id: 'izypost', name: 'IzyPost', slogan: 'AI Social Media Management', icon: Send, desc: 'Plan, create, and schedule social media content with AI-driven insights.', image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=800' },
               { id: 'izycard', name: 'IzyCard', slogan: 'Smart Business Identification', icon: CreditCard, desc: 'Professional digital business cards that sync instantly with contacts.', image: 'https://images.unsplash.com/photo-1648260295976-de09f77ab469?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
            ].map((product, i) => (
               <div key={product.id} className={`flex flex-col lg:flex-row gap-16 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/2">
                     <h2 className="text-4xl font-bold mb-4 tracking-tight">{product.name}</h2>
                     <p className="text-xl text-gray-500 mb-8">{product.slogan}</p>
                     <p className="text-gray-600 mb-10 leading-relaxed font-medium">
                        {product.desc}
                     </p>
                     <Link to="/contact" className="btn-primary px-10">Learn More About {product.name}</Link>
                  </div>
                  <div className="lg:w-1/2 w-full">
                     <div className="aspect-video bg-gray-100 rounded-[3rem] overflow-hidden shadow-2xl relative border border-gray-100">
                        <img 
                           src={product.image} 
                           alt={product.name} 
                           className="w-full h-full object-cover"
                           referrerPolicy="no-referrer"
                        />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Benefits / Revenue Section */}
      <section className="bg-brand-navy text-white py-24 border-t border-white/5">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-brand-gold tracking-tight">Our Business Model</h2>
              <div className="space-y-6">
                {[
                  { title: 'Solve African Problems', desc: 'Focusing on products that bridge the unique infrastructure gaps in our market.' },
                  { title: 'Recurring Income', desc: 'Building systems that provide long-term stable value for users and the company.' },
                  { title: 'Global Ambition', desc: 'Starting in Ghana, but engineered to scale globally from day one.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="text-brand-gold" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {['SaaS Subscriptions', 'Licensing', 'White-label Deals', 'Product Sales'].map((item, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-center">
                     <p className="font-bold uppercase tracking-widest text-xs text-brand-gold">{item}</p>
                  </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="section-padding text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-brand-navy mb-8 tracking-tighter">Invest in the Future</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary px-12 py-4 text-lg">
               Partner with Labs
            </Link>
            <Link to="/contact" className="btn-gold px-12 py-4 text-lg">
               Investor Enquiries
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Labs;
