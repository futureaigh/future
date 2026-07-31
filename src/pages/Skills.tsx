import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bot, Share2, Layout, Briefcase, Palette, GraduationCap, Users, Award, CheckCircle2, ArrowRight, Video, FileVideo, Globe, Zap, Smartphone, MessageSquare, ShieldCheck, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, query, orderBy, onSnapshot, where } from '../firebase';
import { usePage } from '../hooks/usePage';
import { Service } from '../types';

const iconMap: Record<string, any> = {
  Bot, Share2, Layout, Briefcase, Palette, GraduationCap, Users, Award, Video, FileVideo, Globe, Zap, Smartphone, MessageSquare, ShieldCheck, Settings
};

const Skills = () => {
  const { page, loading: pageLoading } = usePage('skills');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const content = page?.content || {};

  useEffect(() => {
    const q = query(collection(db, 'services'), where('category', '==', 'skills'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const defaultServices = [
    { title: 'AI Training for Teams', icon: 'Bot', description: 'Hands-on workshops teaching corporate teams how to use generative AI for daily business productivity.', outcome: 'CUT HOURS OF MANUAL WORK' },
    { title: 'Digital Marketing & Social Media', icon: 'Share2', description: 'Practical masterclasses on performance marketing, audience growth, and automated content engines.', outcome: 'GENERATE CONSISTENT LEADS' },
    { title: 'Web & No-Code Systems', icon: 'Layout', description: 'Empowering non-technical founders to build, launch, and manage modern web platforms.', outcome: 'FULL DIGITAL INDEPENDENCE' },
    { title: 'Corporate Executive Briefings', icon: 'Briefcase', description: 'High-level strategic briefings on emerging tech trends, AI compliance, and digital transformation.', outcome: 'FUTURE-PROOF LEADERSHIP' },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  if (pageLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-brand-navy"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-gold"></div></div>;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-brand-gold text-brand-navy py-24 relative overflow-hidden">
        <div className="section-padding relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-navy/60 font-bold tracking-[0.2em] uppercase text-sm mb-4 block"
          >
            SKILLS
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter"
          >
            {content.heroHeading || 'We teach people and businesses how to use modern tools.'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-brand-navy/80 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            {content.heroSubtext || 'Empowering the next generation of African professionals with practical AI and digital skills that deliver real-world value.'}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, i) => {
            const IconComp = iconMap[service.icon] || GraduationCap;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-10 rounded-3xl bg-gray-50 border border-transparent hover:border-brand-gold hover:bg-white hover:shadow-2xl transition-all group"
              >
                <div className="w-14 h-14 bg-brand-navy rounded-2xl flex items-center justify-center text-brand-gold mb-8 group-hover:scale-110 transition-transform">
                  <IconComp size={28} />
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4">{service.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                   {service.description || 'Practical hands-on learning designed for immediate application.'}
                </p>
                {service.outcome && (
                  <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2 text-brand-navy font-bold text-xs uppercase tracking-widest">
                     <CheckCircle2 size={14} className="text-brand-gold" />
                     {service.outcome}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-brand-navy text-white py-24">
        <div className="section-padding">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-12 tracking-tight">Why Learn with Future?</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: 'Understand AI', desc: 'Demystify artificial intelligence and learn how to use it as a tool for success.' },
                  { title: 'Digital Income', desc: 'Master skills that are in high demand globally and locally.' },
                  { title: 'Better Operations', desc: 'Learn how to streamline your own business processes using digital tools.' },
                  { title: 'Stay Relevant', desc: 'Future-proof your career in an era of rapid technological change.' }
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-gold">
                       <GraduationCap size={20} />
                    </div>
                    <h4 className="font-bold text-xl">{item.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-sm">
                <blockquote className="text-2xl italic text-gray-300 mb-8 leading-relaxed">
                  "The AI training was a game changer for my team. We went from struggling with basic tools to automating half of our reporting in just two days."
                </blockquote>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-brand-gold"></div>
                   <div>
                      <p className="font-bold">Ekow Mensah</p>
                      <p className="text-sm text-brand-gold">Managing Director, EM Agency</p>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="section-padding py-24">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-navy mb-4 text-center">Learning Paths</h2>
            <p className="text-gray-500">Choose the format that works for you</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Paid Workshops', icon: Users },
              { label: 'Corporate Training', icon: Briefcase },
              { label: 'Online Courses', icon: Smartphone },
              { label: 'Certifications', icon: Award }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-3xl border border-gray-100 text-center flex flex-col items-center">
                 <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-navy mb-4">
                    <item.icon size={24} />
                 </div>
                 <p className="font-bold text-brand-navy uppercase tracking-widest text-xs">{item.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy text-white py-24">
        <div className="section-padding text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">Start your learning journey</h2>
          <Link to="/contact" className="btn-gold px-12 py-4 text-lg">
            Enquire About Training
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Skills;
