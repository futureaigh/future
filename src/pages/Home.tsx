import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Zap, Shield, Cpu, Clock, Globe, Quote, Briefcase, GraduationCap, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHomeContent } from '../hooks/useHomeContent';
import { useCMS } from '../hooks/useCMS';

const Home = () => {
  const { page, products, services, testimonials } = useHomeContent();
  const { settings } = useCMS();

  const iconMap: Record<string, any> = {
    Zap, Shield, Cpu, Clock, Globe, Briefcase, GraduationCap, CheckCircle2, Video
  };
  const homeContent = page?.content || {};

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-1/4 -left-20 w-[600px] h-[600px] bg-brand-navy-light/30 rounded-full blur-[140px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="section-padding relative z-10 w-full">
          <div className="max-w-4xl">
            <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tighter leading-[0.9]"
            >
               {homeContent.heroTextLine1 || 'Simplified AI'} <br />
               <span className="text-brand-gold">
                 {homeContent.heroTextLine2 || 'solutions for Africa'}
               </span>
            </motion.h1>

            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3, duration: 0.8 }}
               className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl leading-relaxed font-medium"
            >
               {homeContent.heroTextLine3 || 'Helping businesses and people operate smarter with AI, systems, media, and modern digital tools.'}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/contact" className="btn-gold group px-10 py-4 text-lg">
                {homeContent.heroBtnPrimary || 'Start Growing Smarter'}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/work" className="px-10 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition-all text-lg text-center">
                {homeContent.heroBtnSecondary || 'Explore Our Work'}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-brand-navy border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { value: '24/7', label: 'Economy Engine' },
            { value: '100%', label: 'Automated Systems' },
            { value: '4+', label: 'Core Divisions' }
          ].map((stat, i) => (
            <div key={i} className="flex items-center justify-center sm:justify-start gap-4 text-center sm:text-left">
              <span className="text-4xl md:text-5xl font-display font-bold text-brand-gold tracking-tighter">{stat.value}</span>
              <span className="text-sm md:text-base text-gray-400 font-semibold uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4 Divisions Section */}
      <section className="section-padding py-32 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { title: 'FUTURE WORK', path: '/work', desc: 'Systems & Automations.', color: 'bg-brand-navy' },
             { title: 'FUTURE STUDIO', path: '/studio', desc: 'Media & Branding.', color: 'bg-brand-navy-light' },
             { title: 'FUTURE SKILLS', path: '/skills', desc: 'Training & Skills.', color: 'bg-brand-gold' },
             { title: 'FUTURE LABS', path: '/labs', desc: 'Products & Ideas.', color: 'bg-gray-100' }
           ].map((division, i) => (
             <Link 
               to={division.path} 
               key={division.title}
               className={`group relative p-12 rounded-[2.5rem] overflow-hidden transition-all hover:scale-[1.02] flex flex-col justify-between aspect-[4/5] ${division.color === 'bg-brand-gold' || division.color === 'bg-gray-100' ? 'text-brand-navy' : 'text-white'} ${division.color}`}
             >
                <div className="relative z-10">
                   <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-60 mb-2 block">Division 0{i+1}</span>
                   <h3 className="text-3xl font-bold tracking-tighter leading-none mb-4">{division.title}</h3>
                   <p className="text-lg opacity-80">{division.desc}</p>
                </div>
                <div className="relative z-10 flex justify-end">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-brand-navy ${division.color === 'bg-brand-gold' || division.color === 'bg-gray-100' ? 'border-brand-navy' : 'border-white'}`}>
                      <ArrowRight size={20} />
                   </div>
                </div>
             </Link>
           ))}
        </div>
      </section>

      {/* Why Section - Using Services CMS */}
      <section className="bg-brand-navy text-white relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5" />
        <div className="section-padding relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl mb-8 leading-tight">
                {homeContent.whyHeadingMain || 'Empowering Africa'} <br /> through <span className="text-brand-gold italic">{homeContent.whyHeadingHighlight || 'Intelligence'}</span>
              </h2>
              <div className="space-y-8">
                {(services.length > 0 ? services : [
                  { title: 'Video Production', description: 'High-impact brand documentaries, product commercials, and corporate video storytelling.', icon: 'Video' },
                  { title: 'AI Training for Teams', description: 'Hands-on workshops teaching corporate teams how to use generative AI for daily business productivity.', icon: 'GraduationCap' }
                ]).slice(0, 2).map((s: any, i: number) => {
                  const IconComp = iconMap[s.icon] || Briefcase;
                  return (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-12 h-12 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-300">
                        <IconComp size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                         <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white/5 p-10 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/10 transition-all" />
               <h3 className="text-2xl font-bold mb-6 text-brand-gold uppercase tracking-widest text-sm">{homeContent.solutionLabel || 'The Solution'}</h3>
               <p className="text-lg leading-relaxed text-gray-300 mb-8 italic">
                  "{homeContent.solutionText || 'Future makes modern tools simple, practical, accessible, and relevant. We bridge the gap between advanced technology and African realities.'}"
               </p>
               <Link to="/about" className="flex items-center gap-2 text-brand-gold font-bold hover:gap-3 transition-all">
                  {homeContent.solutionBtn || 'Read Our Full Story'} <ArrowRight size={18} />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="section-padding bg-gray-50/50">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 font-display font-bold">{homeContent.productsHeading || 'The Ecosystem'}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{homeContent.productsSubtext || 'Innovative SaaS solutions building the foundation for the new 24-hour economy.'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.length > 0 ? products.slice(0, 3).map((product, i) => (
            <motion.div
              key={product.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-navy flex items-center justify-center text-brand-gold mb-8 group-hover:scale-110 transition-transform overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Cpu size={28} />
                )}
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{product.name}</h3>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm line-clamp-3">{product.description}</p>
              <Link to={`/products`} className="text-brand-navy font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Learn More <ArrowRight size={16} />
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-3 text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
               <p className="text-gray-400 italic">Exploring the Future with AI solutions...</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-brand-navy text-white">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4 italic text-brand-gold">{homeContent.testimonialsHeading || 'Real Results.'}</h2>
            <p className="text-gray-400">What business leaders are saying about the {settings?.brandName || 'Future'} ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-3xl border border-white/5 relative">
                <Quote className="absolute top-8 right-8 text-white/5" size={64} />
                <p className="text-lg mb-8 leading-relaxed italic text-gray-300">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-brand-gold font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 24/7 Economy Section */}
      <section className="bg-brand-gold text-brand-navy">
        <div className="section-padding flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl mb-6">
              {homeContent.economyHeadingLine1 || 'Built for the'} <br />{homeContent.economyHeadingLine2 || '24-Hour Economy'}
            </h2>
            <p className="text-lg mb-8 font-medium">
              {homeContent.economyText || 'Future helps businesses stay available, responsive, and efficient day and night using smart systems and automation.'}
            </p>
            <div className="space-y-4">
              {(homeContent.economyList || ['Always Accessible', 'Fully Automated', 'Revenue Focused']).map((item: string) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="shrink-0" />
                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
               src={homeContent.economyImage || "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
               alt="24/7 Economy" 
               className="rounded-2xl shadow-2xl"
               referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-center">
        <div className="bg-brand-navy rounded-3xl p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-gold/5" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl text-white mb-8">
              {homeContent.ctaHeadingLine1 || 'Ready to Simplify the'} <br />{homeContent.ctaHeadingLine2 || 'Future of Your Business?'}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
               <Link to="/contact" className="btn-gold py-4 px-12 text-lg">
                 {homeContent.ctaBtnPrimary || 'Book a Consultation'}
               </Link>
               <a 
                 href={`https://wa.me/${settings?.whatsappNumber?.replace(/[\+\s\-\(\)]/g, '') || '233000000000'}`}
                 target="_blank" 
                 rel="noopener"
                 className="flex items-center justify-center gap-2 border-2 border-brand-gold bg-transparent text-brand-gold hover:bg-brand-gold hover:text-brand-navy px-12 py-4 rounded-lg font-bold text-lg transition-all active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
               >
                 {homeContent.ctaBtnSecondary || 'Chat on WhatsApp'}
               </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
